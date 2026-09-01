// Uploads a video straight to R2 using S3-compatible multipart upload: the
// server only ever mints short-lived presigned URLs for each 10MB chunk
// (see app/api/video-upload/*), the bytes go browser -> R2 directly. Unlike
// a single presigned PUT (lib/uploadFile.ts, still used for PDFs/images),
// a stalled or dropped chunk here only costs a retry of that one chunk —
// not the whole file — which is what makes multi-hundred-MB recordings
// upload smoothly over an ordinary connection.

const CHUNK_SIZE = 10 * 1024 * 1024; // R2/S3 multipart parts must be >=5MB except the last.
const PART_RETRY_DELAYS = [0, 2000, 5000, 10000];

// A connection that's merely slow keeps firing upload.onprogress and is
// left alone — only a genuinely stalled one (no bytes moving at all) trips
// this and fails the chunk so the existing per-part retry loop picks it
// back up, instead of the upload hanging forever with no error and no way
// to recover short of reloading the page.
const CHUNK_STALL_MS = 45_000;

type CompletedPart = { partNumber: number; etag: string };

export class UploadCancelledError extends Error {}

async function callVideoUploadApi<T>(path: string, body: unknown): Promise<T> {
  const res = await fetch(`/api/video-upload/${path}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  if (!res.ok) throw new Error(await res.text().catch(() => `Request to ${path} failed.`));
  return res.json();
}

// PUTs one chunk to a presigned URL, reporting byte progress via XHR
// (fetch doesn't expose upload progress). Resolves with the part's ETag
// header, which CompleteMultipartUpload needs verbatim to identify the part.
function uploadPart(
  url: string,
  blob: Blob,
  onProgress: (loaded: number) => void,
  registerXhr: (xhr: XMLHttpRequest | null) => void
): Promise<string> {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    registerXhr(xhr);
    let stallTimer: ReturnType<typeof setTimeout> | undefined;
    let settled = false;

    function resetStallTimer() {
      if (stallTimer) clearTimeout(stallTimer);
      stallTimer = setTimeout(() => {
        settled = true;
        xhr.abort();
        reject(new Error("This chunk stalled — retrying."));
      }, CHUNK_STALL_MS);
    }

    xhr.open("PUT", url);
    resetStallTimer();
    xhr.upload.onprogress = (e) => {
      resetStallTimer();
      if (e.lengthComputable) onProgress(e.loaded);
    };
    xhr.onload = () => {
      if (stallTimer) clearTimeout(stallTimer);
      registerXhr(null);
      if (settled) return;
      settled = true;
      if (xhr.status >= 200 && xhr.status < 300) {
        const etag = xhr.getResponseHeader("ETag");
        if (!etag) {
          reject(new Error("R2 didn't return an ETag for this chunk — check the bucket's CORS ExposeHeaders includes \"ETag\"."));
          return;
        }
        resolve(etag);
      } else {
        reject(new Error(`Chunk upload failed with status ${xhr.status}`));
      }
    };
    xhr.onerror = () => {
      if (stallTimer) clearTimeout(stallTimer);
      registerXhr(null);
      if (settled) return;
      settled = true;
      reject(new Error("Network error while uploading a chunk."));
    };
    xhr.onabort = () => {
      if (stallTimer) clearTimeout(stallTimer);
      registerXhr(null);
      if (settled) return;
      settled = true;
      reject(new UploadCancelledError());
    };
    xhr.send(blob);
  });
}

export type VideoUploadHandle = {
  promise: Promise<string>;
  cancel: () => void;
};

export function uploadVideoToR2(file: File, onProgress: (percent: number) => void): VideoUploadHandle {
  let cancelled = false;
  let currentXhr: XMLHttpRequest | null = null;

  const promise = (async () => {
    let key: string | undefined;
    let uploadId: string | undefined;

    try {
      const started = await callVideoUploadApi<{ key: string; uploadId: string }>("start", {
        filename: file.name,
        contentType: file.type || "video/mp4",
      });
      key = started.key;
      uploadId = started.uploadId;

      const totalParts = Math.max(1, Math.ceil(file.size / CHUNK_SIZE));
      const parts: CompletedPart[] = [];
      const partBytesLoaded = new Array<number>(totalParts + 1).fill(0);

      const reportProgress = () => {
        const loaded = partBytesLoaded.reduce((sum, n) => sum + n, 0);
        onProgress(Math.min(99, Math.round((loaded / file.size) * 100)));
      };

      for (let partNumber = 1; partNumber <= totalParts; partNumber++) {
        if (cancelled) throw new UploadCancelledError();

        const start = (partNumber - 1) * CHUNK_SIZE;
        const blob = file.slice(start, Math.min(start + CHUNK_SIZE, file.size));

        let lastError: unknown;
        let etag: string | null = null;

        for (let attempt = 0; attempt < PART_RETRY_DELAYS.length; attempt++) {
          if (attempt > 0) await new Promise((r) => setTimeout(r, PART_RETRY_DELAYS[attempt]));
          if (cancelled) throw new UploadCancelledError();

          try {
            const { url } = await callVideoUploadApi<{ url: string }>("part-url", { key, uploadId, partNumber });
            etag = await uploadPart(
              url,
              blob,
              (loaded) => {
                partBytesLoaded[partNumber] = loaded;
                reportProgress();
              },
              (xhr) => {
                currentXhr = xhr;
              }
            );
            lastError = null;
            break;
          } catch (err) {
            if (err instanceof UploadCancelledError) throw err;
            lastError = err;
          }
        }

        if (!etag) throw lastError ?? new Error("Chunk upload failed after retries.");
        partBytesLoaded[partNumber] = blob.size;
        parts.push({ partNumber, etag });
      }

      const { fileUrl } = await callVideoUploadApi<{ fileUrl: string }>("complete", { key, uploadId, parts });
      return fileUrl;
    } catch (error) {
      if (key && uploadId) callVideoUploadApi("abort", { key, uploadId }).catch(() => {});
      throw error;
    }
  })();

  return {
    promise,
    cancel: () => {
      cancelled = true;
      currentXhr?.abort();
    },
  };
}

// Uploads straight to R2 from the browser, bypassing our server entirely —
// avoids Vercel's request body size limit for large files.

export async function presignUpload(file: File): Promise<{ uploadUrl: string; fileUrl: string }> {
  const presignRes = await fetch("/api/admin/upload", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ filename: file.name, contentType: file.type || "application/octet-stream" }),
  });
  if (!presignRes.ok) {
    throw new Error(await presignRes.text());
  }
  return presignRes.json();
}

// PUTs a file to a presigned R2 URL via XHR (rather than fetch) so upload
// progress and cancellation are observable — needed for the drag-and-drop
// upload UI's progress bar and Cancel button.
export function putFileToR2(uploadUrl: string, file: File, onProgress?: (percent: number) => void) {
  const xhr = new XMLHttpRequest();
  const promise = new Promise<void>((resolve, reject) => {
    xhr.open("PUT", uploadUrl);
    xhr.setRequestHeader("Content-Type", file.type || "application/octet-stream");
    xhr.upload.onprogress = (e) => {
      if (e.lengthComputable && onProgress) onProgress(Math.round((e.loaded / e.total) * 100));
    };
    xhr.onload = () => {
      if (xhr.status >= 200 && xhr.status < 300) resolve();
      else reject(new Error("Upload to storage failed. Please try again."));
    };
    xhr.onerror = () => reject(new Error("Upload failed. Check your connection and try again."));
    xhr.onabort = () => reject(new Error("Upload cancelled."));
    xhr.send(file);
  });
  return { promise, xhr };
}

export async function uploadFileToR2(file: File): Promise<string> {
  const { uploadUrl, fileUrl } = await presignUpload(file);
  const { promise } = putFileToR2(uploadUrl, file);
  await promise;
  return fileUrl;
}

export function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

// Reads a video/audio file's duration client-side by loading it into a
// throwaway media element — used to auto-fill a recording's duration.
export function readMediaDuration(file: File): Promise<string | null> {
  return new Promise((resolve) => {
    const url = URL.createObjectURL(file);
    const el = document.createElement(file.type.startsWith("audio/") ? "audio" : "video");
    el.preload = "metadata";
    el.onloadedmetadata = () => {
      URL.revokeObjectURL(url);
      const total = Math.round(el.duration);
      if (!isFinite(total) || total <= 0) {
        resolve(null);
        return;
      }
      const m = Math.floor(total / 60);
      const s = total % 60;
      resolve(`${m}:${s.toString().padStart(2, "0")}`);
    };
    el.onerror = () => {
      URL.revokeObjectURL(url);
      resolve(null);
    };
    el.src = url;
  });
}

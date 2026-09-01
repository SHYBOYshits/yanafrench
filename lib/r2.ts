import { S3Client, GetObjectCommand, PutObjectCommand, DeleteObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

// Server-only. Shared R2 (S3-compatible) client for small JSON documents
// that need to persist across devices/browsers — there's no database yet,
// so this is the persistence layer for things like the shared message
// thread.

export function getR2Client() {
  const accountId = process.env.CLOUDFLARE_ACCOUNT_ID;
  const accessKeyId = process.env.R2_ACCESS_KEY_ID;
  const secretAccessKey = process.env.R2_SECRET_ACCESS_KEY;
  const bucket = process.env.R2_BUCKET_NAME;

  if (!accountId || !accessKeyId || !secretAccessKey || !bucket) return null;

  const client = new S3Client({
    region: "auto",
    endpoint: `https://${accountId}.r2.cloudflarestorage.com`,
    credentials: { accessKeyId, secretAccessKey },
  });

  return { client, bucket };
}

export async function readJson<T>(key: string, fallback: T): Promise<T> {
  const r2 = getR2Client();
  if (!r2) return fallback;
  try {
    const result = await r2.client.send(new GetObjectCommand({ Bucket: r2.bucket, Key: key }));
    const text = await result.Body?.transformToString();
    return text ? (JSON.parse(text) as T) : fallback;
  } catch {
    return fallback;
  }
}

// Builds the URL a browser will fetch an uploaded object from: the
// permanent public URL if the bucket has one configured, otherwise a
// long-lived signed GET URL. Shared by the direct-PUT upload route and the
// video multipart-upload "complete" route so both hand back a playable URL
// the same way.
export async function resolveFileUrl(key: string): Promise<string> {
  const r2 = getR2Client();
  if (!r2) throw new Error("R2 isn't configured.");

  const publicBase = process.env.R2_PUBLIC_URL;
  if (publicBase) return `${publicBase.replace(/\/$/, "")}/${key}`;

  return getSignedUrl(r2.client, new GetObjectCommand({ Bucket: r2.bucket, Key: key }), {
    expiresIn: 60 * 60 * 24 * 7,
  });
}

// A safe, unique object key for an uploaded file — same convention the
// direct-PUT /api/upload route uses, so video keys sit alongside every
// other uploaded object.
export function buildUploadKey(filename: string): string {
  return `resources/${Date.now()}-${filename.replace(/[^a-zA-Z0-9._-]/g, "-")}`;
}

// Recovers the object key from a URL this app handed out for an uploaded
// file — either the permanent public URL or a signed one, both of which
// end in the key itself (see buildUploadKey). Returns null for anything
// else (an admin-pasted external link, e.g. a YouTube URL), so callers can
// tell "nothing to delete from R2" apart from "this is our object."
export function extractUploadKey(url: string): string | null {
  const match = url.match(/resources\/[^?]+/);
  return match ? decodeURIComponent(match[0]) : null;
}

// Best-effort delete of an uploaded object — used when an admin deletes or
// replaces a video/PDF, so the file doesn't keep sitting in the bucket
// forever with nothing left pointing at it. Never throws: a cleanup
// failure shouldn't block the admin's edit from going through.
export async function deleteUploadedObject(key: string): Promise<void> {
  const r2 = getR2Client();
  if (!r2) return;
  try {
    await r2.client.send(new DeleteObjectCommand({ Bucket: r2.bucket, Key: key }));
  } catch (error) {
    console.error("Failed to delete R2 object", key, error);
  }
}

export async function writeJson<T>(key: string, value: T): Promise<boolean> {
  const r2 = getR2Client();
  if (!r2) return false;
  try {
    await r2.client.send(
      new PutObjectCommand({
        Bucket: r2.bucket,
        Key: key,
        Body: JSON.stringify(value),
        ContentType: "application/json",
      })
    );
    return true;
  } catch {
    return false;
  }
}

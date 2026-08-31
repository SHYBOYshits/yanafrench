import { S3Client, GetObjectCommand, PutObjectCommand } from "@aws-sdk/client-s3";

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

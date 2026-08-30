import { PutObjectCommand, GetObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { getR2Client } from "@/lib/r2";

// Returns a presigned URL the browser uploads directly to R2 — the file
// never passes through this function. Routing large files (videos) through
// a Vercel Function hits its request body size limit; going straight to R2
// avoids that entirely and scales to whatever size R2 itself allows.
export async function POST(req: Request) {
  const r2 = getR2Client();
  if (!r2) {
    return new Response(
      "R2 isn't configured yet — set CLOUDFLARE_ACCOUNT_ID, R2_ACCESS_KEY_ID, R2_SECRET_ACCESS_KEY and R2_BUCKET_NAME.",
      { status: 501 }
    );
  }

  const body = await req.json().catch(() => null);
  const filename = typeof body?.filename === "string" && body.filename ? body.filename : "file";
  const contentType = typeof body?.contentType === "string" && body.contentType ? body.contentType : "application/octet-stream";

  const key = `resources/${Date.now()}-${filename.replace(/[^a-zA-Z0-9._-]/g, "-")}`;

  try {
    const uploadUrl = await getSignedUrl(
      r2.client,
      new PutObjectCommand({ Bucket: r2.bucket, Key: key, ContentType: contentType }),
      { expiresIn: 600 }
    );

    const publicBase = process.env.R2_PUBLIC_URL;
    const fileUrl = publicBase
      ? `${publicBase.replace(/\/$/, "")}/${key}`
      : await getSignedUrl(r2.client, new GetObjectCommand({ Bucket: r2.bucket, Key: key }), { expiresIn: 60 * 60 * 24 * 7 });

    return Response.json({ key, uploadUrl, fileUrl });
  } catch (error) {
    console.error(error);
    return new Response("Couldn't prepare upload", { status: 500 });
  }
}

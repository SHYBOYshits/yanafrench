import { PutObjectCommand, GetObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { getR2Client } from "@/lib/r2";

export async function POST(req: Request) {
  const r2 = getR2Client();
  if (!r2) {
    return new Response(
      "R2 isn't configured yet — set CLOUDFLARE_ACCOUNT_ID, R2_ACCESS_KEY_ID, R2_SECRET_ACCESS_KEY and R2_BUCKET_NAME.",
      { status: 501 }
    );
  }

  const formData = await req.formData();
  const file = formData.get("file");
  if (!(file instanceof File)) {
    return new Response("Missing file", { status: 400 });
  }

  const key = `resources/${Date.now()}-${file.name.replace(/[^a-zA-Z0-9._-]/g, "-")}`;
  const buffer = Buffer.from(await file.arrayBuffer());

  try {
    await r2.client.send(
      new PutObjectCommand({
        Bucket: r2.bucket,
        Key: key,
        Body: buffer,
        ContentType: file.type || "application/octet-stream",
      })
    );

    const publicBase = process.env.R2_PUBLIC_URL;
    const url = publicBase
      ? `${publicBase.replace(/\/$/, "")}/${key}`
      : await getSignedUrl(r2.client, new GetObjectCommand({ Bucket: r2.bucket, Key: key }), { expiresIn: 60 * 60 * 24 * 7 });

    return Response.json({ key, url });
  } catch (error) {
    console.error(error);
    return new Response("Upload failed", { status: 500 });
  }
}

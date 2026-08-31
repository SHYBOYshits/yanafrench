// Uploads straight to R2 from the browser, bypassing our server entirely —
// avoids Vercel's request body size limit for large files.
export async function uploadFileToR2(file: File): Promise<string> {
  const presignRes = await fetch("/api/admin/upload", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ filename: file.name, contentType: file.type || "application/octet-stream" }),
  });
  if (!presignRes.ok) {
    throw new Error(await presignRes.text());
  }
  const { uploadUrl, fileUrl } = await presignRes.json();

  const putRes = await fetch(uploadUrl, {
    method: "PUT",
    headers: { "Content-Type": file.type || "application/octet-stream" },
    body: file,
  });
  if (!putRes.ok) {
    throw new Error("Upload to storage failed. Please try again.");
  }

  return fileUrl as string;
}

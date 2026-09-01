// Fire-and-forget cleanup of an uploaded file's R2 object, called whenever
// the admin deletes or replaces a video/PDF/recording/resource. Never
// awaited by callers — a slow or failed cleanup shouldn't hold up the
// admin's edit, which has already applied optimistically.
export function deleteFileFromR2(url: string | undefined): void {
  if (!url) return;
  fetch("/api/storage/delete", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ url }),
  }).catch(() => {});
}

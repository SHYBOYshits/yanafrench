// Reads every File out of a drop event's DataTransfer, recursing into any
// dropped folders — so an admin can drag a whole folder of videos onto the
// dropzone instead of selecting/dropping each file one at a time. Falls
// back to the flat file list on browsers that don't support the
// (WebKit-originated but now broadly supported) entries API.

function readEntryFiles(entry: FileSystemEntry): Promise<File[]> {
  return new Promise((resolve) => {
    if (entry.isFile) {
      (entry as FileSystemFileEntry).file(
        (file) => resolve([file]),
        () => resolve([])
      );
      return;
    }
    if (entry.isDirectory) {
      const reader = (entry as FileSystemDirectoryEntry).createReader();
      const collected: FileSystemEntry[] = [];
      const readBatch = () => {
        reader.readEntries(async (entries) => {
          if (entries.length === 0) {
            const nested = await Promise.all(collected.map(readEntryFiles));
            resolve(nested.flat());
            return;
          }
          collected.push(...entries);
          readBatch();
        }, () => resolve([]));
      };
      readBatch();
      return;
    }
    resolve([]);
  });
}

export async function getFilesFromDataTransfer(dataTransfer: DataTransfer): Promise<File[]> {
  const items = dataTransfer.items ? Array.from(dataTransfer.items) : [];
  const entries = items
    .map((item) => (typeof item.webkitGetAsEntry === "function" ? item.webkitGetAsEntry() : null))
    .filter((e): e is FileSystemEntry => e != null);

  if (entries.length === 0) {
    return Array.from(dataTransfer.files);
  }

  const results = await Promise.all(entries.map(readEntryFiles));
  return results.flat();
}

// Loosely matches an `accept` string (the same format passed to
// <input accept>, e.g. "video/*" or ".pdf,.ppt,.pptx") against a file —
// used to filter out stray non-matching files pulled in from a dropped
// folder (a native file picker enforces `accept` itself, but a folder
// drop bypasses that entirely).
export function matchesAccept(file: File, accept: string): boolean {
  const patterns = accept
    .split(",")
    .map((p) => p.trim().toLowerCase())
    .filter(Boolean);
  if (patterns.length === 0) return true;

  const name = file.name.toLowerCase();
  const type = (file.type || "").toLowerCase();

  return patterns.some((pattern) => {
    if (pattern.startsWith(".")) return name.endsWith(pattern);
    if (pattern.endsWith("/*")) return type.startsWith(pattern.slice(0, -1));
    return type === pattern;
  });
}

export type Note = {
  id: string;
  text: string;
  date: string;
};

// Seed notes. Admin-added notes come from the shared R2-backed admin
// state (see lib/adminState.ts / lib/useAdminState.ts) and are merged
// ahead of this list there.
export const notes: Note[] = [
  { id: "seed-note-1", text: "Great progress on spontaneous answers today — keep leading with a clear position before the example.", date: "14 Oct" },
  { id: "seed-note-2", text: "Opinion openers are sounding natural now. Next: work on closing an answer without trailing off.", date: "7 Oct" },
];

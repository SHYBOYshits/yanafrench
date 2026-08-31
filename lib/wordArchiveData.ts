export type WordEntry = {
  id: string;
  word: string;
  meaning: string;
  date: string;
};

// Seed archive. Admin-added entries come from the shared R2-backed admin
// state (see lib/adminState.ts / lib/useAdminState.ts) and are merged
// ahead of this list there.
export const wordArchive: WordEntry[] = [
  { id: "seed-word-quant-a", word: "quant à", meaning: "as for", date: "7 Oct" },
  { id: "seed-word-en-revanche", word: "en revanche", meaning: "on the other hand", date: "1 Oct" },
];

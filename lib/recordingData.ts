export type Recording = {
  id: string;
  title: string;
  date: string;
  published: boolean;
  videoUrl?: string;
  sizeBytes?: number;
};

// Seed Zoom class recordings. Admin-added recordings and edits are merged
// in via the shared portal state (see lib/portalState.ts).
export const recordings: Recording[] = [
  { id: "seed-rec-1", title: "Class recording · Building stronger oral answers", date: "14 Oct", published: true },
  { id: "seed-rec-2", title: "Class recording · Opinion structures that sound natural", date: "7 Oct", published: true },
];

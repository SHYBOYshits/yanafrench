export type Recording = {
  id: string;
  title: string;
  lessonNumber: number;
  date: string;
  videoUrl?: string;
};

// Seed recordings. Admin-added recordings come from the shared R2-backed
// admin state (see lib/adminState.ts / lib/useAdminState.ts) and are
// merged ahead of this list there.
export const recordings: Recording[] = [
  { id: "rec-lesson-12", title: "Class recording · Building stronger oral answers", lessonNumber: 12, date: "14 Oct" },
  { id: "rec-lesson-11", title: "Class recording · Opinion structures that sound natural", lessonNumber: 11, date: "7 Oct" },
  { id: "rec-lesson-10", title: "Class recording · Listening under exam pressure", lessonNumber: 10, date: "4 Oct" },
];

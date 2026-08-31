export type Document = {
  id: string;
  title: string;
  category: "Grammar" | "Vocabulary" | "TEF Preparation" | "Class Notes" | "Worksheet";
  lessonNumber: number;
  fileType: "PDF" | "Image" | "PPT";
  pages?: number;
  date: string;
  fileUrl?: string;
  sizeBytes?: number;
  order: number;
};

// Seed library. Admin-added resources come from the shared R2-backed
// admin state (see lib/adminState.ts / lib/useAdminState.ts) and are
// merged ahead of this list there. Each document is attached to the
// lesson it belongs to and shows up in that lesson's Documents column.
export const documents: Document[] = [
  { id: "connectors", title: "French Connectors — TEF", category: "Grammar", lessonNumber: 9, fileType: "PDF", pages: 12, date: "14 Oct", order: 1 },
  { id: "answer-structures", title: "Answer Structure Cheat Sheet", category: "TEF Preparation", lessonNumber: 12, fileType: "PDF", pages: 4, date: "14 Oct", order: 1 },
  { id: "opinion-openers", title: "Opinion Openers List", category: "Vocabulary", lessonNumber: 11, fileType: "PDF", pages: 3, date: "7 Oct", order: 1 },
  { id: "listening-notes", title: "Class Notes — Listening Under Pressure", category: "Class Notes", lessonNumber: 10, fileType: "PDF", pages: 6, date: "4 Oct", order: 1 },
  { id: "conditional-worksheet", title: "Conditional Tense Worksheet", category: "Worksheet", lessonNumber: 8, fileType: "PDF", pages: 5, date: "28 Sep", order: 1 },
  { id: "vocab-notebook", title: "Le Carnet de Vocabulaire — Extract", category: "Vocabulary", lessonNumber: 9, fileType: "PDF", pages: 18, date: "20 Sep", order: 2 },
  { id: "delf-writing", title: "DELF B2 Writing Frameworks", category: "TEF Preparation", lessonNumber: 12, fileType: "PDF", pages: 9, date: "12 Sep", order: 2 },
];

export const categories = ["Grammar", "Vocabulary", "TEF Preparation", "Class Notes", "Worksheet"] as const;

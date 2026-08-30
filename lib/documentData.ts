export type Document = {
  id: string;
  title: string;
  category: "Grammar" | "Vocabulary" | "TEF Preparation" | "Class Notes" | "Worksheet";
  course: "TEF Canada" | "DELF" | "General French";
  fileType: "PDF" | "Worksheet";
  pages?: number;
  date: string;
};

export const documents: Document[] = [
  { id: "connectors", title: "French Connectors — TEF", category: "Grammar", course: "TEF Canada", fileType: "PDF", pages: 12, date: "14 Oct" },
  { id: "answer-structures", title: "Answer Structure Cheat Sheet", category: "TEF Preparation", course: "TEF Canada", fileType: "PDF", pages: 4, date: "14 Oct" },
  { id: "opinion-openers", title: "Opinion Openers List", category: "Vocabulary", course: "TEF Canada", fileType: "PDF", pages: 3, date: "7 Oct" },
  { id: "listening-notes", title: "Class Notes — Listening Under Pressure", category: "Class Notes", course: "TEF Canada", fileType: "PDF", pages: 6, date: "4 Oct" },
  { id: "conditional-worksheet", title: "Conditional Tense Worksheet", category: "Worksheet", course: "General French", fileType: "Worksheet", pages: 5, date: "28 Sep" },
  { id: "vocab-notebook", title: "Le Carnet de Vocabulaire — Extract", category: "Vocabulary", course: "General French", fileType: "PDF", pages: 18, date: "20 Sep" },
  { id: "delf-writing", title: "DELF B2 Writing Frameworks", category: "TEF Preparation", course: "DELF", fileType: "PDF", pages: 9, date: "12 Sep" },
];

export function getDocuments() {
  return documents;
}

export function getDocument(id: string) {
  return documents.find((d) => d.id === id);
}

export const categories = ["All", "Grammar", "Vocabulary", "TEF Preparation", "Class Notes", "Worksheet"] as const;
export const courses = ["All", "TEF Canada", "DELF", "General French"] as const;

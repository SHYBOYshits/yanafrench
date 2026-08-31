export type Resource = {
  id: string;
  title: string;
  fileType: "PDF" | "PPT";
  date: string;
  fileUrl?: string;
  sizeBytes?: number;
};

// Seed external resources (PDFs/PPTs) provided to the student. Admin-added
// resources and edits are merged in via the shared portal state (see
// lib/portalState.ts).
export const resources: Resource[] = [
  { id: "seed-res-1", title: "French Connectors — TEF", fileType: "PDF", date: "14 Oct" },
  { id: "seed-res-2", title: "Opinion Openers List", fileType: "PDF", date: "7 Oct" },
];

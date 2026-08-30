import type { Metadata } from "next";
import { DocumentsPage } from "@/components/DocumentsPage";

export const metadata: Metadata = { title: "Documents" };

export default function StudentDocumentsPage() {
  return <DocumentsPage />;
}

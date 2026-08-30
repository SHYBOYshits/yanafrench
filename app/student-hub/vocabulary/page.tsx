import type { Metadata } from "next";
import { VocabularyPage } from "@/components/VocabularyPage";

export const metadata: Metadata = { title: "Vocabulary" };

export default function StudentVocabularyPage() {
  return <VocabularyPage />;
}

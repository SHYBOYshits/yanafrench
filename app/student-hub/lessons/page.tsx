import type { Metadata } from "next";
import { LessonsPage } from "@/components/LessonsPage";

export const metadata: Metadata = { title: "Lessons" };

export default function StudentLessonsPage() {
  return <LessonsPage />;
}

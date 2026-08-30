import type { Metadata } from "next";
import { TestsPage } from "@/components/TestsPage";

export const metadata: Metadata = { title: "Tests & Assignments" };

export default function StudentTestsPage() {
  return <TestsPage />;
}

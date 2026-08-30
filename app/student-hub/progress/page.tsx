import type { Metadata } from "next";
import { ProgressPage } from "@/components/ProgressPage";

export const metadata: Metadata = { title: "Progress" };

export default function StudentProgressPage() {
  return <ProgressPage />;
}

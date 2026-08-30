import type { Metadata } from "next";
import { StudentHub } from "@/components/StudentHub";

export const metadata: Metadata = { title: "Student Hub" };

export default function StudentHubPage() {
  return <StudentHub />;
}

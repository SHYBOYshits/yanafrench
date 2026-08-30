import type { Metadata } from "next";
import { StudentDashboard } from "@/components/StudentDashboard";

export const metadata: Metadata = { title: "Student Hub" };

export default function StudentHubPage() {
  return <StudentDashboard />;
}

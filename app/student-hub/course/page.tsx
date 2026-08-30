import type { Metadata } from "next";
import { CoursePage } from "@/components/CoursePage";

export const metadata: Metadata = { title: "My Course" };

export default function StudentCoursePage() {
  return <CoursePage />;
}

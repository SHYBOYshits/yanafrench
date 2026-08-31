import type { Metadata } from "next";
import { AdminLessons } from "@/components/admin/AdminLessons";

export const metadata: Metadata = { title: "Admin · Lessons" };

export default function AdminLessonsPage() {
  return <AdminLessons />;
}

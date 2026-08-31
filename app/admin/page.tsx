import type { Metadata } from "next";
import { AdminLessonsManager } from "@/components/admin/AdminLessonsManager";

export const metadata: Metadata = { title: "Admin · Lessons" };

export default function AdminPage() {
  return <AdminLessonsManager />;
}

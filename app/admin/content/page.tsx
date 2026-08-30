import type { Metadata } from "next";
import { AdminContent } from "@/components/admin/AdminContent";

export const metadata: Metadata = { title: "Admin · Content" };

export default function AdminContentPage() {
  return <AdminContent />;
}

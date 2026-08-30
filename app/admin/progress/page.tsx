import type { Metadata } from "next";
import { AdminProgress } from "@/components/admin/AdminProgress";

export const metadata: Metadata = { title: "Admin · Student Progress" };

export default function AdminProgressPage() {
  return <AdminProgress />;
}

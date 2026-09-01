import type { Metadata } from "next";
import { AdminBatchesPage } from "@/components/admin/AdminBatchesPage";

export const metadata: Metadata = { title: "Admin · Batches" };

export default function AdminBatchesRoute() {
  return <AdminBatchesPage />;
}

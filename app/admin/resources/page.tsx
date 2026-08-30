import type { Metadata } from "next";
import { AdminResources } from "@/components/admin/AdminResources";

export const metadata: Metadata = { title: "Admin · Resources" };

export default function AdminResourcesPage() {
  return <AdminResources />;
}

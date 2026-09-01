import type { Metadata } from "next";
import { AdminHighlightsPage } from "@/components/admin/AdminHighlightsPage";

export const metadata: Metadata = { title: "Admin · Highlights" };

export default function AdminHighlightsRoute() {
  return <AdminHighlightsPage />;
}

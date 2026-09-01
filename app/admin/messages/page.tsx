import type { Metadata } from "next";
import { AdminMessagesPage } from "@/components/admin/AdminMessagesPage";

export const metadata: Metadata = { title: "Admin · Messages" };

export default function AdminMessagesRoute() {
  return <AdminMessagesPage />;
}

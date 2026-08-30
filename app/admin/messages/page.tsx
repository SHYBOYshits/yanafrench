import type { Metadata } from "next";
import { AdminMessages } from "@/components/admin/AdminMessages";

export const metadata: Metadata = { title: "Admin · Messages" };

export default function AdminMessagesPage() {
  return <AdminMessages />;
}

import type { Metadata } from "next";
import { MessagesPage } from "@/components/MessagesPage";

export const metadata: Metadata = { title: "Messages" };

export default function StudentMessagesPage() {
  return <MessagesPage />;
}

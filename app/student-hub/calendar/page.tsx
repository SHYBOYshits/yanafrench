import type { Metadata } from "next";
import { CalendarPage } from "@/components/CalendarPage";

export const metadata: Metadata = { title: "Calendar" };

export default function StudentCalendarPage() {
  return <CalendarPage />;
}

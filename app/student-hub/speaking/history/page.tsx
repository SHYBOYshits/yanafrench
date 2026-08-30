import type { Metadata } from "next";
import { SpeakingHistory } from "@/components/SpeakingHistory";

export const metadata: Metadata = { title: "Speaking History" };

export default function StudentSpeakingHistoryPage() {
  return <SpeakingHistory />;
}

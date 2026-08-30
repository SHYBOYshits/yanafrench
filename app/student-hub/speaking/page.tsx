import type { Metadata } from "next";
import { SpeakingPractice } from "@/components/SpeakingPractice";

export const metadata: Metadata = { title: "Speaking Practice" };

export default function StudentSpeakingPage() {
  return <SpeakingPractice />;
}

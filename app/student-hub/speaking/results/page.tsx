import type { Metadata } from "next";
import { Suspense } from "react";
import { SpeakingResults } from "@/components/SpeakingResults";

export const metadata: Metadata = { title: "Speaking Results" };

export default function StudentSpeakingResultsPage() {
  return (
    <Suspense>
      <SpeakingResults />
    </Suspense>
  );
}

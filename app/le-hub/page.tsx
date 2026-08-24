import type { Metadata } from "next";
import { LeHubShowcase } from "@/components/LeHubShowcase";

export const metadata: Metadata = {
  title: "Le Hub by Yana",
  description: "Meet Le Hub — The Français Hub learning space for classes, practice, feedback, vocabulary, tests and progress with Yana Budhiraja.",
};

export default function LeHubPage() {
  return <LeHubShowcase />;
}

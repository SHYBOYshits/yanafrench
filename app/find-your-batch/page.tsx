import type { Metadata } from "next";
import { BatchFinder } from "@/components/BatchFinder";

export const metadata: Metadata = {
  title: "Find your batch",
  description: "Choose a TEF, TCF or DELF batch with live availability from The Français Hub and continue your enquiry on WhatsApp.",
};

export default function FindYourBatchPage() {
  return <BatchFinder standalone />;
}

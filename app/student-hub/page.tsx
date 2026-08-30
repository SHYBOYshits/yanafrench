import type { Metadata } from "next";
import { PageHero } from "@/components/PageHero";

export const metadata: Metadata = { title: "Student Hub" };

export default function StudentHubPage() {
  return (
    <PageHero
      eyebrow="Le Hub"
      title="Coming soon."
      body="This is where Le Hub will live."
      trail={[{ label: "Discover", href: "/" }, { label: "Student Hub" }]}
    />
  );
}

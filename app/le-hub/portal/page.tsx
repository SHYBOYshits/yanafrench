import type { Metadata } from "next";
import { PageHero } from "@/components/PageHero";

export const metadata: Metadata = { title: "Le Hub Portal" };

export default function LeHubPortalPage() {
  return (
    <PageHero
      eyebrow="Le Hub"
      title="Coming soon."
      body="This is where Le Hub will live."
      trail={[{ label: "Discover", href: "/" }, { label: "Le Hub", href: "/le-hub" }, { label: "Portal" }]}
    />
  );
}

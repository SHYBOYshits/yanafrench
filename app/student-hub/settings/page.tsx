import type { Metadata } from "next";
import { SettingsPage } from "@/components/SettingsPage";

export const metadata: Metadata = { title: "Profile & Settings" };

export default function StudentSettingsPage() {
  return <SettingsPage />;
}

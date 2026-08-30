import type { Metadata } from "next";
import { VideosPage } from "@/components/VideosPage";

export const metadata: Metadata = { title: "Videos" };

export default function StudentVideosPage() {
  return <VideosPage />;
}

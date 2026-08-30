import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getVideo } from "@/lib/videoData";
import { VideoDetail } from "@/components/VideoDetail";

export async function generateMetadata({ params }: { params: Promise<{ video: string }> }): Promise<Metadata> {
  const { video: videoId } = await params;
  const video = getVideo(videoId);
  return { title: video ? video.title : "Video" };
}

export default async function VideoPage({ params }: { params: Promise<{ video: string }> }) {
  const { video: videoId } = await params;
  const video = getVideo(videoId);
  if (!video) notFound();
  return <VideoDetail video={video} />;
}

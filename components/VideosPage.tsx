"use client";

import Link from "next/link";
import { getVideos } from "@/lib/videoData";
import { DashboardShell } from "./DashboardShell";
import styles from "./VideosPage.module.css";

function PlayIcon() {
  return <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M8 5.5v13l11-6.5z" /></svg>;
}

export function VideosPage() {
  const videos = getVideos();

  return (
    <DashboardShell>
      <div className={styles.head}>
        <small>LE HUB</small>
        <h1>Videos.</h1>
        <p>Every recorded class and lesson video, in one library.</p>
      </div>

      <div className={styles.grid}>
        {videos.map((video) => (
          <Link key={video.id} href={`/student-hub/videos/${video.id}`} className={styles.card}>
            <div className={styles.thumb}>
              <span className={styles.playCircle}><PlayIcon /></span>
              {video.progress > 0 && video.progress < 100 && (
                <div className={styles.thumbProgress}><span style={{ width: `${video.progress}%` }} /></div>
              )}
              <span className={styles.duration}>{video.duration}</span>
            </div>
            <span className={styles.module}>{video.module}</span>
            <strong>{video.title}</strong>
            <small className={styles.desc}>{video.description}</small>
            <span className={video.completed ? styles.watchDone : styles.watch}>
              {video.completed ? "Completed" : video.progress > 0 ? "Continue watching →" : "Watch →"}
            </span>
          </Link>
        ))}
      </div>
    </DashboardShell>
  );
}

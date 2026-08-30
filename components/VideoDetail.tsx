"use client";

import Link from "next/link";
import { useState } from "react";
import { getAdjacentVideos, type Video } from "@/lib/videoData";
import styles from "./VideoDetail.module.css";

export function VideoDetail({ video }: { video: Video }) {
  const [completed, setCompleted] = useState(video.completed);
  const [notes, setNotes] = useState("");
  const { previous, next } = getAdjacentVideos(video.id);

  return (
    <div className={styles.page}>
      <header className={styles.bar}>
        <Link href="/student-hub/videos" className={styles.back}>← Back to videos</Link>
        <span className={styles.barMeta}>{video.module}</span>
      </header>

      <div className={styles.content}>
        <div className={styles.player}>
          <button type="button" className={styles.playButton} aria-label="Play video">
            <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M8 5.5v13l11-6.5z" /></svg>
          </button>
          <div className={styles.playerProgress}><span style={{ width: `${video.progress}%` }} /></div>
        </div>

        <div className={styles.titleRow}>
          <div>
            <span className={styles.module}>{video.module}</span>
            <h1>{video.title}</h1>
          </div>
          <span className={styles.duration}>{video.duration}</span>
        </div>

        <p className={styles.description}>{video.description}</p>

        <button
          type="button"
          className={completed ? styles.completeDone : styles.complete}
          onClick={() => setCompleted((v) => !v)}
        >
          {completed ? "✓ Marked as completed" : "Mark as completed"}
        </button>

        <section className={styles.section}>
          <h2>Notes</h2>
          <textarea
            className={styles.notes}
            placeholder="Jot down anything worth remembering while you watch…"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
          />
        </section>

        {video.resources.length > 0 && (
          <section className={styles.section}>
            <h2>Related resources</h2>
            <div className={styles.resourceList}>
              {video.resources.map((r) => (
                <div key={r.label} className={styles.resourceRow}>
                  <span className={styles.resourceType}>{r.type}</span>
                  <span>{r.label}</span>
                  <button type="button" className={styles.resourceOpen}>Open →</button>
                </div>
              ))}
            </div>
          </section>
        )}

        <nav className={styles.pager}>
          {previous ? (
            <Link href={`/student-hub/videos/${previous.id}`} className={styles.pagerLink}>
              <small>← Previous</small>
              <span>{previous.title}</span>
            </Link>
          ) : <span />}
          {next ? (
            <Link href={`/student-hub/videos/${next.id}`} className={`${styles.pagerLink} ${styles.pagerLinkNext}`}>
              <small>Next →</small>
              <span>{next.title}</span>
            </Link>
          ) : <span />}
        </nav>
      </div>
    </div>
  );
}

"use client";

import Link from "next/link";
import { profile } from "@/lib/profileData";
import { getCurrentLevelCode, getLessonProgress, getOverallProgress, getStreak } from "@/lib/progressData";
import { getAssignments } from "@/lib/testData";
import { getSpeakingHistory } from "@/lib/speakingData";
import { AdminShell } from "../AdminShell";
import styles from "./AdminOverview.module.css";

export function AdminOverview() {
  const overall = getOverallProgress();
  const lessonProgress = getLessonProgress();
  const level = getCurrentLevelCode();
  const streak = getStreak();
  const assignments = getAssignments();
  const pendingAssignments = assignments.filter((a) => a.status === "Not started" || a.status === "In progress" || a.status === "Submitted").length;
  const speakingCount = getSpeakingHistory().length;
  const initials = profile.name.slice(0, 2).toUpperCase();

  return (
    <AdminShell>
      <div className={styles.head}>
        <small>ADMIN</small>
        <h1>Student overview.</h1>
      </div>

      <div className={styles.studentCard}>
        <span className={styles.avatar}>{initials}</span>
        <div>
          <strong>{profile.name}</strong>
          <small>{profile.email} · {profile.course}</small>
        </div>
        <Link href="/admin/progress" className={styles.editLink}>Edit progress →</Link>
      </div>

      <div className={styles.statsRow}>
        <div className={styles.stat}>
          <span>OVERALL PROGRESS</span>
          <strong>{overall}%</strong>
        </div>
        <div className={styles.stat}>
          <span>CEFR LEVEL</span>
          <strong>{level}</strong>
        </div>
        <div className={styles.stat}>
          <span>LESSONS DONE</span>
          <strong>{lessonProgress.completed} / {lessonProgress.total}</strong>
        </div>
        <div className={styles.stat}>
          <span>STREAK</span>
          <strong>{streak} days</strong>
        </div>
        <div className={styles.stat}>
          <span>PENDING WORK</span>
          <strong>{pendingAssignments}</strong>
        </div>
        <div className={styles.stat}>
          <span>SPEAKING ATTEMPTS</span>
          <strong>{speakingCount}</strong>
        </div>
      </div>

      <div className={styles.quickLinks}>
        <Link href="/admin/progress" className={styles.quickLink}><strong>Student Progress</strong><small>Mark lessons complete, edit assignments, set CEFR level</small></Link>
        <Link href="/admin/content" className={styles.quickLink}><strong>Content</strong><small>Weekly focus, word of the week, today's note</small></Link>
        <Link href="/admin/resources" className={styles.quickLink}><strong>Resources</strong><small>Upload or link PDFs, videos and worksheets</small></Link>
        <Link href="/admin/messages" className={styles.quickLink}><strong>Messages</strong><small>Reply to Amelia directly</small></Link>
      </div>
    </AdminShell>
  );
}

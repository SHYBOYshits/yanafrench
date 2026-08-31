"use client";

import Link from "next/link";
import type { LessonStatus } from "@/lib/courseData";
import { useAdminState } from "@/lib/useAdminState";
import { AdminShell } from "../AdminShell";
import styles from "./AdminLessons.module.css";

function statusBadgeClass(status: LessonStatus) {
  if (status === "Published") return styles.badgePublished;
  if (status === "Completed") return styles.badgeCompleted;
  return styles.badgeDraft;
}

export function AdminLessons() {
  const { lessons, documents, recordings, courseName, setLessonCompleted } = useAdminState();
  const sorted = [...lessons].sort((a, b) => b.number - a.number);

  return (
    <AdminShell>
      <div className={styles.head}>
        <small>CURRENT COURSE · {courseName.toUpperCase()}</small>
        <h1>Lessons.</h1>
        <p>Click into a lesson to manage its overview, materials and recordings.</p>
      </div>

      <div className={styles.grid}>
        {sorted.map((lesson) => {
          const docCount = documents.filter((d) => d.lessonNumber === lesson.number).length;
          const recCount = recordings.filter((r) => r.lessonNumber === lesson.number).length;
          return (
            <div key={lesson.number} className={styles.card}>
              <Link href={`/admin/course/${lesson.number}`} className={styles.cardMain}>
                <div className={styles.cardTop}>
                  <b>{lesson.number}</b>
                  <span className={`${styles.badge} ${statusBadgeClass(lesson.status)}`}>{lesson.status}</span>
                </div>
                <strong>{lesson.title}</strong>
                <small className={styles.meta}>{lesson.date} · {lesson.duration}</small>
                <div className={styles.statsRow}>
                  <span>{docCount} material{docCount === 1 ? "" : "s"}</span>
                  <span>{recCount} recording{recCount === 1 ? "" : "s"}</span>
                </div>
              </Link>
              <div className={styles.cardFooter}>
                <label className={styles.completeRow}>
                  <input
                    type="checkbox"
                    checked={lesson.completed}
                    onChange={(e) => setLessonCompleted(lesson.number, e.target.checked)}
                  />
                  Completed
                </label>
                <Link href={`/admin/course/${lesson.number}`} className={styles.manage}>Manage →</Link>
              </div>
            </div>
          );
        })}
      </div>
    </AdminShell>
  );
}

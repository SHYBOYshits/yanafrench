"use client";

import Link from "next/link";
import { useState } from "react";
import { useAdminState } from "@/lib/useAdminState";
import { DashboardShell } from "./DashboardShell";
import styles from "./CoursePage.module.css";

const tabs = ["Lessons", "Recordings", "Notes", "Words of the Week", "Tests"] as const;
type Tab = (typeof tabs)[number];

const emptyStates: Record<Exclude<Tab, "Lessons">, string> = {
  Recordings: "Class recordings will appear here after each session.",
  Notes: "Notes from class will be collected here.",
  "Words of the Week": "Every word of the week will be archived here.",
  Tests: "Upcoming and past tests will be listed here.",
};

export function CoursePage() {
  const [activeTab, setActiveTab] = useState<Tab>("Lessons");
  const { lessons, documents } = useAdminState();
  const sorted = [...lessons].sort((a, b) => b.number - a.number);

  return (
    <DashboardShell>
      <div className={styles.head}>
        <small>CURRENT COURSE · TEF CANADA</small>
        <h1>Everything from class,<br /><em>in one clear place.</em></h1>
      </div>

      <div className={styles.tabs} role="tablist">
        {tabs.map((tab) => (
          <button
            key={tab}
            type="button"
            role="tab"
            aria-selected={activeTab === tab}
            className={activeTab === tab ? styles.tabActive : styles.tab}
            onClick={() => setActiveTab(tab)}
          >
            {tab}
          </button>
        ))}
      </div>

      {activeTab === "Lessons" ? (
        <div className={styles.lessonList}>
          {sorted.map((lesson) => {
            const lessonDocs = documents.filter((d) => d.lessonNumber === lesson.number);
            return (
              <div
                key={lesson.number}
                className={lesson.completed ? styles.lesson : `${styles.lesson} ${styles.lessonActive}`}
              >
                <Link href={`/student-hub/course/${lesson.number}`} className={styles.lessonMain}>
                  <b>{lesson.number}</b>
                  <div className={styles.lessonBody}>
                    <strong>{lesson.title}</strong>
                    <small>{lesson.date} · {lesson.duration} · {lesson.notesCount} notes</small>
                  </div>
                </Link>
                <div className={styles.lessonDocs}>
                  {lessonDocs.length > 0 ? (
                    lessonDocs.map((doc) =>
                      doc.fileUrl ? (
                        <a
                          key={doc.id}
                          href={doc.fileUrl}
                          target="_blank"
                          rel="noreferrer"
                          className={styles.docChip}
                          title={doc.title}
                        >
                          {doc.fileType}
                        </a>
                      ) : (
                        <span key={doc.id} className={styles.docChipStatic} title={doc.title}>
                          {doc.fileType}
                        </span>
                      )
                    )
                  ) : (
                    <span className={styles.docsEmpty}>—</span>
                  )}
                </div>
                <Link href={`/student-hub/course/${lesson.number}`} className={styles.lessonStatus}>
                  {lesson.completed ? (
                    <span className={styles.lessonDone}>Completed</span>
                  ) : (
                    <span className={styles.lessonResume}>Resume →</span>
                  )}
                </Link>
              </div>
            );
          })}
        </div>
      ) : (
        <div className={styles.empty}>
          <p>{emptyStates[activeTab]}</p>
        </div>
      )}
    </DashboardShell>
  );
}

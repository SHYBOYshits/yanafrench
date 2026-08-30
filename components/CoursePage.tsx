"use client";

import { useState } from "react";
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

const lessons = [
  { number: 12, title: "Building stronger oral answers", date: "Today", duration: "64 min", notes: 3, completed: false },
  { number: 11, title: "Opinion structures that sound natural", date: "7 Oct", duration: "58 min", notes: 5, completed: true },
  { number: 10, title: "Listening under exam pressure", date: "4 Oct", duration: "62 min", notes: 2, completed: true },
  { number: 9, title: "Connectors for natural transitions", date: "1 Oct", duration: "50 min", notes: 4, completed: true },
  { number: 8, title: "Describing hypothetical situations", date: "28 Sep", duration: "55 min", notes: 3, completed: true },
];

export function CoursePage() {
  const [activeTab, setActiveTab] = useState<Tab>("Lessons");

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
          {lessons.map((lesson) => (
            <div key={lesson.number} className={lesson.completed ? styles.lesson : `${styles.lesson} ${styles.lessonActive}`}>
              <b>{lesson.number}</b>
              <div className={styles.lessonBody}>
                <strong>{lesson.title}</strong>
                <small>{lesson.date} · {lesson.duration} · {lesson.notes} notes</small>
              </div>
              {lesson.completed ? (
                <span className={styles.lessonDone}>Completed</span>
              ) : (
                <button type="button" className={styles.lessonResume}>Resume →</button>
              )}
            </div>
          ))}
        </div>
      ) : (
        <div className={styles.empty}>
          <p>{emptyStates[activeTab]}</p>
        </div>
      )}
    </DashboardShell>
  );
}

"use client";

import { usePortalState } from "@/lib/usePortalState";
import { AdminShell } from "../AdminShell";
import styles from "./AdminLessonsManager.module.css";

function todayLabel() {
  return new Date().toLocaleDateString("en-US", { day: "numeric", month: "short" });
}

// Word of the Week and Today's Note — small admin-authored highlights
// shown on the student's dashboard (components/StudentDashboard.tsx),
// stored on the same shared portal state as everything else under Lessons.
export function AdminHighlightsPage() {
  const { loaded, wordOfWeek, teacherNote, setWordOfWeek, setTeacherNote } = usePortalState();

  return (
    <AdminShell>
      <div className={styles.head}>
        <small>ADMIN</small>
        <h1>Highlights.</h1>
        <p>What the student sees on their dashboard — updates the moment you save.</p>
      </div>

      {!loaded ? (
        <div className={styles.tabPanel}>
          <p className={styles.tabHint}>Loading…</p>
        </div>
      ) : (
        <div className={styles.tabPanel}>
          <form className={styles.form} onSubmit={(e) => e.preventDefault()}>
            <h2>Word of the week</h2>
            <div className={styles.fieldGrid}>
              <label>
                <span>Word</span>
                <input
                  key={wordOfWeek.word}
                  defaultValue={wordOfWeek.word}
                  placeholder="e.g. pourtant"
                  onBlur={(e) => e.target.value.trim() && e.target.value !== wordOfWeek.word && setWordOfWeek({ word: e.target.value.trim(), meaning: wordOfWeek.meaning })}
                />
              </label>
              <label>
                <span>Meaning</span>
                <input
                  key={wordOfWeek.meaning}
                  defaultValue={wordOfWeek.meaning}
                  placeholder="e.g. however · yet"
                  onBlur={(e) => e.target.value !== wordOfWeek.meaning && setWordOfWeek({ word: wordOfWeek.word, meaning: e.target.value.trim() })}
                />
              </label>
            </div>
          </form>

          <form className={styles.form} onSubmit={(e) => e.preventDefault()}>
            <h2>Today&rsquo;s note</h2>
            <label className={styles.fullWidth}>
              <span>Note</span>
              <textarea
                key={teacherNote.text}
                defaultValue={teacherNote.text}
                placeholder="A quick note for the student to see on their dashboard…"
                onBlur={(e) => e.target.value.trim() && e.target.value !== teacherNote.text && setTeacherNote({ text: e.target.value.trim(), date: todayLabel() })}
              />
            </label>
            {teacherNote.date && <p className={styles.tabHint}>Last updated {teacherNote.date}</p>}
          </form>
        </div>
      )}
    </AdminShell>
  );
}

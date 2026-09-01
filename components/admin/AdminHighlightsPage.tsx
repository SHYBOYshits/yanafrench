"use client";

import { useState } from "react";
import { usePortalState } from "@/lib/usePortalState";
import { AdminShell } from "../AdminShell";
import { WordOfWeekAiButton } from "./WordOfWeekAiButton";
import styles from "./AdminLessonsManager.module.css";

function todayLabel() {
  return new Date().toLocaleDateString("en-US", { day: "numeric", month: "short" });
}

/** Controlled word/meaning fields, remounted (via the `key` its parent
 * passes) whenever the saved value changes from elsewhere — so typing
 * doesn't fight a concurrent admin edit or the AI suggestion, but a fresh
 * external value still shows up. */
function WordOfWeekFields({
  word,
  meaning,
  onSave,
}: {
  word: string;
  meaning: string;
  onSave: (next: { word: string; meaning: string }) => void;
}) {
  const [wordDraft, setWordDraft] = useState(word);
  const [meaningDraft, setMeaningDraft] = useState(meaning);

  function commit(next: { word: string; meaning: string }) {
    setWordDraft(next.word);
    setMeaningDraft(next.meaning);
    if (next.word.trim() && (next.word !== word || next.meaning !== meaning)) onSave(next);
  }

  return (
    <>
      <div className={styles.fieldGrid}>
        <label>
          <span>Word</span>
          <input
            value={wordDraft}
            onChange={(e) => setWordDraft(e.target.value)}
            onBlur={() => commit({ word: wordDraft, meaning: meaningDraft })}
            placeholder="e.g. pourtant"
          />
        </label>
        <label>
          <span>Meaning</span>
          <input
            value={meaningDraft}
            onChange={(e) => setMeaningDraft(e.target.value)}
            onBlur={() => commit({ word: wordDraft, meaning: meaningDraft })}
            placeholder="e.g. however · yet"
          />
        </label>
      </div>
      <WordOfWeekAiButton word={wordDraft} onApply={commit} />
    </>
  );
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
            <WordOfWeekFields key={`${wordOfWeek.word}-${wordOfWeek.meaning}`} word={wordOfWeek.word} meaning={wordOfWeek.meaning} onSave={setWordOfWeek} />
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

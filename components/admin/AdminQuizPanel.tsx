"use client";

import { useState } from "react";
import { quizLevels, type QuizLevel, type QuizSession } from "@/lib/quizData";
import { IconCheck, IconClose } from "../Icons";
import styles from "./AdminQuizPanel.module.css";

function formatSessionDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-US", { day: "numeric", month: "short", year: "numeric", hour: "numeric", minute: "2-digit" });
}

function SessionRow({ session }: { session: QuizSession }) {
  const [open, setOpen] = useState(false);

  return (
    <div className={styles.sessionRow}>
      <button type="button" className={styles.sessionHead} onClick={() => setOpen((v) => !v)}>
        <div>
          <strong>{formatSessionDate(session.date)}</strong>
          <small>Level {session.level}</small>
        </div>
        <span className={styles.sessionScore}>{session.overallScore.toFixed(1)} / 10</span>
      </button>
      <p className={styles.sessionSummary}>{session.summary}</p>

      {open && (
        <div className={styles.sessionItems}>
          <p className={styles.remarkLine}><strong>Strengths:</strong> {session.strengths}</p>
          <p className={styles.remarkLine}><strong>Focus next:</strong> {session.focusAreas}</p>
          {session.items.map((item) => (
            <div key={item.id} className={styles.item}>
              <div className={styles.itemTop}>
                <span>{item.skill}</span>
                {item.type === "speaking" ? (
                  item.speakingEval && <strong>{item.speakingEval.overall.toFixed(1)} / 10</strong>
                ) : item.correct ? (
                  <IconCheck size={12} />
                ) : (
                  <IconClose size={12} />
                )}
              </div>
              <p>{item.prompt}</p>
              <small>Answered: {item.response || "(no answer)"}</small>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export function AdminQuizPanel({
  level,
  sessions,
  onLevelChange,
}: {
  level: QuizLevel;
  sessions: QuizSession[];
  onLevelChange: (level: QuizLevel) => void;
}) {
  return (
    <div className={styles.panel}>
      <div className={styles.levelBox}>
        <span className={styles.sectionLabel}>STUDENT LEVEL</span>
        <p className={styles.hint}>The AI pitches quiz questions at this CEFR level. Two AI-graded sessions are available per day.</p>
        <select value={level} onChange={(e) => onLevelChange(e.target.value as QuizLevel)} className={styles.levelSelect}>
          {quizLevels.map((l) => <option key={l} value={l}>{l}</option>)}
        </select>
      </div>

      <div className={styles.history}>
        <span className={styles.sectionLabel}>QUIZ HISTORY</span>
        {sessions.length > 0 ? (
          <div className={styles.sessionList}>
            {sessions.map((s) => <SessionRow key={s.id} session={s} />)}
          </div>
        ) : (
          <p className={styles.hint}>Completed quiz sessions will appear here.</p>
        )}
      </div>
    </div>
  );
}

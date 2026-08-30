"use client";

import { useEffect, useState } from "react";
import { getLessons, setLessonCompleted, type Lesson } from "@/lib/courseData";
import { getAssignments, updateAssignment, type Assignment, type AssignmentStatus } from "@/lib/testData";
import { cefrLevels, getCurrentLevelCode, getStreak, setCurrentLevelCode, setStreak } from "@/lib/progressData";
import { AdminShell } from "../AdminShell";
import styles from "./AdminProgress.module.css";

const statuses: AssignmentStatus[] = ["Not started", "In progress", "Submitted", "Reviewed", "Completed"];

export function AdminProgress() {
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [level, setLevel] = useState(getCurrentLevelCode());
  const [streak, setStreakValue] = useState(getStreak());

  useEffect(() => {
    setLessons(getLessons());
    setAssignments(getAssignments());
  }, []);

  function toggleLesson(number: number, completed: boolean) {
    setLessonCompleted(number, completed);
    setLessons(getLessons());
  }

  function patchAssignment(id: string, patch: Partial<Assignment>) {
    updateAssignment(id, patch);
    setAssignments(getAssignments());
  }

  function handleLevelChange(code: string) {
    setLevel(code as typeof level);
    setCurrentLevelCode(code as typeof level);
  }

  function handleStreakChange(value: number) {
    setStreakValue(value);
    setStreak(value);
  }

  return (
    <AdminShell>
      <div className={styles.head}>
        <small>ADMIN</small>
        <h1>Student progress.</h1>
        <p>Every change here feeds directly into Amelia&apos;s computed progress on the dashboard.</p>
      </div>

      <section className={styles.section}>
        <h2>Level &amp; streak</h2>
        <div className={styles.levelRow}>
          <label>
            <span>CEFR level</span>
            <select value={level} onChange={(e) => handleLevelChange(e.target.value)}>
              {cefrLevels.map((l) => (
                <option key={l.code} value={l.code}>{l.code} — {l.label}</option>
              ))}
            </select>
          </label>
          <label>
            <span>Streak (days)</span>
            <input type="number" min={0} value={streak} onChange={(e) => handleStreakChange(Number(e.target.value))} />
          </label>
        </div>
      </section>

      <section className={styles.section}>
        <h2>Lessons</h2>
        <div className={styles.list}>
          {lessons.map((l) => (
            <div key={l.number} className={styles.row}>
              <div>
                <strong>{l.number}. {l.title}</strong>
                <small>{l.date} · {l.duration}</small>
              </div>
              <label className={styles.checkLabel}>
                <input type="checkbox" checked={l.completed} onChange={(e) => toggleLesson(l.number, e.target.checked)} />
                Completed
              </label>
            </div>
          ))}
        </div>
      </section>

      <section className={styles.section}>
        <h2>Assignments</h2>
        <div className={styles.list}>
          {assignments.map((a) => (
            <div key={a.id} className={styles.assignmentRow}>
              <div className={styles.assignmentHead}>
                <strong>{a.title}</strong>
                <small>{a.category}</small>
              </div>
              <div className={styles.assignmentFields}>
                <label>
                  <span>Status</span>
                  <select value={a.status} onChange={(e) => patchAssignment(a.id, { status: e.target.value as AssignmentStatus })}>
                    {statuses.map((s) => <option key={s} value={s}>{s}</option>)}
                  </select>
                </label>
                <label>
                  <span>Score</span>
                  <input placeholder="e.g. 8.5 / 10" defaultValue={a.score ?? ""} onBlur={(e) => patchAssignment(a.id, { score: e.target.value || undefined })} />
                </label>
              </div>
              <label className={styles.feedbackLabel}>
                <span>Feedback</span>
                <textarea defaultValue={a.feedback ?? ""} onBlur={(e) => patchAssignment(a.id, { feedback: e.target.value || undefined })} />
              </label>
            </div>
          ))}
        </div>
      </section>
    </AdminShell>
  );
}

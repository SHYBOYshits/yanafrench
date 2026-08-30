"use client";

import { motion } from "motion/react";
import { getTodaysNote, getWeeklyFocus, getWordOfWeek } from "@/lib/adminContent";
import { getCurrentLevelCode, getLessonProgress, getOverallProgress, getStreak } from "@/lib/progressData";
import { useAdminValue } from "@/lib/useAdminValue";
import { DashboardShell } from "./DashboardShell";
import styles from "./StudentDashboard.module.css";

// Mock data — stands in for what will eventually come from the student's
// account and the admin-editable content once Le Hub has a real backend.
// Progress/CEFR/completed-lessons come from lib/progressData.ts instead,
// computed from actual lesson, assignment and speaking-practice activity.
const student = {
  name: "Amelia",
  level: "TEF · CLB 7+",
};

const nextTask = {
  type: "Listening",
  title: "Task 04 · Interview about travel plans",
  dueDate: "Due tomorrow",
  estimatedTime: "18 min",
  progress: 40,
};

const nextClass = {
  day: "Thursday",
  time: "9:30 AM",
  teacher: "Yana",
  platform: "Google Meet",
};

function ProgressRing({ value }: { value: number }) {
  const r = 54;
  const circumference = 2 * Math.PI * r;
  return (
    <div className={styles.ring}>
      <svg viewBox="0 0 130 130" aria-hidden="true">
        <circle cx="65" cy="65" r={r} className={styles.ringTrack} />
        <motion.circle
          cx="65" cy="65" r={r} className={styles.ringValue}
          style={{ strokeDasharray: circumference }}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: circumference * (1 - value / 100) }}
          transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1], delay: 0.2 }}
        />
      </svg>
      <div className={styles.ringLabel}>
        <strong>{value}%</strong>
        <span>French progress</span>
      </div>
    </div>
  );
}

export function StudentDashboard() {
  const overallProgress = useAdminValue(getOverallProgress);
  const lessonProgress = useAdminValue(getLessonProgress);
  const currentLevelCode = useAdminValue(getCurrentLevelCode);
  const streak = useAdminValue(getStreak);
  const weeklyFocus = useAdminValue(getWeeklyFocus);
  const wordOfWeek = useAdminValue(getWordOfWeek);
  const teacherNote = useAdminValue(getTodaysNote);

  return (
    <DashboardShell>
      <div className={styles.greeting}>
        <small>BONJOUR, {student.name.toUpperCase()}</small>
        <h1>Your French,<br /><em>moving forward.</em></h1>
      </div>

      <div className={styles.focusStrip}>
        <span>THIS WEEK&apos;S FOCUS</span>
        <strong>{weeklyFocus.text}</strong>
        <small>{weeklyFocus.tag}</small>
      </div>

      <div className={`${styles.card} ${styles.taskCard}`}>
        <div className={styles.taskMain}>
          <span className={styles.cardLabel}>NEXT TASK</span>
          <span className={styles.taskType}>{nextTask.type}</span>
          <strong className={styles.taskTitle}>{nextTask.title}</strong>
          <div className={styles.taskMetaRow}>
            <span>{nextTask.dueDate}</span>
            <span className={styles.metaDot} />
            <span>{nextTask.estimatedTime}</span>
          </div>
        </div>
        <div className={styles.taskProgress}>
          <div className={styles.taskProgressHead}>
            <span>Progress</span>
            <strong>{nextTask.progress}%</strong>
          </div>
          <div className={styles.progressBar}><span style={{ width: `${nextTask.progress}%` }} /></div>
          <button type="button" className={styles.cardCtaSolid}>Continue →</button>
        </div>
      </div>

      <div className={styles.grid}>
        <div className={styles.card}>
          <span className={styles.cardLabel}>NEXT CLASS</span>
          <strong className={styles.cardTitle}>{nextClass.day}</strong>
          <small className={styles.cardMeta}>{nextClass.time} · {nextClass.platform}</small>
          <div className={styles.teacherLine}><i /> With {nextClass.teacher}</div>
          <button type="button" className={styles.cardCtaSolid}>Join class</button>
        </div>

        <div className={`${styles.card} ${styles.cardProgress}`}>
          <ProgressRing value={overallProgress} />
          <div className={styles.progressFacts}>
            <div><span>CEFR level</span><strong>{currentLevelCode}</strong></div>
            <div><span>Streak</span><strong>{streak} days</strong></div>
            <div><span>Completed</span><strong>{lessonProgress.completed} / {lessonProgress.total} lessons</strong></div>
          </div>
        </div>
      </div>

      <div className={styles.featuredRow}>
        <div className={styles.journalCard}>
          <span className={styles.journalFlourish} aria-hidden="true">{wordOfWeek.word.charAt(0)}</span>
          <span className={styles.journalEyebrow}>Word of the week</span>
          <strong className={styles.journalWord}>{wordOfWeek.word}</strong>
          <div className={styles.journalRule} />
          <small className={styles.journalMeaning}>{wordOfWeek.meaning}</small>
        </div>
        <div className={styles.featured}>
          <div className={styles.featuredTop}><span>TODAY&apos;S NOTE</span></div>
          <strong>{teacherNote.text}</strong>
          <small>{teacherNote.cta} →</small>
        </div>
      </div>
    </DashboardShell>
  );
}

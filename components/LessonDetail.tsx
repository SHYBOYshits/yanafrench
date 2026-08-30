"use client";

import Link from "next/link";
import { getAdjacentLessons, getLesson, setLessonCompleted } from "@/lib/courseData";
import { useAdminValue } from "@/lib/useAdminValue";
import styles from "./LessonDetail.module.css";

export function LessonDetail({ lessonNumber }: { lessonNumber: number }) {
  const lesson = useAdminValue(() => getLesson(lessonNumber));

  if (!lesson) {
    return (
      <div className={styles.page}>
        <header className={styles.bar}>
          <Link href="/student-hub/course" className={styles.back}>← Back to course</Link>
        </header>
        <div className={styles.content}>
          <p>That lesson couldn&apos;t be found.</p>
        </div>
      </div>
    );
  }

  const { previous, next } = getAdjacentLessons(lesson.number);

  function toggleComplete() {
    setLessonCompleted(lesson!.number, !lesson!.completed);
  }

  return (
    <div className={styles.page}>
      <header className={styles.bar}>
        <Link href="/student-hub/course" className={styles.back}>← Back to course</Link>
        <span className={styles.barMeta}>{lesson.track}</span>
      </header>

      <div className={styles.content}>
        <span className={styles.eyebrow}>LESSON {lesson.number}</span>
        <h1>{lesson.title}</h1>
        <div className={styles.metaRow}>
          <span>{lesson.teacher}</span>
          <span className={styles.metaDot} />
          <span>{lesson.date}</span>
          <span className={styles.metaDot} />
          <span>{lesson.duration}</span>
        </div>

        <div className={styles.player}>
          <button type="button" className={styles.playButton} aria-label="Play lesson video">
            <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M8 5.5v13l11-6.5z" /></svg>
          </button>
        </div>

        <section className={styles.section}>
          <h2>Lesson notes</h2>
          <p>{lesson.summary}</p>
        </section>

        <section className={styles.section}>
          <h2>Attached resources</h2>
          <div className={styles.resourceList}>
            {lesson.resources.map((r) => (
              <div key={r.label} className={styles.resourceRow}>
                <span className={styles.resourceType}>{r.type}</span>
                <span>{r.label}</span>
                <button type="button" className={styles.resourceOpen}>Open →</button>
              </div>
            ))}
          </div>
        </section>

        <section className={styles.section}>
          <h2>Vocabulary</h2>
          <div className={styles.vocabGrid}>
            {lesson.vocabulary.map((v) => (
              <div key={v.word} className={styles.vocabItem}>
                <strong>{v.word}</strong>
                <small>{v.meaning}</small>
              </div>
            ))}
          </div>
        </section>

        <section className={styles.section}>
          <h2>Exercises</h2>
          <div className={styles.exerciseList}>
            {lesson.exercises.map((ex) => (
              <label key={ex.title} className={styles.exerciseRow}>
                <input type="checkbox" defaultChecked={ex.done} />
                <span>{ex.title}</span>
              </label>
            ))}
          </div>
        </section>

        <button
          type="button"
          className={lesson.completed ? styles.completeDone : styles.complete}
          onClick={toggleComplete}
        >
          {lesson.completed ? "✓ Marked as complete" : "Mark as complete"}
        </button>

        <nav className={styles.pager}>
          {previous ? (
            <Link href={`/student-hub/course/${previous.number}`} className={styles.pagerLink}>
              <small>← Previous</small>
              <span>{previous.title}</span>
            </Link>
          ) : <span />}
          {next ? (
            <Link href={`/student-hub/course/${next.number}`} className={`${styles.pagerLink} ${styles.pagerLinkNext}`}>
              <small>Next →</small>
              <span>{next.title}</span>
            </Link>
          ) : <span />}
        </nav>
      </div>
    </div>
  );
}

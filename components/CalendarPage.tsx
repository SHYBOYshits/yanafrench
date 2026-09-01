"use client";

import { useMemo, useState } from "react";
import { generateClassEvents, formatTime, DAY_LABELS, type Batch, type BatchCourse } from "@/lib/batchData";
import { usePortalState } from "@/lib/usePortalState";
import { DashboardShell } from "./DashboardShell";
import styles from "./CalendarPage.module.css";

type CategoryFilter = "All" | BatchCourse;
const CATEGORIES: CategoryFilter[] = ["All", "TEF", "TCF", "DELF"];

function isSameDay(a: Date, b: Date) {
  return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();
}

function BatchCard({ batch, zoomLink }: { batch: Batch; zoomLink: string }) {
  const next = useMemo(() => generateClassEvents(batch, zoomLink, 30)[0] ?? null, [batch, zoomLink]);

  return (
    <div className={styles.batchCard}>
      <div className={styles.batchTop}>
        <span className={styles.batchCourse}>{batch.course.toUpperCase()}</span>
        {batch.level && <span className={styles.batchLevel}>{batch.level}</span>}
      </div>
      <strong>{batch.name}</strong>
      <small>{batch.days.map((d) => DAY_LABELS[d] ?? d).join(" · ")}</small>
      <small>{formatTime(batch.start_time)}–{formatTime(batch.end_time)}</small>
      {next && (
        <small className={styles.nextClass}>
          Next class: {next.date.toLocaleDateString("en-US", { weekday: "long", month: "short", day: "numeric" })}
        </small>
      )}
      {zoomLink && <a href={zoomLink} target="_blank" rel="noreferrer" className={styles.joinLink}>Join class →</a>}
    </div>
  );
}

export function CalendarPage() {
  const { batches, zoomLink } = usePortalState();
  const [category, setCategory] = useState<CategoryFilter>("All");

  const currentBatches = useMemo(
    () => batches.filter((b) => b.isCurrent && (category === "All" || b.course === category)),
    [batches, category]
  );

  // Only drives the dots on the grid — the batches themselves (not
  // per-occurrence entries) are what the agenda now lists.
  const classDates = useMemo(
    () => currentBatches.flatMap((b) => generateClassEvents(b, zoomLink, 45).map((e) => e.date)),
    [currentBatches, zoomLink]
  );

  const today = useMemo(() => new Date(), []);
  const year = today.getFullYear();
  const month = today.getMonth();
  const monthLabel = today.toLocaleDateString("en-US", { month: "long", year: "numeric" });
  const firstOfMonth = new Date(year, month, 1);
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const startOffset = firstOfMonth.getDay();

  const cells: (Date | null)[] = [
    ...Array(startOffset).fill(null),
    ...Array.from({ length: daysInMonth }, (_, i) => new Date(year, month, i + 1)),
  ];

  const hasClassOn = (day: Date) => classDates.some((d) => isSameDay(d, day));

  return (
    <DashboardShell>
      <div className={styles.head}>
        <small>LE HUB</small>
        <h1>Calendar.</h1>
      </div>

      <div className={styles.categoryRow} role="tablist" aria-label="Filter by course">
        {CATEGORIES.map((c) => (
          <button
            key={c}
            type="button"
            role="tab"
            aria-selected={category === c}
            className={category === c ? styles.chipActive : styles.chip}
            onClick={() => setCategory(c)}
          >
            {c}
          </button>
        ))}
      </div>

      <div className={styles.layout}>
        <div className={styles.calendarCard}>
          <div className={styles.calendarHead}>
            <strong>{monthLabel}</strong>
          </div>
          <div className={styles.weekdays}>
            {["S", "M", "T", "W", "T", "F", "S"].map((d, i) => <span key={i}>{d}</span>)}
          </div>
          <div className={styles.grid}>
            {cells.map((day, i) => {
              if (!day) return <span key={i} className={styles.emptyCell} />;
              const isToday = isSameDay(day, today);
              return (
                <div key={i} className={`${styles.cell} ${isToday ? styles.cellToday : ""}`}>
                  <span>{day.getDate()}</span>
                  {hasClassOn(day) && (
                    <div className={styles.dots}>
                      <i />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        <div className={styles.agenda}>
          <h2>Her batches</h2>
          {currentBatches.length > 0 ? (
            <div className={styles.list}>
              {currentBatches.map((b) => <BatchCard key={b.id} batch={b} zoomLink={zoomLink} />)}
            </div>
          ) : (
            <div className={styles.empty}>
              <p>{category === "All" ? "No batch set yet — ask your teacher." : `No ${category} batch set yet.`}</p>
            </div>
          )}
        </div>
      </div>
    </DashboardShell>
  );
}

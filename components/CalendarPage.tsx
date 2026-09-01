"use client";

import { useMemo, useState } from "react";
import { eventTypeLabels, getStaticEvents, type CalendarEventType } from "@/lib/calendarData";
import { generateClassEvents, type BatchCourse } from "@/lib/batchData";
import { usePortalState } from "@/lib/usePortalState";
import { DashboardShell } from "./DashboardShell";
import styles from "./CalendarPage.module.css";

type CategoryFilter = "All" | BatchCourse;
const CATEGORIES: CategoryFilter[] = ["All", "TEF", "TCF", "DELF"];

const typeClass: Record<CalendarEventType, string> = {
  class: "dotClass",
  assignment: "dotAssignment",
  test: "dotTest",
  speaking: "dotSpeaking",
  deadline: "dotDeadline",
};

function isSameDay(a: Date, b: Date) {
  return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();
}

export function CalendarPage() {
  const { batches, zoomLink } = usePortalState();
  const [category, setCategory] = useState<CategoryFilter>("All");

  const currentBatches = useMemo(
    () => batches.filter((b) => b.isCurrent && (category === "All" || b.course === category)),
    [batches, category]
  );

  const events = useMemo(() => {
    const classEvents = currentBatches.flatMap((b) => generateClassEvents(b, zoomLink));
    return [...classEvents, ...getStaticEvents()].sort((a, b) => a.date.getTime() - b.date.getTime());
  }, [currentBatches, zoomLink]);
  const today = useMemo(() => new Date(), []);
  const [selected, setSelected] = useState<Date | null>(null);

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

  const eventsForDay = (day: Date) => events.filter((e) => isSameDay(e.date, day));

  const visibleEvents = selected ? events.filter((e) => isSameDay(e.date, selected)) : events;

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
            {selected && <button type="button" className={styles.clear} onClick={() => setSelected(null)}>Show all</button>}
          </div>
          <div className={styles.weekdays}>
            {["S", "M", "T", "W", "T", "F", "S"].map((d, i) => <span key={i}>{d}</span>)}
          </div>
          <div className={styles.grid}>
            {cells.map((day, i) => {
              if (!day) return <span key={i} className={styles.emptyCell} />;
              const dayEvents = eventsForDay(day);
              const isToday = isSameDay(day, today);
              const isSelected = selected && isSameDay(day, selected);
              return (
                <button
                  key={i}
                  type="button"
                  className={`${styles.cell} ${isToday ? styles.cellToday : ""} ${isSelected ? styles.cellSelected : ""}`}
                  onClick={() => setSelected(day)}
                >
                  <span>{day.getDate()}</span>
                  {dayEvents.length > 0 && (
                    <div className={styles.dots}>
                      {dayEvents.slice(0, 3).map((e) => <i key={e.id} className={styles[typeClass[e.type]]} />)}
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        <div className={styles.agenda}>
          <h2>{selected ? selected.toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" }) : "Upcoming"}</h2>
          {visibleEvents.length > 0 ? (
            <div className={styles.list}>
              {visibleEvents.map((e) => (
                <div key={e.id} className={styles.eventCard}>
                  <div className={styles.eventTop}>
                    <span className={styles[typeClass[e.type]]} />
                    <span className={styles.eventType}>{eventTypeLabels[e.type].toUpperCase()}</span>
                    <span className={styles.eventDate}>{e.date.toLocaleDateString("en-US", { month: "short", day: "numeric" })}</span>
                  </div>
                  <strong>{e.title}</strong>
                  <small>{e.time}{e.course ? ` · ${e.course}` : ""}</small>
                  {e.teacher && <small className={styles.teacher}>With {e.teacher}</small>}
                  {e.meetingLink && <a href={e.meetingLink} className={styles.joinLink}>Join class →</a>}
                </div>
              ))}
            </div>
          ) : (
            <div className={styles.empty}><p>Nothing scheduled.</p></div>
          )}
        </div>
      </div>
    </DashboardShell>
  );
}

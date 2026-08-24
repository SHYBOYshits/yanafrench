"use client";

import { AnimatePresence, motion } from "motion/react";
import { useEffect, useMemo, useState } from "react";
import { whatsappUrl } from "@/lib/site";
import styles from "./BatchFinder.module.css";

type Course = "TEF" | "TCF" | "DELF";
type BatchStatus = "available" | "few_seats" | "full" | "waitlist";

type Batch = {
  id: string;
  course: Course;
  level?: string | null;
  name: string;
  days: string[];
  start_time: string;
  end_time: string;
  start_date?: string | null;
  end_date?: string | null;
  total_seats: number;
  seats_remaining: number;
  status: BatchStatus;
  timezone?: string;
};

type BatchPayload = {
  batches?: Batch[];
  timezone?: string;
  error?: string;
};

declare global {
  interface Window {
    __TFH_BATCH_PAYLOAD__?: BatchPayload;
  }
}

const COURSES: { code: Course; title: string; note: string }[] = [
  { code: "TEF", title: "TEF", note: "Canada & score-focused preparation" },
  { code: "TCF", title: "TCF", note: "Structured exam preparation" },
  { code: "DELF", title: "DELF", note: "A1–B2 language certification" },
];

const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const DAY_LABELS: Record<string, string> = {
  Mon: "Monday",
  Tue: "Tuesday",
  Wed: "Wednesday",
  Thu: "Thursday",
  Fri: "Friday",
  Sat: "Saturday",
};

const API_URL =
  process.env.NEXT_PUBLIC_BATCH_API_URL ||
  "https://tfh-resources-theprathambatras-projects.vercel.app/api/batches";

const SCRIPT_URL = API_URL.replace(/\/api\/batches\/?$/, "/api/batches-script");

function loadBatchScript(): Promise<BatchPayload> {
  return new Promise((resolve, reject) => {
    if (typeof window === "undefined") {
      reject(new Error("Browser unavailable"));
      return;
    }

    delete window.__TFH_BATCH_PAYLOAD__;
    const script = document.createElement("script");
    script.src = `${SCRIPT_URL}?t=${Date.now()}`;
    script.async = true;

    const cleanup = () => {
      script.remove();
    };

    script.onload = () => {
      const payload = window.__TFH_BATCH_PAYLOAD__;
      cleanup();
      if (payload && Array.isArray(payload.batches)) resolve(payload);
      else reject(new Error("Batch fallback did not return data"));
    };

    script.onerror = () => {
      cleanup();
      reject(new Error("Batch fallback failed"));
    };

    document.head.appendChild(script);
  });
}

function formatTime(value: string) {
  const [h = "0", m = "00"] = String(value || "").split(":");
  const hour = Number(h);
  const suffix = hour >= 12 ? "PM" : "AM";
  const displayHour = hour % 12 || 12;
  return `${displayHour}:${m} ${suffix}`;
}

function formatDate(value?: string | null) {
  if (!value) return null;
  const date = new Date(`${value}T00:00:00`);
  if (Number.isNaN(date.getTime())) return null;
  return new Intl.DateTimeFormat("en-IN", { day: "numeric", month: "short" }).format(date);
}

function statusText(batch: Batch) {
  if (batch.status === "waitlist") return "Waitlist";
  if (batch.status === "full" || batch.seats_remaining <= 0) return "Full";
  if (batch.status === "few_seats") {
    return batch.seats_remaining === 1 ? "1 seat left" : `${batch.seats_remaining} seats left`;
  }
  return "Available";
}

function canSelect(batch: Batch) {
  return batch.status !== "full" && batch.seats_remaining > 0;
}

function whatsappMessage(batch: Batch) {
  const dayNames = batch.days.map(day => DAY_LABELS[day] || day).join(", ");
  const time = `${formatTime(batch.start_time)}–${formatTime(batch.end_time)} IST`;
  const start = formatDate(batch.start_date);

  if (batch.status === "waitlist") {
    return `Hi Yana! I found The Français Hub website and I'd like to join the waitlist for the ${batch.course} batch I selected.\n\nBatch: ${batch.name}${batch.level ? `\nLevel: ${batch.level}` : ""}\nDays: ${dayNames}\nTime: ${time}${start ? `\nStarts: ${start}` : ""}\n\nCould you please let me know the next step?`;
  }

  return `Hi Yana! I found The Français Hub website and I'm interested in the ${batch.course} batch I selected.\n\nBatch: ${batch.name}${batch.level ? `\nLevel: ${batch.level}` : ""}\nDays: ${dayNames}\nTime: ${time}${start ? `\nStarts: ${start}` : ""}\n\nCould you please confirm if a seat is still available?`;
}

export function BatchFinder({ standalone = false }: { standalone?: boolean }) {
  const [course, setCourse] = useState<Course>("TEF");
  const [batches, setBatches] = useState<Batch[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    let active = true;

    async function load() {
      try {
        const response = await fetch(API_URL, { cache: "no-store" });
        if (!response.ok) throw new Error("Availability request failed");
        const body: BatchPayload = await response.json();
        if (active) {
          setBatches(Array.isArray(body.batches) ? body.batches : []);
          setError(false);
        }
      } catch {
        try {
          const body = await loadBatchScript();
          if (active) {
            setBatches(Array.isArray(body.batches) ? body.batches : []);
            setError(false);
          }
        } catch {
          if (active) setError(true);
        }
      } finally {
        if (active) setLoading(false);
      }
    }

    load();
    return () => { active = false; };
  }, []);

  const courseBatches = useMemo(
    () => batches.filter(batch => batch.course === course),
    [batches, course]
  );

  const selected = useMemo(
    () => batches.find(batch => batch.id === selectedId) || null,
    [batches, selectedId]
  );

  function chooseCourse(next: Course) {
    setCourse(next);
    setSelectedId(null);
  }

  return (
    <section
      id="find-your-batch"
      className={`${styles.section} ${standalone ? styles.standalone : ""}`}
    >
      <div className="container">
        <div className={styles.intro}>
          <div>
            <p className="eyebrow">Find your class</p>
            <h2>Choose the rhythm<br/><em>that fits your week.</em></h2>
          </div>
          <div className={styles.introCopy}>
            <p>Select your course, explore Yana&apos;s current batch availability and continue on WhatsApp when you find the right fit.</p>
            <div className={styles.liveLine}><span/> Live availability · India Standard Time</div>
          </div>
        </div>

        <div className={styles.coursePicker} aria-label="Choose a course">
          {COURSES.map((item, index) => (
            <button
              key={item.code}
              className={`${styles.courseCard} ${course === item.code ? styles.courseCardActive : ""}`}
              onClick={() => chooseCourse(item.code)}
              type="button"
              aria-pressed={course === item.code}
            >
              <span className={styles.courseNumber}>0{index + 1}</span>
              <strong>{item.title}</strong>
              <small>{item.note}</small>
            </button>
          ))}
        </div>

        <div className={styles.scheduleTop}>
          <div>
            <span className={styles.scheduleCourse}>{course}</span>
            <h3>Available batches.</h3>
          </div>
          <p>Monday–Saturday · 8:00 AM–6:00 PM IST</p>
        </div>

        {loading ? (
          <div className={styles.state}>Checking Yana&apos;s latest availability…</div>
        ) : error ? (
          <div className={styles.state}>
            Live availability is temporarily unavailable. You can still <a href={whatsappUrl()} target="_blank" rel="noreferrer">talk to Yana on WhatsApp →</a>
          </div>
        ) : courseBatches.length === 0 ? (
          <div className={styles.state}>
            No {course} batches are published right now. <a href={whatsappUrl(`Hi Yana! I found The Français Hub website and I'm interested in ${course}. Could you let me know when the next batch opens?`)} target="_blank" rel="noreferrer">Ask about the next batch →</a>
          </div>
        ) : (
          <div className={styles.calendarScroll}>
            <div className={styles.calendar}>
              {DAYS.map(day => {
                const dayBatches = courseBatches.filter(batch => batch.days.includes(day));
                return (
                  <div className={styles.day} key={day}>
                    <div className={styles.dayHead}>
                      <span>{day}</span>
                      <small>{DAY_LABELS[day]}</small>
                    </div>
                    <div className={styles.dayBody}>
                      {dayBatches.length ? dayBatches.map(batch => {
                        const selectable = canSelect(batch) || batch.status === "waitlist";
                        const isSelected = selectedId === batch.id;
                        return (
                          <button
                            type="button"
                            key={`${day}-${batch.id}`}
                            disabled={!selectable}
                            onClick={() => selectable && setSelectedId(batch.id)}
                            className={`${styles.slot} ${isSelected ? styles.slotSelected : ""} ${!selectable ? styles.slotDisabled : ""}`}
                          >
                            <span className={styles.slotTime}>{formatTime(batch.start_time)}</span>
                            <strong>{batch.name}</strong>
                            {batch.level && <small>{batch.level}</small>}
                            <span className={`${styles.status} ${styles[`status_${batch.status}`] || ""}`}>{statusText(batch)}</span>
                          </button>
                        );
                      }) : <span className={styles.noClass}>—</span>}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        <AnimatePresence mode="wait">
          {selected && (
            <motion.div
              key={selected.id}
              className={styles.selection}
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              transition={{ duration: .35 }}
            >
              <div className={styles.selectionLabel}>Your selection</div>
              <div className={styles.selectionMain}>
                <div>
                  <span>{selected.course}{selected.level ? ` · ${selected.level}` : ""}</span>
                  <h3>{selected.name}</h3>
                </div>
                <div className={styles.selectionDetails}>
                  <div><small>Days</small><strong>{selected.days.join(" · ")}</strong></div>
                  <div><small>Time</small><strong>{formatTime(selected.start_time)}–{formatTime(selected.end_time)}</strong></div>
                  <div><small>Availability</small><strong>{statusText(selected)}</strong></div>
                </div>
              </div>
              <div className={styles.selectionBottom}>
                <p>A website selection does not reserve a seat. Yana will confirm the latest availability personally.</p>
                <a
                  className="button button--accent"
                  href={whatsappUrl(whatsappMessage(selected))}
                  target="_blank"
                  rel="noreferrer"
                >
                  {selected.status === "waitlist" ? "Join waitlist on WhatsApp" : "Continue on WhatsApp"}
                  <span aria-hidden="true">↗</span>
                </a>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}

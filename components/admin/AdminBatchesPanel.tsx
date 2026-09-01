"use client";

import { useState, type FormEvent } from "react";
import { DAYS, type Batch, type BatchCourse, type BatchStatus } from "@/lib/batchData";
import styles from "./AdminBatchesPanel.module.css";

const COURSES: BatchCourse[] = ["TEF", "TCF", "DELF"];
const STATUSES: BatchStatus[] = ["available", "few_seats", "full", "waitlist"];
const STATUS_LABELS: Record<BatchStatus, string> = {
  available: "Available",
  few_seats: "Few seats",
  full: "Full",
  waitlist: "Waitlist",
};

function DayPicker({ value, onChange }: { value: string[]; onChange: (days: string[]) => void }) {
  function toggle(day: string) {
    onChange(value.includes(day) ? value.filter((d) => d !== day) : [...value, day]);
  }
  return (
    <div className={styles.dayPicker}>
      {DAYS.map((day) => (
        <button
          key={day}
          type="button"
          className={value.includes(day) ? styles.dayChipActive : styles.dayChip}
          onClick={() => toggle(day)}
        >
          {day}
        </button>
      ))}
    </div>
  );
}

function NewBatchForm({ onAdd }: { onAdd: (batch: Batch) => void }) {
  const [course, setCourse] = useState<BatchCourse>("TEF");
  const [name, setName] = useState("");
  const [level, setLevel] = useState("");
  const [days, setDays] = useState<string[]>([]);
  const [startTime, setStartTime] = useState("09:30");
  const [endTime, setEndTime] = useState("10:30");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [totalSeats, setTotalSeats] = useState(4);
  const [status, setStatus] = useState<BatchStatus>("available");

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!name.trim() || days.length === 0) return;
    onAdd({
      id: `batch-${Date.now()}-${Math.random().toString(36).slice(2)}`,
      course,
      level: level.trim() || null,
      name: name.trim(),
      days,
      start_time: startTime,
      end_time: endTime,
      start_date: startDate || null,
      end_date: endDate || null,
      total_seats: totalSeats,
      seats_remaining: totalSeats,
      status,
      published: true,
      isCurrent: false,
    });
    setName("");
    setLevel("");
    setDays([]);
  }

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      <h2>New batch</h2>
      <div className={styles.fieldGrid}>
        <label>
          <span>Course</span>
          <select value={course} onChange={(e) => setCourse(e.target.value as BatchCourse)}>
            {COURSES.map((c) => <option key={c} value={c}>{c}</option>)}
          </select>
        </label>
        <label>
          <span>Batch name</span>
          <input value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. TEF Weekday Evening" required />
        </label>
        <label>
          <span>Level (optional)</span>
          <input value={level} onChange={(e) => setLevel(e.target.value)} placeholder="e.g. B1" />
        </label>
      </div>

      <label className={styles.fullWidth}>
        <span>Days</span>
        <DayPicker value={days} onChange={setDays} />
      </label>

      <div className={styles.fieldGrid}>
        <label>
          <span>Start time</span>
          <input type="time" value={startTime} onChange={(e) => setStartTime(e.target.value)} required />
        </label>
        <label>
          <span>End time</span>
          <input type="time" value={endTime} onChange={(e) => setEndTime(e.target.value)} required />
        </label>
        <label>
          <span>Status</span>
          <select value={status} onChange={(e) => setStatus(e.target.value as BatchStatus)}>
            {STATUSES.map((s) => <option key={s} value={s}>{STATUS_LABELS[s]}</option>)}
          </select>
        </label>
        <label>
          <span>Start date (optional)</span>
          <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
        </label>
        <label>
          <span>End date (optional)</span>
          <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} />
        </label>
        <label>
          <span>Total seats</span>
          <input type="number" min={1} value={totalSeats} onChange={(e) => setTotalSeats(Number(e.target.value) || 1)} />
        </label>
      </div>

      <button type="submit" className={styles.save}>Add batch</button>
    </form>
  );
}

function BatchRow({
  batch,
  onUpdate,
  onRemove,
  onSetCurrent,
}: {
  batch: Batch;
  onUpdate: (patch: Partial<Batch>) => void;
  onRemove: () => void;
  onSetCurrent: () => void;
}) {
  return (
    <div className={batch.published ? styles.row : `${styles.row} ${styles.draftRow}`}>
      <div className={styles.rowHead}>
        <input
          className={styles.rowTitleInput}
          defaultValue={batch.name}
          onBlur={(e) => e.target.value.trim() && e.target.value !== batch.name && onUpdate({ name: e.target.value.trim() })}
        />
        <div className={styles.rowBadges}>
          {batch.isCurrent ? (
            <button type="button" className={styles.currentBadge} onClick={() => onUpdate({ isCurrent: false })}>
              Current {batch.course} batch — click to unset
            </button>
          ) : (
            <button type="button" className={styles.setCurrent} onClick={onSetCurrent}>Set as her current {batch.course} batch</button>
          )}
          <button type="button" className={batch.published ? styles.publishedBadge : styles.draftBadge} onClick={() => onUpdate({ published: !batch.published })}>
            {batch.published ? "Published" : "Draft"}
          </button>
        </div>
      </div>

      <div className={styles.fieldGrid}>
        <label>
          <span>Course</span>
          <select value={batch.course} onChange={(e) => onUpdate({ course: e.target.value as BatchCourse })}>
            {COURSES.map((c) => <option key={c} value={c}>{c}</option>)}
          </select>
        </label>
        <label>
          <span>Level</span>
          <input
            defaultValue={batch.level ?? ""}
            onBlur={(e) => e.target.value !== (batch.level ?? "") && onUpdate({ level: e.target.value || null })}
          />
        </label>
        <label>
          <span>Status</span>
          <select value={batch.status} onChange={(e) => onUpdate({ status: e.target.value as BatchStatus })}>
            {STATUSES.map((s) => <option key={s} value={s}>{STATUS_LABELS[s]}</option>)}
          </select>
        </label>
        <label>
          <span>Seats remaining</span>
          <input
            type="number"
            min={0}
            max={batch.total_seats}
            defaultValue={batch.seats_remaining}
            onBlur={(e) => Number(e.target.value) !== batch.seats_remaining && onUpdate({ seats_remaining: Number(e.target.value) || 0 })}
          />
        </label>
        <label>
          <span>Total seats</span>
          <input
            type="number"
            min={1}
            defaultValue={batch.total_seats}
            onBlur={(e) => Number(e.target.value) !== batch.total_seats && onUpdate({ total_seats: Number(e.target.value) || 1 })}
          />
        </label>
      </div>

      <label className={styles.fullWidth}>
        <span>Days</span>
        <DayPicker value={batch.days} onChange={(days) => onUpdate({ days })} />
      </label>

      <div className={styles.fieldGrid}>
        <label>
          <span>Start time</span>
          <input type="time" defaultValue={batch.start_time} onBlur={(e) => e.target.value !== batch.start_time && onUpdate({ start_time: e.target.value })} />
        </label>
        <label>
          <span>End time</span>
          <input type="time" defaultValue={batch.end_time} onBlur={(e) => e.target.value !== batch.end_time && onUpdate({ end_time: e.target.value })} />
        </label>
        <label>
          <span>Start date</span>
          <input type="date" defaultValue={batch.start_date ?? ""} onBlur={(e) => e.target.value !== (batch.start_date ?? "") && onUpdate({ start_date: e.target.value || null })} />
        </label>
        <label>
          <span>End date</span>
          <input type="date" defaultValue={batch.end_date ?? ""} onBlur={(e) => e.target.value !== (batch.end_date ?? "") && onUpdate({ end_date: e.target.value || null })} />
        </label>
      </div>

      <button type="button" className={styles.remove} onClick={onRemove}>Delete</button>
    </div>
  );
}

// Admin-managed class batches — feeds two live surfaces from one shared
// portal-state list: the public site's Available Batches section (every
// published batch) and, for whichever one is flagged isCurrent, the
// student's recurring class events on her calendar (see
// lib/batchData.ts's generateClassEvents, used by components/CalendarPage).
export function AdminBatchesPanel({
  batches,
  onAdd,
  onUpdate,
  onRemove,
  onSetCurrent,
}: {
  batches: Batch[];
  onAdd: (batch: Batch) => void;
  onUpdate: (id: string, patch: Partial<Batch>) => void;
  onRemove: (id: string) => void;
  onSetCurrent: (id: string) => void;
}) {
  return (
    <div className={styles.panel}>
      <NewBatchForm onAdd={onAdd} />

      <div className={styles.list}>
        {batches.map((batch) => (
          <BatchRow
            key={batch.id}
            batch={batch}
            onUpdate={(patch) => onUpdate(batch.id, patch)}
            onRemove={() => onRemove(batch.id)}
            onSetCurrent={() => onSetCurrent(batch.id)}
          />
        ))}
      </div>
    </div>
  );
}

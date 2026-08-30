"use client";

import { useState } from "react";
import { assignmentCategories, type AssignmentStatus } from "@/lib/testData";
import { useAdminState } from "@/lib/useAdminState";
import { DashboardShell } from "./DashboardShell";
import styles from "./TestsPage.module.css";

const statusStyles: Record<AssignmentStatus, string> = {
  "Not started": "statusNeutral",
  "In progress": "statusActive",
  Submitted: "statusPending",
  Reviewed: "statusDone",
  Completed: "statusDone",
};

const actionLabel: Record<AssignmentStatus, string> = {
  "Not started": "Start →",
  "In progress": "Continue →",
  Submitted: "View →",
  Reviewed: "View →",
  Completed: "View →",
};

export function TestsPage() {
  const { assignments } = useAdminState();
  const [category, setCategory] = useState<(typeof assignmentCategories)[number]>("All");

  const filtered = category === "All" ? assignments : assignments.filter((a) => a.category === category);

  return (
    <DashboardShell>
      <div className={styles.head}>
        <small>LE HUB</small>
        <h1>Tests &amp; Assignments.</h1>
        <p>Everything assigned, in progress, or already reviewed.</p>
      </div>

      <div className={styles.filterRow}>
        {assignmentCategories.map((c) => (
          <button key={c} type="button" className={category === c ? styles.chipActive : styles.chip} onClick={() => setCategory(c)}>{c}</button>
        ))}
      </div>

      <div className={styles.list}>
        {filtered.map((a) => (
          <div key={a.id} className={styles.card}>
            <div className={styles.cardTop}>
              <span className={styles.category}>{a.category.toUpperCase()}</span>
              <span className={styles[statusStyles[a.status]]}>{a.status}</span>
            </div>
            <strong>{a.title}</strong>
            <p>{a.description}</p>
            <div className={styles.cardFooter}>
              <div>
                <small className={styles.deadline}>{a.deadline}</small>
                {a.score && <small className={styles.score}>Score: {a.score}</small>}
              </div>
              <button type="button" className={styles.action}>{actionLabel[a.status]}</button>
            </div>
            {a.feedback && (
              <div className={styles.feedback}>
                <span>FEEDBACK</span>
                <p>{a.feedback}</p>
              </div>
            )}
          </div>
        ))}
      </div>
    </DashboardShell>
  );
}

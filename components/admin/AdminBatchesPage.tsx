"use client";

import { usePortalState } from "@/lib/usePortalState";
import { AdminShell } from "../AdminShell";
import { AdminBatchesPanel } from "./AdminBatchesPanel";
import styles from "./AdminLessonsManager.module.css";

// Its own top-level admin page (not a Lessons tab) — class batches feed
// both the public Available Batches section and, via whichever batch is
// flagged isCurrent, the student's calendar (see lib/batchData.ts).
export function AdminBatchesPage() {
  const { loaded, batches, addBatch, removeBatch, updateBatch, setCurrentBatch } = usePortalState();

  return (
    <AdminShell>
      <div className={styles.head}>
        <small>ADMIN</small>
        <h1>Batches.</h1>
        <p>Manage class batches — shown live on the website&rsquo;s Available Batches section, and the one marked current drives the student&rsquo;s calendar.</p>
      </div>

      {!loaded ? (
        <div className={styles.tabPanel}>
          <p className={styles.tabHint}>Loading…</p>
        </div>
      ) : (
        <div className={styles.tabPanel}>
          <AdminBatchesPanel batches={batches} onAdd={addBatch} onUpdate={updateBatch} onRemove={removeBatch} onSetCurrent={setCurrentBatch} />
        </div>
      )}
    </AdminShell>
  );
}

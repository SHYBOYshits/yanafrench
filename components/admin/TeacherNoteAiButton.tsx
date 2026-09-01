"use client";

import { useState } from "react";
import styles from "./AiEnhanceButton.module.css";

// One click, no confirm step: writes a short (3-4 word), purely
// motivational "Today's Note" and fills it straight in.
export function TeacherNoteAiButton({ onApply }: { onApply: (text: string) => void }) {
  const [status, setStatus] = useState<"idle" | "loading" | "error">("idle");
  const [error, setError] = useState<string | null>(null);

  async function generate() {
    setStatus("loading");
    setError(null);
    try {
      const res = await fetch("/api/teacher-note", { method: "POST" });
      if (!res.ok) {
        setError(await res.text());
        setStatus("error");
        return;
      }
      const { text } = (await res.json()) as { text: string };
      onApply(text);
      setStatus("idle");
    } catch {
      setError("Couldn't reach the AI. Check your connection.");
      setStatus("error");
    }
  }

  return (
    <div className={styles.wrap}>
      <button type="button" className={styles.trigger} onClick={generate} disabled={status === "loading"}>
        {status === "loading" ? "Writing…" : "✨ Write with AI"}
      </button>
      {status === "error" && <p className={styles.error}>{error}</p>}
    </div>
  );
}

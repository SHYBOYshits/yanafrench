"use client";

import { useState } from "react";
import type { QuizSession } from "@/lib/quizData";
import styles from "./AiEnhanceButton.module.css";

function buildContext(session: QuizSession | undefined): string {
  if (!session) return "";
  return `Last quiz session — level ${session.level}, overall score ${session.overallScore}/10. ${session.summary}`;
}

// One click, no confirm step: writes a short "Today's Note" and fills it
// straight in — grounded in the student's latest quiz session when one
// exists, otherwise a general encouraging note.
export function TeacherNoteAiButton({
  latestQuizSession,
  onApply,
}: {
  latestQuizSession: QuizSession | undefined;
  onApply: (text: string) => void;
}) {
  const [status, setStatus] = useState<"idle" | "loading" | "error">("idle");
  const [error, setError] = useState<string | null>(null);

  async function generate() {
    setStatus("loading");
    setError(null);
    try {
      const res = await fetch("/api/teacher-note", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ context: buildContext(latestQuizSession) }),
      });
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

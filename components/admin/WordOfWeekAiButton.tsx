"use client";

import { useState } from "react";
import styles from "./AiEnhanceButton.module.css";

// One click, no confirm step: the AI always picks a random French word (or
// connector/idiom) and its short meaning, and fills both fields in.
export function WordOfWeekAiButton({ onApply }: { onApply: (result: { word: string; meaning: string }) => void }) {
  const [status, setStatus] = useState<"idle" | "loading" | "error">("idle");
  const [error, setError] = useState<string | null>(null);

  async function generate() {
    setStatus("loading");
    setError(null);
    try {
      const res = await fetch("/api/word-of-week", { method: "POST" });
      if (!res.ok) {
        setError(await res.text());
        setStatus("error");
        return;
      }
      const result = (await res.json()) as { word: string; meaning: string };
      onApply(result);
      setStatus("idle");
    } catch {
      setError("Couldn't reach the AI. Check your connection.");
      setStatus("error");
    }
  }

  return (
    <div className={styles.wrap}>
      <button type="button" className={styles.trigger} onClick={generate} disabled={status === "loading"}>
        {status === "loading" ? "Thinking…" : "✨ Write with AI"}
      </button>
      {status === "error" && <p className={styles.error}>{error}</p>}
    </div>
  );
}

"use client";

import { useState } from "react";
import styles from "./AiEnhanceButton.module.css";

// Same trigger/panel visual language as AiEnhanceButton, but for the Word
// of the Week field specifically: with a word typed, it translates/glosses
// that exact word; left blank, it has the AI pick a random one instead —
// both go through the same /api/word-of-week endpoint.
export function WordOfWeekAiButton({
  word,
  onApply,
}: {
  word: string;
  onApply: (result: { word: string; meaning: string }) => void;
}) {
  const [status, setStatus] = useState<"idle" | "loading" | "ready" | "error">("idle");
  const [suggestion, setSuggestion] = useState<{ word: string; meaning: string } | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function generate() {
    setStatus("loading");
    setError(null);
    try {
      const res = await fetch("/api/word-of-week", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ word: word.trim() }),
      });
      if (!res.ok) {
        setError(await res.text());
        setStatus("error");
        return;
      }
      const result = (await res.json()) as { word: string; meaning: string };
      setSuggestion(result);
      setStatus("ready");
    } catch {
      setError("Couldn't reach the AI. Check your connection.");
      setStatus("error");
    }
  }

  function apply() {
    if (suggestion) onApply(suggestion);
    setStatus("idle");
  }

  function dismiss() {
    setStatus("idle");
    setError(null);
  }

  return (
    <div className={styles.wrap}>
      <button type="button" className={styles.trigger} onClick={generate} disabled={status === "loading"}>
        {status === "loading" ? "Thinking…" : word.trim() ? "✨ Translate with AI" : "✨ Surprise me"}
      </button>

      {status === "error" && (
        <div className={styles.panel}>
          <p className={styles.error}>{error}</p>
          <button type="button" className={styles.dismiss} onClick={dismiss}>Dismiss</button>
        </div>
      )}

      {status === "ready" && suggestion && (
        <div className={styles.panel}>
          <span className={styles.panelLabel}>SUGGESTED</span>
          <p className={styles.suggestion}><strong>{suggestion.word}</strong> — {suggestion.meaning}</p>
          <div className={styles.panelActions}>
            <button type="button" className={styles.use} onClick={apply}>Use this</button>
            <button type="button" className={styles.retry} onClick={generate}>Regenerate</button>
            <button type="button" className={styles.dismiss} onClick={dismiss}>Cancel</button>
          </div>
        </div>
      )}
    </div>
  );
}

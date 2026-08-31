"use client";

import { useState } from "react";
import styles from "./AiEnhanceButton.module.css";

export function AiEnhanceButton({
  kind,
  value,
  context,
  onApply,
}: {
  kind: "title" | "description";
  value: string;
  context?: string;
  onApply: (text: string) => void;
}) {
  const [status, setStatus] = useState<"idle" | "loading" | "ready" | "error">("idle");
  const [suggestion, setSuggestion] = useState("");
  const [error, setError] = useState<string | null>(null);

  async function enhance() {
    if (!value.trim()) {
      setError("Write a draft first.");
      setStatus("error");
      return;
    }
    setStatus("loading");
    setError(null);
    try {
      const res = await fetch("/api/enhance-text", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ kind, text: value, context }),
      });
      if (!res.ok) {
        setError(await res.text());
        setStatus("error");
        return;
      }
      const { enhanced } = (await res.json()) as { enhanced: string };
      setSuggestion(enhanced);
      setStatus("ready");
    } catch {
      setError("Couldn't reach the AI. Check your connection.");
      setStatus("error");
    }
  }

  function apply() {
    onApply(suggestion);
    setStatus("idle");
  }

  function dismiss() {
    setStatus("idle");
    setError(null);
  }

  return (
    <div className={styles.wrap}>
      <button type="button" className={styles.trigger} onClick={enhance} disabled={status === "loading"}>
        {status === "loading" ? "Enhancing…" : "✨ Enhance with AI"}
      </button>

      {status === "error" && (
        <div className={styles.panel}>
          <p className={styles.error}>{error}</p>
          <button type="button" className={styles.dismiss} onClick={dismiss}>Dismiss</button>
        </div>
      )}

      {status === "ready" && (
        <div className={styles.panel}>
          <span className={styles.panelLabel}>SUGGESTED</span>
          <p className={styles.suggestion}>{suggestion}</p>
          <div className={styles.panelActions}>
            <button type="button" className={styles.use} onClick={apply}>Use this</button>
            <button type="button" className={styles.retry} onClick={enhance}>Regenerate</button>
            <button type="button" className={styles.dismiss} onClick={dismiss}>Cancel</button>
          </div>
        </div>
      )}
    </div>
  );
}

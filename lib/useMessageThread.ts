"use client";

import { useCallback, useEffect, useRef, useState } from "react";

export type ThreadMessage = { id: string; from: "student" | "teacher"; text: string; time: number };

const POLL_MS = 3000;

export function formatMessageTime(epochMs: number) {
  const date = new Date(epochMs);
  const now = new Date();
  const clock = date.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" });

  const startOfDay = (d: Date) => new Date(d.getFullYear(), d.getMonth(), d.getDate()).getTime();
  const dayDiff = Math.round((startOfDay(now) - startOfDay(date)) / 86400000);

  if (dayDiff === 0) return clock;
  if (dayDiff === 1) return `Yesterday · ${clock}`;
  if (dayDiff < 7) return `${date.toLocaleDateString("en-US", { weekday: "short" })} · ${clock}`;
  return `${date.toLocaleDateString("en-US", { day: "numeric", month: "short" })} · ${clock}`;
}

// Polls the shared R2-backed message thread so both the student and admin
// Messages pages stay in sync across devices/browsers, not just same-tab.
export function useMessageThread() {
  const [messages, setMessages] = useState<ThreadMessage[]>([]);
  const [loaded, setLoaded] = useState(false);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const refresh = useCallback(async () => {
    try {
      const res = await fetch("/api/messages", { cache: "no-store" });
      if (!res.ok) return;
      const data = await res.json();
      setMessages(data);
    } catch {
      // stay on last-known messages if a poll fails
    } finally {
      setLoaded(true);
    }
  }, []);

  useEffect(() => {
    refresh();
    timerRef.current = setInterval(refresh, POLL_MS);
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [refresh]);

  const send = useCallback(async (from: "student" | "teacher", text: string) => {
    const trimmed = text.trim();
    if (!trimmed) return;
    try {
      const res = await fetch("/api/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ from, text: trimmed }),
      });
      if (res.ok) {
        setMessages(await res.json());
      }
    } catch {
      // next poll will reconcile
    }
  }, []);

  return { messages, loaded, send };
}

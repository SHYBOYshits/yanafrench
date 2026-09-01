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

  // A poll and a send() can both be in flight at once. Without a sequence
  // guard, a poll that started before a send resolves can land after it
  // and overwrite the thread with its (older) snapshot — the message you
  // just sent would flash away until the next poll fetched it back. Only
  // the response to the most-recently-started request is ever applied.
  const seqRef = useRef(0);

  // A sent message not yet confirmed by its own POST response — shown
  // immediately instead of waiting on the R2 round trip, and replayed on
  // top of every poll/response until that POST resolves (same pattern as
  // lib/usePortalState.ts), so it can't flicker away in the meantime.
  const pendingRef = useRef<ThreadMessage[]>([]);
  const applyPending = useCallback((list: ThreadMessage[]) => [...list, ...pendingRef.current], []);

  const refresh = useCallback(async () => {
    const seq = ++seqRef.current;
    try {
      const res = await fetch("/api/messages", { cache: "no-store" });
      if (!res.ok) return;
      const data = await res.json();
      if (seq === seqRef.current) setMessages(applyPending(data));
    } catch {
      // stay on last-known messages if a poll fails
    } finally {
      setLoaded(true);
    }
  }, [applyPending]);

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

    const optimistic: ThreadMessage = { id: `pending-${Date.now()}-${Math.random().toString(36).slice(2)}`, from, text: trimmed, time: Date.now() };
    pendingRef.current = [...pendingRef.current, optimistic];
    setMessages((prev) => [...prev, optimistic]);

    const seq = ++seqRef.current;
    try {
      const res = await fetch("/api/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ from, text: trimmed }),
      });
      if (res.ok) {
        const data = await res.json();
        pendingRef.current = pendingRef.current.filter((m) => m !== optimistic);
        if (seq === seqRef.current) setMessages(applyPending(data));
      }
    } catch {
      // Leave it pending — replayed on every poll until a retry succeeds.
    }
  }, [applyPending]);

  return { messages, loaded, send };
}

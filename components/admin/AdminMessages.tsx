"use client";

import { useEffect, useRef, useState, type FormEvent } from "react";
import { profile } from "@/lib/profileData";
import { formatMessageTime, useMessageThread } from "@/lib/useMessageThread";
import { AdminShell } from "../AdminShell";
import styles from "./AdminMessages.module.css";

export function AdminMessages() {
  const { messages, send } = useMessageThread();
  const [draft, setDraft] = useState("");
  const messagesRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = messagesRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [messages.length]);

  function handleSend(e: FormEvent) {
    e.preventDefault();
    if (!draft.trim()) return;
    send("teacher", draft);
    setDraft("");
  }

  const initials = profile.name.slice(0, 2).toUpperCase();

  return (
    <AdminShell>
      <div className={styles.head}>
        <small>ADMIN</small>
        <h1>Messages.</h1>
      </div>

      <div className={styles.thread}>
        <div className={styles.threadHead}>
          <span className={styles.avatar}>{initials}</span>
          <div>
            <strong>{profile.name}</strong>
            <small>{profile.course}</small>
          </div>
        </div>

        <div className={styles.messages} ref={messagesRef}>
          {messages.map((m) => (
            <div key={m.id} className={m.from === "teacher" ? styles.bubbleTeacher : styles.bubbleStudent}>
              <p>{m.text}</p>
              <span>{formatMessageTime(m.time)}</span>
            </div>
          ))}
        </div>

        <form className={styles.composer} onSubmit={handleSend}>
          <input
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            placeholder="Reply to Amelia…"
            aria-label="Message"
          />
          <button type="submit" disabled={!draft.trim()}>Send →</button>
        </form>
      </div>
    </AdminShell>
  );
}

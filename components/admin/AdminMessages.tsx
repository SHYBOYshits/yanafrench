"use client";

import { useEffect, useState, type FormEvent } from "react";
import { addMessage, getMessages, type ThreadMessage } from "@/lib/adminContent";
import { profile } from "@/lib/profileData";
import { AdminShell } from "../AdminShell";
import styles from "./AdminMessages.module.css";

export function AdminMessages() {
  const [messages, setMessages] = useState<ThreadMessage[]>([]);
  const [draft, setDraft] = useState("");

  useEffect(() => {
    setMessages(getMessages());
    function onStorage() {
      setMessages(getMessages());
    }
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  function handleSend(e: FormEvent) {
    e.preventDefault();
    const text = draft.trim();
    if (!text) return;
    setMessages(addMessage("teacher", text));
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

        <div className={styles.messages}>
          {messages.map((m) => (
            <div key={m.id} className={m.from === "teacher" ? styles.bubbleTeacher : styles.bubbleStudent}>
              <p>{m.text}</p>
              <span>{m.time}</span>
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

"use client";

import { useState } from "react";
import {
  getTodaysNote,
  getWeeklyFocus,
  getWordOfWeek,
  setTodaysNote,
  setWeeklyFocus,
  setWordOfWeek,
} from "@/lib/adminContent";
import { AdminShell } from "../AdminShell";
import styles from "./AdminContent.module.css";

export function AdminContent() {
  const [focus, setFocus] = useState(getWeeklyFocus());
  const [word, setWord] = useState(getWordOfWeek());
  const [note, setNote] = useState(getTodaysNote());
  const [savedField, setSavedField] = useState<string | null>(null);

  function flashSaved(field: string) {
    setSavedField(field);
    setTimeout(() => setSavedField((f) => (f === field ? null : f)), 1500);
  }

  function saveFocus() {
    setWeeklyFocus(focus);
    flashSaved("focus");
  }
  function saveWord() {
    setWordOfWeek(word);
    flashSaved("word");
  }
  function saveNote() {
    setTodaysNote(note);
    flashSaved("note");
  }

  return (
    <AdminShell>
      <div className={styles.head}>
        <small>ADMIN</small>
        <h1>Content.</h1>
        <p>These show up on Amelia&apos;s dashboard immediately after saving.</p>
      </div>

      <section className={styles.card}>
        <h2>This week&apos;s focus</h2>
        <label>
          <span>Focus</span>
          <input value={focus.text} onChange={(e) => setFocus({ ...focus, text: e.target.value })} />
        </label>
        <label>
          <span>Tag</span>
          <input value={focus.tag} onChange={(e) => setFocus({ ...focus, tag: e.target.value })} placeholder="e.g. TEF · Expression orale" />
        </label>
        <button type="button" className={styles.save} onClick={saveFocus}>{savedField === "focus" ? "✓ Saved" : "Save"}</button>
      </section>

      <section className={styles.card}>
        <h2>Word of the week</h2>
        <label>
          <span>Word</span>
          <input value={word.word} onChange={(e) => setWord({ ...word, word: e.target.value })} />
        </label>
        <label>
          <span>Meaning</span>
          <input value={word.meaning} onChange={(e) => setWord({ ...word, meaning: e.target.value })} placeholder="e.g. however · yet" />
        </label>
        <button type="button" className={styles.save} onClick={saveWord}>{savedField === "word" ? "✓ Saved" : "Save"}</button>
      </section>

      <section className={styles.card}>
        <h2>Today&apos;s note</h2>
        <label>
          <span>Note</span>
          <input value={note.text} onChange={(e) => setNote({ ...note, text: e.target.value })} />
        </label>
        <label>
          <span>Call to action</span>
          <input value={note.cta} onChange={(e) => setNote({ ...note, cta: e.target.value })} placeholder="e.g. One thing to revisit" />
        </label>
        <button type="button" className={styles.save} onClick={saveNote}>{savedField === "note" ? "✓ Saved" : "Save"}</button>
      </section>
    </AdminShell>
  );
}

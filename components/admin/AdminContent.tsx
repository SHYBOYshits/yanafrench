"use client";

import { useEffect, useRef, useState, type FormEvent } from "react";
import type { Recording } from "@/lib/recordingData";
import type { Note } from "@/lib/noteData";
import { uploadFileToR2 } from "@/lib/uploadFile";
import { useAdminState } from "@/lib/useAdminState";
import { AdminShell } from "../AdminShell";
import { RichTextEditor } from "./RichTextEditor";
import styles from "./AdminContent.module.css";

function todayLabel() {
  return new Date().toLocaleDateString("en-US", { day: "numeric", month: "short" });
}

export function AdminContent() {
  const {
    weeklyFocus,
    wordOfWeek,
    todaysNote,
    courseName,
    lessons,
    recordings,
    notes,
    wordArchive,
    loaded,
    setWeeklyFocus,
    setWordOfWeek,
    setTodaysNote,
    setCourseName,
    addRecording,
    removeRecording,
    addNote,
    removeNote,
    addWordEntry,
    removeWordEntry,
  } = useAdminState();

  const [focus, setFocus] = useState(weeklyFocus);
  const [word, setWord] = useState(wordOfWeek);
  const [note, setNote] = useState(todaysNote);
  const [course, setCourse] = useState(courseName);
  const [savedField, setSavedField] = useState<string | null>(null);
  const initialized = useRef(false);

  // Seed the editable fields once from the first successful load — not on
  // every poll after that, so a fetch mid-edit doesn't overwrite what the
  // admin is typing before they hit Save.
  useEffect(() => {
    if (loaded && !initialized.current) {
      setFocus(weeklyFocus);
      setWord(wordOfWeek);
      setNote(todaysNote);
      setCourse(courseName);
      initialized.current = true;
    }
  }, [loaded, weeklyFocus, wordOfWeek, todaysNote, courseName]);

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
  function saveCourse() {
    setCourseName(course);
    flashSaved("course");
  }

  // Recordings
  const sortedLessons = [...lessons].sort((a, b) => b.number - a.number);
  const [recTitle, setRecTitle] = useState("");
  const [recLesson, setRecLesson] = useState<number>(sortedLessons[0]?.number ?? 1);
  const [recUrl, setRecUrl] = useState("");
  const [recFile, setRecFile] = useState<File | null>(null);
  const [recUploading, setRecUploading] = useState(false);
  const [recError, setRecError] = useState<string | null>(null);

  async function handleAddRecording(e: FormEvent) {
    e.preventDefault();
    if (!recTitle.trim()) return;
    setRecError(null);

    let videoUrl = recUrl.trim();
    if (recFile) {
      setRecUploading(true);
      try {
        videoUrl = await uploadFileToR2(recFile);
      } catch (err) {
        setRecError(err instanceof Error ? err.message : "Upload failed. Check your connection and try again.");
        setRecUploading(false);
        return;
      }
      setRecUploading(false);
    }

    const recording: Recording = {
      id: `recording-${Date.now()}`,
      title: recTitle.trim(),
      lessonNumber: recLesson,
      date: todayLabel(),
      videoUrl: videoUrl || undefined,
      visibility: "Visible",
      order: Date.now(),
    };
    addRecording(recording);
    setRecTitle("");
    setRecUrl("");
    setRecFile(null);
  }

  // Notes
  const [noteTitle, setNoteTitle] = useState("");
  const [noteLesson, setNoteLesson] = useState<number>(sortedLessons[0]?.number ?? 1);
  const [noteBodyHtml, setNoteBodyHtml] = useState("");
  const [noteEditorKey, setNoteEditorKey] = useState(0);

  function handleAddNote(e: FormEvent) {
    e.preventDefault();
    if (!noteTitle.trim()) return;
    const note: Note = {
      id: `note-${Date.now()}`,
      title: noteTitle.trim(),
      bodyHtml: noteBodyHtml,
      lessonNumber: noteLesson,
      date: todayLabel(),
      order: Date.now(),
    };
    addNote(note);
    setNoteTitle("");
    setNoteBodyHtml("");
    setNoteEditorKey((k) => k + 1);
  }

  // Words of the week archive
  const [archiveWord, setArchiveWord] = useState("");
  const [archiveMeaning, setArchiveMeaning] = useState("");

  function handleAddWordEntry(e: FormEvent) {
    e.preventDefault();
    if (!archiveWord.trim() || !archiveMeaning.trim()) return;
    addWordEntry({ id: `word-${Date.now()}`, word: archiveWord.trim(), meaning: archiveMeaning.trim(), date: todayLabel() });
    setArchiveWord("");
    setArchiveMeaning("");
  }

  return (
    <AdminShell>
      <div className={styles.head}>
        <small>ADMIN</small>
        <h1>Content.</h1>
        <p>These show up on Amelia&apos;s dashboard and My Course page immediately after saving.</p>
      </div>

      <section className={styles.card}>
        <h2>Course</h2>
        <label>
          <span>Course name</span>
          <input value={course} onChange={(e) => setCourse(e.target.value)} placeholder="e.g. TEF Canada" />
        </label>
        <button type="button" className={styles.save} onClick={saveCourse}>{savedField === "course" ? "✓ Saved" : "Save"}</button>
      </section>

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

      <section className={`${styles.card} ${styles.cardWide}`}>
        <h2>Recordings</h2>
        <p className={styles.cardHint}>Attach a class recording to a lesson — shows up in the Recordings tab on My Course.</p>
        <form className={styles.subform} onSubmit={handleAddRecording}>
          <div className={styles.fieldGrid}>
            <label>
              <span>Title</span>
              <input value={recTitle} onChange={(e) => setRecTitle(e.target.value)} placeholder="e.g. Class recording · 14 Oct" required />
            </label>
            <label>
              <span>Lesson</span>
              <select value={recLesson} onChange={(e) => setRecLesson(Number(e.target.value))}>
                {sortedLessons.map((l) => <option key={l.number} value={l.number}>Lesson {l.number} — {l.title}</option>)}
              </select>
            </label>
          </div>
          <label className={styles.fullWidth}>
            <span>Upload a video</span>
            <input type="file" accept="video/*" onChange={(e) => setRecFile(e.target.files?.[0] ?? null)} />
          </label>
          <label className={styles.fullWidth}>
            <span>Or paste a video URL</span>
            <input value={recUrl} onChange={(e) => setRecUrl(e.target.value)} placeholder="https://…" disabled={!!recFile} />
          </label>
          {recError && <p className={styles.error}>{recError}</p>}
          <button type="submit" className={styles.save} disabled={recUploading}>{recUploading ? "Uploading…" : "Add recording"}</button>
        </form>

        <div className={styles.list}>
          {recordings.map((r) => (
            <div key={r.id} className={styles.row}>
              <div>
                <strong>{r.title}</strong>
                <small>Lesson {r.lessonNumber} · {r.date}</small>
              </div>
              {r.id.startsWith("recording-") ? (
                <button type="button" className={styles.remove} onClick={() => removeRecording(r.id)}>Remove</button>
              ) : (
                <span className={styles.seedTag}>Seed content</span>
              )}
            </div>
          ))}
        </div>
      </section>

      <section className={`${styles.card} ${styles.cardWide}`}>
        <h2>Notes</h2>
        <p className={styles.cardHint}>Attach a class note to a lesson — shows up in the Notes tab on My Course.</p>
        <form className={styles.subform} onSubmit={handleAddNote}>
          <div className={styles.fieldGrid}>
            <label>
              <span>Title</span>
              <input value={noteTitle} onChange={(e) => setNoteTitle(e.target.value)} placeholder="e.g. Great progress today" required />
            </label>
            <label>
              <span>Lesson</span>
              <select value={noteLesson} onChange={(e) => setNoteLesson(Number(e.target.value))}>
                {sortedLessons.map((l) => <option key={l.number} value={l.number}>Lesson {l.number} — {l.title}</option>)}
              </select>
            </label>
          </div>
          <RichTextEditor key={noteEditorKey} content={noteBodyHtml} onChange={setNoteBodyHtml} />
          <button type="submit" className={styles.save}>Add note</button>
        </form>

        <div className={styles.list}>
          {notes.map((n) => (
            <div key={n.id} className={styles.row}>
              <div>
                <strong>{n.title}</strong>
                <small>Lesson {n.lessonNumber} · {n.date}</small>
              </div>
              {n.id.startsWith("note-") ? (
                <button type="button" className={styles.remove} onClick={() => removeNote(n.id)}>Remove</button>
              ) : (
                <span className={styles.seedTag}>Seed content</span>
              )}
            </div>
          ))}
        </div>
      </section>

      <section className={`${styles.card} ${styles.cardWide}`}>
        <h2>Words of the week (archive)</h2>
        <p className={styles.cardHint}>Past words — shows up in the Words of the Week tab on My Course. Separate from the current word above.</p>
        <form className={styles.subform} onSubmit={handleAddWordEntry}>
          <div className={styles.fieldGrid}>
            <label>
              <span>Word</span>
              <input value={archiveWord} onChange={(e) => setArchiveWord(e.target.value)} placeholder="e.g. pourtant" required />
            </label>
            <label>
              <span>Meaning</span>
              <input value={archiveMeaning} onChange={(e) => setArchiveMeaning(e.target.value)} placeholder="e.g. however · yet" required />
            </label>
          </div>
          <button type="submit" className={styles.save}>Add word</button>
        </form>

        <div className={styles.list}>
          {wordArchive.map((w) => (
            <div key={w.id} className={styles.row}>
              <div>
                <strong>{w.word}</strong>
                <small>{w.meaning} · {w.date}</small>
              </div>
              {w.id.startsWith("word-") ? (
                <button type="button" className={styles.remove} onClick={() => removeWordEntry(w.id)}>Remove</button>
              ) : (
                <span className={styles.seedTag}>Seed content</span>
              )}
            </div>
          ))}
        </div>
      </section>
    </AdminShell>
  );
}

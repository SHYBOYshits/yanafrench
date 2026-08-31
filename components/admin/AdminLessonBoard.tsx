"use client";

import Link from "next/link";
import { useEffect, useRef, useState, type FormEvent } from "react";
import { categories, type Document } from "@/lib/documentData";
import type { LessonStatus } from "@/lib/courseData";
import type { Recording } from "@/lib/recordingData";
import { useAdminState } from "@/lib/useAdminState";
import { formatFileSize, readMediaDuration, uploadFileToR2 } from "@/lib/uploadFile";
import { AdminShell } from "../AdminShell";
import { UploadDropzone } from "./UploadDropzone";
import styles from "./AdminLessonBoard.module.css";

const tabs = ["Lessons", "Recordings", "Notes", "Words of the Week", "Tests"] as const;
type Tab = (typeof tabs)[number];

const statuses: LessonStatus[] = ["Draft", "Published", "Completed"];
const fileTypes: Document["fileType"][] = ["PDF", "Image", "PPT"];

const comingSoon: Partial<Record<Tab, string>> = {
  Notes: "A rich-text notes editor for this lesson is coming in a follow-up pass.",
  "Words of the Week": "Per-lesson vocabulary management (word, meaning, pronunciation, example) is coming in a follow-up pass.",
  Tests: "The test/quiz builder for this lesson is coming in a follow-up pass.",
};

function todayLabel() {
  return new Date().toLocaleDateString("en-US", { day: "numeric", month: "short" });
}

function stripExtension(filename: string) {
  return filename.replace(/\.[^./]+$/, "");
}

function inferFileType(file: File): Document["fileType"] {
  const name = file.name.toLowerCase();
  if (file.type.startsWith("image/") || /\.(png|jpe?g|gif|webp|svg)$/.test(name)) return "Image";
  if (/\.(ppt|pptx)$/.test(name) || file.type.includes("presentation")) return "PPT";
  return "PDF";
}

function statusBadgeClass(status: LessonStatus) {
  if (status === "Published") return styles.badgePublished;
  if (status === "Completed") return styles.badgeCompleted;
  return styles.badgeDraft;
}

export function AdminLessonBoard({ lessonNumber }: { lessonNumber: number }) {
  const {
    courseName,
    getLesson,
    setLessonCompleted,
    updateLessonDetails,
    documents,
    addResource,
    removeResource,
    updateResource,
    reorderResources,
    recordings,
    addRecording,
    removeRecording,
    updateRecording,
    reorderRecordings,
    loaded,
  } = useAdminState();

  const lesson = getLesson(lessonNumber);
  const [activeTab, setActiveTab] = useState<Tab>("Lessons");

  const [title, setTitle] = useState("");
  const [summary, setSummary] = useState("");
  const [date, setDate] = useState("");
  const [duration, setDuration] = useState("");
  const [status, setStatus] = useState<LessonStatus>("Draft");
  const [notesCount, setNotesCount] = useState(0);
  const [saved, setSaved] = useState(false);
  const initialized = useRef(false);

  useEffect(() => {
    if (loaded && lesson && !initialized.current) {
      setTitle(lesson.title);
      setSummary(lesson.summary);
      setDate(lesson.date);
      setDuration(lesson.duration);
      setStatus(lesson.status);
      setNotesCount(lesson.notesCount);
      initialized.current = true;
    }
  }, [loaded, lesson]);

  const [replacingId, setReplacingId] = useState<string | null>(null);
  const [addingLink, setAddingLink] = useState(false);
  const [linkTitle, setLinkTitle] = useState("");
  const [linkUrl, setLinkUrl] = useState("");
  const [linkCategory, setLinkCategory] = useState<Document["category"]>(categories[0]);
  const [linkFileType, setLinkFileType] = useState<Document["fileType"]>("PDF");

  const [addingRecordingLink, setAddingRecordingLink] = useState(false);
  const [recLinkTitle, setRecLinkTitle] = useState("");
  const [recLinkUrl, setRecLinkUrl] = useState("");

  if (!lesson) {
    return (
      <AdminShell>
        <div className={styles.head}>
          <small>ADMIN</small>
          <h1>Lesson not found.</h1>
        </div>
      </AdminShell>
    );
  }

  const lessonDocs = documents.filter((d) => d.lessonNumber === lessonNumber).sort((a, b) => a.order - b.order);
  const lessonRecordings = recordings.filter((r) => r.lessonNumber === lessonNumber).sort((a, b) => a.order - b.order);

  function saveOverview() {
    updateLessonDetails(lessonNumber, { title, summary, date, duration, status, notesCount });
    setSaved(true);
    setTimeout(() => setSaved(false), 1500);
  }

  function moveResource(id: string, dir: -1 | 1) {
    const ids = lessonDocs.map((d) => d.id);
    const idx = ids.indexOf(id);
    const swap = idx + dir;
    if (swap < 0 || swap >= ids.length) return;
    [ids[idx], ids[swap]] = [ids[swap], ids[idx]];
    reorderResources(lessonNumber, ids);
  }

  function moveRecording(id: string, dir: -1 | 1) {
    const ids = lessonRecordings.map((r) => r.id);
    const idx = ids.indexOf(id);
    const swap = idx + dir;
    if (swap < 0 || swap >= ids.length) return;
    [ids[idx], ids[swap]] = [ids[swap], ids[idx]];
    reorderRecordings(lessonNumber, ids);
  }

  function handleMaterialUploaded(fileUrl: string, file: File) {
    addResource({
      id: `resource-${Date.now()}-${Math.random().toString(36).slice(2)}`,
      title: stripExtension(file.name),
      category: categories[0],
      lessonNumber,
      fileType: inferFileType(file),
      date: todayLabel(),
      fileUrl,
      sizeBytes: file.size,
      order: Date.now(),
    });
  }

  async function handleReplaceMaterial(doc: Document, file: File) {
    setReplacingId(doc.id);
    try {
      const fileUrl = await uploadFileToR2(file);
      updateResource(doc.id, {
        fileUrl,
        fileType: inferFileType(file),
        sizeBytes: file.size,
        date: todayLabel(),
      });
    } finally {
      setReplacingId(null);
    }
  }

  function handleAddLink(e: FormEvent) {
    e.preventDefault();
    if (!linkTitle.trim() || !linkUrl.trim()) return;
    addResource({
      id: `resource-${Date.now()}-${Math.random().toString(36).slice(2)}`,
      title: linkTitle.trim(),
      category: linkCategory,
      lessonNumber,
      fileType: linkFileType,
      date: todayLabel(),
      fileUrl: linkUrl.trim(),
      order: Date.now(),
    });
    setLinkTitle("");
    setLinkUrl("");
    setAddingLink(false);
  }

  async function handleRecordingUploaded(fileUrl: string, file: File) {
    const duration = await readMediaDuration(file);
    addRecording({
      id: `recording-${Date.now()}-${Math.random().toString(36).slice(2)}`,
      title: stripExtension(file.name),
      lessonNumber,
      date: todayLabel(),
      duration: duration ?? undefined,
      videoUrl: fileUrl,
      visibility: "Visible",
      order: Date.now(),
    });
  }

  async function handleReplaceRecording(recording: Recording, file: File) {
    setReplacingId(recording.id);
    try {
      const fileUrl = await uploadFileToR2(file);
      const duration = await readMediaDuration(file);
      updateRecording(recording.id, { videoUrl: fileUrl, duration: duration ?? recording.duration, date: todayLabel() });
    } finally {
      setReplacingId(null);
    }
  }

  function handleAddRecordingLink(e: FormEvent) {
    e.preventDefault();
    if (!recLinkTitle.trim() || !recLinkUrl.trim()) return;
    addRecording({
      id: `recording-${Date.now()}-${Math.random().toString(36).slice(2)}`,
      title: recLinkTitle.trim(),
      lessonNumber,
      date: todayLabel(),
      videoUrl: recLinkUrl.trim(),
      visibility: "Visible",
      order: Date.now(),
    });
    setRecLinkTitle("");
    setRecLinkUrl("");
    setAddingRecordingLink(false);
  }

  return (
    <AdminShell>
      <Link href="/admin/progress" className={styles.backLink}>← Back to Admin Dashboard</Link>

      <div className={styles.header}>
        <div>
          <small>CURRENT COURSE · {courseName.toUpperCase()}</small>
          <h1>Lesson {lessonNumber}<br /><em>{lesson.title}</em></h1>
          <span className={`${styles.badge} ${statusBadgeClass(lesson.status)}`}>{lesson.status}</span>
        </div>
        <div className={styles.headerActions}>
          <Link href={`/student-hub/course/${lessonNumber}`} target="_blank" rel="noreferrer" className={styles.previewBtn}>
            Preview as Student →
          </Link>
          <button type="button" className={styles.saveBtn} onClick={saveOverview}>{saved ? "✓ Saved" : "Save Changes"}</button>
        </div>
      </div>

      <section className={styles.overview}>
        <h2>Lesson overview</h2>
        <div className={styles.overviewGrid}>
          <label>
            <span>Lesson number</span>
            <input value={lessonNumber} disabled />
          </label>
          <label>
            <span>Status</span>
            <select value={status} onChange={(e) => setStatus(e.target.value as LessonStatus)}>
              {statuses.map((s) => <option key={s} value={s}>{s}</option>)}
            </select>
          </label>
          <label>
            <span>Title</span>
            <input value={title} onChange={(e) => setTitle(e.target.value)} />
          </label>
          <label>
            <span>Date</span>
            <input value={date} onChange={(e) => setDate(e.target.value)} />
          </label>
          <label>
            <span>Duration</span>
            <input value={duration} onChange={(e) => setDuration(e.target.value)} placeholder="e.g. 64 min" />
          </label>
          <label>
            <span>Notes count</span>
            <input type="number" min={0} value={notesCount} onChange={(e) => setNotesCount(Number(e.target.value))} />
          </label>
        </div>
        <label className={styles.fullWidth}>
          <span>Description</span>
          <textarea value={summary} onChange={(e) => setSummary(e.target.value)} />
        </label>
        <label className={styles.completionRow}>
          <input type="checkbox" checked={lesson.completed} onChange={(e) => setLessonCompleted(lessonNumber, e.target.checked)} />
          Mark this lesson as completed for the student
        </label>
      </section>

      <div className={styles.tabs} role="tablist">
        {tabs.map((tab) => (
          <button
            key={tab}
            type="button"
            role="tab"
            aria-selected={activeTab === tab}
            className={activeTab === tab ? styles.tabActive : styles.tab}
            onClick={() => setActiveTab(tab)}
          >
            {tab}
          </button>
        ))}
      </div>

      {activeTab === "Lessons" && (
        <div className={styles.tabPanel}>
          <p className={styles.tabHint}>Lesson materials — PDFs, images and slide decks students see for this lesson.</p>
          <UploadDropzone
            accept=".pdf,image/*,.ppt,.pptx"
            hint="PDF, image or PPT — multiple files supported"
            onUploaded={handleMaterialUploaded}
          />

          <button type="button" className={styles.linkToggle} onClick={() => setAddingLink((v) => !v)}>
            {addingLink ? "Cancel" : "+ Add Resource (external link)"}
          </button>
          {addingLink && (
            <form className={styles.inlineForm} onSubmit={handleAddLink}>
              <input value={linkTitle} onChange={(e) => setLinkTitle(e.target.value)} placeholder="Resource title" required />
              <input value={linkUrl} onChange={(e) => setLinkUrl(e.target.value)} placeholder="https://…" required />
              <select value={linkCategory} onChange={(e) => setLinkCategory(e.target.value as Document["category"])}>
                {categories.map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
              <select value={linkFileType} onChange={(e) => setLinkFileType(e.target.value as Document["fileType"])}>
                {fileTypes.map((t) => <option key={t} value={t}>{t}</option>)}
              </select>
              <button type="submit" className={styles.saveBtn}>Add</button>
            </form>
          )}

          <div className={styles.cardGrid}>
            {lessonDocs.length === 0 && <p className={styles.emptyHint}>No materials uploaded yet.</p>}
            {lessonDocs.map((doc, i) => (
              <div key={doc.id} className={styles.card}>
                <div className={styles.cardTop}>
                  <select
                    className={styles.categoryChip}
                    value={doc.category}
                    onChange={(e) => updateResource(doc.id, { category: e.target.value as Document["category"] })}
                  >
                    {categories.map((c) => <option key={c} value={c}>{c}</option>)}
                  </select>
                  <span className={styles.typeTag}>{doc.fileType}</span>
                </div>
                <input
                  className={styles.cardTitleInput}
                  defaultValue={doc.title}
                  onBlur={(e) => e.target.value !== doc.title && updateResource(doc.id, { title: e.target.value })}
                />
                <small className={styles.cardMeta}>
                  {doc.sizeBytes ? `${formatFileSize(doc.sizeBytes)} · ` : ""}{doc.date}
                </small>
                <div className={styles.cardActions}>
                  <div className={styles.reorderBtns}>
                    <button type="button" disabled={i === 0} onClick={() => moveResource(doc.id, -1)} aria-label="Move up">↑</button>
                    <button type="button" disabled={i === lessonDocs.length - 1} onClick={() => moveResource(doc.id, 1)} aria-label="Move down">↓</button>
                  </div>
                  {doc.fileUrl && (
                    <a href={doc.fileUrl} target="_blank" rel="noreferrer" className={styles.cardLink}>View</a>
                  )}
                  {doc.fileUrl && (
                    <a href={doc.fileUrl} download target="_blank" rel="noreferrer" className={styles.cardLink}>Download</a>
                  )}
                  <label className={styles.cardLink}>
                    {replacingId === doc.id ? "Replacing…" : "Replace"}
                    <input
                      type="file"
                      hidden
                      accept=".pdf,image/*,.ppt,.pptx"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) handleReplaceMaterial(doc, file);
                        e.target.value = "";
                      }}
                    />
                  </label>
                  <button
                    type="button"
                    className={styles.deleteBtn}
                    onClick={() => {
                      if (confirm(`Delete "${doc.title}"?`)) removeResource(doc.id);
                    }}
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === "Recordings" && (
        <div className={styles.tabPanel}>
          <p className={styles.tabHint}>Class recordings students can watch for this lesson.</p>
          <UploadDropzone
            accept="video/*,audio/*"
            hint="Video or audio — multiple recordings supported"
            onUploaded={handleRecordingUploaded}
          />

          <button type="button" className={styles.linkToggle} onClick={() => setAddingRecordingLink((v) => !v)}>
            {addingRecordingLink ? "Cancel" : "+ Add Recording (external link)"}
          </button>
          {addingRecordingLink && (
            <form className={styles.inlineForm} onSubmit={handleAddRecordingLink}>
              <input value={recLinkTitle} onChange={(e) => setRecLinkTitle(e.target.value)} placeholder="Recording title" required />
              <input value={recLinkUrl} onChange={(e) => setRecLinkUrl(e.target.value)} placeholder="https://…" required />
              <button type="submit" className={styles.saveBtn}>Add</button>
            </form>
          )}

          <div className={styles.cardGrid}>
            {lessonRecordings.length === 0 && <p className={styles.emptyHint}>No recordings uploaded yet.</p>}
            {lessonRecordings.map((rec, i) => (
              <div key={rec.id} className={styles.card}>
                {rec.videoUrl && (
                  <video className={styles.player} src={rec.videoUrl} controls preload="metadata" />
                )}
                <input
                  className={styles.cardTitleInput}
                  defaultValue={rec.title}
                  onBlur={(e) => e.target.value !== rec.title && updateRecording(rec.id, { title: e.target.value })}
                />
                <textarea
                  className={styles.cardDescription}
                  defaultValue={rec.description ?? ""}
                  placeholder="Description (optional)"
                  onBlur={(e) => e.target.value !== (rec.description ?? "") && updateRecording(rec.id, { description: e.target.value })}
                />
                <div className={styles.recMetaRow}>
                  <input
                    className={styles.durationInput}
                    defaultValue={rec.duration ?? ""}
                    placeholder="Duration"
                    onBlur={(e) => e.target.value !== (rec.duration ?? "") && updateRecording(rec.id, { duration: e.target.value })}
                  />
                  <select
                    value={rec.visibility}
                    onChange={(e) => updateRecording(rec.id, { visibility: e.target.value as Recording["visibility"] })}
                  >
                    <option value="Visible">Visible</option>
                    <option value="Hidden">Hidden</option>
                  </select>
                  <small>{rec.date}</small>
                </div>
                <div className={styles.cardActions}>
                  <div className={styles.reorderBtns}>
                    <button type="button" disabled={i === 0} onClick={() => moveRecording(rec.id, -1)} aria-label="Move up">↑</button>
                    <button type="button" disabled={i === lessonRecordings.length - 1} onClick={() => moveRecording(rec.id, 1)} aria-label="Move down">↓</button>
                  </div>
                  <label className={styles.cardLink}>
                    {replacingId === rec.id ? "Replacing…" : "Replace"}
                    <input
                      type="file"
                      hidden
                      accept="video/*,audio/*"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) handleReplaceRecording(rec, file);
                        e.target.value = "";
                      }}
                    />
                  </label>
                  <button
                    type="button"
                    className={styles.deleteBtn}
                    onClick={() => {
                      if (confirm(`Delete "${rec.title}"?`)) removeRecording(rec.id);
                    }}
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {(activeTab === "Notes" || activeTab === "Words of the Week" || activeTab === "Tests") && (
        <div className={styles.comingSoon}>
          <p>{comingSoon[activeTab]}</p>
        </div>
      )}
    </AdminShell>
  );
}

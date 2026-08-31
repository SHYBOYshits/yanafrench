"use client";

import { useState, type FormEvent } from "react";
import { categories, type Document } from "@/lib/documentData";
import { useAdminState } from "@/lib/useAdminState";
import { uploadFileToR2 } from "@/lib/uploadFile";
import { AdminShell } from "../AdminShell";
import styles from "./AdminResources.module.css";

const fileTypes: Document["fileType"][] = ["PDF", "Image", "PPT"];

export function AdminResources() {
  const { documents: resources, lessons, addResource, removeResource } = useAdminState();
  const sortedLessons = [...lessons].sort((a, b) => b.number - a.number);
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState<Document["category"]>(categories[0]);
  const [lessonNumber, setLessonNumber] = useState<number>(sortedLessons[0]?.number ?? 1);
  const [fileType, setFileType] = useState<Document["fileType"]>("PDF");
  const [pages, setPages] = useState("");
  const [url, setUrl] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleAdd(e: FormEvent) {
    e.preventDefault();
    if (!title.trim()) return;
    setError(null);

    let fileUrl = url.trim();

    if (file) {
      setUploading(true);
      try {
        fileUrl = await uploadFileToR2(file);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Upload failed. Check your connection and try again.");
        setUploading(false);
        return;
      }
      setUploading(false);
    }

    const doc: Document = {
      id: `resource-${Date.now()}`,
      title: title.trim(),
      category,
      lessonNumber,
      fileType,
      pages: pages ? Number(pages) : undefined,
      date: new Date().toLocaleDateString("en-US", { day: "numeric", month: "short" }),
      fileUrl: fileUrl || undefined,
    };
    addResource(doc);
    setTitle("");
    setPages("");
    setUrl("");
    setFile(null);
  }

  function handleRemove(id: string) {
    removeResource(id);
  }

  return (
    <AdminShell>
      <div className={styles.head}>
        <small>ADMIN</small>
        <h1>Resources.</h1>
        <p>Add PDFs, images and slide decks to a lesson&apos;s Documents column — upload to R2 or paste a link.</p>
      </div>

      <form className={styles.form} onSubmit={handleAdd}>
        <div className={styles.fieldGrid}>
          <label>
            <span>Title</span>
            <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="e.g. Subjunctive worksheet" required />
          </label>
          <label>
            <span>Category</span>
            <select value={category} onChange={(e) => setCategory(e.target.value as Document["category"])}>
              {categories.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
          </label>
          <label>
            <span>Lesson</span>
            <select value={lessonNumber} onChange={(e) => setLessonNumber(Number(e.target.value))}>
              {sortedLessons.map((l) => <option key={l.number} value={l.number}>Lesson {l.number} — {l.title}</option>)}
            </select>
          </label>
          <label>
            <span>File type</span>
            <select value={fileType} onChange={(e) => setFileType(e.target.value as Document["fileType"])}>
              {fileTypes.map((t) => <option key={t} value={t}>{t}</option>)}
            </select>
          </label>
          <label>
            <span>Pages (optional)</span>
            <input type="number" min={1} value={pages} onChange={(e) => setPages(e.target.value)} />
          </label>
        </div>

        <label className={styles.fullWidth}>
          <span>Upload a file</span>
          <input type="file" accept=".pdf,image/*,.ppt,.pptx" onChange={(e) => setFile(e.target.files?.[0] ?? null)} />
        </label>

        <label className={styles.fullWidth}>
          <span>Or paste a file URL</span>
          <input value={url} onChange={(e) => setUrl(e.target.value)} placeholder="https://…" disabled={!!file} />
        </label>

        {error && <p className={styles.error}>{error}</p>}

        <button type="submit" className={styles.save} disabled={uploading}>{uploading ? "Uploading…" : "Add resource"}</button>
      </form>

      <div className={styles.section}>
        <h2>Library</h2>
        <div className={styles.list}>
          {resources.map((doc) => (
            <div key={doc.id} className={styles.row}>
              <div>
                <span className={styles.category}>{doc.category.toUpperCase()}</span>
                <strong>{doc.title}</strong>
                <small>{doc.fileType}{doc.pages ? ` · ${doc.pages} pages` : ""} · Lesson {doc.lessonNumber} · {doc.date}</small>
              </div>
              {doc.id.startsWith("resource-") ? (
                <button type="button" className={styles.remove} onClick={() => handleRemove(doc.id)}>Remove</button>
              ) : (
                <span className={styles.seedTag}>Seed content</span>
              )}
            </div>
          ))}
        </div>
      </div>
    </AdminShell>
  );
}

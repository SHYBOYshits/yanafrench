"use client";

import { useState, type FormEvent } from "react";
import { categories, courses, type Document } from "@/lib/documentData";
import { useAdminState } from "@/lib/useAdminState";
import { AdminShell } from "../AdminShell";
import styles from "./AdminResources.module.css";

const fileTypes: Document["fileType"][] = ["PDF", "Video", "Worksheet"];
const realCategories = categories.filter((c) => c !== "All");
const realCourses = courses.filter((c) => c !== "All");

export function AdminResources() {
  const { documents: resources, addResource, removeResource } = useAdminState();
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState<Document["category"]>(realCategories[0]);
  const [course, setCourse] = useState<Document["course"]>(realCourses[0]);
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
        const presignRes = await fetch("/api/admin/upload", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ filename: file.name, contentType: file.type || "application/octet-stream" }),
        });
        if (!presignRes.ok) {
          setError(await presignRes.text());
          setUploading(false);
          return;
        }
        const { uploadUrl, fileUrl: presignedFileUrl } = await presignRes.json();

        // Uploads straight to R2 from the browser, bypassing our server
        // entirely — avoids Vercel's request body size limit for large files.
        const putRes = await fetch(uploadUrl, {
          method: "PUT",
          headers: { "Content-Type": file.type || "application/octet-stream" },
          body: file,
        });
        if (!putRes.ok) {
          setError("Upload to storage failed. Please try again.");
          setUploading(false);
          return;
        }

        fileUrl = presignedFileUrl;
      } catch {
        setError("Upload failed. Check your connection and try again.");
        setUploading(false);
        return;
      }
      setUploading(false);
    }

    const doc: Document = {
      id: `resource-${Date.now()}`,
      title: title.trim(),
      category,
      course,
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
        <p>Add PDFs, videos and worksheets to Amelia&apos;s Documents library — upload to R2 or paste a link.</p>
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
              {realCategories.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
          </label>
          <label>
            <span>Course</span>
            <select value={course} onChange={(e) => setCourse(e.target.value as Document["course"])}>
              {realCourses.map((c) => <option key={c} value={c}>{c}</option>)}
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
          <input type="file" accept=".pdf,video/*,.doc,.docx" onChange={(e) => setFile(e.target.files?.[0] ?? null)} />
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
                <small>{doc.fileType}{doc.pages ? ` · ${doc.pages} pages` : ""} · {doc.course} · {doc.date}</small>
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

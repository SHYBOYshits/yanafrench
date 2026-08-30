"use client";

import { useMemo, useState } from "react";
import { categories, courses, getDocuments, type Document } from "@/lib/documentData";
import { useAdminValue } from "@/lib/useAdminValue";
import { DashboardShell } from "./DashboardShell";
import styles from "./DocumentsPage.module.css";

export function DocumentsPage() {
  const documents = useAdminValue(getDocuments);
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<(typeof categories)[number]>("All");
  const [course, setCourse] = useState<(typeof courses)[number]>("All");
  const [preview, setPreview] = useState<Document | null>(null);

  const recent = [...documents].slice(0, 3);

  const filtered = useMemo(() => {
    return documents.filter((d) => {
      const matchesQuery = d.title.toLowerCase().includes(query.trim().toLowerCase());
      const matchesCategory = category === "All" || d.category === category;
      const matchesCourse = course === "All" || d.course === course;
      return matchesQuery && matchesCategory && matchesCourse;
    });
  }, [documents, query, category, course]);

  function renderCard(doc: Document) {
    return (
      <div key={doc.id} className={styles.card}>
        <span className={styles.category}>{doc.category.toUpperCase()}</span>
        <strong>{doc.title}</strong>
        <small className={styles.meta}>{doc.fileType}{doc.pages ? ` · ${doc.pages} pages` : ""} · {doc.date}</small>
        <div className={styles.cardActions}>
          {doc.fileUrl ? (
            <a href={doc.fileUrl} target="_blank" rel="noreferrer" className={styles.view}>View →</a>
          ) : (
            <button type="button" className={styles.view} onClick={() => setPreview(doc)}>View →</button>
          )}
          {doc.fileUrl ? (
            <a href={doc.fileUrl} download target="_blank" rel="noreferrer" className={styles.download}>Download</a>
          ) : (
            <button type="button" className={styles.download}>Download</button>
          )}
        </div>
      </div>
    );
  }

  return (
    <DashboardShell>
      <div className={styles.head}>
        <small>LE HUB</small>
        <h1>Documents.</h1>
        <p>Grammar sheets, vocabulary lists, class notes and TEF prep material, all in one library.</p>
      </div>

      <div className={styles.controls}>
        <input
          className={styles.search}
          placeholder="Search documents…"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          aria-label="Search documents"
        />
        <div className={styles.filterRow}>
          {categories.map((c) => (
            <button key={c} type="button" className={category === c ? styles.chipActive : styles.chip} onClick={() => setCategory(c)}>{c}</button>
          ))}
        </div>
        <div className={styles.filterRow}>
          {courses.map((c) => (
            <button key={c} type="button" className={course === c ? styles.chipActive : styles.chip} onClick={() => setCourse(c)}>{c}</button>
          ))}
        </div>
      </div>

      {query.trim() === "" && category === "All" && course === "All" && (
        <div className={styles.section}>
          <h2>Recently added</h2>
          <div className={styles.grid}>{recent.map(renderCard)}</div>
        </div>
      )}

      <div className={styles.section}>
        <h2>All documents</h2>
        {filtered.length > 0 ? (
          <div className={styles.grid}>{filtered.map(renderCard)}</div>
        ) : (
          <div className={styles.empty}><p>No documents match your search.</p></div>
        )}
      </div>

      {preview && (
        <div className={styles.previewOverlay} onClick={() => setPreview(null)}>
          <div className={styles.previewPanel} onClick={(e) => e.stopPropagation()}>
            <button type="button" className={styles.previewClose} onClick={() => setPreview(null)} aria-label="Close preview">×</button>
            <div className={styles.previewPage}>
              <span className={styles.previewCategory}>{preview.category.toUpperCase()}</span>
              <strong>{preview.title}</strong>
              <div className={styles.previewLines}>
                <i /><i /><i style={{ width: "70%" }} />
                <i style={{ marginTop: ".9rem" }} /><i /><i style={{ width: "55%" }} />
              </div>
            </div>
            <div className={styles.previewMeta}>
              <div>
                <strong>{preview.title}</strong>
                <small>{preview.fileType}{preview.pages ? ` · ${preview.pages} pages` : ""} · {preview.course} · {preview.date}</small>
              </div>
              {preview.fileUrl ? (
                <a href={preview.fileUrl} download target="_blank" rel="noreferrer" className={styles.download}>Download</a>
              ) : (
                <button type="button" className={styles.download}>Download</button>
              )}
            </div>
          </div>
        </div>
      )}
    </DashboardShell>
  );
}

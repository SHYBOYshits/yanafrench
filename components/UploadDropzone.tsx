"use client";

import { useCallback, useRef, useState } from "react";
import { formatFileSize, presignUpload, putFileToR2 } from "@/lib/uploadFile";
import styles from "./UploadDropzone.module.css";

type QueueItem = {
  id: string;
  file: File;
  progress: number;
  status: "uploading" | "done" | "error";
  error?: string;
  xhr?: XMLHttpRequest;
};

export function UploadDropzone({
  accept,
  hint,
  multiple = true,
  onUploaded,
  disabled,
}: {
  accept: string;
  hint: string;
  multiple?: boolean;
  onUploaded: (fileUrl: string, file: File) => void;
  disabled?: boolean;
}) {
  const [items, setItems] = useState<QueueItem[]>([]);
  const [dragOver, setDragOver] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const startUpload = useCallback(
    (file: File) => {
      const id = `${file.name}-${Date.now()}-${Math.random().toString(36).slice(2)}`;
      setItems((prev) => [...prev, { id, file, progress: 0, status: "uploading" }]);

      (async () => {
        try {
          const { uploadUrl, fileUrl } = await presignUpload(file);
          const { promise, xhr } = putFileToR2(uploadUrl, file, (percent) => {
            setItems((prev) => prev.map((it) => (it.id === id ? { ...it, progress: percent } : it)));
          });
          setItems((prev) => prev.map((it) => (it.id === id ? { ...it, xhr } : it)));
          await promise;
          setItems((prev) => prev.map((it) => (it.id === id ? { ...it, status: "done", progress: 100 } : it)));
          onUploaded(fileUrl, file);
          setTimeout(() => setItems((prev) => prev.filter((it) => it.id !== id)), 1500);
        } catch (err) {
          setItems((prev) =>
            prev.map((it) =>
              it.id === id ? { ...it, status: "error", error: err instanceof Error ? err.message : "Upload failed." } : it
            )
          );
        }
      })();
    },
    [onUploaded]
  );

  function handleFiles(fileList: FileList | null) {
    if (!fileList) return;
    Array.from(fileList).forEach(startUpload);
  }

  function dismiss(id: string) {
    setItems((prev) => {
      const item = prev.find((it) => it.id === id);
      item?.xhr?.abort();
      return prev.filter((it) => it.id !== id);
    });
  }

  function retry(id: string) {
    const item = items.find((it) => it.id === id);
    if (!item) return;
    setItems((prev) => prev.filter((it) => it.id !== id));
    startUpload(item.file);
  }

  return (
    <div>
      <div
        className={dragOver ? `${styles.zone} ${styles.zoneActive}` : styles.zone}
        onDragOver={(e) => {
          e.preventDefault();
          if (!disabled) setDragOver(true);
        }}
        onDragLeave={() => setDragOver(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDragOver(false);
          if (!disabled) handleFiles(e.dataTransfer.files);
        }}
        onClick={() => !disabled && inputRef.current?.click()}
        onKeyDown={(e) => {
          if (!disabled && (e.key === "Enter" || e.key === " ")) inputRef.current?.click();
        }}
        role="button"
        tabIndex={0}
        aria-disabled={disabled}
      >
        <input
          ref={inputRef}
          type="file"
          accept={accept}
          multiple={multiple}
          hidden
          disabled={disabled}
          onChange={(e) => {
            handleFiles(e.target.files);
            e.target.value = "";
          }}
        />
        <span className={styles.zoneIcon} aria-hidden="true">↑</span>
        <strong>Drop files here or browse</strong>
        <small>{hint}</small>
      </div>

      {items.length > 0 && (
        <div className={styles.queue}>
          {items.map((it) => (
            <div key={it.id} className={styles.queueItem}>
              <div className={styles.queueInfo}>
                <strong>{it.file.name}</strong>
                <small>
                  {formatFileSize(it.file.size)}
                  {it.status === "error" ? ` · ${it.error}` : ""}
                </small>
                {it.status === "uploading" && (
                  <div className={styles.progressTrack}>
                    <span style={{ width: `${it.progress}%` }} />
                  </div>
                )}
              </div>
              {it.status === "done" && <span className={styles.statusDone}>✓ Uploaded</span>}
              {it.status === "uploading" && (
                <button type="button" className={styles.dismissBtn} onClick={() => dismiss(it.id)}>Cancel</button>
              )}
              {it.status === "error" && (
                <div className={styles.errorActions}>
                  <button type="button" className={styles.retryBtn} onClick={() => retry(it.id)}>Retry</button>
                  <button type="button" className={styles.dismissBtn} onClick={() => dismiss(it.id)}>Remove</button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

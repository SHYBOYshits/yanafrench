"use client";

import { useState, type FormEvent } from "react";
import type { CourseItem, CoursePdf, CourseVideo } from "@/lib/courseCatalog";
import type { Recording } from "@/lib/recordingData";
import type { Resource } from "@/lib/resourceData";
import { assignmentCategories, type Assignment, type AssignmentStatus } from "@/lib/testData";
import { usePortalState } from "@/lib/usePortalState";
import { formatFileSize, uploadFileToR2 } from "@/lib/uploadFile";
import { UploadDropzone } from "../UploadDropzone";
import { AdminShell } from "../AdminShell";
import { AiEnhanceButton } from "./AiEnhanceButton";
import styles from "./AdminLessonsManager.module.css";

const tabs = ["Course", "Recordings", "Resources", "Test and Assignments"] as const;
type Tab = (typeof tabs)[number];

const statuses: AssignmentStatus[] = ["Not started", "In progress", "Submitted", "Reviewed", "Completed"];
const realCategories = assignmentCategories.filter((c) => c !== "All");

function todayLabel() {
  return new Date().toLocaleDateString("en-US", { day: "numeric", month: "short" });
}

function stripExtension(filename: string) {
  return filename.replace(/\.[^./]+$/, "");
}

function inferResourceType(file: File): Resource["fileType"] {
  const name = file.name.toLowerCase();
  if (/\.(ppt|pptx)$/.test(name) || file.type.includes("presentation")) return "PPT";
  return "PDF";
}

export function AdminLessonsManager() {
  const [activeTab, setActiveTab] = useState<Tab>("Course");
  const {
    courses,
    addCourse,
    removeCourse,
    updateCourse,
    recordings,
    addRecording,
    removeRecording,
    updateRecording,
    resources,
    addResource,
    removeResource,
    updateResource,
    assignments,
    addAssignment,
    removeAssignment,
    updateAssignment,
  } = usePortalState();

  const [replacingId, setReplacingId] = useState<string | null>(null);

  // New course form
  const [courseTitle, setCourseTitle] = useState("");
  const [courseDescription, setCourseDescription] = useState("");

  function handleAddCourse(e: FormEvent) {
    e.preventDefault();
    if (!courseTitle.trim()) return;
    const course: CourseItem = {
      id: `course-${Date.now()}-${Math.random().toString(36).slice(2)}`,
      title: courseTitle.trim(),
      description: courseDescription.trim(),
      date: todayLabel(),
      videos: [],
      pdfs: [],
    };
    addCourse(course);
    setCourseTitle("");
    setCourseDescription("");
  }

  function handleAddVideosToCourse(course: CourseItem, fileUrl: string, file: File) {
    const video: CourseVideo = {
      id: `video-${Date.now()}-${Math.random().toString(36).slice(2)}`,
      title: stripExtension(file.name),
      videoUrl: fileUrl,
      sizeBytes: file.size,
    };
    updateCourse(course.id, { videos: [...course.videos, video] });
  }

  function handleAddPdfsToCourse(course: CourseItem, fileUrl: string, file: File) {
    const pdf: CoursePdf = {
      id: `pdf-${Date.now()}-${Math.random().toString(36).slice(2)}`,
      title: stripExtension(file.name),
      fileUrl,
      sizeBytes: file.size,
    };
    updateCourse(course.id, { pdfs: [...course.pdfs, pdf] });
  }

  function removeVideoFromCourse(course: CourseItem, videoId: string) {
    updateCourse(course.id, { videos: course.videos.filter((v) => v.id !== videoId) });
  }

  function removePdfFromCourse(course: CourseItem, pdfId: string) {
    updateCourse(course.id, { pdfs: course.pdfs.filter((p) => p.id !== pdfId) });
  }

  // Recordings
  const [addingRecordingLink, setAddingRecordingLink] = useState(false);
  const [recLinkTitle, setRecLinkTitle] = useState("");
  const [recLinkUrl, setRecLinkUrl] = useState("");

  function handleRecordingUploaded(fileUrl: string, file: File) {
    const recording: Recording = {
      id: `recording-${Date.now()}-${Math.random().toString(36).slice(2)}`,
      title: stripExtension(file.name),
      date: todayLabel(),
      videoUrl: fileUrl,
      sizeBytes: file.size,
    };
    addRecording(recording);
  }

  function handleAddRecordingLink(e: FormEvent) {
    e.preventDefault();
    if (!recLinkTitle.trim() || !recLinkUrl.trim()) return;
    addRecording({
      id: `recording-${Date.now()}-${Math.random().toString(36).slice(2)}`,
      title: recLinkTitle.trim(),
      date: todayLabel(),
      videoUrl: recLinkUrl.trim(),
    });
    setRecLinkTitle("");
    setRecLinkUrl("");
    setAddingRecordingLink(false);
  }

  async function handleReplaceRecording(recording: Recording, file: File) {
    setReplacingId(recording.id);
    try {
      const fileUrl = await uploadFileToR2(file);
      updateRecording(recording.id, { videoUrl: fileUrl, sizeBytes: file.size, date: todayLabel() });
    } finally {
      setReplacingId(null);
    }
  }

  // Resources
  const [addingResourceLink, setAddingResourceLink] = useState(false);
  const [resLinkTitle, setResLinkTitle] = useState("");
  const [resLinkUrl, setResLinkUrl] = useState("");
  const [resLinkType, setResLinkType] = useState<Resource["fileType"]>("PDF");

  function handleResourceUploaded(fileUrl: string, file: File) {
    const resource: Resource = {
      id: `resource-${Date.now()}-${Math.random().toString(36).slice(2)}`,
      title: stripExtension(file.name),
      fileType: inferResourceType(file),
      date: todayLabel(),
      fileUrl,
      sizeBytes: file.size,
    };
    addResource(resource);
  }

  function handleAddResourceLink(e: FormEvent) {
    e.preventDefault();
    if (!resLinkTitle.trim() || !resLinkUrl.trim()) return;
    addResource({
      id: `resource-${Date.now()}-${Math.random().toString(36).slice(2)}`,
      title: resLinkTitle.trim(),
      fileType: resLinkType,
      date: todayLabel(),
      fileUrl: resLinkUrl.trim(),
    });
    setResLinkTitle("");
    setResLinkUrl("");
    setAddingResourceLink(false);
  }

  async function handleReplaceResource(resource: Resource, file: File) {
    setReplacingId(resource.id);
    try {
      const fileUrl = await uploadFileToR2(file);
      updateResource(resource.id, { fileUrl, fileType: inferResourceType(file), sizeBytes: file.size, date: todayLabel() });
    } finally {
      setReplacingId(null);
    }
  }

  // Assignments
  const [aTitle, setATitle] = useState("");
  const [aDescription, setADescription] = useState("");
  const [aCategory, setACategory] = useState<Assignment["category"]>(realCategories[0]);
  const [aDeadline, setADeadline] = useState("");

  function handleAddAssignment(e: FormEvent) {
    e.preventDefault();
    if (!aTitle.trim()) return;
    addAssignment({
      id: `assignment-${Date.now()}-${Math.random().toString(36).slice(2)}`,
      title: aTitle.trim(),
      description: aDescription.trim(),
      category: aCategory,
      deadline: aDeadline.trim() || "No deadline set",
      status: "Not started",
    });
    setATitle("");
    setADescription("");
    setADeadline("");
  }

  return (
    <AdminShell>
      <div className={styles.head}>
        <small>ADMIN</small>
        <h1>Lessons.</h1>
        <p>Manage what students see under Lessons — course material, class recordings, resources and homework.</p>
      </div>

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

      {activeTab === "Course" && (
        <div className={styles.tabPanel}>
          <form className={styles.form} onSubmit={handleAddCourse}>
            <h2>New course</h2>
            <label>
              <span>Title</span>
              <input value={courseTitle} onChange={(e) => setCourseTitle(e.target.value)} placeholder="e.g. TEF Canada — Expression orale" required />
            </label>
            <AiEnhanceButton kind="title" value={courseTitle} context="a course title for a French class" onApply={setCourseTitle} />
            <label>
              <span>Description</span>
              <textarea value={courseDescription} onChange={(e) => setCourseDescription(e.target.value)} placeholder="What this course covers…" />
            </label>
            <AiEnhanceButton kind="description" value={courseDescription} context="a course description for a French class" onApply={setCourseDescription} />
            <button type="submit" className={styles.save}>Add course</button>
          </form>

          <div className={styles.courseList}>
            {courses.map((course) => (
              <div key={course.id} className={styles.courseCard}>
                <input
                  className={styles.courseTitleInput}
                  defaultValue={course.title}
                  onBlur={(e) => e.target.value !== course.title && updateCourse(course.id, { title: e.target.value })}
                />
                <textarea
                  className={styles.courseDescInput}
                  defaultValue={course.description}
                  onBlur={(e) => e.target.value !== course.description && updateCourse(course.id, { description: e.target.value })}
                />

                <div className={styles.courseSection}>
                  <span className={styles.sectionLabel}>VIDEOS</span>
                  <UploadDropzone
                    accept="video/*"
                    hint="Upload one or more lecture videos"
                    onUploaded={(fileUrl, file) => handleAddVideosToCourse(course, fileUrl, file)}
                  />
                  <div className={styles.itemGrid}>
                    {course.videos.map((v) => (
                      <div key={v.id} className={styles.item}>
                        <input
                          className={styles.itemTitleInput}
                          defaultValue={v.title}
                          onBlur={(e) => {
                            if (e.target.value !== v.title) {
                              updateCourse(course.id, { videos: course.videos.map((x) => (x.id === v.id ? { ...x, title: e.target.value } : x)) });
                            }
                          }}
                        />
                        <small>{v.sizeBytes ? formatFileSize(v.sizeBytes) : ""}</small>
                        <button type="button" className={styles.remove} onClick={() => removeVideoFromCourse(course, v.id)}>Delete</button>
                      </div>
                    ))}
                  </div>
                </div>

                <div className={styles.courseSection}>
                  <span className={styles.sectionLabel}>PDFS</span>
                  <UploadDropzone
                    accept=".pdf,.ppt,.pptx"
                    hint="Upload one or more PDFs"
                    onUploaded={(fileUrl, file) => handleAddPdfsToCourse(course, fileUrl, file)}
                  />
                  <div className={styles.itemGrid}>
                    {course.pdfs.map((p) => (
                      <div key={p.id} className={styles.item}>
                        <input
                          className={styles.itemTitleInput}
                          defaultValue={p.title}
                          onBlur={(e) => {
                            if (e.target.value !== p.title) {
                              updateCourse(course.id, { pdfs: course.pdfs.map((x) => (x.id === p.id ? { ...x, title: e.target.value } : x)) });
                            }
                          }}
                        />
                        <small>{p.sizeBytes ? formatFileSize(p.sizeBytes) : ""}</small>
                        <button type="button" className={styles.remove} onClick={() => removePdfFromCourse(course, p.id)}>Delete</button>
                      </div>
                    ))}
                  </div>
                </div>

                <button
                  type="button"
                  className={styles.deleteCourse}
                  onClick={() => {
                    if (confirm(`Delete course "${course.title}"?`)) removeCourse(course.id);
                  }}
                >
                  Delete course
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === "Recordings" && (
        <div className={styles.tabPanel}>
          <p className={styles.tabHint}>Upload Zoom class recordings for students to watch.</p>
          <UploadDropzone accept="video/*" hint="Video files — multiple supported" onUploaded={handleRecordingUploaded} />

          <button type="button" className={styles.linkToggle} onClick={() => setAddingRecordingLink((v) => !v)}>
            {addingRecordingLink ? "Cancel" : "+ Add Recording (external link)"}
          </button>
          {addingRecordingLink && (
            <form className={styles.inlineForm} onSubmit={handleAddRecordingLink}>
              <input value={recLinkTitle} onChange={(e) => setRecLinkTitle(e.target.value)} placeholder="Recording title" required />
              <input value={recLinkUrl} onChange={(e) => setRecLinkUrl(e.target.value)} placeholder="https://…" required />
              <button type="submit" className={styles.save}>Add</button>
            </form>
          )}

          <div className={styles.list}>
            {recordings.map((r) => (
              <div key={r.id} className={styles.row}>
                <div>
                  <input
                    className={styles.rowTitleInput}
                    defaultValue={r.title}
                    onBlur={(e) => e.target.value !== r.title && updateRecording(r.id, { title: e.target.value })}
                  />
                  <small>{r.sizeBytes ? `${formatFileSize(r.sizeBytes)} · ` : ""}{r.date}</small>
                </div>
                <div className={styles.rowActions}>
                  <label className={styles.rowLink}>
                    {replacingId === r.id ? "Replacing…" : "Replace"}
                    <input
                      type="file"
                      hidden
                      accept="video/*"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) handleReplaceRecording(r, file);
                        e.target.value = "";
                      }}
                    />
                  </label>
                  <button type="button" className={styles.remove} onClick={() => removeRecording(r.id)}>Delete</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === "Resources" && (
        <div className={styles.tabPanel}>
          <p className={styles.tabHint}>Upload external PDFs or slide decks for students.</p>
          <UploadDropzone accept=".pdf,.ppt,.pptx" hint="PDF or PPT — multiple files supported" onUploaded={handleResourceUploaded} />

          <button type="button" className={styles.linkToggle} onClick={() => setAddingResourceLink((v) => !v)}>
            {addingResourceLink ? "Cancel" : "+ Add Resource (external link)"}
          </button>
          {addingResourceLink && (
            <form className={styles.inlineForm} onSubmit={handleAddResourceLink}>
              <input value={resLinkTitle} onChange={(e) => setResLinkTitle(e.target.value)} placeholder="Resource title" required />
              <input value={resLinkUrl} onChange={(e) => setResLinkUrl(e.target.value)} placeholder="https://…" required />
              <select value={resLinkType} onChange={(e) => setResLinkType(e.target.value as Resource["fileType"])}>
                <option value="PDF">PDF</option>
                <option value="PPT">PPT</option>
              </select>
              <button type="submit" className={styles.save}>Add</button>
            </form>
          )}

          <div className={styles.list}>
            {resources.map((r) => (
              <div key={r.id} className={styles.row}>
                <div>
                  <span className={styles.typeTag}>{r.fileType}</span>
                  <input
                    className={styles.rowTitleInput}
                    defaultValue={r.title}
                    onBlur={(e) => e.target.value !== r.title && updateResource(r.id, { title: e.target.value })}
                  />
                  <small>{r.sizeBytes ? `${formatFileSize(r.sizeBytes)} · ` : ""}{r.date}</small>
                </div>
                <div className={styles.rowActions}>
                  <label className={styles.rowLink}>
                    {replacingId === r.id ? "Replacing…" : "Replace"}
                    <input
                      type="file"
                      hidden
                      accept=".pdf,.ppt,.pptx"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) handleReplaceResource(r, file);
                        e.target.value = "";
                      }}
                    />
                  </label>
                  <button type="button" className={styles.remove} onClick={() => removeResource(r.id)}>Delete</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === "Test and Assignments" && (
        <div className={styles.tabPanel}>
          <form className={styles.form} onSubmit={handleAddAssignment}>
            <h2>New test / assignment</h2>
            <div className={styles.fieldGrid}>
              <label>
                <span>Title</span>
                <input value={aTitle} onChange={(e) => setATitle(e.target.value)} placeholder="e.g. Writing · Opinion essay" required />
                <AiEnhanceButton kind="title" value={aTitle} context="a homework/test title for a French class" onApply={setATitle} />
              </label>
              <label>
                <span>Category</span>
                <select value={aCategory} onChange={(e) => setACategory(e.target.value as Assignment["category"])}>
                  {realCategories.map((c) => <option key={c} value={c}>{c}</option>)}
                </select>
              </label>
              <label>
                <span>Deadline</span>
                <input value={aDeadline} onChange={(e) => setADeadline(e.target.value)} placeholder="e.g. Due in 3 days" />
              </label>
            </div>
            <label className={styles.fullWidth}>
              <span>Description</span>
              <textarea value={aDescription} onChange={(e) => setADescription(e.target.value)} placeholder="What the student needs to do…" />
            </label>
            <AiEnhanceButton kind="description" value={aDescription} context="a homework/test description for a French class" onApply={setADescription} />
            <button type="submit" className={styles.save}>Add</button>
          </form>

          <div className={styles.assignmentList}>
            {assignments.map((a) => (
              <div key={a.id} className={styles.assignmentRow}>
                <div className={styles.assignmentHead}>
                  <strong>{a.title}</strong>
                  <small>{a.category}</small>
                </div>
                <div className={styles.fieldGrid}>
                  <label>
                    <span>Status</span>
                    <select value={a.status} onChange={(e) => updateAssignment(a.id, { status: e.target.value as AssignmentStatus })}>
                      {statuses.map((s) => <option key={s} value={s}>{s}</option>)}
                    </select>
                  </label>
                  <label>
                    <span>Deadline</span>
                    <input
                      defaultValue={a.deadline}
                      onBlur={(e) => e.target.value !== a.deadline && updateAssignment(a.id, { deadline: e.target.value })}
                    />
                  </label>
                  <label>
                    <span>Score</span>
                    <input
                      placeholder="e.g. 8.5 / 10"
                      defaultValue={a.score ?? ""}
                      onBlur={(e) => updateAssignment(a.id, { score: e.target.value || undefined })}
                    />
                  </label>
                </div>
                <label className={styles.fullWidth}>
                  <span>Feedback</span>
                  <textarea
                    defaultValue={a.feedback ?? ""}
                    onBlur={(e) => updateAssignment(a.id, { feedback: e.target.value || undefined })}
                  />
                </label>
                <button type="button" className={styles.remove} onClick={() => removeAssignment(a.id)}>Delete</button>
              </div>
            ))}
          </div>
        </div>
      )}
    </AdminShell>
  );
}

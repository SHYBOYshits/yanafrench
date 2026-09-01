"use client";

import { useState } from "react";
import type { CourseItem } from "@/lib/courseCatalog";
import { assignmentCategories, type AssignmentStatus } from "@/lib/testData";
import { usePortalState } from "@/lib/usePortalState";
import { DashboardShell } from "./DashboardShell";
import { IconPlay, IconVideoFrame } from "./Icons";
import styles from "./LessonsPage.module.css";

const tabs = ["Course", "Recordings", "Resources", "Test and Assignments"] as const;
type Tab = (typeof tabs)[number];

const statusStyles: Record<AssignmentStatus, string> = {
  "Not started": "statusNeutral",
  "In progress": "statusActive",
  Submitted: "statusPending",
  Reviewed: "statusDone",
  Completed: "statusDone",
};

const actionLabel: Record<AssignmentStatus, string> = {
  "Not started": "Start →",
  "In progress": "Continue →",
  Submitted: "View →",
  Reviewed: "View →",
  Completed: "View →",
};

function CourseLessons({ course }: { course: CourseItem }) {
  const [activeVideoId, setActiveVideoId] = useState(course.videos[0]?.id ?? null);
  const activeVideo = course.videos.find((v) => v.id === activeVideoId) ?? course.videos[0] ?? null;

  return (
    <div className={styles.courseSection}>
      <span className={styles.courseSectionLabel}>LESSONS</span>
      <div className={styles.lessonLayout}>
        <nav className={styles.lessonList}>
          {course.videos.map((v, i) => (
            <button
              key={v.id}
              type="button"
              className={v.id === activeVideo?.id ? styles.lessonRowActive : styles.lessonRow}
              onClick={() => setActiveVideoId(v.id)}
            >
              <IconPlay size={15} />
              <span className={styles.lessonRowText}>
                <small>Lesson {i + 1}</small>
                {v.title}
              </span>
            </button>
          ))}
        </nav>

        <div className={styles.playerPane}>
          {activeVideo?.videoUrl ? (
            <video key={activeVideo.id} src={activeVideo.videoUrl} controls preload="metadata" className={styles.videoPlayer} />
          ) : (
            <div className={styles.videoPlaceholder}>
              <IconVideoFrame size={26} />
              <span>Video coming soon</span>
            </div>
          )}
          {activeVideo && <p className={styles.playerCaption}>{activeVideo.title}</p>}
        </div>
      </div>
    </div>
  );
}

export function LessonsPage() {
  const [activeTab, setActiveTab] = useState<Tab>("Course");
  const [category, setCategory] = useState<(typeof assignmentCategories)[number]>("All");
  const { courses: allCourses, recordings: allRecordings, resources: allResources, assignments: allAssignments } = usePortalState();

  const courses = allCourses.filter((c) => c.published);
  const recordings = allRecordings.filter((r) => r.published);
  const resources = allResources.filter((r) => r.published);
  const publishedAssignments = allAssignments.filter((a) => a.published);
  const filteredAssignments = category === "All" ? publishedAssignments : publishedAssignments.filter((a) => a.category === category);

  return (
    <DashboardShell>
      <div className={styles.head}>
        <small>LE HUB</small>
        <h1>Lessons.</h1>
        <p>Course material, class recordings, resources and homework — all in one place.</p>
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
        courses.length > 0 ? (
          <div className={styles.courseList}>
            {courses.map((c) => (
              <div key={c.id} className={styles.courseCard}>
                <strong>{c.title}</strong>
                <small className={styles.courseDate}>{c.date}</small>
                <p className={styles.courseDescription}>{c.description}</p>

                {c.videos.length > 0 && <CourseLessons course={c} />}

                {c.pdfs.length > 0 && (
                  <div className={styles.courseSection}>
                    <span className={styles.courseSectionLabel}>PDFS</span>
                    <div className={styles.fileRow}>
                      {c.pdfs.map((p) =>
                        p.fileUrl ? (
                          <a key={p.id} href={p.fileUrl} target="_blank" rel="noreferrer" className={styles.fileChip}>{p.title}</a>
                        ) : (
                          <span key={p.id} className={styles.fileChipStatic}>{p.title}</span>
                        )
                      )}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className={styles.empty}><p>Course material will appear here.</p></div>
        )
      )}

      {activeTab === "Recordings" && (
        recordings.length > 0 ? (
          <div className={styles.simpleList}>
            {recordings.map((r) => (
              <div key={r.id} className={styles.simpleRow}>
                <div>
                  <strong>{r.title}</strong>
                  <small>{r.date}</small>
                </div>
                {r.videoUrl ? (
                  <a href={r.videoUrl} target="_blank" rel="noreferrer" className={styles.simpleAction}>Watch →</a>
                ) : (
                  <span className={styles.simpleActionStatic}>Watch →</span>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className={styles.empty}><p>Class recordings will appear here after each session.</p></div>
        )
      )}

      {activeTab === "Resources" && (
        resources.length > 0 ? (
          <div className={styles.simpleList}>
            {resources.map((r) => (
              <div key={r.id} className={styles.simpleRow}>
                <div>
                  <span className={styles.simpleTag}>{r.fileType}</span>
                  <strong>{r.title}</strong>
                  <small>{r.date}</small>
                </div>
                {r.fileUrl ? (
                  <div className={styles.resActions}>
                    <a href={r.fileUrl} target="_blank" rel="noreferrer" className={styles.simpleAction}>View</a>
                    <a href={r.fileUrl} download target="_blank" rel="noreferrer" className={styles.simpleAction}>Download</a>
                  </div>
                ) : (
                  <span className={styles.simpleActionStatic}>View</span>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className={styles.empty}><p>External resources will appear here.</p></div>
        )
      )}

      {activeTab === "Test and Assignments" && (
        <>
          <div className={styles.filterRow}>
            {assignmentCategories.map((c) => (
              <button key={c} type="button" className={category === c ? styles.chipActive : styles.chip} onClick={() => setCategory(c)}>{c}</button>
            ))}
          </div>

          {filteredAssignments.length > 0 ? (
            <div className={styles.assignmentList}>
              {filteredAssignments.map((a) => (
                <div key={a.id} className={styles.assignmentCard}>
                  <div className={styles.assignmentTop}>
                    <span className={styles.assignmentCategory}>{a.category.toUpperCase()}</span>
                    <span className={styles[statusStyles[a.status]]}>{a.status}</span>
                  </div>
                  <strong>{a.title}</strong>
                  <p>{a.description}</p>
                  <div className={styles.assignmentFooter}>
                    <div>
                      <small className={styles.deadline}>{a.deadline}</small>
                      {a.score && <small className={styles.score}>Score: {a.score}</small>}
                    </div>
                    <button type="button" className={styles.assignmentAction}>{actionLabel[a.status]}</button>
                  </div>
                  {a.feedback && (
                    <div className={styles.feedback}>
                      <span>FEEDBACK</span>
                      <p>{a.feedback}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className={styles.empty}><p>Homework and tests will appear here.</p></div>
          )}
        </>
      )}
    </DashboardShell>
  );
}

"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { defaultAdminState, type AdminState, type AdminStateAction, type LessonDetailPatch } from "./adminState";
import { lessons as seedLessons, getLesson as pureGetLesson, getAdjacentLessons as pureGetAdjacentLessons, type Lesson } from "./courseData";
import { assignments as seedAssignments, type Assignment } from "./testData";
import { documents as seedDocuments, type Document } from "./documentData";
import { recordings as seedRecordings, type Recording } from "./recordingData";
import { notes as seedNotes, type Note } from "./noteData";
import { wordArchive as seedWordArchive, type WordEntry } from "./wordArchiveData";
import type { CefrLevel } from "./progressData";

const POLL_MS = 3000;

function mergeLessons(overrides: AdminState["lessonOverrides"], detailOverrides: AdminState["lessonDetailOverrides"]): Lesson[] {
  return seedLessons.map((l) => {
    const patch = detailOverrides[l.number];
    const completed = l.number in overrides ? overrides[l.number] : l.completed;
    return patch ? { ...l, ...patch, completed } : { ...l, completed };
  });
}

function mergeAssignments(overrides: AdminState["assignmentOverrides"]): Assignment[] {
  return seedAssignments.map((a) => (a.id in overrides ? { ...a, ...overrides[a.id] } : a));
}

function mergeDocuments(added: Document[], overrides: AdminState["resourceOverrides"], hidden: string[]): Document[] {
  return [...added, ...seedDocuments]
    .filter((d) => !hidden.includes(d.id))
    .map((d) => (d.id in overrides ? { ...d, ...overrides[d.id] } : d));
}

function mergeRecordings(added: Recording[], overrides: AdminState["recordingOverrides"], hidden: string[]): Recording[] {
  return [...added, ...seedRecordings]
    .filter((r) => !hidden.includes(r.id))
    .map((r) => (r.id in overrides ? { ...r, ...overrides[r.id] } : r));
}

function mergeNotes(added: Note[], overrides: AdminState["noteOverrides"], hidden: string[]): Note[] {
  return [...added, ...seedNotes]
    .filter((n) => !hidden.includes(n.id))
    .map((n) => (n.id in overrides ? { ...n, ...overrides[n.id] } : n));
}

function mergeWordArchive(added: WordEntry[]): WordEntry[] {
  return [...added, ...seedWordArchive];
}

// Polls the shared R2-backed admin state so any change made in the admin
// dashboard (weekly focus, word of the week, today's note, lesson
// completion/details, assignment status/score/feedback, CEFR level,
// streak, resources, recordings, notes, word archive) reaches the
// student view across devices/browsers — the same pattern used for
// Messages, applied to everything admin-editable.
export function useAdminState() {
  const [raw, setRaw] = useState<AdminState>(defaultAdminState);
  const [loaded, setLoaded] = useState(false);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const refresh = useCallback(async () => {
    try {
      const res = await fetch("/api/admin-state", { cache: "no-store" });
      if (res.ok) setRaw(await res.json());
    } catch {
      // stay on last-known state if a poll fails
    } finally {
      setLoaded(true);
    }
  }, []);

  useEffect(() => {
    refresh();
    timerRef.current = setInterval(refresh, POLL_MS);
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [refresh]);

  const send = useCallback(async (action: AdminStateAction) => {
    try {
      const res = await fetch("/api/admin-state", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(action),
      });
      if (res.ok) setRaw(await res.json());
    } catch {
      // next poll will reconcile
    }
  }, []);

  const lessons = mergeLessons(raw.lessonOverrides, raw.lessonDetailOverrides);
  const assignments = mergeAssignments(raw.assignmentOverrides);
  const documents = mergeDocuments(raw.resources, raw.resourceOverrides, raw.hiddenResourceIds);
  const recordings = mergeRecordings(raw.recordings, raw.recordingOverrides, raw.hiddenRecordingIds);
  const notes = mergeNotes(raw.notes, raw.noteOverrides, raw.hiddenNoteIds);
  const wordArchive = mergeWordArchive(raw.wordArchive);

  return {
    loaded,
    weeklyFocus: raw.weeklyFocus,
    wordOfWeek: raw.wordOfWeek,
    todaysNote: raw.todaysNote,
    currentLevelCode: raw.currentLevelCode,
    streak: raw.streak,
    courseName: raw.courseName,
    lessons,
    assignments,
    documents,
    recordings,
    notes,
    wordArchive,
    getLesson: (number: number) => pureGetLesson(lessons, number),
    getAdjacentLessons: (number: number) => pureGetAdjacentLessons(lessons, number),
    setWeeklyFocus: (value: AdminState["weeklyFocus"]) => send({ type: "field", key: "weeklyFocus", value }),
    setWordOfWeek: (value: AdminState["wordOfWeek"]) => send({ type: "field", key: "wordOfWeek", value }),
    setTodaysNote: (value: AdminState["todaysNote"]) => send({ type: "field", key: "todaysNote", value }),
    setCurrentLevelCode: (value: CefrLevel["code"]) => send({ type: "field", key: "currentLevelCode", value }),
    setStreak: (value: number) => send({ type: "field", key: "streak", value }),
    setCourseName: (value: string) => send({ type: "field", key: "courseName", value }),
    setLessonCompleted: (number: number, completed: boolean) => send({ type: "lessonOverride", number, completed }),
    updateLessonDetails: (number: number, patch: LessonDetailPatch) => send({ type: "lessonDetailOverride", number, patch }),
    updateAssignment: (id: string, patch: Partial<Assignment>) => send({ type: "assignmentOverride", id, patch }),
    addResource: (resource: Document) => send({ type: "addResource", resource }),
    removeResource: (id: string) => send({ type: "removeResource", id }),
    updateResource: (id: string, patch: Partial<Document>) => send({ type: "updateResource", id, patch }),
    reorderResources: (lessonNumber: number, orderedIds: string[]) => send({ type: "reorderResources", lessonNumber, orderedIds }),
    addRecording: (recording: Recording) => send({ type: "addRecording", recording }),
    removeRecording: (id: string) => send({ type: "removeRecording", id }),
    updateRecording: (id: string, patch: Partial<Recording>) => send({ type: "updateRecording", id, patch }),
    reorderRecordings: (lessonNumber: number, orderedIds: string[]) => send({ type: "reorderRecordings", lessonNumber, orderedIds }),
    addNote: (note: Note) => send({ type: "addNote", note }),
    removeNote: (id: string) => send({ type: "removeNote", id }),
    updateNote: (id: string, patch: Partial<Note>) => send({ type: "updateNote", id, patch }),
    reorderNotes: (lessonNumber: number, orderedIds: string[]) => send({ type: "reorderNotes", lessonNumber, orderedIds }),
    addWordEntry: (entry: WordEntry) => send({ type: "addWordEntry", entry }),
    removeWordEntry: (id: string) => send({ type: "removeWordEntry", id }),
  };
}

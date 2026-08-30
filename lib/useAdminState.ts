"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { defaultAdminState, type AdminState, type AdminStateAction } from "./adminState";
import { lessons as seedLessons, getLesson as pureGetLesson, getAdjacentLessons as pureGetAdjacentLessons, type Lesson } from "./courseData";
import { assignments as seedAssignments, type Assignment } from "./testData";
import { documents as seedDocuments, type Document } from "./documentData";
import type { CefrLevel } from "./progressData";

const POLL_MS = 3000;

function mergeLessons(overrides: AdminState["lessonOverrides"]): Lesson[] {
  return seedLessons.map((l) => (l.number in overrides ? { ...l, completed: overrides[l.number] } : l));
}

function mergeAssignments(overrides: AdminState["assignmentOverrides"]): Assignment[] {
  return seedAssignments.map((a) => (a.id in overrides ? { ...a, ...overrides[a.id] } : a));
}

function mergeDocuments(resources: Document[]): Document[] {
  return [...resources, ...seedDocuments];
}

// Polls the shared R2-backed admin state so any change made in the admin
// dashboard (weekly focus, word of the week, today's note, lesson
// completion, assignment status/score/feedback, CEFR level, streak,
// resources) reaches the student view across devices/browsers — the same
// pattern used for Messages, applied to everything admin-editable.
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

  const lessons = mergeLessons(raw.lessonOverrides);
  const assignments = mergeAssignments(raw.assignmentOverrides);
  const documents = mergeDocuments(raw.resources);

  return {
    loaded,
    weeklyFocus: raw.weeklyFocus,
    wordOfWeek: raw.wordOfWeek,
    todaysNote: raw.todaysNote,
    currentLevelCode: raw.currentLevelCode,
    streak: raw.streak,
    lessons,
    assignments,
    documents,
    getLesson: (number: number) => pureGetLesson(lessons, number),
    getAdjacentLessons: (number: number) => pureGetAdjacentLessons(lessons, number),
    setWeeklyFocus: (value: AdminState["weeklyFocus"]) => send({ type: "field", key: "weeklyFocus", value }),
    setWordOfWeek: (value: AdminState["wordOfWeek"]) => send({ type: "field", key: "wordOfWeek", value }),
    setTodaysNote: (value: AdminState["todaysNote"]) => send({ type: "field", key: "todaysNote", value }),
    setCurrentLevelCode: (value: CefrLevel["code"]) => send({ type: "field", key: "currentLevelCode", value }),
    setStreak: (value: number) => send({ type: "field", key: "streak", value }),
    setLessonCompleted: (number: number, completed: boolean) => send({ type: "lessonOverride", number, completed }),
    updateAssignment: (id: string, patch: Partial<Assignment>) => send({ type: "assignmentOverride", id, patch }),
    addResource: (resource: Document) => send({ type: "addResource", resource }),
    removeResource: (id: string) => send({ type: "removeResource", id }),
  };
}

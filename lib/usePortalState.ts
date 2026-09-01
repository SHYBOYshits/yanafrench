"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { applyPortalAction, defaultPortalState, type PortalState, type PortalStateAction } from "./portalState";
import { courses as seedCourses, type CourseItem } from "./courseCatalog";
import { recordings as seedRecordings, type Recording } from "./recordingData";
import { resources as seedResources, type Resource } from "./resourceData";
import { assignments as seedAssignments, type Assignment } from "./testData";

const POLL_MS = 3000;

function mergeList<T extends { id: string }>(added: T[], seed: T[], overrides: Record<string, Partial<T>>, hidden: string[]): T[] {
  return [...added, ...seed]
    .filter((item) => !hidden.includes(item.id))
    .map((item) => (item.id in overrides ? { ...item, ...overrides[item.id] } : item));
}

// Polls the shared R2-backed portal state so any change made in the admin
// panel (courses, recordings, resources, assignments) reaches the student
// Lessons page across devices/browsers — the same pattern used for
// Messages.
export function usePortalState() {
  const [raw, setRaw] = useState<PortalState>(defaultPortalState);
  const [loaded, setLoaded] = useState(false);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Edits sent but not yet confirmed persisted. A background poll's
  // response is a snapshot from whenever *it* started — if it lands after
  // an optimistic edit but before that edit's own POST resolves, applying
  // it verbatim would momentarily un-delete/un-edit whatever's still
  // pending (a visible flash back to the old state). Replaying every
  // pending action on top of any server snapshot — poll or POST response —
  // keeps the UI consistent with the latest local edit no matter which
  // response lands first.
  const pendingRef = useRef<PortalStateAction[]>([]);
  const applyPending = useCallback(
    (state: PortalState) => pendingRef.current.reduce(applyPortalAction, state),
    []
  );

  const refresh = useCallback(async () => {
    try {
      const res = await fetch("/api/portal-state", { cache: "no-store" });
      if (res.ok) setRaw(applyPending(await res.json()));
    } catch {
      // stay on last-known state if a poll fails
    } finally {
      setLoaded(true);
    }
  }, [applyPending]);

  useEffect(() => {
    refresh();
    timerRef.current = setInterval(refresh, POLL_MS);
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [refresh]);

  // Applies the edit to local state immediately (so a delete/edit feels
  // instant instead of waiting on a round trip to R2) and persists it in
  // the background; the response — or the next poll — reconciles with the
  // authoritative server state.
  const send = useCallback(async (action: PortalStateAction) => {
    pendingRef.current = [...pendingRef.current, action];
    setRaw((prev) => applyPortalAction(prev, action));
    try {
      const res = await fetch("/api/portal-state", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(action),
      });
      if (res.ok) {
        const serverState = await res.json();
        pendingRef.current = pendingRef.current.filter((a) => a !== action);
        setRaw(applyPending(serverState));
      }
    } catch {
      // Leave it pending — it keeps getting replayed on top of every poll
      // until a retry succeeds, instead of silently reverting.
    }
  }, [applyPending]);

  const courses = mergeList(raw.courses, seedCourses, raw.courseOverrides, raw.hiddenCourseIds);
  const recordings = mergeList(raw.recordings, seedRecordings, raw.recordingOverrides, raw.hiddenRecordingIds);
  const resources = mergeList(raw.resources, seedResources, raw.resourceOverrides, raw.hiddenResourceIds);
  const assignments = mergeList(raw.assignments, seedAssignments, raw.assignmentOverrides, raw.hiddenAssignmentIds);

  return {
    loaded,
    courses,
    recordings,
    resources,
    assignments,
    addCourse: (course: CourseItem) => send({ type: "addCourse", course }),
    removeCourse: (id: string) => send({ type: "removeCourse", id }),
    updateCourse: (id: string, patch: Partial<CourseItem>) => send({ type: "updateCourse", id, patch }),
    addRecording: (recording: Recording) => send({ type: "addRecording", recording }),
    removeRecording: (id: string) => send({ type: "removeRecording", id }),
    updateRecording: (id: string, patch: Partial<Recording>) => send({ type: "updateRecording", id, patch }),
    addResource: (resource: Resource) => send({ type: "addResource", resource }),
    removeResource: (id: string) => send({ type: "removeResource", id }),
    updateResource: (id: string, patch: Partial<Resource>) => send({ type: "updateResource", id, patch }),
    addAssignment: (assignment: Assignment) => send({ type: "addAssignment", assignment }),
    removeAssignment: (id: string) => send({ type: "removeAssignment", id }),
    updateAssignment: (id: string, patch: Partial<Assignment>) => send({ type: "updateAssignment", id, patch }),
  };
}

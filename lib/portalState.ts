// Shared types for the Lessons portal content (Course / Recordings /
// Resources / Test & Assignments), persisted as a single JSON document in
// R2 (see app/api/portal-state/route.ts) so admin edits reach the student
// view regardless of device or browser — the same pattern already used
// for Messages.

import type { CourseItem } from "./courseCatalog";
import type { Recording } from "./recordingData";
import type { Resource } from "./resourceData";
import type { Assignment } from "./testData";

export type PortalState = {
  zoomLink: string;

  courses: CourseItem[];
  courseOverrides: Record<string, Partial<CourseItem>>;
  hiddenCourseIds: string[];

  recordings: Recording[];
  recordingOverrides: Record<string, Partial<Recording>>;
  hiddenRecordingIds: string[];

  resources: Resource[];
  resourceOverrides: Record<string, Partial<Resource>>;
  hiddenResourceIds: string[];

  assignments: Assignment[];
  assignmentOverrides: Record<string, Partial<Assignment>>;
  hiddenAssignmentIds: string[];
};

export const defaultPortalState: PortalState = {
  zoomLink: "",

  courses: [],
  courseOverrides: {},
  hiddenCourseIds: [],

  recordings: [],
  recordingOverrides: {},
  hiddenRecordingIds: [],

  resources: [],
  resourceOverrides: {},
  hiddenResourceIds: [],

  assignments: [],
  assignmentOverrides: {},
  hiddenAssignmentIds: [],
};

export type PortalStateAction =
  | { type: "setZoomLink"; url: string }
  | { type: "addCourse"; course: CourseItem }
  | { type: "removeCourse"; id: string }
  | { type: "updateCourse"; id: string; patch: Partial<CourseItem> }
  | { type: "addRecording"; recording: Recording }
  | { type: "removeRecording"; id: string }
  | { type: "updateRecording"; id: string; patch: Partial<Recording> }
  | { type: "addResource"; resource: Resource }
  | { type: "removeResource"; id: string }
  | { type: "updateResource"; id: string; patch: Partial<Resource> }
  | { type: "addAssignment"; assignment: Assignment }
  | { type: "removeAssignment"; id: string }
  | { type: "updateAssignment"; id: string; patch: Partial<Assignment> };

// Pure reducer shared by the API route (authoritative, persisted write) and
// the client hook (optimistic local update, applied instantly so the UI
// doesn't wait on a round trip to R2 before a delete/edit is reflected).
export function applyPortalAction(state: PortalState, action: PortalStateAction): PortalState {
  switch (action.type) {
    case "setZoomLink":
      return { ...state, zoomLink: action.url };
    case "addCourse":
      return { ...state, courses: [action.course, ...state.courses] };
    case "removeCourse":
      return { ...state, hiddenCourseIds: [...state.hiddenCourseIds, action.id] };
    case "updateCourse":
      return {
        ...state,
        courseOverrides: { ...state.courseOverrides, [action.id]: { ...state.courseOverrides[action.id], ...action.patch } },
      };
    case "addRecording":
      return { ...state, recordings: [action.recording, ...state.recordings] };
    case "removeRecording":
      return { ...state, hiddenRecordingIds: [...state.hiddenRecordingIds, action.id] };
    case "updateRecording":
      return {
        ...state,
        recordingOverrides: { ...state.recordingOverrides, [action.id]: { ...state.recordingOverrides[action.id], ...action.patch } },
      };
    case "addResource":
      return { ...state, resources: [action.resource, ...state.resources] };
    case "removeResource":
      return { ...state, hiddenResourceIds: [...state.hiddenResourceIds, action.id] };
    case "updateResource":
      return {
        ...state,
        resourceOverrides: { ...state.resourceOverrides, [action.id]: { ...state.resourceOverrides[action.id], ...action.patch } },
      };
    case "addAssignment":
      return { ...state, assignments: [action.assignment, ...state.assignments] };
    case "removeAssignment":
      return { ...state, hiddenAssignmentIds: [...state.hiddenAssignmentIds, action.id] };
    case "updateAssignment":
      return {
        ...state,
        assignmentOverrides: { ...state.assignmentOverrides, [action.id]: { ...state.assignmentOverrides[action.id], ...action.patch } },
      };
    default:
      return state;
  }
}

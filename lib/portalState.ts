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

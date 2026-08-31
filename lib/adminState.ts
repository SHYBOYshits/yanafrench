// Shared types for admin-editable content, persisted as a single JSON
// document in R2 (see app/api/admin-state/route.ts) so admin edits reach
// the student view regardless of device or browser — the same pattern
// already used for Messages.

import type { CefrLevel } from "./progressData";
import type { Assignment } from "./testData";
import type { Document } from "./documentData";
import type { Recording } from "./recordingData";
import type { Note } from "./noteData";
import type { WordEntry } from "./wordArchiveData";

export type AdminState = {
  weeklyFocus: { text: string; tag: string };
  wordOfWeek: { word: string; meaning: string };
  todaysNote: { text: string; cta: string };
  currentLevelCode: CefrLevel["code"];
  streak: number;
  courseName: string;
  lessonOverrides: Record<number, boolean>;
  assignmentOverrides: Record<string, Partial<Assignment>>;
  resources: Document[];
  recordings: Recording[];
  notes: Note[];
  wordArchive: WordEntry[];
};

export const defaultAdminState: AdminState = {
  weeklyFocus: { text: "Speak with more natural connectors", tag: "TEF · Expression orale" },
  wordOfWeek: { word: "pourtant", meaning: "however · yet" },
  todaysNote: { text: "Better rhythm today.", cta: "One thing to revisit" },
  currentLevelCode: "B1",
  streak: 12,
  courseName: "TEF Canada",
  lessonOverrides: {},
  assignmentOverrides: {},
  resources: [],
  recordings: [],
  notes: [],
  wordArchive: [],
};

export type AdminStateAction =
  | { type: "field"; key: "weeklyFocus"; value: AdminState["weeklyFocus"] }
  | { type: "field"; key: "wordOfWeek"; value: AdminState["wordOfWeek"] }
  | { type: "field"; key: "todaysNote"; value: AdminState["todaysNote"] }
  | { type: "field"; key: "currentLevelCode"; value: AdminState["currentLevelCode"] }
  | { type: "field"; key: "streak"; value: number }
  | { type: "field"; key: "courseName"; value: string }
  | { type: "lessonOverride"; number: number; completed: boolean }
  | { type: "assignmentOverride"; id: string; patch: Partial<Assignment> }
  | { type: "addResource"; resource: Document }
  | { type: "removeResource"; id: string }
  | { type: "addRecording"; recording: Recording }
  | { type: "removeRecording"; id: string }
  | { type: "addNote"; note: Note }
  | { type: "removeNote"; id: string }
  | { type: "addWordEntry"; entry: WordEntry }
  | { type: "removeWordEntry"; id: string };

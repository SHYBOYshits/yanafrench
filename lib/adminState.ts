// Shared types for admin-editable content, persisted as a single JSON
// document in R2 (see app/api/admin-state/route.ts) so admin edits reach
// the student view regardless of device or browser — the same pattern
// already used for Messages.

import type { CefrLevel } from "./progressData";
import type { Assignment } from "./testData";
import type { Document } from "./documentData";

export type AdminState = {
  weeklyFocus: { text: string; tag: string };
  wordOfWeek: { word: string; meaning: string };
  todaysNote: { text: string; cta: string };
  currentLevelCode: CefrLevel["code"];
  streak: number;
  lessonOverrides: Record<number, boolean>;
  assignmentOverrides: Record<string, Partial<Assignment>>;
  resources: Document[];
};

export const defaultAdminState: AdminState = {
  weeklyFocus: { text: "Speak with more natural connectors", tag: "TEF · Expression orale" },
  wordOfWeek: { word: "pourtant", meaning: "however · yet" },
  todaysNote: { text: "Better rhythm today.", cta: "One thing to revisit" },
  currentLevelCode: "B1",
  streak: 12,
  lessonOverrides: {},
  assignmentOverrides: {},
  resources: [],
};

export type AdminStateAction =
  | { type: "field"; key: "weeklyFocus"; value: AdminState["weeklyFocus"] }
  | { type: "field"; key: "wordOfWeek"; value: AdminState["wordOfWeek"] }
  | { type: "field"; key: "todaysNote"; value: AdminState["todaysNote"] }
  | { type: "field"; key: "currentLevelCode"; value: AdminState["currentLevelCode"] }
  | { type: "field"; key: "streak"; value: number }
  | { type: "lessonOverride"; number: number; completed: boolean }
  | { type: "assignmentOverride"; id: string; patch: Partial<Assignment> }
  | { type: "addResource"; resource: Document }
  | { type: "removeResource"; id: string };

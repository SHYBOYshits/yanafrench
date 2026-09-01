// Data layer for the AI Quiz feature — replaces the old admin-authored
// Test & Assignments list. Questions are generated on demand by
// /api/quiz/generate (never admin-authored) and graded by
// /api/quiz/submit, which also writes the finished QuizSession into the
// shared portal state (see lib/portalState.ts) so it shows up in both the
// student's history and the admin's read-only view.

import type { SpeakingEvaluation } from "./speakingData";

export type QuizLevel = "A1" | "A2" | "B1" | "B2";
export const quizLevels: QuizLevel[] = ["A1", "A2", "B1", "B2"];
export const defaultQuizLevel: QuizLevel = "A2";

export const DAILY_QUIZ_LIMIT = 2;
export const QUESTIONS_PER_SESSION = 6;

export type QuizSkill = "Grammar" | "Vocabulary" | "Listening" | "Reading" | "Writing" | "Speaking";

export type QuizQuestionType = "mcq" | "fillBlank" | "speaking";

// Sent to the client when a session is generated — no correct answers.
export type QuizQuestionPublic =
  | { id: string; type: "mcq"; skill: QuizSkill; prompt: string; choices: string[] }
  | { id: string; type: "fillBlank"; skill: QuizSkill; prompt: string }
  | { id: string; type: "speaking"; skill: "Speaking"; prompt: string };

// Server-side shape, round-tripped to the client as an opaque token (see
// encodeQuizToken/decodeQuizToken) and echoed back unmodified on submit —
// there's no per-session server storage to look this up from.
export type QuizQuestionAnswered =
  | { id: string; type: "mcq"; skill: QuizSkill; prompt: string; choices: string[]; correctAnswer: string; explanation: string }
  | { id: string; type: "fillBlank"; skill: QuizSkill; prompt: string; correctAnswer: string; acceptableAnswers: string[]; explanation: string }
  | { id: string; type: "speaking"; skill: "Speaking"; prompt: string };

export type QuizToken = { level: QuizLevel; questions: QuizQuestionAnswered[] };

export type QuizGradedItem = {
  id: string;
  type: QuizQuestionType;
  skill: QuizSkill;
  prompt: string;
  response: string;
  correct?: boolean;
  correctAnswer?: string;
  explanation?: string;
  speakingEval?: SpeakingEvaluation;
};

export type QuizSession = {
  id: string;
  date: string; // ISO timestamp
  level: QuizLevel;
  overallScore: number; // 0-10
  summary: string;
  strengths: string;
  focusAreas: string;
  items: QuizGradedItem[];
};

export function encodeQuizToken(token: QuizToken): string {
  return Buffer.from(JSON.stringify(token)).toString("base64url");
}

export function decodeQuizToken(raw: string): QuizToken {
  return JSON.parse(Buffer.from(raw, "base64url").toString("utf8")) as QuizToken;
}

function toCalendarDay(iso: string): string {
  return iso.slice(0, 10);
}

/** Whether an ISO date string falls on the same UTC calendar day as `now`. */
export function isSameCalendarDay(iso: string, now: Date = new Date()): boolean {
  return toCalendarDay(iso) === now.toISOString().slice(0, 10);
}

export function countSessionsToday(sessions: QuizSession[], now: Date = new Date()): number {
  return sessions.filter((s) => isSameCalendarDay(s.date, now)).length;
}

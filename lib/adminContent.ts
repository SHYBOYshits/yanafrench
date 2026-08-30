// Shared, admin-editable content for the student platform.
//
// There's no database yet, so this persists to localStorage — but every
// value is read through a getter that falls back to a sensible seed, and
// every write goes through a setter here. That's the seam: swap these
// functions for real API calls to a database later and nothing that calls
// them (student pages or the admin dashboard) needs to change.

import { notifyAdminChange } from "./adminEvents";

function readKey<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  try {
    const stored = localStorage.getItem(key);
    return stored ? (JSON.parse(stored) as T) : fallback;
  } catch {
    return fallback;
  }
}

function writeKey<T>(key: string, value: T) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(key, JSON.stringify(value));
    notifyAdminChange();
  } catch {}
}

// --- Weekly focus ---

export type WeeklyFocus = { text: string; tag: string };
const WEEKLY_FOCUS_KEY = "admin-weekly-focus";
const defaultWeeklyFocus: WeeklyFocus = { text: "Speak with more natural connectors", tag: "TEF · Expression orale" };

export function getWeeklyFocus(): WeeklyFocus {
  return readKey(WEEKLY_FOCUS_KEY, defaultWeeklyFocus);
}
export function setWeeklyFocus(value: WeeklyFocus) {
  writeKey(WEEKLY_FOCUS_KEY, value);
}

// --- Word of the week ---

export type WordOfWeek = { word: string; meaning: string };
const WORD_OF_WEEK_KEY = "admin-word-of-week";
const defaultWordOfWeek: WordOfWeek = { word: "pourtant", meaning: "however · yet" };

export function getWordOfWeek(): WordOfWeek {
  return readKey(WORD_OF_WEEK_KEY, defaultWordOfWeek);
}
export function setWordOfWeek(value: WordOfWeek) {
  writeKey(WORD_OF_WEEK_KEY, value);
}

// --- Today's note ---

export type TodaysNote = { text: string; cta: string };
const TODAYS_NOTE_KEY = "admin-todays-note";
const defaultTodaysNote: TodaysNote = { text: "Better rhythm today.", cta: "One thing to revisit" };

export function getTodaysNote(): TodaysNote {
  return readKey(TODAYS_NOTE_KEY, defaultTodaysNote);
}
export function setTodaysNote(value: TodaysNote) {
  writeKey(TODAYS_NOTE_KEY, value);
}

// --- Messages (shared thread between the student and admin views) ---

export type ThreadMessage = { id: string; from: "student" | "teacher"; text: string; time: string };
const MESSAGES_KEY = "admin-messages-thread";
const defaultMessages: ThreadMessage[] = [
  { id: "m1", from: "teacher", text: "Bonjour Amelia ! I left a voice note on your last recording — your rhythm is really improving.", time: "Mon · 10:12 AM" },
  { id: "m2", from: "student", text: "Thank you! I'll listen to it before our next class.", time: "Mon · 11:40 AM" },
  { id: "m3", from: "teacher", text: "Perfect. Also, don't forget Lesson 13 is up — it builds directly on what we covered Thursday.", time: "Mon · 11:52 AM" },
  { id: "m4", from: "teacher", text: "Thursday 9:30 AM as usual — see you then!", time: "Yesterday · 6:05 PM" },
];

export function getMessages(): ThreadMessage[] {
  return readKey(MESSAGES_KEY, defaultMessages);
}
export function addMessage(from: "student" | "teacher", text: string) {
  const next = [...getMessages(), { id: `msg-${Date.now()}`, from, text, time: "Just now" }];
  writeKey(MESSAGES_KEY, next);
  return next;
}

export type CefrLevel = {
  code: "A1" | "A2" | "B1" | "B2" | "C1";
  label: string;
  description: string;
  skillsAchieved: string[];
  skillsToImprove: string[];
  recentAssessments: { title: string; score: string; date: string }[];
  recommendedLessons: string[];
};

export const cefrLevels: CefrLevel[] = [
  {
    code: "A1",
    label: "Beginner",
    description: "Can understand and use familiar everyday expressions and basic phrases for concrete needs.",
    skillsAchieved: ["Basic greetings and introductions", "Simple present tense", "Numbers, dates, everyday vocabulary"],
    skillsToImprove: [],
    recentAssessments: [{ title: "Placement assessment", score: "Passed", date: "12 Jan" }],
    recommendedLessons: [],
  },
  {
    code: "A2",
    label: "Elementary",
    description: "Can communicate in simple, routine tasks on familiar topics and describe immediate needs.",
    skillsAchieved: ["Past tense (passé composé)", "Everyday transactions", "Simple connected sentences"],
    skillsToImprove: [],
    recentAssessments: [{ title: "A2 checkpoint", score: "82%", date: "3 Mar" }],
    recommendedLessons: [],
  },
  {
    code: "B1",
    label: "Independent",
    description: "Can deal with most situations while travelling, describe experiences, and give reasons for opinions.",
    skillsAchieved: ["Conditional tense", "Connecting ideas with basic connectors", "Narrating past experiences"],
    skillsToImprove: ["Speaking fluency", "Complex connectors", "Grammar accuracy", "Vocabulary range"],
    recentAssessments: [
      { title: "TEF mock oral exam", score: "7.6 / 10", date: "20 Sep" },
      { title: "Grammar checkpoint", score: "9 / 10", date: "2 Oct" },
    ],
    recommendedLessons: ["Building stronger oral answers", "Connectors for natural transitions", "Opinion structures that sound natural"],
  },
  {
    code: "B2",
    label: "Confident",
    description: "Can interact with fluency and spontaneity, produce clear detailed text, and argue a viewpoint.",
    skillsAchieved: [],
    skillsToImprove: ["Nuanced argumentation", "Idiomatic expressions", "Register (formal vs. informal)"],
    recentAssessments: [],
    recommendedLessons: ["Building stronger oral answers", "Opinion structures that sound natural"],
  },
  {
    code: "C1",
    label: "Advanced",
    description: "Can express ideas fluently and spontaneously without much searching for expressions.",
    skillsAchieved: [],
    skillsToImprove: [],
    recentAssessments: [],
    recommendedLessons: [],
  },
];

const seedLevelCode: CefrLevel["code"] = "B1";
const LEVEL_KEY = "admin-cefr-level";
const STREAK_KEY = "admin-streak";

export function getCurrentLevelCode(): CefrLevel["code"] {
  if (typeof window === "undefined") return seedLevelCode;
  try {
    const stored = localStorage.getItem(LEVEL_KEY);
    return (stored as CefrLevel["code"]) || seedLevelCode;
  } catch {
    return seedLevelCode;
  }
}

export function setCurrentLevelCode(code: CefrLevel["code"]) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(LEVEL_KEY, code);
  } catch {}
}

const seedStreak = 12;

export function getStreak(): number {
  if (typeof window === "undefined") return seedStreak;
  try {
    const stored = localStorage.getItem(STREAK_KEY);
    return stored ? Number(stored) : seedStreak;
  } catch {
    return seedStreak;
  }
}

export function setStreak(days: number) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STREAK_KEY, String(days));
  } catch {}
}

export function getCefrLevels() {
  return cefrLevels;
}

export function getCefrLevel(code: string) {
  return cefrLevels.find((l) => l.code === code.toUpperCase());
}

export type SkillMetric = {
  skill: string;
  type: "delta" | "score" | "count";
  value: string;
  detail: string;
};

// Progress is computed from real activity elsewhere in the app — lessons
// completed (My Course), assignment scores (Tests & Assignments), and
// speaking evaluations (Speaking Practice, scored by the AI pipeline) —
// rather than being a fixed number. Nothing here is fabricated: a skill
// with no underlying activity yet says so instead of showing a fake stat.

import { getLessons } from "./courseData";
import { getAssignments, type Assignment } from "./testData";
import { getSpeakingHistory } from "./speakingData";
import { getSavedWords, getVocabulary } from "./vocabData";

function parseScoreFraction(score?: string): number | null {
  if (!score) return null;
  const match = score.match(/([\d.]+)\s*\/\s*([\d.]+)/);
  if (!match) return null;
  const num = parseFloat(match[1]);
  const denom = parseFloat(match[2]);
  return denom ? num / denom : null;
}

function avgAssignmentFraction(category: Assignment["category"]): number | null {
  const fractions = getAssignments()
    .filter((a) => a.category === category)
    .map((a) => parseScoreFraction(a.score))
    .filter((v): v is number => v != null);
  return fractions.length ? fractions.reduce((a, b) => a + b, 0) / fractions.length : null;
}

function avgSpeakingSkill(key: keyof import("./speakingData").SkillScores): number | null {
  const history = getSpeakingHistory();
  if (history.length === 0) return null;
  return history.reduce((sum, a) => sum + a.evaluation.scores[key], 0) / history.length;
}

export function getLessonProgress() {
  const lessons = getLessons();
  const completed = lessons.filter((l) => l.completed).length;
  return { completed, total: lessons.length, pct: lessons.length ? completed / lessons.length : 0 };
}

function assignmentCompletionPct() {
  const assignments = getAssignments();
  if (assignments.length === 0) return 0;
  const done = assignments.filter((a) => a.status === "Reviewed" || a.status === "Completed").length;
  return done / assignments.length;
}

export function getOverallProgress() {
  const lessonPct = getLessonProgress().pct;
  const assignmentPct = assignmentCompletionPct();
  const speakingHistory = getSpeakingHistory();
  const speakingPct = speakingHistory.length
    ? speakingHistory.reduce((sum, a) => sum + a.evaluation.overall, 0) / speakingHistory.length / 10
    : null;

  const signals = [lessonPct, assignmentPct, speakingPct].filter((v): v is number => v != null);
  if (signals.length === 0) return 0;
  return Math.round((signals.reduce((a, b) => a + b, 0) / signals.length) * 100);
}

export function getSkillProgress(): SkillMetric[] {
  const speakingHistory = getSpeakingHistory();
  const latestSpeaking = speakingHistory[0];
  const vocabCount = getVocabulary().length + getSavedWords().length;

  const scoreOrEmpty = (fraction: number | null, detail: string): { type: "score"; value: string; detail: string } => {
    if (fraction == null) return { type: "score", value: "—", detail: "no scored work yet" };
    return { type: "score", value: `${(fraction * 10).toFixed(1)} / 10`, detail };
  };

  const listening = scoreOrEmpty(avgAssignmentFraction("Listening"), "average assignment score");
  const reading = scoreOrEmpty(avgAssignmentFraction("Reading"), "average assignment score");
  const writing = scoreOrEmpty(avgAssignmentFraction("Writing"), "average assignment score");

  const grammarAssignment = avgAssignmentFraction("Grammar");
  const grammarSpeaking = avgSpeakingSkill("grammar");
  const grammarSignals = [grammarAssignment != null ? grammarAssignment * 10 : null, grammarSpeaking].filter((v): v is number => v != null);
  const grammar: SkillMetric =
    grammarSignals.length > 0
      ? { skill: "Grammar", type: "score", value: `${(grammarSignals.reduce((a, b) => a + b, 0) / grammarSignals.length).toFixed(1)} / 10`, detail: "from assignments and speaking practice" }
      : { skill: "Grammar", type: "score", value: "—", detail: "no scored work yet" };

  return [
    { skill: "Listening", ...listening },
    latestSpeaking
      ? { skill: "Speaking", type: "score", value: `${latestSpeaking.evaluation.overall.toFixed(1)} / 10`, detail: "latest speaking attempt" }
      : { skill: "Speaking", type: "score", value: "—", detail: "no speaking attempts yet" },
    { skill: "Reading", ...reading },
    { skill: "Writing", ...writing },
    grammar,
    { skill: "Vocabulary", type: "count", value: `${vocabCount} words`, detail: "known and saved" },
    avgSpeakingSkill("pronunciation") != null
      ? { skill: "Pronunciation", type: "score", value: `${avgSpeakingSkill("pronunciation")!.toFixed(1)} / 10`, detail: "average across speaking attempts" }
      : { skill: "Pronunciation", type: "score", value: "—", detail: "no speaking attempts yet" },
  ];
}

export const testTarget = { reached: 4, of: 5 };

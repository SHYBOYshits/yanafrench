import type { Lesson } from "./courseData";
import type { QuizSession } from "./quizData";
import type { SkillScores, SpeakingAttempt } from "./speakingData";

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
// completed, AI Quiz scores, and speaking evaluations (scored by the AI
// pipeline) — rather than being a fixed number. Nothing here is
// fabricated: a skill with no underlying activity yet says so instead of
// showing a fake stat.

function avgQuizSkillFraction(sessions: QuizSession[], skill: string): number | null {
  const items = sessions.flatMap((s) => s.items).filter((i) => i.skill === skill && i.type !== "speaking");
  if (items.length === 0) return null;
  return items.filter((i) => i.correct).length / items.length;
}

function avgSpeakingSkill(history: SpeakingAttempt[], key: keyof SkillScores): number | null {
  if (history.length === 0) return null;
  return history.reduce((sum, a) => sum + a.evaluation.scores[key], 0) / history.length;
}

export function computeLessonProgress(lessons: Lesson[]) {
  const completed = lessons.filter((l) => l.completed).length;
  return { completed, total: lessons.length, pct: lessons.length ? completed / lessons.length : 0 };
}

function quizCompletionPct(sessions: QuizSession[]): number | null {
  if (sessions.length === 0) return null;
  return sessions.reduce((sum, s) => sum + s.overallScore, 0) / sessions.length / 10;
}

export function computeOverallProgress(lessons: Lesson[], quizSessions: QuizSession[], speakingHistory: SpeakingAttempt[]) {
  const lessonPct = computeLessonProgress(lessons).pct;
  const quizPct = quizCompletionPct(quizSessions);
  const speakingPct = speakingHistory.length
    ? speakingHistory.reduce((sum, a) => sum + a.evaluation.overall, 0) / speakingHistory.length / 10
    : null;

  const signals = [lessonPct, quizPct, speakingPct].filter((v): v is number => v != null);
  if (signals.length === 0) return 0;
  return Math.round((signals.reduce((a, b) => a + b, 0) / signals.length) * 100);
}

export function computeSkillProgress(quizSessions: QuizSession[], speakingHistory: SpeakingAttempt[], vocabCount: number): SkillMetric[] {
  const latestSpeaking = speakingHistory[0];

  const scoreOrEmpty = (fraction: number | null, detail: string): { type: "score"; value: string; detail: string } => {
    if (fraction == null) return { type: "score", value: "—", detail: "no scored work yet" };
    return { type: "score", value: `${(fraction * 10).toFixed(1)} / 10`, detail };
  };

  const listening = scoreOrEmpty(avgQuizSkillFraction(quizSessions, "Listening"), "average quiz score");
  const reading = scoreOrEmpty(avgQuizSkillFraction(quizSessions, "Reading"), "average quiz score");
  const writing = scoreOrEmpty(avgQuizSkillFraction(quizSessions, "Writing"), "average quiz score");

  const grammarQuiz = avgQuizSkillFraction(quizSessions, "Grammar");
  const grammarSpeaking = avgSpeakingSkill(speakingHistory, "grammar");
  const grammarSignals = [grammarQuiz != null ? grammarQuiz * 10 : null, grammarSpeaking].filter((v): v is number => v != null);
  const grammar: SkillMetric =
    grammarSignals.length > 0
      ? { skill: "Grammar", type: "score", value: `${(grammarSignals.reduce((a, b) => a + b, 0) / grammarSignals.length).toFixed(1)} / 10`, detail: "from quizzes and speaking practice" }
      : { skill: "Grammar", type: "score", value: "—", detail: "no scored work yet" };

  const pronunciation = avgSpeakingSkill(speakingHistory, "pronunciation");

  return [
    { skill: "Listening", ...listening },
    latestSpeaking
      ? { skill: "Speaking", type: "score", value: `${latestSpeaking.evaluation.overall.toFixed(1)} / 10`, detail: "latest speaking attempt" }
      : { skill: "Speaking", type: "score", value: "—", detail: "no speaking attempts yet" },
    { skill: "Reading", ...reading },
    { skill: "Writing", ...writing },
    grammar,
    { skill: "Vocabulary", type: "count", value: `${vocabCount} words`, detail: "known and saved" },
    pronunciation != null
      ? { skill: "Pronunciation", type: "score", value: `${pronunciation.toFixed(1)} / 10`, detail: "average across speaking attempts" }
      : { skill: "Pronunciation", type: "score", value: "—", detail: "no speaking attempts yet" },
  ];
}

export const testTarget = { reached: 4, of: 5 };

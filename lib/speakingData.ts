// Data layer for the Speaking Practice feature.
//
// evaluateAttempt() calls /api/speaking/evaluate, which sends the recorded
// audio directly to Gemini (audio -> AI analysis -> scores -> corrections ->
// feedback, in one multimodal call) and returns a structured evaluation.

import { notifyAdminChange } from "./adminEvents";

export type SkillScores = {
  pronunciation: number;
  fluency: number;
  grammar: number;
  vocabulary: number;
  sentenceStructure: number;
  coherence: number;
};

export type Correction = { said: string; better: string; explanation: string };

export type SpeakingEvaluation = {
  transcript: string;
  overall: number;
  scores: SkillScores;
  wellDone: string;
  improve: string;
  corrections: Correction[];
  improvedAnswer: string;
};

export type SpeakingAttempt = {
  id: string;
  date: string;
  topic: string;
  prompt: string;
  durationLabel: string;
  status: "Reviewed";
  evaluation: SpeakingEvaluation;
};

export const prompts = [
  { topic: "Personal experience", text: "Parlez-moi d'une expérience qui vous a beaucoup appris." },
  { topic: "Travel", text: "Décrivez un voyage qui vous a marqué et expliquez pourquoi." },
  { topic: "Opinion", text: "Pensez-vous que la technologie a changé notre façon d'apprendre ? Pourquoi ?" },
];

const placeholderEvaluation: SpeakingEvaluation = {
  transcript: "Je pense que cette expérience m'a beaucoup appris, parce que j'ai dû sortir de ma zone de confort.",
  overall: 7.8,
  scores: {
    pronunciation: 7.6,
    fluency: 8.2,
    grammar: 7.1,
    vocabulary: 7.9,
    sentenceStructure: 7.4,
    coherence: 8.4,
  },
  wellDone: "Your structure was clear and your ideas were easy to follow.",
  improve: "Try slowing down before introducing your example.",
  corrections: [
    { said: "Je suis allé au Paris.", better: "Je suis allé à Paris.", explanation: "City names use \"à\", not \"au\" — \"au\" is reserved for masculine countries like \"au Canada\"." },
    { said: "J'ai beaucoup de expériences.", better: "J'ai beaucoup d'expériences.", explanation: "\"De\" elides to \"d'\" before a word starting with a vowel sound." },
  ],
  improvedAnswer: "Je pense que cette expérience m'a beaucoup appris, notamment parce qu'elle m'a poussé à sortir de ma zone de confort.",
};

export async function evaluateAttempt(audio: Blob, promptText: string): Promise<SpeakingEvaluation> {
  const formData = new FormData();
  formData.append("audio", audio, "attempt.webm");
  formData.append("prompt", promptText);

  const res = await fetch("/api/speaking/evaluate", { method: "POST", body: formData });
  if (!res.ok) {
    throw new Error(res.status === 429 ? "RATE_LIMITED" : "EVALUATION_FAILED");
  }
  return res.json();
}

export const speakingHistory: SpeakingAttempt[] = [
  {
    id: "attempt-3",
    date: "30 Aug",
    topic: "Travel",
    prompt: "Décrivez un voyage qui vous a marqué et expliquez pourquoi.",
    durationLabel: "1:42",
    status: "Reviewed",
    evaluation: placeholderEvaluation,
  },
  {
    id: "attempt-2",
    date: "23 Aug",
    topic: "Personal experience",
    prompt: "Parlez-moi d'une expérience qui vous a beaucoup appris.",
    durationLabel: "1:35",
    status: "Reviewed",
    evaluation: {
      ...placeholderEvaluation,
      overall: 7.2,
      scores: { pronunciation: 7.0, fluency: 7.4, grammar: 6.8, vocabulary: 7.3, sentenceStructure: 7.0, coherence: 7.6 },
    },
  },
  {
    id: "attempt-1",
    date: "16 Aug",
    topic: "Opinion",
    prompt: "Pensez-vous que la technologie a changé notre façon d'apprendre ? Pourquoi ?",
    durationLabel: "1:58",
    status: "Reviewed",
    evaluation: {
      ...placeholderEvaluation,
      overall: 6.6,
      scores: { pronunciation: 6.4, fluency: 6.8, grammar: 6.2, vocabulary: 6.9, sentenceStructure: 6.5, coherence: 7.0 },
    },
  },
];

const LOCAL_ATTEMPTS_KEY = "student-hub-speaking-attempts";

function readLocalAttempts(): SpeakingAttempt[] {
  if (typeof window === "undefined") return [];
  try {
    const stored = localStorage.getItem(LOCAL_ATTEMPTS_KEY);
    return stored ? (JSON.parse(stored) as SpeakingAttempt[]) : [];
  } catch {
    return [];
  }
}

// Persists a freshly-submitted attempt client-side so it shows up in
// history immediately. Stands in for a real "save to database" call.
export function saveAttempt(attempt: SpeakingAttempt) {
  if (typeof window === "undefined") return;
  try {
    const next = [attempt, ...readLocalAttempts()];
    localStorage.setItem(LOCAL_ATTEMPTS_KEY, JSON.stringify(next));
    notifyAdminChange();
  } catch {}
}

export function getSpeakingHistory() {
  return [...readLocalAttempts(), ...speakingHistory];
}

export function getSpeakingAttempt(id: string) {
  return readLocalAttempts().find((a) => a.id === id) ?? speakingHistory.find((a) => a.id === id);
}

// Data layer for the Speaking Practice feature.
//
// evaluateAttempt() is the seam where a real pipeline plugs in later:
// audio -> speech-to-text -> AI analysis -> scores -> corrections -> feedback.
// It's async and shaped like a real API call so swapping the body for a
// fetch() to a real evaluation route is a small, contained change — nothing
// upstream (the recorder, the results page) needs to know the difference.

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

// Simulates the pipeline latency of a real evaluation call.
export async function evaluateAttempt(_audio: Blob, _promptText: string): Promise<SpeakingEvaluation> {
  await new Promise((resolve) => setTimeout(resolve, 900));
  // TODO: replace with a real pipeline — upload audio, transcribe, send
  // transcript + prompt to an LLM for scoring, return structured evaluation.
  return placeholderEvaluation;
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

export function getSpeakingHistory() {
  return speakingHistory;
}

export function getSpeakingAttempt(id: string) {
  return speakingHistory.find((a) => a.id === id);
}

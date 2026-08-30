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

export const currentLevelCode: CefrLevel["code"] = "B1";

export function getCefrLevels() {
  return cefrLevels;
}

export function getCefrLevel(code: string) {
  return cefrLevels.find((l) => l.code === code.toUpperCase());
}

export type SkillMetric = {
  skill: string;
  type: "delta" | "score";
  value: string;
  detail: string;
};

export const skillProgress: SkillMetric[] = [
  { skill: "Listening", type: "delta", value: "+18%", detail: "over the last 6 weeks" },
  { skill: "Speaking", type: "score", value: "7.8 / 10", detail: "latest assessment" },
  { skill: "Reading", type: "delta", value: "+14%", detail: "over the last 6 weeks" },
  { skill: "Writing", type: "score", value: "7.2 / 10", detail: "latest assessment" },
  { skill: "Grammar", type: "delta", value: "+9%", detail: "over the last 6 weeks" },
  { skill: "Vocabulary", type: "delta", value: "+22 words", detail: "this month" },
  { skill: "Pronunciation", type: "score", value: "7.6 / 10", detail: "latest assessment" },
];

export function getSkillProgress() {
  return skillProgress;
}

export const overallProgress = 68;
export const testTarget = { reached: 4, of: 5 };

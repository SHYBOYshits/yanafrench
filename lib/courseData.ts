export type LessonStatus = "Draft" | "Published" | "Completed";

export type Lesson = {
  number: number;
  title: string;
  date: string;
  duration: string;
  notesCount: number;
  completed: boolean;
  status: LessonStatus;
  teacher: string;
  track: string;
  summary: string;
  resources: { label: string; type: string }[];
  vocabulary: { word: string; meaning: string }[];
  exercises: { title: string; done: boolean }[];
};

// Seed course content. Lesson completion overrides (set by the admin, or
// by a student marking a lesson complete) come from the shared R2-backed
// admin state (see lib/adminState.ts / lib/useAdminState.ts) and are
// merged onto this list there.
export const lessons: Lesson[] = [
  {
    number: 12,
    title: "Building stronger oral answers",
    date: "Today",
    duration: "64 min",
    notesCount: 3,
    completed: false,
    status: "Draft",
    teacher: "Yana Budhiraja",
    track: "TEF Canada · Expression orale",
    summary:
      "We worked on structuring spontaneous answers under time pressure — leading with a clear position, supporting it with one concrete example, and closing without trailing off.",
    resources: [
      { label: "Class recording · 14 Oct", type: "Video" },
      { label: "Answer structure cheat sheet", type: "PDF" },
    ],
    vocabulary: [
      { word: "pourtant", meaning: "however · yet" },
      { word: "quant à", meaning: "as for" },
      { word: "il n'empêche que", meaning: "nevertheless" },
    ],
    exercises: [
      { title: "Record a 60-second answer using \"pourtant\"", done: false },
      { title: "Rewrite yesterday's answer with a clearer close", done: false },
    ],
  },
  {
    number: 11,
    title: "Opinion structures that sound natural",
    date: "7 Oct",
    duration: "58 min",
    notesCount: 5,
    completed: true,
    status: "Published",
    teacher: "Yana Budhiraja",
    track: "TEF Canada · Expression orale",
    summary:
      "Focused on moving past \"je pense que\" — using a wider range of opinion openers and connecting sentences so answers sound less like a list and more like reasoning.",
    resources: [
      { label: "Class recording · 7 Oct", type: "Video" },
      { label: "Opinion openers list", type: "PDF" },
    ],
    vocabulary: [
      { word: "à mon avis", meaning: "in my opinion" },
      { word: "force est de constater", meaning: "it must be said" },
    ],
    exercises: [
      { title: "Use 3 different opinion openers in one answer", done: true },
    ],
  },
  {
    number: 10,
    title: "Listening under exam pressure",
    date: "4 Oct",
    duration: "62 min",
    notesCount: 2,
    completed: true,
    status: "Published",
    teacher: "Yana Budhiraja",
    track: "TEF Canada · Compréhension orale",
    summary:
      "Practised catching the main idea on a first listen instead of chasing every word, then went back for the details that questions actually ask about.",
    resources: [{ label: "Class recording · 4 Oct", type: "Video" }],
    vocabulary: [
      { word: "au fur et à mesure", meaning: "as things progress" },
      { word: "dans l'ensemble", meaning: "on the whole" },
    ],
    exercises: [{ title: "Practice audio · Set 4", done: true }],
  },
  {
    number: 9,
    title: "Connectors for natural transitions",
    date: "1 Oct",
    duration: "50 min",
    notesCount: 4,
    completed: true,
    status: "Published",
    teacher: "Yana Budhiraja",
    track: "TEF Canada · Expression orale",
    summary:
      "Built a working set of connectors for contrast, cause and sequence, and practised swapping out repeated \"et\" / \"mais\" for something more precise.",
    resources: [{ label: "Connectors reference sheet", type: "PDF" }],
    vocabulary: [
      { word: "en revanche", meaning: "on the other hand" },
      { word: "de ce fait", meaning: "as a result" },
    ],
    exercises: [{ title: "Rewrite 5 sentences using new connectors", done: true }],
  },
  {
    number: 8,
    title: "Describing hypothetical situations",
    date: "28 Sep",
    duration: "55 min",
    notesCount: 3,
    completed: true,
    status: "Completed",
    teacher: "Yana Budhiraja",
    track: "TEF Canada · Expression orale",
    summary:
      "Reviewed the conditional for hypothetical situations and practised answering \"what would you do if...\" questions without hesitation.",
    resources: [{ label: "Class recording · 28 Sep", type: "Video" }],
    vocabulary: [
      { word: "si jamais", meaning: "if ever" },
      { word: "au cas où", meaning: "in case" },
    ],
    exercises: [{ title: "Record 3 hypothetical answers", done: true }],
  },
];

export function getLesson(list: Lesson[], number: number) {
  return list.find((l) => l.number === number);
}

export function getAdjacentLessons(list: Lesson[], number: number) {
  const sorted = [...list].sort((a, b) => a.number - b.number);
  const index = sorted.findIndex((l) => l.number === number);
  return {
    previous: index > 0 ? sorted[index - 1] : undefined,
    next: index >= 0 && index < sorted.length - 1 ? sorted[index + 1] : undefined,
  };
}

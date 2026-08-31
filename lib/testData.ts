export type AssignmentStatus = "Not started" | "In progress" | "Submitted" | "Reviewed" | "Completed";

export type Assignment = {
  id: string;
  title: string;
  description: string;
  category: "Homework" | "Listening" | "Reading" | "Writing" | "Speaking" | "Grammar" | "TEF Preparation";
  deadline: string;
  status: AssignmentStatus;
  published: boolean;
  score?: string;
  feedback?: string;
};

// Seed assignments.
export const assignments: Assignment[] = [
  { id: "listening-04", title: "Listening · Task 04", description: "Interview about travel plans — answer the comprehension questions.", category: "Listening", deadline: "Due tomorrow", status: "In progress", published: true },
  { id: "writing-03", title: "Writing · Opinion essay", description: "250-word opinion piece on remote learning, using at least 4 connectors.", category: "Writing", deadline: "Due in 3 days", status: "Not started", published: true },
  { id: "speaking-02", title: "Speaking · Hypothetical situations", description: "Record a 90-second answer using the conditional tense.", category: "Speaking", deadline: "Due in 5 days", status: "Not started", published: true },
  { id: "grammar-worksheet", title: "Grammar · Connectors worksheet", description: "Fill-in-the-blank practice on contrast and cause connectors.", category: "Grammar", deadline: "Submitted 2 Oct", status: "Reviewed", published: true, score: "9 / 10", feedback: "Strong control of connectors — watch \"donc\" vs \"alors\" in formal writing." },
  { id: "reading-05", title: "Reading · Article summary", description: "Summarize the assigned article in your own words, 150 words max.", category: "Reading", deadline: "Submitted 28 Sep", status: "Completed", published: true, score: "8.5 / 10" },
  { id: "tef-mock-1", title: "TEF Preparation · Mock oral exam", description: "Full-length timed mock covering all four sections.", category: "TEF Preparation", deadline: "Submitted 20 Sep", status: "Reviewed", published: true, score: "7.6 / 10", feedback: "Good pacing. Work on varying your opinion openers in section 2." },
  { id: "homework-listening-3", title: "Homework · Listening practice set 3", description: "Three short audio clips with comprehension questions.", category: "Homework", deadline: "Submitted 14 Sep", status: "Completed", published: true, score: "10 / 10" },
  { id: "listening-03", title: "Listening · Task 03", description: "Radio segment about city transport — answer the comprehension questions.", category: "Listening", deadline: "Submitted 24 Sep", status: "Completed", published: true, score: "8 / 10" },
  { id: "writing-02", title: "Writing · Formal email", description: "Write a formal email requesting information, using appropriate register.", category: "Writing", deadline: "Submitted 18 Sep", status: "Reviewed", published: true, score: "7.5 / 10", feedback: "Good structure — keep working on formal vs. informal register." },
];

export const assignmentCategories = ["All", "Homework", "Listening", "Reading", "Writing", "Speaking", "Grammar", "TEF Preparation"] as const;

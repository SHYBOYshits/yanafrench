export const programmes = [
  {
    kicker: "Canada",
    title: "TEF / TCF",
    subtitle: "Focused preparation for learners working toward CLB 7+.",
    href: "/tef-tcf",
    code: "01",
  },
  {
    kicker: "Certification",
    title: "DELF A1–B2",
    subtitle: "Build proficiency with a clear level-by-level path.",
    href: "/delf",
    code: "02",
  },
  {
    kicker: "French",
    title: "Build your foundation",
    subtitle: "Personal online learning designed around your pace and goals.",
    href: "whatsapp",
    code: "03",
  },
];

export type ResultRow = { skill: string; score: string; level: string; clb?: string };

export const tefResult: ResultRow[] = [
  { skill: "Compréhension écrite", score: "521 / 699", level: "C1", clb: "NCLC 9" },
  { skill: "Compréhension orale", score: "425 / 699", level: "B2", clb: "NCLC 6" },
  { skill: "Expression écrite", score: "421 / 699", level: "B2", clb: "NCLC 6" },
  { skill: "Expression orale", score: "473 / 699", level: "B2", clb: "NCLC 7" },
];

export const tcfResult: ResultRow[] = [
  { skill: "Compréhension orale", score: "505 / 699", level: "C1" },
  { skill: "Compréhension écrite", score: "496 / 699", level: "B2" },
  { skill: "Expression orale", score: "10 / 20", level: "B2" },
  { skill: "Expression écrite", score: "8 / 20", level: "B1" },
];

export const resourcePathways = [
  { code: "TEF", title: "TEF", body: "Focused practice for learners preparing for TEF Canada and ambitious score targets." },
  { code: "TCF", title: "TCF", body: "Clear, exam-aware material to help you understand the format and practise with purpose." },
  { code: "DELF", title: "DELF", body: "Level-based resources for learners building strong French from A1 through B2." },
];

export const resourcesApproach = [
  { title: "Built with a purpose", body: "Resources designed around real skills and the problems learners actually run into." },
  { title: "Designed to be usable", body: "Clarity and practical exercises first — material you can act on, not just read." },
  { title: "Connected to real teaching", body: "Reflects the same pedagogy Yana uses in class, not a generic study guide." },
];

export type Resource = {
  slug: string;
  title: string;
  category: "TEF" | "TCF" | "Vocabulary";
  level: string;
  price: string;
  body: string;
  format: string;
  features: string[];
};

export const resources: Resource[] = [
  {
    slug: "tef-writing-framework",
    title: "TEF Writing Framework",
    category: "TEF",
    level: "B2+",
    price: "₹499",
    body: "Frameworks and focused exercises for structuring stronger TEF written responses.",
    format: "Digital PDF",
    features: ["Writing frameworks", "Model approaches", "Practice prompts"],
  },
  {
    slug: "tef-speaking-kit",
    title: "TEF Speaking Kit",
    category: "TEF",
    level: "B2+",
    price: "₹599",
    body: "Structure and spontaneity practice for the TEF speaking section.",
    format: "Digital PDF",
    features: ["Speaking structures", "Spontaneous response drills", "Practice prompts"],
  },
  {
    slug: "vocabulary-notebook",
    title: "Le Carnet de Vocabulaire",
    category: "Vocabulary",
    level: "A2–B2",
    price: "₹299",
    body: "A vocabulary system for building and retaining French words with real context.",
    format: "Digital PDF",
    features: ["Themed vocabulary lists", "Example sentences in context", "Spaced revision tracker"],
  },
  {
    slug: "abc",
    title: "ABC",
    category: "TEF",
    level: "B2",
    price: "₹1,000",
    body: "A B2-level writing resource for learners refining structure and accuracy.",
    format: "Digital PDF",
    features: ["Structure checklists", "Accuracy drills", "Annotated examples"],
  },
  {
    slug: "tcf-listening-hacks",
    title: "TCF Listening hacks",
    category: "TCF",
    level: "B1+",
    price: "₹499",
    body: "Practical listening practice and techniques for the TCF exam format.",
    format: "Digital PDF",
    features: ["Listening strategies", "Timed practice scripts", "Answer-pattern breakdowns"],
  },
];

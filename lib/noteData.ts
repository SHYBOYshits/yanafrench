export type Note = {
  id: string;
  title: string;
  bodyHtml: string;
  lessonNumber: number;
  date: string;
  order: number;
};

// Seed notes. Admin-added notes come from the shared R2-backed admin
// state (see lib/adminState.ts / lib/useAdminState.ts) and are merged
// ahead of this list there. Each note is attached to the lesson it
// belongs to and shows up in that lesson's Notes tab.
export const notes: Note[] = [
  {
    id: "seed-note-1",
    title: "Great progress today",
    bodyHtml: "<p>Great progress on spontaneous answers today — keep leading with a <strong>clear position</strong> before the example.</p>",
    lessonNumber: 12,
    date: "14 Oct",
    order: 1,
  },
  {
    id: "seed-note-2",
    title: "Opinion openers are clicking",
    bodyHtml: "<p>Opinion openers are sounding natural now. Next: work on closing an answer without trailing off.</p>",
    lessonNumber: 11,
    date: "7 Oct",
    order: 1,
  },
];

export type CourseVideo = { id: string; title: string; videoUrl?: string; sizeBytes?: number };
export type CoursePdf = { id: string; title: string; fileUrl?: string; sizeBytes?: number };

export type CourseItem = {
  id: string;
  title: string;
  description: string;
  date: string;
  published: boolean;
  videos: CourseVideo[];
  pdfs: CoursePdf[];
};

// Seed course catalog — a course groups the video lectures and PDF
// material for one topic. Admin-added courses and edits are merged in
// via the shared portal state (see lib/portalState.ts).
export const courses: CourseItem[] = [
  {
    id: "seed-course-tef-oral",
    title: "TEF Canada — Expression orale",
    description: "Structuring spontaneous answers under time pressure, building a working set of connectors, and sounding natural under exam conditions.",
    date: "14 Oct",
    published: true,
    videos: [
      { id: "seed-video-1", title: "Building stronger oral answers" },
      { id: "seed-video-2", title: "Opinion structures that sound natural" },
    ],
    pdfs: [
      { id: "seed-pdf-1", title: "Answer structure cheat sheet" },
    ],
  },
];

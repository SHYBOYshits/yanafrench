export type Video = {
  id: string;
  title: string;
  module: string;
  duration: string;
  description: string;
  completed: boolean;
  progress: number;
  resources: { label: string; type: string }[];
};

export const videos: Video[] = [
  {
    id: "oral-04",
    title: "Building stronger oral answers",
    module: "TEF Oral",
    duration: "18:42",
    description: "Structuring spontaneous answers under time pressure, with a clear position, one example, and a real close.",
    completed: false,
    progress: 35,
    resources: [{ label: "Answer structure cheat sheet", type: "PDF" }],
  },
  {
    id: "oral-03",
    title: "Opinion structures that sound natural",
    module: "TEF Oral",
    duration: "15:10",
    description: "Moving past \"je pense que\" with a wider set of natural opinion openers.",
    completed: true,
    progress: 100,
    resources: [{ label: "Opinion openers list", type: "PDF" }],
  },
  {
    id: "listening-06",
    title: "Listening under exam pressure",
    module: "TEF Compréhension orale",
    duration: "21:05",
    description: "Catching the main idea on a first listen, then returning for detail.",
    completed: true,
    progress: 100,
    resources: [],
  },
  {
    id: "grammar-02",
    title: "Connectors for natural transitions",
    module: "Grammar",
    duration: "12:34",
    description: "A working set of connectors for contrast, cause and sequence.",
    completed: true,
    progress: 100,
    resources: [{ label: "Connectors reference sheet", type: "PDF" }],
  },
  {
    id: "grammar-01",
    title: "Describing hypothetical situations",
    module: "Grammar",
    duration: "14:20",
    description: "The conditional, and answering \"what would you do if...\" without hesitation.",
    completed: false,
    progress: 0,
    resources: [],
  },
];

export function getVideos() {
  return videos;
}

export function getVideo(id: string) {
  return videos.find((v) => v.id === id);
}

export function getAdjacentVideos(id: string) {
  const index = videos.findIndex((v) => v.id === id);
  return {
    previous: index > 0 ? videos[index - 1] : undefined,
    next: index >= 0 && index < videos.length - 1 ? videos[index + 1] : undefined,
  };
}

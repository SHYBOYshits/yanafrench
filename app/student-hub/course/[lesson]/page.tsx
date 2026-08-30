import type { Metadata } from "next";
import { getLesson } from "@/lib/courseData";
import { LessonDetail } from "@/components/LessonDetail";

export async function generateMetadata({ params }: { params: Promise<{ lesson: string }> }): Promise<Metadata> {
  const { lesson: lessonParam } = await params;
  const lesson = getLesson(Number(lessonParam));
  return { title: lesson ? `Lesson ${lesson.number} · ${lesson.title}` : "Lesson" };
}

export default async function LessonPage({ params }: { params: Promise<{ lesson: string }> }) {
  const { lesson: lessonParam } = await params;
  return <LessonDetail lessonNumber={Number(lessonParam)} />;
}

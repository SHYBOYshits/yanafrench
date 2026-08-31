import type { Metadata } from "next";
import { getLesson, lessons } from "@/lib/courseData";
import { AdminLessonBoard } from "@/components/admin/AdminLessonBoard";

export async function generateMetadata({ params }: { params: Promise<{ lesson: string }> }): Promise<Metadata> {
  const { lesson: lessonParam } = await params;
  const lesson = getLesson(lessons, Number(lessonParam));
  return { title: lesson ? `Admin · Lesson ${lesson.number}` : "Admin · Lesson" };
}

export default async function AdminLessonPage({ params }: { params: Promise<{ lesson: string }> }) {
  const { lesson: lessonParam } = await params;
  return <AdminLessonBoard lessonNumber={Number(lessonParam)} />;
}

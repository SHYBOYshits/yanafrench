export type NotificationType = "lesson" | "video" | "document" | "assignment" | "speaking" | "test" | "class" | "feedback";

export type Notification = {
  id: string;
  type: NotificationType;
  title: string;
  detail: string;
  date: string;
  read: boolean;
};

export const notifications: Notification[] = [
  { id: "n1", type: "feedback", title: "Yana left feedback", detail: "On your Workspace recording", date: "2h ago", read: false },
  { id: "n2", type: "lesson", title: "New lesson available", detail: "Lesson 13 · Opinion under pressure", date: "1d ago", read: false },
  { id: "n3", type: "class", title: "Class reminder", detail: "Thursday 9:30 AM with Yana", date: "2d ago", read: false },
  { id: "n4", type: "speaking", title: "Speaking results ready", detail: "Your \"Travel\" attempt scored 7.8 / 10", date: "3d ago", read: true },
  { id: "n5", type: "assignment", title: "Assignment due soon", detail: "Listening · Task 04 is due tomorrow", date: "3d ago", read: true },
  { id: "n6", type: "document", title: "New document added", detail: "French Connectors — TEF (PDF)", date: "5d ago", read: true },
  { id: "n7", type: "video", title: "New video available", detail: "Building stronger oral answers", date: "6d ago", read: true },
  { id: "n8", type: "test", title: "Test results published", detail: "TEF mock oral exam · 7.6 / 10", date: "1w ago", read: true },
];

export function getNotifications() {
  return notifications;
}

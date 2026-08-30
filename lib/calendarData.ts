export type CalendarEventType = "class" | "assignment" | "test" | "speaking" | "deadline";

export type CalendarEvent = {
  id: string;
  type: CalendarEventType;
  title: string;
  date: Date;
  time: string;
  course?: string;
  teacher?: string;
  meetingLink?: string;
};

function daysFromNow(days: number) {
  const d = new Date();
  d.setDate(d.getDate() + days);
  d.setHours(0, 0, 0, 0);
  return d;
}

export function getCalendarEvents(): CalendarEvent[] {
  const events: CalendarEvent[] = [
    { id: "class-1", type: "class", title: "TEF Oral · Live class", date: daysFromNow(1), time: "9:30 AM", course: "TEF Canada", teacher: "Yana Budhiraja", meetingLink: "#" },
    { id: "assignment-1", type: "assignment", title: "Listening · Task 04", date: daysFromNow(1), time: "Due end of day" },
    { id: "speaking-1", type: "speaking", title: "Speaking practice · Hypothetical situations", date: daysFromNow(3), time: "Self-paced" },
    { id: "test-1", type: "test", title: "TEF mock oral exam", date: daysFromNow(5), time: "10:00 AM" },
    { id: "class-2", type: "class", title: "TEF Oral · Live class", date: daysFromNow(8), time: "9:30 AM", course: "TEF Canada", teacher: "Yana Budhiraja", meetingLink: "#" },
    { id: "deadline-1", type: "deadline", title: "Writing · Opinion essay", date: daysFromNow(4), time: "11:59 PM" },
    { id: "class-3", type: "class", title: "TEF Oral · Live class", date: daysFromNow(15), time: "9:30 AM", course: "TEF Canada", teacher: "Yana Budhiraja", meetingLink: "#" },
  ];
  return events.sort((a, b) => a.date.getTime() - b.date.getTime());
}

export const eventTypeLabels: Record<CalendarEventType, string> = {
  class: "Class",
  assignment: "Assignment",
  test: "Test",
  speaking: "Speaking practice",
  deadline: "Deadline",
};

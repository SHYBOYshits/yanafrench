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

// Non-class placeholder events. "class" events aren't seeded here anymore
// — they're generated live from the student's current batch (see
// lib/batchData.ts's generateClassEvents), so an admin edit to the batch's
// days/times/name reshapes the calendar instantly instead of leaving
// stale hand-seeded entries behind.
export function getStaticEvents(): CalendarEvent[] {
  return [
    { id: "speaking-1", type: "speaking", title: "Speaking practice · Hypothetical situations", date: daysFromNow(3), time: "Self-paced" },
    { id: "deadline-1", type: "deadline", title: "Writing · Opinion essay", date: daysFromNow(4), time: "11:59 PM" },
    { id: "test-1", type: "test", title: "TEF mock oral exam", date: daysFromNow(5), time: "10:00 AM" },
  ];
}

export const eventTypeLabels: Record<CalendarEventType, string> = {
  class: "Class",
  assignment: "Assignment",
  test: "Test",
  speaking: "Speaking practice",
  deadline: "Deadline",
};

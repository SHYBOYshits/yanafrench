import { readJson, writeJson } from "@/lib/r2";
import { defaultPortalState, type PortalState, type PortalStateAction } from "@/lib/portalState";

const STATE_KEY = "data/portal-state.json";

export async function GET() {
  const state = await readJson<PortalState>(STATE_KEY, defaultPortalState);
  return Response.json({ ...defaultPortalState, ...state });
}

export async function POST(req: Request) {
  const action = (await req.json().catch(() => null)) as PortalStateAction | null;
  if (!action || typeof action !== "object" || !("type" in action)) {
    return new Response("Invalid action", { status: 400 });
  }

  const existing = await readJson<PortalState>(STATE_KEY, defaultPortalState);
  let next: PortalState;

  switch (action.type) {
    case "addCourse":
      next = { ...existing, courses: [action.course, ...existing.courses] };
      break;
    case "removeCourse":
      next = { ...existing, hiddenCourseIds: [...existing.hiddenCourseIds, action.id] };
      break;
    case "updateCourse":
      next = {
        ...existing,
        courseOverrides: { ...existing.courseOverrides, [action.id]: { ...existing.courseOverrides[action.id], ...action.patch } },
      };
      break;
    case "addRecording":
      next = { ...existing, recordings: [action.recording, ...existing.recordings] };
      break;
    case "removeRecording":
      next = { ...existing, hiddenRecordingIds: [...existing.hiddenRecordingIds, action.id] };
      break;
    case "updateRecording":
      next = {
        ...existing,
        recordingOverrides: { ...existing.recordingOverrides, [action.id]: { ...existing.recordingOverrides[action.id], ...action.patch } },
      };
      break;
    case "addResource":
      next = { ...existing, resources: [action.resource, ...existing.resources] };
      break;
    case "removeResource":
      next = { ...existing, hiddenResourceIds: [...existing.hiddenResourceIds, action.id] };
      break;
    case "updateResource":
      next = {
        ...existing,
        resourceOverrides: { ...existing.resourceOverrides, [action.id]: { ...existing.resourceOverrides[action.id], ...action.patch } },
      };
      break;
    case "addAssignment":
      next = { ...existing, assignments: [action.assignment, ...existing.assignments] };
      break;
    case "removeAssignment":
      next = { ...existing, hiddenAssignmentIds: [...existing.hiddenAssignmentIds, action.id] };
      break;
    case "updateAssignment":
      next = {
        ...existing,
        assignmentOverrides: { ...existing.assignmentOverrides, [action.id]: { ...existing.assignmentOverrides[action.id], ...action.patch } },
      };
      break;
    default:
      return new Response("Unknown action", { status: 400 });
  }

  const saved = await writeJson(STATE_KEY, next);
  if (!saved) {
    return new Response("Not persisted — R2 isn't configured.", { status: 501 });
  }

  return Response.json(next);
}

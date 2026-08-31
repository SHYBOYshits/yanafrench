import { readJson, writeJson } from "@/lib/r2";
import { defaultAdminState, type AdminState, type AdminStateAction } from "@/lib/adminState";

const STATE_KEY = "data/admin-state.json";

export async function GET() {
  const state = await readJson<AdminState>(STATE_KEY, defaultAdminState);
  return Response.json({ ...defaultAdminState, ...state });
}

export async function POST(req: Request) {
  const action = (await req.json().catch(() => null)) as AdminStateAction | null;
  if (!action || typeof action !== "object" || !("type" in action)) {
    return new Response("Invalid action", { status: 400 });
  }

  const existing = await readJson<AdminState>(STATE_KEY, defaultAdminState);
  let next: AdminState;

  switch (action.type) {
    case "field":
      next = { ...existing, [action.key]: action.value };
      break;
    case "lessonOverride":
      next = { ...existing, lessonOverrides: { ...existing.lessonOverrides, [action.number]: action.completed } };
      break;
    case "lessonDetailOverride":
      next = {
        ...existing,
        lessonDetailOverrides: {
          ...existing.lessonDetailOverrides,
          [action.number]: { ...existing.lessonDetailOverrides[action.number], ...action.patch },
        },
      };
      break;
    case "assignmentOverride":
      next = {
        ...existing,
        assignmentOverrides: {
          ...existing.assignmentOverrides,
          [action.id]: { ...existing.assignmentOverrides[action.id], ...action.patch },
        },
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
        resourceOverrides: {
          ...existing.resourceOverrides,
          [action.id]: { ...existing.resourceOverrides[action.id], ...action.patch },
        },
      };
      break;
    case "reorderResources": {
      const overrides = { ...existing.resourceOverrides };
      action.orderedIds.forEach((id, index) => {
        overrides[id] = { ...overrides[id], order: index };
      });
      next = { ...existing, resourceOverrides: overrides };
      break;
    }
    case "addRecording":
      next = { ...existing, recordings: [action.recording, ...existing.recordings] };
      break;
    case "removeRecording":
      next = { ...existing, hiddenRecordingIds: [...existing.hiddenRecordingIds, action.id] };
      break;
    case "updateRecording":
      next = {
        ...existing,
        recordingOverrides: {
          ...existing.recordingOverrides,
          [action.id]: { ...existing.recordingOverrides[action.id], ...action.patch },
        },
      };
      break;
    case "reorderRecordings": {
      const overrides = { ...existing.recordingOverrides };
      action.orderedIds.forEach((id, index) => {
        overrides[id] = { ...overrides[id], order: index };
      });
      next = { ...existing, recordingOverrides: overrides };
      break;
    }
    case "addNote":
      next = { ...existing, notes: [action.note, ...existing.notes] };
      break;
    case "removeNote":
      next = { ...existing, notes: existing.notes.filter((n) => n.id !== action.id) };
      break;
    case "addWordEntry":
      next = { ...existing, wordArchive: [action.entry, ...existing.wordArchive] };
      break;
    case "removeWordEntry":
      next = { ...existing, wordArchive: existing.wordArchive.filter((w) => w.id !== action.id) };
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

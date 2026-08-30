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
      next = { ...existing, resources: existing.resources.filter((r) => r.id !== action.id) };
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

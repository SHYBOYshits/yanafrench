import { readJson, writeJson } from "@/lib/r2";
import { applyPortalAction, defaultPortalState, PORTAL_STATE_KEY, type PortalState, type PortalStateAction } from "@/lib/portalState";

export async function GET() {
  const state = await readJson<PortalState>(PORTAL_STATE_KEY, defaultPortalState);
  return Response.json({ ...defaultPortalState, ...state });
}

export async function POST(req: Request) {
  const action = (await req.json().catch(() => null)) as PortalStateAction | null;
  if (!action || typeof action !== "object" || !("type" in action)) {
    return new Response("Invalid action", { status: 400 });
  }

  const existing = await readJson<PortalState>(PORTAL_STATE_KEY, defaultPortalState);
  const next = applyPortalAction(existing, action);
  if (next === existing) {
    return new Response("Unknown action", { status: 400 });
  }

  const saved = await writeJson(PORTAL_STATE_KEY, next);
  if (!saved) {
    return new Response("Not persisted — R2 isn't configured.", { status: 501 });
  }

  return Response.json(next);
}

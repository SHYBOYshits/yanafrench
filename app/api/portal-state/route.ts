import { writeJson } from "@/lib/r2";
import { applyPortalAction, PORTAL_STATE_KEY, type PortalStateAction } from "@/lib/portalState";
import { readPortalState } from "@/lib/portalStateServer";

export async function GET() {
  return Response.json(await readPortalState());
}

export async function POST(req: Request) {
  const action = (await req.json().catch(() => null)) as PortalStateAction | null;
  if (!action || typeof action !== "object" || !("type" in action)) {
    return new Response("Invalid action", { status: 400 });
  }

  const existing = await readPortalState();
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

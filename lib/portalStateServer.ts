// Server-only. Kept separate from lib/portalState.ts (which lib/usePortalState.ts,
// a client hook, also imports) so this file's dependency on lib/r2's AWS SDK
// client never ends up in the browser bundle.

import { readJson } from "./r2";
import { defaultPortalState, PORTAL_STATE_KEY, type PortalState } from "./portalState";

// The stored R2 document was written before some of PortalState's current
// fields existed (e.g. batches, quizSessions) — reading it raw would hand
// a reducer case or route handler an `undefined` where it expects an
// array/object. Every server read merges defaults on top for that reason.
export async function readPortalState(): Promise<PortalState> {
  return { ...defaultPortalState, ...(await readJson<PortalState>(PORTAL_STATE_KEY, defaultPortalState)) };
}

// The browser's native "storage" event only fires in *other* tabs, never the
// tab that made the write — so a same-tab write wouldn't otherwise trigger a
// re-render. speakingData.ts and vocabData.ts (per-student local data, not
// admin content — see lib/useAdminState.ts for that) call this after
// writing, and useAdminValue listens for it alongside the real "storage"
// event, so both same-tab and cross-tab changes show up immediately.
const EVENT_NAME = "admin-content-change";

export function notifyAdminChange() {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new Event(EVENT_NAME));
}

export function onAdminChange(handler: () => void) {
  if (typeof window === "undefined") return () => {};
  window.addEventListener("storage", handler);
  window.addEventListener(EVENT_NAME, handler);
  return () => {
    window.removeEventListener("storage", handler);
    window.removeEventListener(EVENT_NAME, handler);
  };
}

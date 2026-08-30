"use client";

import { useEffect, useState } from "react";
import { onAdminChange } from "./adminEvents";

// For data that's genuinely per-browser/per-student (saved speaking
// attempts, saved vocabulary — see speakingData.ts/vocabData.ts), not
// admin-authored content. Admin-editable content now lives in the shared
// R2-backed admin state instead (see lib/useAdminState.ts), so it syncs
// across devices; this hook only covers same-tab/cross-tab localStorage
// reactivity for the local-only data that's left.
export function useAdminValue<T>(getter: () => T): T {
  const [value, setValue] = useState<T>(getter);

  useEffect(() => {
    setValue(getter());
    return onAdminChange(() => setValue(getter()));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return value;
}

"use client";

import { useEffect, useState } from "react";
import { onAdminChange } from "./adminEvents";

// For data that's genuinely per-browser/per-student (saved speaking
// attempts, saved vocabulary — see speakingData.ts/vocabData.ts), stored
// in localStorage. Provides same-tab/cross-tab reactivity for it.
export function useAdminValue<T>(getter: () => T): T {
  const [value, setValue] = useState<T>(getter);

  useEffect(() => {
    setValue(getter());
    return onAdminChange(() => setValue(getter()));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return value;
}

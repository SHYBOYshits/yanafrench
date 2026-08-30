"use client";

import { useEffect, useState } from "react";
import { onAdminChange } from "./adminEvents";

// Admin-editable content lives in localStorage (see lib/adminContent.ts and
// the override helpers in courseData/testData/progressData/speakingData/
// vocabData/documentData). Reading those getters directly in a render body
// only ever sees the value from the very first render — this hook re-reads
// on mount (so client-side data always wins over any server-prerendered
// default) and again whenever anything changes it, in this tab or another.
export function useAdminValue<T>(getter: () => T): T {
  const [value, setValue] = useState<T>(getter);

  useEffect(() => {
    setValue(getter());
    return onAdminChange(() => setValue(getter()));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return value;
}

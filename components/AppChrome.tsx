"use client";

import { usePathname } from "next/navigation";
import type { ReactNode } from "react";
import { Navigation } from "./Navigation";
import { Footer } from "./Footer";
import { ChatWidget } from "./ChatWidget";

const STANDALONE_PREFIXES = ["/student-hub"];

export function AppChrome({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const standalone = STANDALONE_PREFIXES.some((p) => pathname?.startsWith(p));

  if (standalone) {
    return (
      <>
        <main id="main">{children}</main>
        <ChatWidget />
      </>
    );
  }

  return (
    <>
      <Navigation />
      <main id="main">{children}</main>
      <Footer />
      <ChatWidget />
    </>
  );
}

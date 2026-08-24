import type { Metadata } from "next";
import type { ReactNode } from "react";
import "./globals.css";
import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { asset } from "@/lib/site";

export const metadata: Metadata = {
  title: { default: "The Français Hub · French with direction", template: "%s · The Français Hub" },
  description: "Online French coaching by Yana Budhiraja for TEF, TCF and DELF learners. Small batches of up to four students.",
  icons: { icon: asset("/favicon.svg") },
};

export default function RootLayout({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <html lang="en">
      <body>
        <a className="skip-link" href="#main">Skip to content</a>
        <Navigation />
        <main id="main">{children}</main>
        <Footer />
      </body>
    </html>
  );
}

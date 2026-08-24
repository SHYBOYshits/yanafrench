import Link from "next/link";
import { site } from "@/lib/site";
import { Wordmark } from "./Wordmark";

export function Footer() {
  return (
    <footer className="footer">
      <div className="container footer__grid">
        <div><Wordmark/><p>French, with direction.</p></div>
        <div className="footer__links"><Link href="/tef-tcf">TEF / TCF</Link><Link href="/delf">DELF</Link><Link href="/about">About Yana</Link><Link href="/results">Results</Link></div>
        <div className="footer__social"><a href={site.instagram} target="_blank" rel="noreferrer">Instagram ↗</a><a href={site.linkedin} target="_blank" rel="noreferrer">LinkedIn ↗</a></div>
      </div>
      <div className="container footer__bottom"><span>© 2026 The Français Hub · by Yana Budhiraja</span><span>Online French tutoring · Delhi, India</span></div>
    </footer>
  );
}

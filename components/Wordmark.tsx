import Link from "next/link";

export function Wordmark({ light = false }: { light?: boolean }) {
  return (
    <Link href="/" className={`wordmark ${light ? "wordmark--light" : ""}`} aria-label="The Français Hub home">
      <span className="wordmark__the">the</span>
      <span className="wordmark__francais">français</span>
      <span className="wordmark__hub">hub<span className="brand-dot">.</span></span>
    </Link>
  );
}

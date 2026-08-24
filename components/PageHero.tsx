import { Reveal } from "./Reveal";

export function PageHero({ eyebrow, title, italic, body }: { eyebrow: string; title: string; italic?: string; body: string }) {
  return (
    <section className="page-hero"><div className="container page-hero__inner"><Reveal><p className="eyebrow">{eyebrow}</p><h1>{title}{italic && <><br/><em>{italic}</em></>}</h1><p>{body}</p></Reveal></div></section>
  );
}

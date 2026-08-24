import { Reveal } from "./Reveal";

const items = [
  ["01", "Personal", "A smaller learning environment with room for individual attention."],
  ["02", "Adaptive", "Teaching shifts with your level, pace, gaps and immediate objective."],
  ["03", "Focused", "Practice is connected to the French you actually need to use."],
  ["04", "Engaging", "High-energy sessions designed to keep you active rather than passive."],
];

export function Approach() {
  return (
    <section className="section approach">
      <div className="container">
        <Reveal className="section-head"><p className="eyebrow">L&apos;approche</p><h2>Structure, without<br/><em>the stiffness.</em></h2></Reveal>
        <div className="approach__grid">
          {items.map(([n,t,d], i) => <Reveal key={t} className="approach__item" delay={i*.06}><span>{n}</span><h3>{t}</h3><p>{d}</p></Reveal>)}
        </div>
      </div>
    </section>
  );
}

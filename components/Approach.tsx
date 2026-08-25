import { Reveal } from "./Reveal";
import { IconPersonal, IconAdaptive, IconFocused, IconEngaging } from "./Icons";

const items = [
  ["01", "Personal", "A smaller learning environment with room for individual attention.", IconPersonal],
  ["02", "Adaptive", "Teaching shifts with your level, pace, gaps and immediate objective.", IconAdaptive],
  ["03", "Focused", "Practice is connected to the French you actually need to use.", IconFocused],
  ["04", "Engaging", "High-energy sessions designed to keep you active rather than passive.", IconEngaging],
] as const;

export function Approach() {
  return (
    <section className="section approach">
      <div className="container">
        <Reveal className="section-head"><p className="eyebrow">L&apos;approche</p><h2>Structure, without<br/><em>the stiffness.</em></h2></Reveal>
        <div className="approach__grid">
          {items.map(([n,t,d,Icon], i) => (
            <Reveal key={t} className="approach__item" delay={i*.06}>
              <span className="approach__icon"><Icon/></span>
              <span className="approach__num">{n}</span>
              <h3>{t}</h3>
              <p>{d}</p>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

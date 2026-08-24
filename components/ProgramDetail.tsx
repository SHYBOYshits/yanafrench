import { WhatsAppLink } from "./WhatsAppLink";
import { Reveal } from "./Reveal";

export function ProgramDetail({
  label,
  intro,
  items,
  message,
}: {
  label: string;
  intro: string;
  items: { title: string; body: string }[];
  message: string;
}) {
  return (
    <section className="section program-detail"><div className="container program-detail__grid">
      <Reveal className="program-detail__intro"><p className="eyebrow">{label}</p><h2>{intro}</h2></Reveal>
      <div className="program-detail__items">
        {items.map((item, i) => <Reveal key={item.title} className="program-detail__item" delay={i*.05}><span>0{i+1}</span><div><h3>{item.title}</h3><p>{item.body}</p></div></Reveal>)}
        <Reveal><WhatsAppLink message={message} className="button button--accent program-detail__cta">Ask about this program</WhatsAppLink></Reveal>
      </div>
    </div></section>
  );
}

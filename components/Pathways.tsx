import Link from "next/link";
import { programmes } from "@/lib/data";
import { whatsappUrl } from "@/lib/site";
import { Arrow, ExternalArrow } from "./Arrow";
import { Reveal } from "./Reveal";

export function Pathways() {
  return (
    <section className="section pathways" id="programs">
      <div className="container">
        <Reveal className="section-head">
          <p className="eyebrow">Pourquoi le français ?</p>
          <h2>Start with your <em>destination.</em></h2>
        </Reveal>
        <div className="pathways__list">
          {programmes.map((item, index) => {
            const content = <>
              <span className="pathway__num">{item.code}</span>
              <div className="pathway__copy"><p>{item.kicker}</p><h3>{item.title}</h3><span>{item.subtitle}</span></div>
              <span className="pathway__arrow">{item.href === "whatsapp" ? <ExternalArrow size={24}/> : <Arrow size={26}/>}</span>
            </>;
            return (
              <Reveal key={item.title} delay={index * .08}>
                {item.href === "whatsapp" ? (
                  <a className="pathway" target="_blank" rel="noreferrer" href={whatsappUrl("Hi Yana! I’m interested in building my French foundation and would like to know about your current class availability.")}>{content}</a>
                ) : (
                  <Link className="pathway" href={item.href}>{content}</Link>
                )}
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}

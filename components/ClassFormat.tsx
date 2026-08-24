import { WhatsAppLink } from "./WhatsAppLink";
import { Reveal } from "./Reveal";

export function ClassFormat() {
  return (
    <section className="section class-format">
      <div className="container class-format__grid">
        <Reveal><p className="eyebrow">The format</p><h2>Your class.<br/><em>Your progress.</em></h2></Reveal>
        <Reveal className="class-format__details" delay={.1}>
          <div><span>01</span><strong>100% online</strong></div>
          <div><span>02</span><strong>Up to 4 students</strong></div>
          <div><span>03</span><strong>Batches based on availability</strong></div>
          <div><span>04</span><strong>Direct guidance from Yana</strong></div>
          <WhatsAppLink message="Hi Yana! I found The Français Hub website and would like to ask about current batch availability." className="button button--accent class-format__cta">Ask about availability</WhatsAppLink>
        </Reveal>
      </div>
    </section>
  );
}

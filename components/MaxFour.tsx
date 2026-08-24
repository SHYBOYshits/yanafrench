import { Reveal } from "./Reveal";

export function MaxFour() {
  return (
    <section className="section max-four">
      <div className="container max-four__grid">
        <Reveal><p className="eyebrow">A deliberately smaller room</p><div className="max-four__number">04<span>.</span></div></Reveal>
        <Reveal className="max-four__copy" delay={.12}><h2>Students.<br/>Maximum.</h2><p>Because language learning shouldn&apos;t feel anonymous. Batches stay intentionally small so every learner has room to speak, ask, adapt and progress.</p></Reveal>
      </div>
    </section>
  );
}

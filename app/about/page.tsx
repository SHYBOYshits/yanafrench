import type { Metadata } from "next";
import { PageHero } from "@/components/PageHero";
import { Reveal } from "@/components/Reveal";
import { Approach } from "@/components/Approach";
import { FinalCta } from "@/components/FinalCta";
import { asset } from "@/lib/site";

export const metadata: Metadata = { title: "About Yana", description: "Meet Yana Budhiraja, the C1-level certified French tutor behind The Français Hub." };

export default function AboutPage() {
  return <>
    <PageHero eyebrow="The person behind the hub" title="Learn French" italic="with Yana." body="The Français Hub is intentionally personal: one tutor, small groups, direct feedback and a teaching style that adapts to the learner in front of her."/>
    <section className="section about-page"><div className="container about-page__grid">
      <Reveal className="about-page__portrait"><img src={asset("/images/yana-standing.webp")} alt="Yana Budhiraja"/></Reveal>
      <Reveal className="about-page__copy" delay={.1}><p className="eyebrow">Yana Budhiraja</p><h2>High energy.<br/><em>Highly adaptable.</em></h2><p>Yana is a C1-level certified French tutor based in Delhi and teaches exclusively online. Her focus spans TEF / TCF preparation for learners targeting CLB 7+ and DELF preparation from A1 to B2.</p><p>The teaching experience is designed around direct interaction rather than crowded classes. Batches are capped at four students and offered based on availability.</p><div className="about-page__facts"><span><small>Specialises in</small>TEF · TCF · DELF</span><span><small>Teaching format</small>Online only</span><span><small>Batch size</small>Maximum 4</span><span><small>Based in</small>Delhi, India</span></div></Reveal>
    </div></section>
    <Approach/>
    <FinalCta/>
  </>;
}

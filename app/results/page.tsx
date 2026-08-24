import type { Metadata } from "next";
import { PageHero } from "@/components/PageHero";
import { Reveal } from "@/components/Reveal";
import { tefResult, tcfResult } from "@/lib/data";
import { asset } from "@/lib/site";
import { FinalCta } from "@/components/FinalCta";

export const metadata: Metadata = { title: "Student results", description: "Anonymised TEF and TCF score documents from students of The Français Hub." };

function FullResult({ title, rows, image, alt }: { title:string; rows:string[][]; image:string; alt:string }) {
  return <article className="full-result">
    <Reveal className="full-result__summary"><p className="eyebrow">{title}</p><h2>Recent student<br/><em>result.</em></h2><div className="full-result__rows">{rows.map(([skill,score,level,clb])=><div key={skill}><span>{skill}</span><strong>{level}</strong><small>{score}{clb !== "—" ? ` · ${clb}` : ""}</small></div>)}</div></Reveal>
    <Reveal className="full-result__image" delay={.1}><img src={asset(image)} alt={alt}/></Reveal>
  </article>;
}

export default function ResultsPage() {
  return <>
    <PageHero eyebrow="Proof, without the noise" title="Student outcomes," italic="shown clearly." body="These are anonymised result documents shared for proof. Names and identifying details remain hidden."/>
    <section className="section results-page"><div className="container">
      <FullResult title="TEF Canada" rows={tefResult} image="/results/tef-result.jpg" alt="Anonymised TEF Canada result certificate"/>
      <FullResult title="TCF Canada" rows={tcfResult} image="/results/tcf-result.jpg" alt="Anonymised TCF Canada result certificate"/>
    </div></section>
    <FinalCta/>
  </>;
}

import type { Metadata } from "next";
import { PageHero } from "@/components/PageHero";
import { ProgramDetail } from "@/components/ProgramDetail";
import { ResultsPreview } from "@/components/ResultsPreview";
import { FinalCta } from "@/components/FinalCta";

export const metadata: Metadata = { title: "TEF / TCF preparation", description: "Online TEF and TCF preparation with Yana Budhiraja in small batches of up to four students." };

export default function TefTcfPage() {
  return <>
    <PageHero eyebrow="TEF / TCF · Canada" title="French for a goal" italic="beyond the classroom." body="Focused online preparation for learners working toward strong Canadian French test outcomes, with small-group attention and direct guidance from Yana."/>
    <ProgramDetail label="How the preparation works" intro="Practice with a purpose." items={[
      { title: "Build the language", body: "Strengthen the grammar, vocabulary and comprehension foundations your exam performance depends on." },
      { title: "Train the format", body: "Work with the structure and expectations of TEF / TCF tasks rather than studying French in the abstract." },
      { title: "Speak and write actively", body: "Expression improves through repetition, correction and feedback — not passive notes." },
      { title: "Adapt the plan", body: "Small batches make it possible to respond to learner gaps instead of forcing everyone through the same pace." },
    ]} message="Hi Yana! I’m interested in TEF/TCF preparation and would like to know about current batch availability."/>
    <ResultsPreview/>
    <FinalCta/>
  </>;
}

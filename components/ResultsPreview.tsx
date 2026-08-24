"use client";

import { AnimatePresence, motion } from "motion/react";
import Link from "next/link";
import { useState } from "react";
import type { MouseEvent } from "react";
import { tefResult, tcfResult } from "@/lib/data";
import { asset } from "@/lib/site";
import { Arrow, ExternalArrow } from "./Arrow";
import { Reveal } from "./Reveal";

type ModalState = null | { src: string; alt: string };

function ResultMini({ label, rows, onOpen }: { label: string; rows: string[][]; onOpen: () => void }) {
  return (
    <article className="result-card">
      <div className="result-card__top"><p>{label}</p><span>Recent student result</span></div>
      <div className="result-card__rows">
        {rows.map(([skill, score, level]) => <div key={skill}><span>{skill}</span><strong>{level}</strong><small>{score}</small></div>)}
      </div>
      <button onClick={onOpen} className="result-card__proof">View anonymised result <ExternalArrow/></button>
    </article>
  );
}

export function ResultsPreview() {
  const [modal, setModal] = useState<ModalState>(null);
  return (
    <section className="section results-preview" id="results">
      <div className="container">
        <Reveal className="section-head section-head--split"><div><p className="eyebrow">Student outcomes</p><h2>Des résultats<br/><em>qui parlent.</em></h2></div><p>Recent student outcomes, shared as real scorecards with personal details respectfully hidden.</p></Reveal>
        <div className="results-preview__grid">
          <Reveal><ResultMini label="TEF Canada" rows={tefResult} onOpen={() => setModal({ src: asset("/results/tef-result.jpg"), alt: "Anonymised TEF Canada student result" })}/></Reveal>
          <Reveal delay={.08}><ResultMini label="TCF Canada" rows={tcfResult} onOpen={() => setModal({ src: asset("/results/tcf-result.jpg"), alt: "Anonymised TCF Canada student result" })}/></Reveal>
        </div>
        <Link href="/results" className="text-link results-preview__more">See all current proof <Arrow/></Link>
      </div>

      <AnimatePresence>
        {modal && (
          <motion.div className="result-modal" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setModal(null)} role="dialog" aria-modal="true" aria-label="Student result proof">
            <motion.div className="result-modal__inner" initial={{ scale: .98, y: 16 }} animate={{ scale: 1, y: 0 }} exit={{ scale: .98, y: 16 }} onClick={(e: MouseEvent<HTMLDivElement>) => e.stopPropagation()}>
              <button className="result-modal__close" onClick={() => setModal(null)} aria-label="Close result">×</button>
              <img src={modal.src} alt={modal.alt}/>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}

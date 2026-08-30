"use client";

import Link from "next/link";
import type { MouseEvent } from "react";
import { useReducedMotion } from "motion/react";
import { programmes } from "@/lib/data";
import { whatsappUrl } from "@/lib/site";
import { Arrow } from "./Arrow";
import { Reveal } from "./Reveal";

const TILT_DEGREES = 7;

export function Pathways() {
  const reduce = useReducedMotion();

  function handleMove(e: MouseEvent<HTMLElement>) {
    if (reduce) return;
    const el = e.currentTarget;
    const rect = el.getBoundingClientRect();
    const px = (e.clientX - rect.left) / rect.width - 0.5;
    const py = (e.clientY - rect.top) / rect.height - 0.5;
    el.style.setProperty("--ry", `${px * TILT_DEGREES}deg`);
    el.style.setProperty("--rx", `${-py * TILT_DEGREES}deg`);
  }

  function handleLeave(e: MouseEvent<HTMLElement>) {
    const el = e.currentTarget;
    el.style.setProperty("--ry", "0deg");
    el.style.setProperty("--rx", "0deg");
  }

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
              <span className="pathway__arrow"><Arrow size={26}/></span>
            </>;
            return (
              <Reveal key={item.title} delay={index * .08}>
                {item.href === "whatsapp" ? (
                  <a className="pathway" target="_blank" rel="noreferrer" href={whatsappUrl("Hi Yana! I’m interested in building my French foundation and would like to know about your current class availability.")} onMouseMove={handleMove} onMouseLeave={handleLeave}>{content}</a>
                ) : (
                  <Link className="pathway" href={item.href} onMouseMove={handleMove} onMouseLeave={handleLeave}>{content}</Link>
                )}
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}

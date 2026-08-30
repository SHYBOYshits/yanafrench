"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { resources } from "@/lib/data";
import { Arrow } from "./Arrow";
import { Reveal } from "./Reveal";

const FILTERS = ["All", "TEF", "TCF", "Vocabulary"] as const;
type Filter = (typeof FILTERS)[number];

export function ResourceCatalog() {
  const [filter, setFilter] = useState<Filter>("All");

  const visible = useMemo(
    () => (filter === "All" ? resources : resources.filter((r) => r.category === filter)),
    [filter]
  );

  return (
    <section className="section resource-catalog">
      <div className="container">
        <Reveal className="section-head">
          <p className="eyebrow">The collection</p>
          <h2>Pick your <em>next resource.</em></h2>
        </Reveal>

        <div className="resource-catalog__filters" role="group" aria-label="Filter resources by category">
          {FILTERS.map((f) => (
            <button
              key={f}
              type="button"
              className={`resource-catalog__filter ${filter === f ? "is-active" : ""}`}
              onClick={() => setFilter(f)}
              aria-pressed={filter === f}
            >
              {f}
            </button>
          ))}
        </div>

        <div className="resource-catalog__grid">
          {visible.map((r, i) => (
            <Reveal key={r.slug} delay={i * 0.06}>
              <Link className="resource-card" href={`/resources/${r.slug}`}>
                <div className="resource-card__top">
                  <span className="resource-card__level">{r.level}</span>
                  <span className="resource-card__price">{r.price}</span>
                </div>
                <h3>{r.title}</h3>
                <p>{r.body}</p>
                <span className="resource-card__cta">View resource <Arrow size={15} /></span>
              </Link>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

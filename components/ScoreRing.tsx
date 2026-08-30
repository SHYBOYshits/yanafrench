"use client";

import { motion, useReducedMotion } from "motion/react";

const R = 32;
const C = 2 * Math.PI * R;

function parsePercent(score: string) {
  const [a, b] = score.split("/").map((s) => parseFloat(s.trim()));
  if (!a || !b) return 0;
  return Math.min(1, a / b);
}

export function ScoreRing({
  skill,
  score,
  level,
  detail,
}: {
  skill: string;
  score: string;
  level: string;
  detail?: string;
}) {
  const pct = parsePercent(score);
  const reduce = useReducedMotion();

  return (
    <div className="score-ring">
      <div className="score-ring__dial">
        <svg viewBox="0 0 76 76" aria-hidden="true">
          <circle className="score-ring__track" cx="38" cy="38" r={R} />
          <motion.circle
            className="score-ring__value"
            cx="38"
            cy="38"
            r={R}
            style={{ strokeDasharray: C }}
            initial={{ strokeDashoffset: reduce ? C * (1 - pct) : C }}
            whileInView={{ strokeDashoffset: C * (1 - pct) }}
            viewport={{ once: true, margin: "-10%" }}
            transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
          />
        </svg>
        <span className="score-ring__level">{level}</span>
      </div>
      <strong className="score-ring__skill">{skill}</strong>
      <span className="score-ring__score">{detail ? `${score} · ${detail}` : score}</span>
    </div>
  );
}

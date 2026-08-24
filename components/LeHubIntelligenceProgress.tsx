"use client";

import { motion } from "motion/react";
import { useState } from "react";
import ui from "./LeHubInteractive.module.css";

const signals = [
  {
    label: "Listening",
    title: "Fast speech is still costing you details.",
    meta: "3 sessions",
    detail: "Accuracy drops most when the speaker accelerates after the first idea.",
    next: "Next practice: shorter, faster clips",
  },
  {
    label: "Vocabulary",
    title: "7 saved words are ready to return.",
    meta: "Today",
    detail: "These words have appeared in class, your writing and your saved Lexique list.",
    next: "Next practice: contextual recall",
  },
  {
    label: "Grammar",
    title: "Agreement errors repeat in longer answers.",
    meta: "Pattern found",
    detail: "The pattern is small, but it becomes more frequent when your answers get longer.",
    next: "Next practice: focused correction",
  },
  {
    label: "Next test",
    title: "Practice will lean slightly more oral.",
    meta: "Adaptive",
    detail: "Your recent work is stronger in writing than spontaneous speaking, so the balance shifts quietly.",
    next: "Next practice: timed oral response",
  },
];

const levels = [
  { code: "A1", label: "Foundations", x: "8%", y: "70%", title: "Build the base.", text: "Core grammar, everyday vocabulary and the confidence to form complete ideas.", note: "The beginning" },
  { code: "A2", label: "Everyday French", x: "27%", y: "52%", title: "Make French usable.", text: "You move from isolated sentences into more natural everyday interaction and comprehension.", note: "Milestone reached" },
  { code: "B1", label: "Independent", x: "50%", y: "62%", title: "Hold your own.", text: "Your ideas are clearer, longer and more independent. Now precision and natural rhythm matter more.", note: "Current learning zone" },
  { code: "B2", label: "Confident", x: "72%", y: "39%", title: "Say more, better.", text: "Complex ideas become easier to structure, defend and express without sounding rehearsed.", note: "Next major threshold" },
  { code: "C1", label: "Advanced", x: "91%", y: "24%", title: "Make nuance feel natural.", text: "Accuracy, flexibility and nuance begin to work together across speaking, listening, reading and writing.", note: "Advanced command" },
];

export function IntelligenceExperience() {
  const [active, setActive] = useState(0);
  const selected = signals[active];

  return (
    <section className={ui.intelligenceSection}>
      <div className="container">
        <motion.div
          className={ui.intelligenceHead}
          initial={{ opacity: 0, y: 32 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-12%" }}
          transition={{ duration: .75, ease: [.22, 1, .36, 1] }}
        >
          <p className={`eyebrow ${ui.intelligenceEyebrow}`}>Intelligence, quietly built in</p>
          <h2>Le Hub learns from<br/><em>your learning.</em></h2>
          <p>Not a chatbot shouting “AI”. A quieter layer that notices what deserves another look and helps practice become more relevant over time.</p>
        </motion.div>

        <motion.div
          className={ui.intelligenceStage}
          initial={{ opacity: 0, y: 30, scale: .985 }}
          whileInView={{ opacity: 1, y: 0, scale: 1 }}
          viewport={{ once: true, margin: "-10%" }}
          transition={{ duration: .85, ease: [.22, 1, .36, 1] }}
        >
          <svg className={ui.signalMap} viewBox="0 0 1200 590" preserveAspectRatio="none" aria-hidden="true">
            {[
              "M 270 135 C 410 155 470 205 600 283",
              "M 930 130 C 800 155 730 205 600 283",
              "M 285 470 C 420 430 485 365 600 283",
              "M 920 465 C 790 425 720 355 600 283",
            ].map((d, i) => (
              <motion.path key={d} d={d} initial={{ pathLength: 0, opacity: 0 }} whileInView={{ pathLength: 1, opacity: 1 }} viewport={{ once: true }} transition={{ duration: 1.1, delay: .16 + i * .1 }} />
            ))}
          </svg>

          <div className={ui.intelligenceCore}>
            <div>
              <span>LE HUB NOTICES</span>
              <strong>Patterns,<br/>not points.</strong>
              <small>Signals become more useful<br/>when they stay quiet.</small>
            </div>
          </div>

          {signals.map((item, index) => (
            <motion.button
              type="button"
              key={item.label}
              className={`${ui.signalNode} ${active === index ? ui.signalNodeActive : ""}`}
              onMouseEnter={() => setActive(index)}
              onFocus={() => setActive(index)}
              onClick={() => setActive(index)}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: .55, delay: .12 + index * .09 }}
              whileHover={{ y: -6 }}
            >
              <div className={ui.signalTop}><span>0{index + 1} · {item.label}</span><em>{item.meta}</em></div>
              <strong>{item.title}</strong>
              <small>Hover or click to see what changes next.</small>
              <i className={ui.signalDot}/>
            </motion.button>
          ))}

          <motion.div
            key={selected.label}
            className={ui.intelligenceDetail}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: .3 }}
          >
            <div>
              <span>WHAT LE HUB NOTICES · {selected.label.toUpperCase()}</span>
              <strong>{selected.detail}</strong>
              <p>Yana still decides what matters. The system simply makes the pattern easier to see.</p>
            </div>
            <em>{selected.next} →</em>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}

export function ProgressExperience() {
  const [active, setActive] = useState(2);
  const selected = levels[active];

  return (
    <section className={ui.progressSection}>
      <div className="container">
        <motion.div
          className={ui.progressHead}
          initial={{ opacity: 0, y: 32 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-12%" }}
          transition={{ duration: .75, ease: [.22, 1, .36, 1] }}
        >
          <p className={`eyebrow ${ui.progressEyebrow}`}>Mon Parcours</p>
          <p>Not streaks. Not meaningless points. A clear view of the language journey, test performance and what is actually changing.</p>
          <h2>Know how far<br/><em>you&apos;ve actually come.</em></h2>
        </motion.div>

        <motion.div
          className={ui.journeyStage}
          initial={{ opacity: 0, y: 28 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-10%" }}
          transition={{ duration: .8, ease: [.22, 1, .36, 1] }}
        >
          <svg className={ui.journeySvg} viewBox="0 0 1200 500" preserveAspectRatio="none" aria-hidden="true">
            <path className={ui.journeyTrack} d="M 96 350 C 190 330 240 270 324 260 S 500 320 600 310 S 780 210 864 195 S 1020 130 1092 120" />
            <motion.path
              className={ui.journeyProgress}
              d="M 96 350 C 190 330 240 270 324 260 S 500 320 600 310 S 780 210 864 195 S 1020 130 1092 120"
              initial={{ pathLength: 0 }}
              whileInView={{ pathLength: .53 }}
              viewport={{ once: true }}
              transition={{ duration: 1.8, ease: [.22, 1, .36, 1] }}
            />
          </svg>

          {levels.map((level, index) => (
            <motion.button
              type="button"
              key={level.code}
              className={`${ui.levelButton} ${index < 2 ? ui.levelButtonDone : ""} ${index === 2 ? ui.levelButtonCurrent : ""} ${active === index ? ui.levelButtonActive : ""}`}
              style={{ left: level.x, top: level.y }}
              onMouseEnter={() => setActive(index)}
              onFocus={() => setActive(index)}
              onClick={() => setActive(index)}
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: .5, delay: .25 + index * .12 }}
            >
              {index === 2 && <span className={ui.youAreHere}>YOU ARE HERE</span>}
              <strong>{level.code}</strong>
              <small>{level.label}</small>
            </motion.button>
          ))}

          <motion.div className={`${ui.journeyMetric} ${ui.metricOne}`} initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: .65 }}>
            <span>LISTENING</span><strong>+18%</strong><small>over the last 6 weeks</small>
          </motion.div>
          <motion.div className={`${ui.journeyMetric} ${ui.metricTwo}`} initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: .8 }}>
            <span>SPEAKING</span><strong>7.8 / 10</strong><small>latest assessment</small>
          </motion.div>
          <motion.div className={`${ui.journeyMetric} ${ui.metricThree}`} initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: .95 }}>
            <span>TEST TARGETS</span><strong>4 / 5</strong><small>currently reached</small>
          </motion.div>

          <motion.div key={selected.code} className={ui.levelDetail} initial={{ opacity: 0, x: 12 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: .28 }}>
            <span>{selected.code} · {selected.label.toUpperCase()}</span>
            <h3>{selected.title}</h3>
            <p>{selected.text}</p>
            <small>{selected.note} · Select another level to explore</small>
          </motion.div>
        </motion.div>
        <p className={ui.journeyHint}>Move across the levels to explore the journey · progress shown here is illustrative</p>
      </div>
    </section>
  );
}

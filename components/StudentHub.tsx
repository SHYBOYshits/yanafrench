"use client";

import Link from "next/link";
import { motion } from "motion/react";
import { Breadcrumb } from "./Breadcrumb";
import { Reveal } from "./Reveal";
import { WhatsAppLink } from "./WhatsAppLink";
import styles from "./StudentHub.module.css";

export function StudentHub() {
  return (
    <section className={styles.page}>
      <div className={`container ${styles.inner}`}>
        <Reveal className={styles.copy}>
          <Breadcrumb items={[{ label: "Discover", href: "/" }, { label: "Le Hub", href: "/le-hub" }, { label: "Student Hub" }]} />
          <p className="eyebrow">Le Hub</p>
          <h1>
            Your Hub,
            <br />
            <em>almost ready.</em>
          </h1>
          <p className={styles.dek}>
            Le Hub is where class, practice, feedback and progress will live in one place —
            built around the way Yana actually teaches. It&apos;s being built now.
          </p>
          <div className={styles.actions}>
            <WhatsAppLink message="Hi Yana! I'd love to hear more about Le Hub." className="button button--accent">
              Ask Yana about it
            </WhatsAppLink>
            <Link href="/le-hub" className="button button--outline">
              Back to Le Hub <span>→</span>
            </Link>
          </div>
        </Reveal>

        <motion.div
          className={styles.badge}
          initial={{ opacity: 0, y: 24, scale: 0.97 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
        >
          <div className={styles.badgeTop}>
            <span className={styles.badgeDot} />
            <span>Launching soon</span>
          </div>
          <strong>le hub.</strong>
          <small>Class · Practice · Feedback · Progress</small>
        </motion.div>
      </div>
    </section>
  );
}

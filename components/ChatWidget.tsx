"use client";

import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import type { FormEvent } from "react";
import { WhatsAppLink } from "./WhatsAppLink";

function ChatIcon() {
  return (
    <svg width="26" height="26" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M4 5.5h16v10.5H9.5L5 20v-4H4V5.5Z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round"/>
      <path d="M8 9.5h8M8 12.5h5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"/>
    </svg>
  );
}

export function ChatWidget() {
  const [open, setOpen] = useState(false);
  const [draft, setDraft] = useState("");

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
  }

  return (
    <div className="chat-widget">
      <AnimatePresence>
        {open && (
          <motion.div
            className="chat-widget__panel"
            initial={{ opacity: 0, y: 16, scale: .97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 12, scale: .97 }}
            transition={{ duration: .28, ease: [0.22, 1, 0.36, 1] }}
            role="dialog"
            aria-label="The Français Hub chat"
          >
            <div className="chat-widget__head">
              <div className="chat-widget__avatar" aria-hidden="true">ç.</div>
              <div>
                <strong>TFH Assistant</strong>
                <span>Ask about the site or a program</span>
              </div>
              <button type="button" className="chat-widget__close" onClick={() => setOpen(false)} aria-label="Close chat">×</button>
            </div>

            <div className="chat-widget__body">
              <div className="chat-widget__bubble">
                Bonjour ! I&apos;m a preview of the TFH chat assistant — I can&apos;t answer yet, but this is where I&apos;ll help you explore programs, resources and results.
              </div>
              <div className="chat-widget__bubble">
                For a real answer right now, message Yana directly on WhatsApp.
              </div>
              <WhatsAppLink className="button button--accent chat-widget__cta" message="Hi Yana! I found The Français Hub website and had a question.">
                Chat with Yana instead
              </WhatsAppLink>
            </div>

            <form className="chat-widget__composer" onSubmit={handleSubmit}>
              <input
                value={draft}
                onChange={(e) => setDraft(e.target.value)}
                placeholder="Chat coming soon…"
                aria-label="Message"
                disabled
              />
              <button type="submit" disabled aria-label="Send">→</button>
            </form>
            <span className="chat-widget__note">Preview only — not connected yet.</span>
          </motion.div>
        )}
      </AnimatePresence>

      <button
        type="button"
        className={`chat-widget__button ${open ? "is-open" : ""}`}
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-label={open ? "Close chat" : "Open chat"}
      >
        {open ? <span className="chat-widget__buttonClose" aria-hidden="true">×</span> : <ChatIcon />}
      </button>
    </div>
  );
}

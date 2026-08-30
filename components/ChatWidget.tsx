"use client";

import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport } from "ai";
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
  const { messages, sendMessage, status, error, clearError } = useChat({
    transport: new DefaultChatTransport({ api: "/api/chat" }),
  });

  const isBusy = status === "submitted" || status === "streaming";
  const errorMessage =
    error == null
      ? null
      : error.message === "RATE_LIMITED"
        ? "I'm getting a lot of questions right now — please try again in a minute."
        : "Something went wrong. Please try again.";

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!draft.trim() || isBusy) return;
    if (error != null) clearError();
    sendMessage({ text: draft });
    setDraft("");
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
              {messages.length === 0 && (
                <div className="chat-widget__bubble">
                  Bonjour ! Ask me about programs, resources or results — I&apos;m happy to help.
                </div>
              )}
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`chat-widget__bubble ${message.role === "user" ? "chat-widget__bubble--user" : ""}`}
                >
                  {message.parts.map((part, i) =>
                    part.type === "text" ? <span key={`${message.id}-${i}`}>{part.text}</span> : null
                  )}
                </div>
              ))}
              {status === "submitted" && (
                <div className="chat-widget__bubble chat-widget__bubble--typing">Typing…</div>
              )}
              {errorMessage && (
                <div className="chat-widget__bubble chat-widget__bubble--error">{errorMessage}</div>
              )}
              <WhatsAppLink className="button button--accent chat-widget__cta" message="Hi Yana! I found The Français Hub website and had a question.">
                Chat with Yana instead
              </WhatsAppLink>
            </div>

            <form className="chat-widget__composer" onSubmit={handleSubmit}>
              <input
                value={draft}
                onChange={(e) => setDraft(e.target.value)}
                placeholder="Ask a question…"
                aria-label="Message"
                disabled={isBusy}
              />
              <button type="submit" disabled={isBusy || !draft.trim()} aria-label="Send">→</button>
            </form>
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

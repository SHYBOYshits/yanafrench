"use client";

import { useEffect, useMemo, useState } from "react";
import { getVocabulary, vocabCategories } from "@/lib/vocabData";
import { DashboardShell } from "./DashboardShell";
import styles from "./VocabularyPage.module.css";

const FAVORITES_KEY = "student-hub-vocab-favorites";
type View = "all" | "favorites" | "flashcards";

export function VocabularyPage() {
  const words = getVocabulary();
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<(typeof vocabCategories)[number]>("All");
  const [view, setView] = useState<View>("all");
  const [favorites, setFavorites] = useState<string[]>([]);
  const [cardIndex, setCardIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(FAVORITES_KEY);
      if (stored) setFavorites(JSON.parse(stored));
    } catch {}
  }, []);

  function toggleFavorite(id: string) {
    setFavorites((prev) => {
      const next = prev.includes(id) ? prev.filter((f) => f !== id) : [...prev, id];
      try { localStorage.setItem(FAVORITES_KEY, JSON.stringify(next)); } catch {}
      return next;
    });
  }

  const recent = [...words].slice(0, 4);

  const filtered = useMemo(() => {
    return words.filter((w) => {
      const matchesQuery = w.word.toLowerCase().includes(query.trim().toLowerCase()) || w.meaning.toLowerCase().includes(query.trim().toLowerCase());
      const matchesCategory = category === "All" || w.category === category;
      const matchesFavorites = view !== "favorites" || favorites.includes(w.id);
      return matchesQuery && matchesCategory && matchesFavorites;
    });
  }, [words, query, category, view, favorites]);

  const flashcardDeck = filtered.length > 0 ? filtered : words;
  const activeCard = flashcardDeck[cardIndex % flashcardDeck.length];

  function nextCard() {
    setFlipped(false);
    setCardIndex((i) => (i + 1) % flashcardDeck.length);
  }
  function prevCard() {
    setFlipped(false);
    setCardIndex((i) => (i - 1 + flashcardDeck.length) % flashcardDeck.length);
  }

  return (
    <DashboardShell>
      <div className={styles.head}>
        <small>LE HUB</small>
        <h1>Vocabulary.</h1>
        <p>Every word from class, organised and ready to review.</p>
      </div>

      <div className={styles.viewTabs}>
        <button type="button" className={view === "all" ? styles.tabActive : styles.tab} onClick={() => setView("all")}>All words</button>
        <button type="button" className={view === "favorites" ? styles.tabActive : styles.tab} onClick={() => setView("favorites")}>Favorites</button>
        <button type="button" className={view === "flashcards" ? styles.tabActive : styles.tab} onClick={() => { setView("flashcards"); setCardIndex(0); setFlipped(false); }}>Flashcards</button>
      </div>

      {view !== "flashcards" && (
        <>
          <div className={styles.controls}>
            <input
              className={styles.search}
              placeholder="Search words or meanings…"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              aria-label="Search vocabulary"
            />
            <div className={styles.filterRow}>
              {vocabCategories.map((c) => (
                <button key={c} type="button" className={category === c ? styles.chipActive : styles.chip} onClick={() => setCategory(c)}>{c}</button>
              ))}
            </div>
          </div>

          {view === "all" && query.trim() === "" && category === "All" && (
            <div className={styles.section}>
              <h2>Recently learned</h2>
              <div className={styles.grid}>
                {recent.map((w) => (
                  <div key={w.id} className={styles.card}>
                    <button type="button" className={favorites.includes(w.id) ? styles.favActive : styles.fav} onClick={() => toggleFavorite(w.id)} aria-label="Toggle favorite">★</button>
                    <span className={styles.category}>{w.category}</span>
                    <strong>{w.word}</strong>
                    <small className={styles.pron}>/{w.pronunciation}/</small>
                    <p className={styles.meaning}>{w.meaning}</p>
                    <p className={styles.example}>{w.example}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className={styles.section}>
            <h2>{view === "favorites" ? "Favorites" : "All words"}</h2>
            {filtered.length > 0 ? (
              <div className={styles.grid}>
                {filtered.map((w) => (
                  <div key={w.id} className={styles.card}>
                    <button type="button" className={favorites.includes(w.id) ? styles.favActive : styles.fav} onClick={() => toggleFavorite(w.id)} aria-label="Toggle favorite">★</button>
                    <span className={styles.category}>{w.category}</span>
                    <strong>{w.word}</strong>
                    <small className={styles.pron}>/{w.pronunciation}/</small>
                    <p className={styles.meaning}>{w.meaning}</p>
                    <p className={styles.example}>{w.example}</p>
                  </div>
                ))}
              </div>
            ) : (
              <div className={styles.empty}><p>{view === "favorites" ? "No favorites yet — star a word to save it here." : "No words match your search."}</p></div>
            )}
          </div>
        </>
      )}

      {view === "flashcards" && activeCard && (
        <div className={styles.flashcardWrap}>
          <button type="button" className={styles.flashcard} onClick={() => setFlipped((f) => !f)}>
            {!flipped ? (
              <>
                <span className={styles.category}>{activeCard.category}</span>
                <strong className={styles.flashWord}>{activeCard.word}</strong>
                <small className={styles.pron}>/{activeCard.pronunciation}/</small>
                <span className={styles.flipHint}>Tap to reveal meaning</span>
              </>
            ) : (
              <>
                <p className={styles.meaning}>{activeCard.meaning}</p>
                <p className={styles.example}>{activeCard.example}</p>
                <span className={styles.flipHint}>Tap to flip back</span>
              </>
            )}
          </button>
          <div className={styles.flashNav}>
            <button type="button" onClick={prevCard}>← Previous</button>
            <span>{(cardIndex % flashcardDeck.length) + 1} / {flashcardDeck.length}</span>
            <button type="button" onClick={nextCard}>Next →</button>
          </div>
        </div>
      )}
    </DashboardShell>
  );
}

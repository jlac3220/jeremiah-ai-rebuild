// src/BiblePage.js — Matches HomePage design system
import React, { useEffect, useState, useRef } from "react";
import { theme } from "./theme";
import PageHeader from "./PageHeader";

const { colors, gradients, typography } = theme;
const { roles, lineHeights } = typography;

// Abbreviation to full book name map for the thiagobodruk format
const ABBREV_TO_NAME = {
  gn:"Genesis",ex:"Exodus",lv:"Leviticus",nm:"Numbers",dt:"Deuteronomy",
  js:"Joshua",jdg:"Judges",rt:"Ruth","1sm":"1 Samuel","2sm":"2 Samuel",
  "1kgs":"1 Kings","2kgs":"2 Kings","1chr":"1 Chronicles","2chr":"2 Chronicles",
  ezr:"Ezra",neh:"Nehemiah",est:"Esther",job:"Job",ps:"Psalms",prv:"Proverbs",
  eccl:"Ecclesiastes",sg:"Song of Solomon",is:"Isaiah",jr:"Jeremiah",
  lm:"Lamentations",ez:"Ezekiel",dn:"Daniel",hs:"Hosea",jl:"Joel",am:"Amos",
  ob:"Obadiah",jn:"Jonah",mi:"Micah",na:"Nahum",hb:"Habakkuk",zp:"Zephaniah",
  hg:"Haggai",zc:"Zechariah",ml:"Malachi",mt:"Matthew",mk:"Mark",lk:"Luke",
  jo:"John",act:"Acts",rm:"Romans","1cor":"1 Corinthians","2cor":"2 Corinthians",
  gl:"Galatians",eph:"Ephesians",ph:"Philippians",cl:"Colossians",
  "1ts":"1 Thessalonians","2ts":"2 Thessalonians","1tm":"1 Timothy",
  "2tm":"2 Timothy",tt:"Titus",phm:"Philemon",heb:"Hebrews",jm:"James",
  "1pe":"1 Peter","2pe":"2 Peter","1jo":"1 John","2jo":"2 John","3jo":"3 John",
  jd:"Jude",rv:"Revelation",jon:"Jonah",jas:"James",rev:"Revelation",
};

// Normalize any supported KJV JSON format into:
// { books: [{ name, chapters: [{ chapter, verses: [{ verse, text }] }] }] }
function normalizeBibleData(data) {
  // Already in correct format
  if (data?.books?.length && data.books[0]?.name && data.books[0]?.chapters?.[0]?.verses) {
    return data;
  }

  // Format: [{ abbrev, chapters: [["v1text","v2text",...], ...] }]
  if (Array.isArray(data) && data[0]?.abbrev && Array.isArray(data[0]?.chapters)) {
    const books = data.map((b) => {
      const name = ABBREV_TO_NAME[b.abbrev] || b.abbrev;
      const chapters = (b.chapters || []).map((chVerses, chIdx) => ({
        chapter: chIdx + 1,
        verses: (chVerses || []).map((text, vIdx) => ({
          verse: vIdx + 1,
          text: String(text),
        })),
      }));
      return { name, chapters };
    });
    return { books };
  }

  // Format: flat array of { book, chapter, verse, text } or { name, text }
  const list = Array.isArray(data) ? data
    : Array.isArray(data?.verses) ? data.verses
    : Array.isArray(data?.kjv) ? data.kjv
    : [];

  if (list.length > 0) {
    const bookMap = {};
    const bookOrder = [];
    for (const row of list) {
      let bookName = row.book;
      let chNum = Number(row.chapter);
      let vNum = Number(row.verse);
      let text = row.text ?? row.t ?? row.verse_text ?? "";

      // Try parsing "Genesis 1:1" style name field
      if (!bookName && row.name) {
        const m = String(row.name).match(/^(.*)\s+(\d+):(\d+)$/);
        if (m) { bookName = m[1].trim(); chNum = Number(m[2]); vNum = Number(m[3]); }
      }

      if (!bookName || !chNum || !vNum) continue;

      if (!bookMap[bookName]) {
        bookMap[bookName] = {};
        bookOrder.push(bookName);
      }
      if (!bookMap[bookName][chNum]) bookMap[bookName][chNum] = {};
      bookMap[bookName][chNum][vNum] = String(text);
    }

    const books = bookOrder.map((name) => ({
      name,
      chapters: Object.keys(bookMap[name])
        .map(Number)
        .sort((a, b) => a - b)
        .map((chNum) => ({
          chapter: chNum,
          verses: Object.keys(bookMap[name][chNum])
            .map(Number)
            .sort((a, b) => a - b)
            .map((vNum) => ({ verse: vNum, text: bookMap[name][chNum][vNum] })),
        })),
    }));
    return { books };
  }

  return { books: [] };
}

export default function BiblePage({
  onBack,
  backLabel,
  onShowProfile,
  onShowAccount,
  profileImageUrl,
}) {
  const [bible, setBible] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [bookIndex, setBookIndex] = useState(0);
  const [chapterNumber, setChapterNumber] = useState(1);
  const [fontSizeRem, setFontSizeRem] = useState(1.08);

  const [showBookPicker, setShowBookPicker] = useState(false);
  const [showChapterPicker, setShowChapterPicker] = useState(false);
  const [readingProgress, setReadingProgress] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);

  const pageRef = useRef(null);

  // Load local KJV JSON
  useEffect(() => {
    async function loadBible() {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch("/kjv.json");
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const raw = await res.json();
        const normalized = normalizeBibleData(raw);
        setBible(normalized);
      } catch (err) {
        console.error("Error loading KJV JSON:", err);
        setError("Could not load Bible text.");
      } finally {
        setLoading(false);
      }
    }
    loadBible();
  }, []);

  // Reading progress on scroll
  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      const docHeight =
        document.documentElement.scrollHeight - window.innerHeight;
      const progress = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
      setReadingProgress(Math.min(100, Math.max(0, progress)));
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const books = bible?.books || [];
  const currentBook = books[bookIndex] || null;
  const chapters = currentBook?.chapters || [];

  let currentChapterIndex = chapters.findIndex(
    (ch) => ch.chapter === chapterNumber
  );
  if (currentChapterIndex === -1 && chapters.length > 0) {
    currentChapterIndex = 0;
  }
  const currentChapter =
    currentChapterIndex >= 0 ? chapters[currentChapterIndex] : null;

  // Navigation helpers
  const atFirstBook = bookIndex === 0;
  const atLastBook = bookIndex === books.length - 1;
  const atFirstChapterInBook = currentChapterIndex <= 0;
  const atLastChapterInBook =
    chapters.length > 0 && currentChapterIndex === chapters.length - 1;
  const isAtVeryStart = atFirstBook && atFirstChapterInBook;
  const isAtVeryEnd = atLastBook && atLastChapterInBook;

  function goToPreviousChapter() {
    if (!books.length || !chapters.length || isAtVeryStart) return;

    setIsTransitioning(true);
    setTimeout(() => {
      if (!atFirstChapterInBook) {
        const prevChapter = chapters[currentChapterIndex - 1];
        setChapterNumber(prevChapter.chapter);
      } else if (!atFirstBook) {
        const prevBookIndex = bookIndex - 1;
        const prevBook = books[prevBookIndex];
        const prevChapters = prevBook?.chapters || [];
        if (prevChapters.length > 0) {
          const lastChapter = prevChapters[prevChapters.length - 1];
          setBookIndex(prevBookIndex);
          setChapterNumber(lastChapter.chapter);
        }
      }
      window.scrollTo({ top: 0, behavior: "auto" });
      setTimeout(() => setIsTransitioning(false), 50);
    }, 150);
  }

  function goToNextChapter() {
    if (!books.length || !chapters.length || isAtVeryEnd) return;

    setIsTransitioning(true);
    setTimeout(() => {
      if (!atLastChapterInBook) {
        const nextChapter = chapters[currentChapterIndex + 1];
        setChapterNumber(nextChapter.chapter);
      } else if (!atLastBook) {
        const nextBookIndex = bookIndex + 1;
        const nextBook = books[nextBookIndex];
        const nextChapters = nextBook?.chapters || [];
        if (nextChapters.length > 0) {
          const firstChapter = nextChapters[0];
          setBookIndex(nextBookIndex);
          setChapterNumber(firstChapter.chapter);
        }
      }
      window.scrollTo({ top: 0, behavior: "auto" });
      setTimeout(() => setIsTransitioning(false), 50);
    }, 150);
  }

  function selectBook(idx) {
    setBookIndex(idx);
    const nextBook = books[idx];
    const nextChapters = nextBook?.chapters || [];
    setChapterNumber(nextChapters[0]?.chapter || 1);
    setShowBookPicker(false);
    window.scrollTo({ top: 0, behavior: "auto" });
  }

  function selectChapter(ch) {
    setChapterNumber(ch);
    setShowChapterPicker(false);
    window.scrollTo({ top: 0, behavior: "auto" });
  }

  // Font size controls
  const MIN_FONT = 0.9;
  const MAX_FONT = 1.5;
  const STEP_FONT = 0.1;
  const increaseFont = () =>
    setFontSizeRem((p) => Math.min(MAX_FONT, p + STEP_FONT));
  const decreaseFont = () =>
    setFontSizeRem((p) => Math.max(MIN_FONT, p - STEP_FONT));
  const canShrink = fontSizeRem > MIN_FONT + 0.001;
  const canGrow = fontSizeRem < MAX_FONT - 0.001;

  // Testament
  const OLD_TESTAMENT_COUNT = 39;
  const isOldTestament = bookIndex < OLD_TESTAMENT_COUNT;

  return (
    <div className="bible-page" ref={pageRef}>
      {/* Progress bar */}
      <div className="progress-bar" style={{ width: `${readingProgress}%` }} />

      <PageHeader
        title="Bible"
        onBack={onBack}
        backLabel={backLabel}
        onProfile={onShowProfile}
        onAccount={onShowAccount}
        profileImageUrl={profileImageUrl}
      />

      <main className="bible-content">
        {/* Controls bar */}
        <div className="controls-bar">
          <div className="selector-row">
            <button
              className="selector-btn"
              onClick={() => setShowBookPicker(true)}
            >
              <span className="selector-label">Book</span>
              <span className="selector-value">
                {currentBook?.name || "Select"}
                <span className="selector-arrow">▼</span>
              </span>
            </button>

            <button
              className="selector-btn chapter-btn"
              onClick={() => setShowChapterPicker(true)}
            >
              <span className="selector-label">Chapter</span>
              <span className="selector-value">
                {currentChapter?.chapter || 1}
                <span className="selector-arrow">▼</span>
              </span>
            </button>
          </div>

          <div className="nav-row">
            <div className="nav-arrows">
              <button
                className={`arrow-btn ${isAtVeryStart ? "disabled" : ""}`}
                onClick={goToPreviousChapter}
                disabled={isAtVeryStart}
                aria-label="Previous chapter"
              >
                ‹
              </button>
              <button
                className={`arrow-btn ${isAtVeryEnd ? "disabled" : ""}`}
                onClick={goToNextChapter}
                disabled={isAtVeryEnd}
                aria-label="Next chapter"
              >
                ›
              </button>
            </div>

            <div className="chapter-badge">
              {currentChapterIndex + 1} / {chapters.length || 1}
            </div>

            <div className="font-controls">
              <button
                className={`font-btn ${!canShrink ? "disabled" : ""}`}
                onClick={decreaseFont}
                disabled={!canShrink}
                aria-label="Decrease font size"
              >
                A-
              </button>
              <span className="font-label">Aa</span>
              <button
                className={`font-btn ${!canGrow ? "disabled" : ""}`}
                onClick={increaseFont}
                disabled={!canGrow}
                aria-label="Increase font size"
              >
                A+
              </button>
            </div>
          </div>
        </div>

        {/* Error */}
        {error && <div className="error-message">{error}</div>}

        {/* Reader */}
        <div
          className={`reader-area ${isTransitioning ? "transitioning" : ""}`}
        >
          {loading ? (
            <div className="loading-state">
              <div className="loading-icon">📖</div>
              Loading Scripture...
            </div>
          ) : !currentBook || !currentChapter ? (
            <div className="empty-state">No text available.</div>
          ) : (
            <div className="reader-card">
              <div className="reader-header">
                <div
                  className={`testament-badge ${
                    isOldTestament ? "old" : "new"
                  }`}
                >
                  {isOldTestament ? "Old Testament" : "New Testament"}
                </div>
                <h1 className="book-title">{currentBook.name}</h1>
                <div className="chapter-subtitle">
                  Chapter {currentChapter.chapter}
                </div>
              </div>

              <div
                className="text-block"
                style={{ fontSize: `${fontSizeRem}rem` }}
              >
                {currentChapter.verses.map((v, i) => {
                  if (i === 0 && v.text.length > 0) {
                    const firstLetter = v.text[0];
                    const rest = v.text.slice(1);
                    return (
                      <p key={v.verse} className="verse-paragraph">
                        <span className="drop-cap">{firstLetter}</span>
                        <sup className="verse-num">{v.verse}</sup>
                        {rest}
                      </p>
                    );
                  }
                  return (
                    <p key={v.verse} className="verse-paragraph">
                      <sup className="verse-num">{v.verse}</sup>
                      {v.text}
                    </p>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Overlay */}
      <div
        className={`overlay ${
          showBookPicker || showChapterPicker ? "visible" : ""
        }`}
        onClick={() => {
          setShowBookPicker(false);
          setShowChapterPicker(false);
        }}
      />

      {/* Book picker */}
      <div className={`bottom-sheet ${showBookPicker ? "open" : ""}`}>
        <div className="sheet-handle" />
        <div className="sheet-header">
          <div className="sheet-title">Select Book</div>
        </div>
        <div className="sheet-list">
          {books.map((book, idx) => (
            <div
              key={book.name}
              className={`sheet-item ${idx === bookIndex ? "active" : ""}`}
              onClick={() => selectBook(idx)}
            >
              <span>{book.name}</span>
              {idx === bookIndex && <span className="check-mark">✓</span>}
            </div>
          ))}
        </div>
      </div>

      {/* Chapter picker */}
      <div className={`bottom-sheet ${showChapterPicker ? "open" : ""}`}>
        <div className="sheet-handle" />
        <div className="sheet-header">
          <div className="sheet-title">Select Chapter</div>
        </div>
        <div className="chapter-grid">
          {chapters.map((ch) => (
            <button
              key={ch.chapter}
              className={`chapter-grid-item ${
                ch.chapter === chapterNumber ? "active" : ""
              }`}
              onClick={() => selectChapter(ch.chapter)}
            >
              {ch.chapter}
            </button>
          ))}
        </div>
      </div>

      <style jsx>{`
        .bible-page {
          min-height: 100vh;
          background: radial-gradient(
            circle at top,
            #f9fafb 0,
            #eef1f5 40%,
            #e5e7eb 100%
          );
        }

        .progress-bar {
          position: fixed;
          top: 0;
          left: 0;
          height: 3px;
          background: ${gradients.flame};
          z-index: 100;
          transition: width 0.1s ease-out;
          pointer-events: none;
        }

        .bible-content {
          max-width: 960px;
          margin: 0 auto;
          padding: 0 1rem 3rem;
        }

        .controls-bar {
          position: sticky;
          top: 56px;
          z-index: 40;
          background: #ffffff;
          border-radius: 18px;
          border: 1px solid #d1d5db;
          box-shadow: 0 6px 16px rgba(0, 0, 0, 0.06);
          padding: 0.75rem 1rem;
          margin-bottom: 1rem;
        }

        .selector-row {
          display: flex;
          gap: 0.5rem;
          margin-bottom: 0.75rem;
        }

        .selector-btn {
          flex: 1;
          display: flex;
          flex-direction: column;
          align-items: flex-start;
          padding: 0.6rem 0.9rem;
          border-radius: 12px;
          border: 1px solid #d1d5db;
          background: #f9fafb;
          cursor: pointer;
          min-width: 0;
          transition: border-color 0.15s ease;
        }

        .selector-btn:active {
          background: #f3f4f6;
        }

        .selector-btn.chapter-btn {
          flex: 0 0 auto;
          min-width: 90px;
        }

        .selector-label {
          font-size: 0.65rem;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          color: #6b7280;
          margin-bottom: 0.1rem;
        }

        .selector-value {
          font-size: ${roles.body.fontSize};
          font-weight: 600;
          color: #1f2937;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          width: 100%;
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .selector-arrow {
          color: #9ca3af;
          font-size: 0.6rem;
          margin-left: 0.3rem;
        }

        .nav-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .nav-arrows {
          display: flex;
          gap: 0.4rem;
        }

        .arrow-btn {
          width: 44px;
          height: 44px;
          border-radius: 50%;
          border: none;
          background: ${colors.primary};
          color: white;
          font-size: 1.3rem;
          font-weight: 600;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 4px 12px rgba(0, 61, 165, 0.3);
          transition: transform 0.15s ease;
        }

        .arrow-btn:active {
          transform: scale(0.95);
        }

        .arrow-btn.disabled {
          background: #e5e7eb;
          color: #9ca3af;
          box-shadow: none;
          cursor: default;
        }

        .chapter-badge {
          padding: 0.4rem 0.9rem;
          border-radius: 999px;
          background: rgba(0, 61, 165, 0.1);
          border: 1px solid rgba(0, 61, 165, 0.2);
          font-size: ${roles.bodySmall.fontSize};
          font-weight: 600;
          color: ${colors.primary};
        }

        .font-controls {
          display: flex;
          align-items: center;
          border-radius: 999px;
          border: 1px solid #d1d5db;
          background: #f9fafb;
          overflow: hidden;
        }

        .font-btn {
          width: 36px;
          height: 36px;
          border: none;
          background: transparent;
          font-size: 0.85rem;
          font-weight: 600;
          color: #6b7280;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .font-btn.disabled {
          color: #d1d5db;
          cursor: default;
        }

        .font-label {
          padding: 0 0.5rem;
          font-size: 0.75rem;
          color: #6b7280;
          border-left: 1px solid #d1d5db;
          border-right: 1px solid #d1d5db;
          height: 36px;
          display: flex;
          align-items: center;
        }

        .error-message {
          margin-bottom: 1rem;
          padding: 0.8rem 1rem;
          border-radius: 14px;
          background: #fef2f2;
          color: #991b1b;
          font-size: ${roles.bodySmall.fontSize};
          border: 1px solid #fecaca;
        }

        .reader-area {
          transition: opacity 0.15s ease, transform 0.15s ease;
        }

        .reader-area.transitioning {
          opacity: 0.3;
          transform: translateY(4px);
        }

        .loading-state,
        .empty-state {
          text-align: center;
          padding: 3rem 1rem;
          color: #6b7280;
        }

        .loading-icon {
          font-size: 2rem;
          margin-bottom: 0.5rem;
        }

        .reader-card {
          background: #ffffff;
          border-radius: 22px;
          border: 1px solid #d1d5db;
          box-shadow: 0 6px 16px rgba(0, 0, 0, 0.06);
          padding: 1.4rem 1.3rem 2rem;
        }

        .reader-header {
          margin-bottom: 1.2rem;
          padding-bottom: 1rem;
          border-bottom: 1px solid #e5e7eb;
        }

        .testament-badge {
          display: inline-block;
          font-size: 0.6rem;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          font-weight: 700;
          color: white;
          padding: 0.25rem 0.6rem;
          border-radius: 999px;
          margin-bottom: 0.5rem;
        }

        .testament-badge.old {
          background: #7c3aed;
        }

        .testament-badge.new {
          background: #059669;
        }

        .book-title {
          margin: 0 0 0.2rem;
          font-size: 1.5rem;
          font-weight: 800;
          color: #1f2937;
          letter-spacing: -0.01em;
        }

        .chapter-subtitle {
          font-size: ${roles.body.fontSize};
          color: #6b7280;
        }

        .text-block {
          font-family: Georgia, "Times New Roman", serif;
          line-height: 1.9;
          color: #1f2937;
        }

        .verse-paragraph {
          margin: 0 0 0.6rem;
        }

        .drop-cap {
          float: left;
          font-size: 3.2rem;
          line-height: 0.85;
          font-weight: 700;
          margin-right: 0.1rem;
          margin-top: 0.15rem;
          color: ${colors.primary};
          font-family: Georgia, serif;
        }

        .verse-num {
          font-size: 0.58em;
          vertical-align: super;
          margin-right: 0.2rem;
          color: #9ca3af;
          font-family: -apple-system, sans-serif;
          font-weight: 600;
        }

        .overlay {
          position: fixed;
          inset: 0;
          background: rgba(0, 0, 0, 0.5);
          z-index: 200;
          opacity: 0;
          pointer-events: none;
          transition: opacity 0.25s ease;
        }

        .overlay.visible {
          opacity: 1;
          pointer-events: auto;
        }

        .bottom-sheet {
          position: fixed;
          bottom: 0;
          left: 0;
          right: 0;
          max-height: 72vh;
          background: #ffffff;
          border-top-left-radius: 22px;
          border-top-right-radius: 22px;
          z-index: 201;
          transform: translateY(100%);
          transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          display: flex;
          flex-direction: column;
          box-shadow: 0 -8px 30px rgba(0, 0, 0, 0.18);
        }

        .bottom-sheet.open {
          transform: translateY(0);
        }

        .sheet-handle {
          width: 36px;
          height: 4px;
          border-radius: 2px;
          background: #d1d5db;
          margin: 0.75rem auto 0.5rem;
        }

        .sheet-header {
          padding: 0.25rem 1.25rem 0.75rem;
          border-bottom: 1px solid #e5e7eb;
        }

        .sheet-title {
          font-size: ${roles.cardTitle.fontSize};
          font-weight: 700;
          color: #1f2937;
        }

        .sheet-list {
          flex: 1;
          overflow-y: auto;
          -webkit-overflow-scrolling: touch;
          padding: 0.5rem 0 1.5rem;
        }

        .sheet-item {
          padding: 0.9rem 1.25rem;
          font-size: ${roles.body.fontSize};
          color: #1f2937;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: space-between;
          border-left: 3px solid transparent;
        }

        .sheet-item.active {
          color: ${colors.primary};
          font-weight: 600;
          background: rgba(0, 61, 165, 0.05);
          border-left-color: ${colors.primary};
        }

        .check-mark {
          color: ${colors.primary};
        }

        .chapter-grid {
          display: grid;
          grid-template-columns: repeat(5, 1fr);
          gap: 0.5rem;
          padding: 1rem 1.25rem 2rem;
          overflow-y: auto;
          max-height: 55vh;
        }

        .chapter-grid-item {
          aspect-ratio: 1;
          border-radius: 12px;
          border: 1px solid #d1d5db;
          background: #ffffff;
          color: #1f2937;
          font-size: ${roles.body.fontSize};
          font-weight: 600;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.15s ease;
        }

        .chapter-grid-item.active {
          border: none;
          background: ${colors.primary};
          color: white;
          box-shadow: 0 4px 12px rgba(0, 61, 165, 0.3);
        }

        .chapter-grid-item:active {
          transform: scale(0.95);
        }

        @media (max-width: 640px) {
          .bible-content {
            padding: 0 0.75rem 2.5rem;
          }

          .controls-bar {
            padding: 0.65rem 0.85rem;
            top: 50px;
          }

          .arrow-btn {
            width: 40px;
            height: 40px;
          }

          .reader-card {
            padding: 1.2rem 1.1rem 1.75rem;
          }

          .book-title {
            font-size: 1.35rem;
          }

          .chapter-grid {
            grid-template-columns: repeat(4, 1fr);
          }
        }
      `}</style>
    </div>
  );
}

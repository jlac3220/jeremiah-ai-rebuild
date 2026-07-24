// src/BibleReaderModal.js — Full chapter reader with verse highlighting + chapter nav
import React, { useEffect, useRef, useState } from "react";

export default function BibleReaderModal({
  isOpen,
  onClose,
  bibleIndex,
  bookName,
  chapter,
  highlightVerse,
}) {
  const verseRefs = useRef({});
  const contentRef = useRef(null);
  const [currentChapter, setCurrentChapter] = useState(chapter);

  // Reset to passed chapter when modal opens or chapter prop changes
  useEffect(() => {
    if (isOpen) {
      setCurrentChapter(chapter);
    }
  }, [isOpen, chapter]);

  // Scroll to highlighted verse (only on initial open, not on chapter nav)
  useEffect(() => {
    if (!isOpen || currentChapter !== chapter || !highlightVerse) return;

    const timer = setTimeout(() => {
      const el = verseRefs.current[highlightVerse];
      if (el) {
        el.scrollIntoView({ behavior: "smooth", block: "center" });
      }
    }, 150);

    return () => clearTimeout(timer);
  }, [isOpen, currentChapter, chapter, highlightVerse]);

  // Scroll to top when changing chapters
  useEffect(() => {
    if (!isOpen) return;
    const timer = setTimeout(() => {
      if (contentRef.current) {
        contentRef.current.scrollTop = 0;
      }
    }, 50);
    return () => clearTimeout(timer);
  }, [currentChapter, isOpen]);

  if (!isOpen) return null;

  // Resolve book key
  function cleanBookKey(s = "") {
    return String(s)
      .toLowerCase()
      .replace(/\./g, "")
      .replace(/\s+/g, " ")
      .trim();
  }

  function resolveBookKey(name) {
    if (!name || !bibleIndex) return null;

    const tryNames = [
      name,
      name.replace(/^1\s+/, "I "),
      name.replace(/^2\s+/, "II "),
      name.replace(/^3\s+/, "III "),
      name.replace(/^I\s+/i, "1 "),
      name.replace(/^II\s+/i, "2 "),
      name.replace(/^III\s+/i, "3 "),
    ];

    for (const nm of tryNames) {
      const key = cleanBookKey(nm);
      if (bibleIndex[key]) {
        return { key, display: bibleIndex[key].__display || nm };
      }
    }

    const wanted = cleanBookKey(name);
    const keys = Object.keys(bibleIndex);
    const found =
      keys.find((k) => k === wanted) ||
      keys.find((k) => k.includes(wanted) || wanted.includes(k));

    if (found) {
      return { key: found, display: bibleIndex[found].__display || name };
    }
    return null;
  }

  const resolved = resolveBookKey(bookName);
  const bookData = resolved ? bibleIndex[resolved.key] : null;
  const chapterData = bookData?.chapters?.[currentChapter] || null;

  // Get available chapters for this book
  const availableChapters = bookData
    ? Object.keys(bookData.chapters)
        .map((c) => Number(c))
        .filter(Boolean)
        .sort((a, b) => a - b)
    : [];

  const minChapter = availableChapters.length ? availableChapters[0] : 1;
  const maxChapter = availableChapters.length
    ? availableChapters[availableChapters.length - 1]
    : 1;

  const hasPrev = currentChapter > minChapter;
  const hasNext = currentChapter < maxChapter;

  const verses = chapterData
    ? Object.keys(chapterData)
        .map((v) => Number(v))
        .filter(Boolean)
        .sort((a, b) => a - b)
        .map((v) => ({ verse: v, text: chapterData[v] }))
    : [];

  const displayBook = resolved?.display || bookName;

  const handlePrevChapter = () => {
    if (hasPrev) {
      setCurrentChapter((c) => c - 1);
    }
  };

  const handleNextChapter = () => {
    if (hasNext) {
      setCurrentChapter((c) => c + 1);
    }
  };

  return (
    <div className="bible-modal-overlay" onClick={onClose}>
      <div className="bible-modal" onClick={(e) => e.stopPropagation()}>
        <div className="bible-modal-header">
          <div className="bible-modal-title">
            {displayBook} {currentChapter}
          </div>
          <button type="button" className="bible-modal-close" onClick={onClose}>
            ✕
          </button>
        </div>

        <div ref={contentRef} className="bible-modal-content">
          {!resolved ? (
            <div className="bible-modal-error">
              Could not find "{bookName}" in the Bible.
            </div>
          ) : !verses.length ? (
            <div className="bible-modal-error">
              No verses found for {displayBook} {currentChapter}.
            </div>
          ) : (
            <div className="bible-chapter">
              {verses.map((v) => {
                const isHighlighted =
                  v.verse === highlightVerse && currentChapter === chapter;
                return (
                  <p
                    key={v.verse}
                    ref={(el) => (verseRefs.current[v.verse] = el)}
                    className={`bible-verse ${
                      isHighlighted ? "highlighted" : ""
                    }`}
                  >
                    <span className="bible-verse-num">{v.verse}</span>
                    <span className="bible-verse-text">{v.text}</span>
                  </p>
                );
              })}
            </div>
          )}
        </div>

        {/* Chapter Navigation */}
        <div className="bible-modal-nav">
          <button
            type="button"
            className={`chapter-nav-btn ${!hasPrev ? "disabled" : ""}`}
            onClick={handlePrevChapter}
            disabled={!hasPrev}
          >
            ← Previous
          </button>
          <div className="chapter-indicator">
            Chapter {currentChapter} of {maxChapter}
          </div>
          <button
            type="button"
            className={`chapter-nav-btn ${!hasNext ? "disabled" : ""}`}
            onClick={handleNextChapter}
            disabled={!hasNext}
          >
            Next →
          </button>
        </div>
      </div>

      <style>{`
        .bible-modal-overlay {
          position: fixed;
          inset: 0;
          background: rgba(2, 6, 23, 0.70);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 4000;
          padding: 1rem;
          -webkit-overflow-scrolling: touch;
        }

        .bible-modal {
          width: 100%;
          max-width: 600px;
          max-height: 85vh;
          background: #fff;
          border-radius: 24px;
          box-shadow: 0 24px 60px rgba(2, 6, 23, 0.40);
          display: flex;
          flex-direction: column;
          overflow: hidden;
          animation: modalIn 180ms ease-out;
        }

        @keyframes modalIn {
          from { transform: scale(0.95) translateY(10px); opacity: 0.7; }
          to { transform: scale(1) translateY(0); opacity: 1; }
        }

        .bible-modal-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 1rem 1.25rem;
          border-bottom: 1px solid rgba(15, 23, 42, 0.08);
          background: linear-gradient(135deg, #1e3a8a, #1e40af);
          color: #fff;
        }

        .bible-modal-title {
          font-size: 1.25rem;
          font-weight: 900;
          letter-spacing: -0.02em;
        }

        .bible-modal-close {
          width: 36px;
          height: 36px;
          border: none;
          background: rgba(255, 255, 255, 0.15);
          color: #fff;
          border-radius: 10px;
          cursor: pointer;
          font-size: 1rem;
          display: flex;
          align-items: center;
          justify-content: center;
          touch-action: manipulation;
          -webkit-tap-highlight-color: transparent;
        }

        .bible-modal-close:hover {
          background: rgba(255, 255, 255, 0.25);
        }

        .bible-modal-content {
          flex: 1;
          overflow-y: auto;
          padding: 1.25rem;
          -webkit-overflow-scrolling: touch;
        }

        .bible-modal-error {
          color: #b91c1c;
          text-align: center;
          padding: 2rem 1rem;
        }

        .bible-chapter {
          line-height: 1.8;
        }

        .bible-verse {
          margin: 0 0 0.75rem;
          padding: 0.5rem 0.75rem;
          border-radius: 12px;
          transition: background 0.2s ease;
        }

        .bible-verse.highlighted {
          background: linear-gradient(135deg, #fef3c7 0%, #fde68a 100%);
          border-left: 4px solid #f59e0b;
          padding-left: 0.65rem;
        }

        .bible-verse-num {
          display: inline-block;
          min-width: 2rem;
          font-weight: 900;
          color: #6b7280;
        }

        .bible-verse.highlighted .bible-verse-num {
          color: #b45309;
        }

        .bible-verse-text {
          color: #111827;
        }

        .bible-modal-nav {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 0.75rem;
          padding: 0.85rem 1rem;
          border-top: 1px solid rgba(15, 23, 42, 0.08);
          background: #f9fafb;
        }

        .chapter-nav-btn {
          border: none;
          background: linear-gradient(135deg, #1e3a8a, #1e40af);
          color: #fff;
          padding: 0.6rem 1rem;
          border-radius: 10px;
          font-size: 0.85rem;
          font-weight: 700;
          cursor: pointer;
          transition: opacity 0.15s ease, transform 0.1s ease;
          touch-action: manipulation;
          -webkit-tap-highlight-color: transparent;
        }

        .chapter-nav-btn:hover {
          opacity: 0.9;
        }

        .chapter-nav-btn:active {
          transform: scale(0.97);
        }

        .chapter-nav-btn.disabled {
          background: #d1d5db;
          color: #9ca3af;
          cursor: not-allowed;
        }

        .chapter-nav-btn.disabled:hover {
          opacity: 1;
        }

        .chapter-indicator {
          font-size: 0.8rem;
          font-weight: 700;
          color: #6b7280;
          text-align: center;
        }

        @media (max-width: 640px) {
          .bible-modal {
            max-height: 90vh;
            border-radius: 20px;
          }

          .bible-modal-header {
            padding: 0.9rem 1rem;
          }

          .bible-modal-content {
            padding: 1rem;
          }

          .bible-modal-nav {
            padding: 0.75rem;
          }

          .chapter-nav-btn {
            padding: 0.55rem 0.75rem;
            font-size: 0.8rem;
          }

          .chapter-indicator {
            font-size: 0.75rem;
          }
        }
      `}</style>
    </div>
  );
}

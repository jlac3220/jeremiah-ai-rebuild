import { useEffect, useMemo, useRef, useState } from "react";
import { ROUTES } from "../../app/routes";
import {
  clearBibleReaderIntent,
  getBibleReaderIntent,
} from "../../core/bible/bibleReaderIntent";
import "./BibleSupportPage.css";

const LAST_LOCATION_KEY = "jeremiah-bible-reader-last";
const chunkCache = new Map();

function normalizeBookName(value = "") {
  return String(value)
    .toLowerCase()
    .replace(/[^a-z0-9]/g, "")
    .replace(/^psalm$/, "psalms");
}

async function loadChunk(filename) {
  if (chunkCache.has(filename)) return chunkCache.get(filename);

  const response = await fetch(`/bible/${filename}`);
  if (!response.ok) throw new Error(`Could not load Bible data (${response.status}).`);
  const data = await response.json();
  chunkCache.set(filename, data);
  return data;
}

function readSavedLocation() {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(LAST_LOCATION_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

function saveLocation(location) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(LAST_LOCATION_KEY, JSON.stringify(location));
}

export default function BibleSupportPage({ onNavigate }) {
  const initialIntentRef = useRef(getBibleReaderIntent());
  const verseRefs = useRef({});
  const [manifest, setManifest] = useState(null);
  const [bookData, setBookData] = useState(null);
  const [bookIndex, setBookIndex] = useState(0);
  const [chapter, setChapter] = useState(1);
  const [highlightVerse, setHighlightVerse] = useState(null);
  const [fontSize, setFontSize] = useState(1.08);
  const [showBookPicker, setShowBookPicker] = useState(false);
  const [showChapterPicker, setShowChapterPicker] = useState(false);
  const [bookQuery, setBookQuery] = useState("");
  const [readingProgress, setReadingProgress] = useState(0);
  const [loadingBook, setLoadingBook] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;

    async function loadManifest() {
      try {
        const response = await fetch("/bible/manifest.json");
        if (!response.ok) throw new Error("Could not load Bible index.");
        const data = await response.json();
        if (cancelled) return;

        setManifest(data);

        const intent = initialIntentRef.current;
        const saved = readSavedLocation();
        const requestedBook = intent?.book || saved?.book || "Genesis";
        const requestedChapter = intent?.chapter || saved?.chapter || 1;
        const requestedVerse = intent?.verse || null;

        const index = Math.max(
          0,
          data.books.findIndex(
            (item) => normalizeBookName(item.name) === normalizeBookName(requestedBook)
          )
        );

        setBookIndex(index);
        setChapter(
          Math.min(
            Math.max(Number(requestedChapter) || 1, 1),
            data.books[index]?.chapters || 1
          )
        );
        setHighlightVerse(requestedVerse ? Number(requestedVerse) : null);
      } catch (err) {
        if (!cancelled) setError(err?.message || "Could not load the Bible.");
      }
    }

    loadManifest();
    return () => {
      cancelled = true;
    };
  }, []);

  const books = manifest?.books || [];
  const currentMeta = books[bookIndex] || null;

  useEffect(() => {
    if (!currentMeta) return;
    let cancelled = false;

    async function loadCurrentBook() {
      setLoadingBook(true);
      setError("");
      try {
        const chunk = await loadChunk(currentMeta.chunk);
        const found = chunk.find((item) => item.abbrev === currentMeta.abbrev);
        if (!cancelled) {
          if (!found) throw new Error("Bible book data is unavailable.");
          setBookData(found);
        }
      } catch (err) {
        if (!cancelled) setError(err?.message || "Could not load this book.");
      } finally {
        if (!cancelled) setLoadingBook(false);
      }
    }

    loadCurrentBook();
    return () => {
      cancelled = true;
    };
  }, [currentMeta?.abbrev, currentMeta?.chunk]);

  useEffect(() => {
    if (!currentMeta) return;
    saveLocation({ book: currentMeta.name, chapter });
  }, [currentMeta?.name, chapter]);

  useEffect(() => {
    if (!highlightVerse || !bookData) return;
    const timer = window.setTimeout(() => {
      verseRefs.current[highlightVerse]?.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
    }, 120);

    return () => window.clearTimeout(timer);
  }, [bookData, chapter, highlightVerse]);

  useEffect(() => {
    function handleScroll() {
      const top = window.scrollY;
      const height = document.documentElement.scrollHeight - window.innerHeight;
      setReadingProgress(height > 0 ? Math.min(100, (top / height) * 100) : 0);
    }

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const chapterVerses = useMemo(() => {
    const raw = bookData?.chapters?.[chapter - 1] || [];
    return raw.map((text, index) => ({
      verse: index + 1,
      text: String(text),
    }));
  }, [bookData, chapter]);

  const filteredBooks = useMemo(() => {
    const query = normalizeBookName(bookQuery);
    if (!query) return books.map((book, index) => ({ ...book, index }));
    return books
      .map((book, index) => ({ ...book, index }))
      .filter((book) => normalizeBookName(book.name).includes(query));
  }, [books, bookQuery]);

  const intent = initialIntentRef.current;
  const canGoPrev = bookIndex > 0 || chapter > 1;
  const canGoNext =
    bookIndex < books.length - 1 || chapter < (currentMeta?.chapters || 1);

  function selectBook(index) {
    const meta = books[index];
    if (!meta) return;
    setBookIndex(index);
    setChapter(1);
    setHighlightVerse(null);
    setShowBookPicker(false);
    setBookQuery("");
    window.scrollTo({ top: 0, behavior: "auto" });
  }

  function selectChapter(nextChapter) {
    setChapter(nextChapter);
    setHighlightVerse(null);
    setShowChapterPicker(false);
    window.scrollTo({ top: 0, behavior: "auto" });
  }

  function goPrevious() {
    if (!canGoPrev) return;
    setHighlightVerse(null);

    if (chapter > 1) {
      setChapter((value) => value - 1);
    } else {
      const nextIndex = bookIndex - 1;
      setBookIndex(nextIndex);
      setChapter(books[nextIndex]?.chapters || 1);
    }

    window.scrollTo({ top: 0, behavior: "auto" });
  }

  function goNext() {
    if (!canGoNext) return;
    setHighlightVerse(null);

    if (chapter < (currentMeta?.chapters || 1)) {
      setChapter((value) => value + 1);
    } else {
      setBookIndex((value) => value + 1);
      setChapter(1);
    }

    window.scrollTo({ top: 0, behavior: "auto" });
  }

  function returnFromReader() {
    const target = intent?.returnRoute || ROUTES.HOME;
    clearBibleReaderIntent();
    onNavigate?.(target);
  }

  const testament = bookIndex < 39 ? "Old Testament" : "New Testament";

  return (
    <div className="br-page">
      <div className="br-read-progress" style={{ width: `${readingProgress}%` }} />

      <header className="br-topbar">
        <button
          type="button"
          className="br-back"
          onClick={returnFromReader}
          aria-label={intent?.returnRoute ? "Return to Classroom" : "Return home"}
        >
          ←
        </button>

        <div className="br-top-title">
          <strong>Bible</strong>
          <small>King James Version</small>
        </div>

        <div className="br-font-controls" aria-label="Text size">
          <button
            type="button"
            onClick={() => setFontSize((value) => Math.max(.9, +(value - .1).toFixed(2)))}
            disabled={fontSize <= .9}
            aria-label="Decrease text size"
          >
            A−
          </button>
          <button
            type="button"
            onClick={() => setFontSize((value) => Math.min(1.5, +(value + .1).toFixed(2)))}
            disabled={fontSize >= 1.5}
            aria-label="Increase text size"
          >
            A+
          </button>
        </div>
      </header>

      <main className="br-shell">
        <section className="br-controls" aria-label="Bible location">
          <button type="button" onClick={() => setShowBookPicker(true)}>
            <small>Book</small>
            <strong>{currentMeta?.name || "Loading…"}</strong>
            <span>⌄</span>
          </button>

          <button type="button" onClick={() => setShowChapterPicker(true)} disabled={!currentMeta}>
            <small>Chapter</small>
            <strong>{chapter}</strong>
            <span>⌄</span>
          </button>
        </section>

        <section className="br-heading">
          <span>{testament}</span>
          <h1>{currentMeta?.name || "Bible"} {chapter}</h1>
        </section>

        {error && <div className="br-error">{error}</div>}

        {loadingBook && !chapterVerses.length ? (
          <div className="br-loading">Loading Scripture…</div>
        ) : (
          <article
            className="br-scripture"
            style={{ "--reader-font-size": `${fontSize}rem` }}
            aria-label={currentMeta ? `${currentMeta.name} chapter ${chapter}` : "Bible chapter"}
          >
            {chapterVerses.map((item) => {
              const highlighted = item.verse === highlightVerse;

              return (
                <p
                  key={item.verse}
                  ref={(element) => {
                    verseRefs.current[item.verse] = element;
                  }}
                  className={highlighted ? "is-highlighted" : ""}
                  onClick={() =>
                    setHighlightVerse((current) =>
                      current === item.verse ? null : item.verse
                    )
                  }
                >
                  <sup>{item.verse}</sup>
                  <span>{item.text}</span>
                </p>
              );
            })}
          </article>
        )}

        <nav className="br-chapter-nav" aria-label="Chapter navigation">
          <button type="button" onClick={goPrevious} disabled={!canGoPrev}>
            <span>←</span>
            <div>
              <small>Previous</small>
              <strong>Chapter</strong>
            </div>
          </button>

          <span>{currentMeta?.name} {chapter}</span>

          <button type="button" onClick={goNext} disabled={!canGoNext}>
            <div>
              <small>Next</small>
              <strong>Chapter</strong>
            </div>
            <span>→</span>
          </button>
        </nav>
      </main>

      {(showBookPicker || showChapterPicker) && (
        <button
          type="button"
          className="br-sheet-backdrop"
          aria-label="Close picker"
          onClick={() => {
            setShowBookPicker(false);
            setShowChapterPicker(false);
          }}
        />
      )}

      <aside className={`br-sheet ${showBookPicker ? "is-open" : ""}`} aria-hidden={!showBookPicker}>
        <div className="br-sheet-handle" />
        <div className="br-sheet-header">
          <div>
            <small>Choose a book</small>
            <strong>66 books</strong>
          </div>
          <button type="button" onClick={() => setShowBookPicker(false)} aria-label="Close">×</button>
        </div>

        <input
          className="br-book-search"
          value={bookQuery}
          onChange={(event) => setBookQuery(event.target.value)}
          placeholder="Find a book…"
        />

        <div className="br-book-list">
          {filteredBooks.map((book) => (
            <button
              type="button"
              key={book.abbrev}
              className={book.index === bookIndex ? "is-current" : ""}
              onClick={() => selectBook(book.index)}
            >
              <span>{book.name}</span>
              <small>{book.chapters} chapters</small>
            </button>
          ))}
        </div>
      </aside>

      <aside className={`br-sheet ${showChapterPicker ? "is-open" : ""}`} aria-hidden={!showChapterPicker}>
        <div className="br-sheet-handle" />
        <div className="br-sheet-header">
          <div>
            <small>{currentMeta?.name}</small>
            <strong>Choose a chapter</strong>
          </div>
          <button type="button" onClick={() => setShowChapterPicker(false)} aria-label="Close">×</button>
        </div>

        <div className="br-chapter-grid">
          {Array.from({ length: currentMeta?.chapters || 0 }, (_, index) => index + 1).map(
            (number) => (
              <button
                type="button"
                key={number}
                className={number === chapter ? "is-current" : ""}
                onClick={() => selectChapter(number)}
              >
                {number}
              </button>
            )
          )}
        </div>
      </aside>
    </div>
  );
}

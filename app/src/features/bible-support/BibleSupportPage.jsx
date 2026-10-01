import { useEffect, useMemo, useRef, useState } from "react";
import { ROUTES } from "../../app/routes";
import {
  BIBLE_BOOKS,
  BIBLE_TRANSLATIONS,
  DEFAULT_BIBLE_TRANSLATION,
  findBibleBook,
  getBibleTranslation,
  getChapterVerses,
  loadBibleChapter,
  normalizeBibleBookName,
} from "../../core/bible/bibleCatalog";
import {
  clearBibleReaderIntent,
  getBibleReaderIntent,
} from "../../core/bible/bibleReaderIntent";
import "./BibleSupportPage.css";

const LAST_LOCATION_KEY = "jeremiah-bible-reader-last";

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
  const savedLocationRef = useRef(readSavedLocation());
  const verseRefs = useRef({});

  const initialIntent = initialIntentRef.current;
  const savedLocation = savedLocationRef.current;
  const requestedBook = findBibleBook(initialIntent?.book || savedLocation?.book || "Genesis");
  const requestedTranslation = getBibleTranslation(
    initialIntent?.translation || savedLocation?.translation || DEFAULT_BIBLE_TRANSLATION
  );

  const [translationId, setTranslationId] = useState(requestedTranslation.id);
  const [bookIndex, setBookIndex] = useState(
    Math.max(0, BIBLE_BOOKS.findIndex((book) => book.bookId === requestedBook.bookId))
  );
  const [chapter, setChapter] = useState(() => {
    const requested = Number(initialIntent?.chapter || savedLocation?.chapter || 1);
    return Math.min(Math.max(requested || 1, 1), requestedBook.chapters);
  });
  const [highlightVerse, setHighlightVerse] = useState(
    initialIntent?.verse ? Number(initialIntent.verse) : null
  );
  const [fontSize, setFontSize] = useState(1.08);
  const [bookData, setBookData] = useState(null);
  const [showTranslationPicker, setShowTranslationPicker] = useState(false);
  const [showBookPicker, setShowBookPicker] = useState(false);
  const [showChapterPicker, setShowChapterPicker] = useState(false);
  const [bookQuery, setBookQuery] = useState("");
  const [readingProgress, setReadingProgress] = useState(0);
  const [loadingBook, setLoadingBook] = useState(false);
  const [reloadKey, setReloadKey] = useState(0);
  const [error, setError] = useState("");

  const currentBook = BIBLE_BOOKS[bookIndex] || BIBLE_BOOKS[0];
  const activeTranslation = getBibleTranslation(translationId);

  useEffect(() => {
    let cancelled = false;

    async function loadCurrentBook() {
      setLoadingBook(true);
      setError("");
      setBookData(null);

      try {
        const data = await loadBibleChapter(translationId, currentBook, chapter);
        if (!cancelled) setBookData(data);
      } catch (err) {
        if (!cancelled) {
          setError(
            err?.message ||
              "Could not load this translation. Check the connection and try again."
          );
        }
      } finally {
        if (!cancelled) setLoadingBook(false);
      }
    }

    loadCurrentBook();
    return () => {
      cancelled = true;
    };
  }, [translationId, currentBook.osis, chapter, reloadKey]);

  useEffect(() => {
    saveLocation({
      translation: translationId,
      book: currentBook.name,
      chapter,
    });
  }, [translationId, currentBook.name, chapter]);

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

  const chapterVerses = useMemo(
    () => getChapterVerses(bookData),
    [bookData, chapter]
  );

  const filteredBooks = useMemo(() => {
    const query = normalizeBibleBookName(bookQuery);
    if (!query) return BIBLE_BOOKS.map((book, index) => ({ ...book, index }));

    return BIBLE_BOOKS
      .map((book, index) => ({ ...book, index }))
      .filter((book) => {
        const labels = [book.name, book.osis, ...(book.aliases || [])];
        return labels.some((label) => normalizeBibleBookName(label).includes(query));
      });
  }, [bookQuery]);

  const intent = initialIntentRef.current;
  const canGoPrev = bookIndex > 0 || chapter > 1;
  const canGoNext =
    bookIndex < BIBLE_BOOKS.length - 1 || chapter < currentBook.chapters;

  function closeSheets() {
    setShowTranslationPicker(false);
    setShowBookPicker(false);
    setShowChapterPicker(false);
  }

  function selectTranslation(nextId) {
    setTranslationId(nextId);
    setShowTranslationPicker(false);
  }

  function selectBook(index) {
    const book = BIBLE_BOOKS[index];
    if (!book) return;
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
      setChapter(BIBLE_BOOKS[nextIndex]?.chapters || 1);
    }

    window.scrollTo({ top: 0, behavior: "auto" });
  }

  function goNext() {
    if (!canGoNext) return;
    setHighlightVerse(null);

    if (chapter < currentBook.chapters) {
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

  const hasSheetOpen =
    showTranslationPicker || showBookPicker || showChapterPicker;

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

        <button
          type="button"
          className="br-top-title"
          onClick={() => setShowTranslationPicker(true)}
          aria-label="Choose Bible translation"
        >
          <strong>Bible</strong>
          <small>
            {activeTranslation.shortName}
            <span> · {activeTranslation.name}</span>
            <i>⌄</i>
          </small>
        </button>

        <div className="br-font-controls" aria-label="Text size">
          <button
            type="button"
            onClick={() =>
              setFontSize((value) => Math.max(0.9, +(value - 0.1).toFixed(2)))
            }
            disabled={fontSize <= 0.9}
            aria-label="Decrease text size"
          >
            A−
          </button>
          <button
            type="button"
            onClick={() =>
              setFontSize((value) => Math.min(1.5, +(value + 0.1).toFixed(2)))
            }
            disabled={fontSize >= 1.5}
            aria-label="Increase text size"
          >
            A+
          </button>
        </div>
      </header>

      <main className="br-shell">
        <section className="br-version-strip">
          <button type="button" onClick={() => setShowTranslationPicker(true)}>
            <span>{activeTranslation.shortName}</span>
            <div>
              <strong>{activeTranslation.name}</strong>
              <small>{activeTranslation.year} · {activeTranslation.license}</small>
            </div>
            <i>Change</i>
          </button>
        </section>

        <section className="br-controls" aria-label="Bible location">
          <button type="button" onClick={() => setShowBookPicker(true)}>
            <small>Book</small>
            <strong>{currentBook.name}</strong>
            <span>⌄</span>
          </button>

          <button
            type="button"
            onClick={() => setShowChapterPicker(true)}
          >
            <small>Chapter</small>
            <strong>{chapter}</strong>
            <span>⌄</span>
          </button>
        </section>

        <section className="br-heading">
          <span>{currentBook.testament === "OT" ? "Old Testament" : "New Testament"}</span>
          <h1>{currentBook.name} {chapter}</h1>
          <small>{activeTranslation.shortName}</small>
        </section>

        {error && (
          <div className="br-error">
            <strong>Scripture did not load.</strong>
            <p>{error}</p>
            <button type="button" onClick={() => setReloadKey((value) => value + 1)}>
              Try again
            </button>
          </div>
        )}

        {loadingBook ? (
          <div className="br-loading">
            <span />
            Loading {activeTranslation.shortName}…
          </div>
        ) : !error ? (
          <article
            className="br-scripture"
            style={{ "--reader-font-size": `${fontSize}rem` }}
            aria-label={`${currentBook.name} chapter ${chapter}, ${activeTranslation.name}`}
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
        ) : null}

        <nav className="br-chapter-nav" aria-label="Chapter navigation">
          <button type="button" onClick={goPrevious} disabled={!canGoPrev}>
            <span>←</span>
            <div>
              <small>Previous</small>
              <strong>Chapter</strong>
            </div>
          </button>

          <span>{currentBook.name} {chapter}</span>

          <button type="button" onClick={goNext} disabled={!canGoNext}>
            <div>
              <small>Next</small>
              <strong>Chapter</strong>
            </div>
            <span>→</span>
          </button>
        </nav>
      </main>

      {hasSheetOpen && (
        <button
          type="button"
          className="br-sheet-backdrop"
          aria-label="Close picker"
          onClick={closeSheets}
        />
      )}

      <aside
        className={`br-sheet ${showTranslationPicker ? "is-open" : ""}`}
        aria-hidden={!showTranslationPicker}
      >
        <div className="br-sheet-handle" />
        <div className="br-sheet-header">
          <div>
            <small>Bible translation</small>
            <strong>Choose a version</strong>
          </div>
          <button type="button" onClick={() => setShowTranslationPicker(false)} aria-label="Close">
            ×
          </button>
        </div>

        <div className="br-translation-list">
          {BIBLE_TRANSLATIONS.map((translation) => (
            <button
              type="button"
              key={translation.id}
              className={translation.id === translationId ? "is-current" : ""}
              onClick={() => selectTranslation(translation.id)}
            >
              <span className="br-translation-badge">{translation.shortName}</span>
              <div>
                <strong>{translation.name}</strong>
                <small>{translation.year} · {translation.editionNote}</small>
              </div>
              <i>{translation.id === translationId ? "✓" : "→"}</i>
            </button>
          ))}
        </div>

        <p className="br-source-note">
          These editions are public-domain texts from eBible.org. Each chapter is cached after it is opened,
          so returning to it is fast.
        </p>
      </aside>

      <aside
        className={`br-sheet ${showBookPicker ? "is-open" : ""}`}
        aria-hidden={!showBookPicker}
      >
        <div className="br-sheet-handle" />
        <div className="br-sheet-header">
          <div>
            <small>Choose a book</small>
            <strong>66 books</strong>
          </div>
          <button type="button" onClick={() => setShowBookPicker(false)} aria-label="Close">
            ×
          </button>
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
              key={book.osis}
              className={book.index === bookIndex ? "is-current" : ""}
              onClick={() => selectBook(book.index)}
            >
              <span>{book.name}</span>
              <small>{book.chapters} chapters</small>
            </button>
          ))}
        </div>
      </aside>

      <aside
        className={`br-sheet ${showChapterPicker ? "is-open" : ""}`}
        aria-hidden={!showChapterPicker}
      >
        <div className="br-sheet-handle" />
        <div className="br-sheet-header">
          <div>
            <small>{currentBook.name}</small>
            <strong>Choose a chapter</strong>
          </div>
          <button type="button" onClick={() => setShowChapterPicker(false)} aria-label="Close">
            ×
          </button>
        </div>

        <div className="br-chapter-grid">
          {Array.from({ length: currentBook.chapters }, (_, index) => index + 1).map(
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

const INTENT_KEY = "jeremiah-bible-reader-intent";

export function parseBibleReference(reference = "") {
  const match = String(reference).trim().match(/^(.+?)\s+(\d+)(?::(\d+)(?:[-–](\d+))?)?/);
  if (!match) return null;

  return {
    book: match[1].trim(),
    chapter: Number(match[2]),
    verse: match[3] ? Number(match[3]) : null,
    endVerse: match[4] ? Number(match[4]) : (match[3] ? Number(match[3]) : null),
  };
}

export function setBibleReaderIntent(reference, options = {}) {
  if (typeof window === "undefined") return;
  const parsed = typeof reference === "string" ? parseBibleReference(reference) : reference;
  if (!parsed?.book || !parsed?.chapter) return;

  window.sessionStorage.setItem(
    INTENT_KEY,
    JSON.stringify({
      ...parsed,
      translation: options.translation || "",
      returnRoute: options.returnRoute || "",
      source: options.source || "",
      at: Date.now(),
    })
  );
}

export function getBibleReaderIntent() {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.sessionStorage.getItem(INTENT_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function clearBibleReaderIntent() {
  if (typeof window === "undefined") return;
  window.sessionStorage.removeItem(INTENT_KEY);
}

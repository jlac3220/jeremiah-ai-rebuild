import { BIBLE_BOOKS } from "../src/core/bible/bibleCatalog.js";

const TRANSLATIONS = {
  kjv: { sourceId: "eng-kjv2006", path: "eng-kjv2006", label: "KJV" },
  asv: { sourceId: "eng-asv", path: "asv", label: "ASV" },
  web: { sourceId: "engwebp", path: "engwebp", label: "WEB" },
};

const BOOK_CODES = {
  Gen: "GEN", Exod: "EXO", Lev: "LEV", Num: "NUM", Deut: "DEU",
  Josh: "JOS", Judg: "JDG", Ruth: "RUT", "1Sam": "1SA", "2Sam": "2SA",
  "1Kgs": "1KI", "2Kgs": "2KI", "1Chr": "1CH", "2Chr": "2CH", Ezra: "EZR",
  Neh: "NEH", Esth: "EST", Job: "JOB", Ps: "PSA", Prov: "PRO",
  Eccl: "ECC", Song: "SNG", Isa: "ISA", Jer: "JER", Lam: "LAM",
  Ezek: "EZK", Dan: "DAN", Hos: "HOS", Joel: "JOL", Amos: "AMO",
  Obad: "OBA", Jonah: "JON", Mic: "MIC", Nah: "NAM", Hab: "HAB",
  Zeph: "ZEP", Hag: "HAG", Zech: "ZEC", Mal: "MAL", Matt: "MAT",
  Mark: "MRK", Luke: "LUK", John: "JHN", Acts: "ACT", Rom: "ROM",
  "1Cor": "1CO", "2Cor": "2CO", Gal: "GAL", Eph: "EPH", Phil: "PHP",
  Col: "COL", "1Thess": "1TH", "2Thess": "2TH", "1Tim": "1TI", "2Tim": "2TI",
  Titus: "TIT", Phlm: "PHM", Heb: "HEB", Jas: "JAS", "1Pet": "1PE",
  "2Pet": "2PE", "1John": "1JN", "2John": "2JN", "3John": "3JN",
  Jude: "JUD", Rev: "REV",
};

const cache = new Map();
const CACHE_TTL_MS = 12 * 60 * 60 * 1000;

function sendJson(res, status, payload) {
  res.statusCode = status;
  res.setHeader("Content-Type", "application/json; charset=utf-8");
  res.setHeader("Cache-Control", status === 200 ? "public, max-age=3600, stale-while-revalidate=86400" : "no-store");
  res.end(JSON.stringify(payload));
}

function decodeEntities(value = "") {
  const named = {
    amp: "&", lt: "<", gt: ">", quot: '"', apos: "'",
    nbsp: " ", ndash: "–", mdash: "—", hellip: "…",
    lsquo: "‘", rsquo: "’", ldquo: "“", rdquo: "”",
  };

  return String(value)
    .replace(/&#x([0-9a-f]+);/gi, (_, hex) => String.fromCodePoint(parseInt(hex, 16)))
    .replace(/&#(\d+);/g, (_, num) => String.fromCodePoint(Number(num)))
    .replace(/&([a-z]+);/gi, (match, name) => named[name.toLowerCase()] ?? match);
}

function stripTags(value = "") {
  return decodeEntities(
    String(value)
      .replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, " ")
      .replace(/<style\b[^>]*>[\s\S]*?<\/style>/gi, " ")
      .replace(/<br\s*\/?>/gi, " ")
      .replace(/<[^>]+>/g, " ")
  )
    .replace(/\s+/g, " ")
    .trim();
}

function removeNotes(value = "") {
  // Remove the entire anchor before its nested popup spans.
  return String(value)
    .replace(/<a\b[^>]*(?:href=["']#(?:fn|note)|class=["'][^"']*(?:footnote|note|notemark|fn))[^>]*>[\s\S]*?<\/a>/gi, "")
    .replace(/<span\b[^>]*class=["'][^"']*\b(?:notemark|popup)\b[^"']*["'][^>]*>[\s\S]*?<\/span>/gi, "");
}

function markerCandidates(html) {
  const patterns = [
    /<(?:span|sup|a)\b[^>]*\bid=["']V(\d+)["'][^>]*>[\s\S]*?<\/(?:span|sup|a)>/gi,
    /<(?:span|sup)\b[^>]*\bclass=["'][^"']*\bverse\b[^"']*["'][^>]*>\s*(\d+)\s*(?:&nbsp;|&#160;)?\s*<\/(?:span|sup)>/gi,
    /<(?:span|sup)\b[^>]*\bclass=["'][^"']*\bv\b[^"']*["'][^>]*>\s*(\d+)\s*(?:&nbsp;|&#160;)?\s*<\/(?:span|sup)>/gi,
  ];

  for (const pattern of patterns) {
    const matches = [];
    let match;
    while ((match = pattern.exec(html))) {
      matches.push({
        verse: Number(match[1]),
        start: match.index,
        end: pattern.lastIndex,
      });
    }
    if (matches.length) return matches;
  }

  return [];
}

export function parseVerses(html) {
  // Semantic verse markers are required: numbers in navigation or prose
  // must never become Scripture. Remove page furniture before slicing.
  const content = String(html)
    .replace(/<head\b[^>]*>[\s\S]*?<\/head>/gi, "")
    .replace(/<(?:ul|nav)\b[^>]*>[\s\S]*?<\/(?:ul|nav)>/gi, "")
    .replace(/<(?:div|p)\b[^>]*(?:class=["'][^"']*\b(?:footnotes|copyright)\b|id=["']FN\d+)[\s\S]*$/i, "")
    .replace(/<footer\b[\s\S]*$/i, "")
    .replace(/<hr\b[\s\S]*$/i, "")
    .replace(/<(?:div|h[1-6])\b[^>]*class=["'][^"']*\b(?:s|s1|s2|ms|ms1|mr|sr|r|d)\b[^"']*["'][^>]*>[\s\S]*?<\/(?:div|h[1-6])>/gi, "");
  const markers = markerCandidates(content);
  return markers.map((marker, index) => ({
    verse: marker.verse,
    text: stripTags(removeNotes(content.slice(marker.end, markers[index + 1]?.start ?? content.length)))
      .replace(/^[\s\u00a0]*(?:¶|§)+\s*/u, "")
      .trim(),
  })).filter((item) => item.verse > 0 && item.text);
}

function chapterFilename(bookCode, chapter) {
  const width = bookCode === "PSA" ? 3 : 2;
  return `${bookCode}${String(chapter).padStart(width, "0")}.htm`;
}

async function fetchChapter(translationId, osis, chapter) {
  const translation = Object.hasOwn(TRANSLATIONS, translationId) ? TRANSLATIONS[translationId] : null;
  const book = BIBLE_BOOKS.find((item) => item.osis === osis);
  const bookCode = book && BOOK_CODES[osis];

  if (!translation || !bookCode || !Number.isInteger(chapter) || chapter < 1 || chapter > book.chapters) {
    const error = new Error("Invalid Bible chapter request.");
    error.statusCode = 400;
    throw error;
  }

  const cacheKey = `${translationId}:${osis}:${chapter}`;
  const cached = cache.get(cacheKey);
  if (cached && Date.now() - cached.at < CACHE_TTL_MS) return cached.value;

  const sourceUrl = `https://ebible.org/${translation.path}/${chapterFilename(bookCode, chapter)}`;
  const response = await fetch(sourceUrl, {
    headers: {
      Accept: "text/html,application/xhtml+xml",
      "User-Agent": "Jeremiah.app Bible Reader",
    },
    signal: AbortSignal.timeout(10000),
  });

  if (!response.ok) {
    const error = new Error(`eBible returned ${response.status} for ${translation.label} ${osis} ${chapter}.`);
    error.statusCode = response.status === 404 ? 404 : 502;
    throw error;
  }

  const html = await response.text();
  const verses = parseVerses(html);

  if (!verses.length) {
    const error = new Error("eBible chapter loaded, but the verse text could not be parsed.");
    error.statusCode = 502;
    throw error;
  }

  const value = {
    translation: translationId,
    source: "eBible.org",
    sourceId: translation.sourceId,
    book: osis,
    chapter,
    verses,
  };

  cache.set(cacheKey, { at: Date.now(), value });
  return value;
}

export async function handleBibleApi(req, res) {
  try {
    const host = req.headers?.host || "localhost";
    const url = new URL(req.url || "/", `http://${host}`);
    const translation = String(url.searchParams.get("translation") || "kjv").toLowerCase();
    const book = String(url.searchParams.get("book") || "");
    const chapter = Number(url.searchParams.get("chapter"));

    const payload = await fetchChapter(translation, book, chapter);
    sendJson(res, 200, payload);
  } catch (error) {
    sendJson(res, error?.statusCode || 500, {
      error: error?.message || "Bible chapter could not be loaded.",
    });
  }
}

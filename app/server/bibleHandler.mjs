const TRANSLATIONS = {
  kjv: { sourceId: "eng-kjv2006", label: "KJV" },
  asv: { sourceId: "asv", label: "ASV" },
  web: { sourceId: "engwebp", label: "WEB" },
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
  return String(value)
    .replace(/<[^>]+class=["'][^"']*(?:footnote|note|notemark|fn)[^"']*["'][^>]*>[\s\S]*?<\/[^>]+>/gi, " ")
    .replace(/<a\b[^>]*(?:href=["']#(?:fn|note)|class=["'][^"']*(?:footnote|note|notemark|fn))[^>]*>[\s\S]*?<\/a>/gi, " ");
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
    if (matches.length >= 2) return matches;
  }

  return [];
}

function parseVerses(html) {
  const markers = markerCandidates(html);

  if (markers.length) {
    return markers
      .map((marker, index) => {
        const next = markers[index + 1];
        const raw = html.slice(marker.end, next ? next.start : html.length);
        const text = stripTags(removeNotes(raw))
          .replace(/^[\s\u00a0]*(?:¶|§)+\s*/u, "")
          .trim();
        return { verse: marker.verse, text };
      })
      .filter((item) => item.verse > 0 && item.text);
  }

  // Defensive fallback for any eBible HTML variant that omits semantic verse spans.
  const body = stripTags(
    String(html)
      .replace(/<head\b[^>]*>[\s\S]*?<\/head>/gi, " ")
      .replace(/<nav\b[^>]*>[\s\S]*?<\/nav>/gi, " ")
      .replace(/<footer\b[^>]*>[\s\S]*?<\/footer>/gi, " ")
  );

  const hits = [];
  const versePattern = /(?:^|\s)(\d{1,3})[\s\u00a0]+(?=\S)/g;
  let match;
  while ((match = versePattern.exec(body))) {
    hits.push({ verse: Number(match[1]), start: match.index + match[0].length });
  }

  return hits
    .map((hit, index) => {
      const next = hits[index + 1];
      const text = body
        .slice(hit.start, next ? next.start - String(next.verse).length - 1 : body.length)
        .replace(/\s+/g, " ")
        .trim();
      return { verse: hit.verse, text };
    })
    .filter((item, index, list) => (
      item.verse > 0 &&
      item.text &&
      (index === 0 || item.verse > list[index - 1].verse)
    ));
}

function chapterFilename(bookCode, chapter) {
  const width = bookCode === "PSA" ? 3 : 2;
  return `${bookCode}${String(chapter).padStart(width, "0")}.htm`;
}

async function fetchChapter(translationId, osis, chapter) {
  const translation = TRANSLATIONS[translationId];
  const bookCode = BOOK_CODES[osis];

  if (!translation || !bookCode || !Number.isInteger(chapter) || chapter < 1 || chapter > 150) {
    const error = new Error("Invalid Bible chapter request.");
    error.statusCode = 400;
    throw error;
  }

  const cacheKey = `${translationId}:${osis}:${chapter}`;
  const cached = cache.get(cacheKey);
  if (cached && Date.now() - cached.at < CACHE_TTL_MS) return cached.value;

  const sourceUrl = `https://ebible.org/${translation.sourceId}/${chapterFilename(bookCode, chapter)}`;
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

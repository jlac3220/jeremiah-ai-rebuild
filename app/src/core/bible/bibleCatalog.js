export const DEFAULT_BIBLE_TRANSLATION = "kjv";

export const BIBLE_TRANSLATIONS = [
  {
    "id": "kjv",
    "shortName": "KJV",
    "name": "King James Version",
    "year": 1769,
    "language": "English",
    "license": "Public domain",
    "editionNote": "Standard 1769 text",
    "sourceLabel": "midvash/bible-data",
    "sourcePath": "versions/en/kjv"
  },
  {
    "id": "asv",
    "shortName": "ASV",
    "name": "American Standard Version",
    "year": 1901,
    "language": "English",
    "license": "Public domain",
    "editionNote": "1901 American Standard Version",
    "sourceLabel": "midvash/bible-data",
    "sourcePath": "versions/en/asv"
  },
  {
    "id": "web",
    "shortName": "WEB",
    "name": "World English Bible",
    "year": 2000,
    "language": "English",
    "license": "Public domain",
    "editionNote": "Modern public-domain English",
    "sourceLabel": "midvash/bible-data",
    "sourcePath": "versions/en/web"
  }
];

export const BIBLE_BOOKS = [
  {
    "osis": "Gen",
    "name": "Genesis",
    "chapters": 50,
    "aliases": [
      "Ge",
      "Gn"
    ],
    "bookId": 1,
    "testament": "OT"
  },
  {
    "osis": "Exod",
    "name": "Exodus",
    "chapters": 40,
    "aliases": [
      "Ex"
    ],
    "bookId": 2,
    "testament": "OT"
  },
  {
    "osis": "Lev",
    "name": "Leviticus",
    "chapters": 27,
    "aliases": [
      "Le",
      "Lv"
    ],
    "bookId": 3,
    "testament": "OT"
  },
  {
    "osis": "Num",
    "name": "Numbers",
    "chapters": 36,
    "aliases": [
      "Nu",
      "Nm"
    ],
    "bookId": 4,
    "testament": "OT"
  },
  {
    "osis": "Deut",
    "name": "Deuteronomy",
    "chapters": 34,
    "aliases": [
      "Dt"
    ],
    "bookId": 5,
    "testament": "OT"
  },
  {
    "osis": "Josh",
    "name": "Joshua",
    "chapters": 24,
    "aliases": [
      "Jos"
    ],
    "bookId": 6,
    "testament": "OT"
  },
  {
    "osis": "Judg",
    "name": "Judges",
    "chapters": 21,
    "aliases": [
      "Jdg",
      "Jg"
    ],
    "bookId": 7,
    "testament": "OT"
  },
  {
    "osis": "Ruth",
    "name": "Ruth",
    "chapters": 4,
    "aliases": [
      "Ru"
    ],
    "bookId": 8,
    "testament": "OT"
  },
  {
    "osis": "1Sam",
    "name": "1 Samuel",
    "chapters": 31,
    "aliases": [
      "I Samuel",
      "1 Sam"
    ],
    "bookId": 9,
    "testament": "OT"
  },
  {
    "osis": "2Sam",
    "name": "2 Samuel",
    "chapters": 24,
    "aliases": [
      "II Samuel",
      "2 Sam"
    ],
    "bookId": 10,
    "testament": "OT"
  },
  {
    "osis": "1Kgs",
    "name": "1 Kings",
    "chapters": 22,
    "aliases": [
      "I Kings",
      "1 Kgs"
    ],
    "bookId": 11,
    "testament": "OT"
  },
  {
    "osis": "2Kgs",
    "name": "2 Kings",
    "chapters": 25,
    "aliases": [
      "II Kings",
      "2 Kgs"
    ],
    "bookId": 12,
    "testament": "OT"
  },
  {
    "osis": "1Chr",
    "name": "1 Chronicles",
    "chapters": 29,
    "aliases": [
      "I Chronicles",
      "1 Chron"
    ],
    "bookId": 13,
    "testament": "OT"
  },
  {
    "osis": "2Chr",
    "name": "2 Chronicles",
    "chapters": 36,
    "aliases": [
      "II Chronicles",
      "2 Chron"
    ],
    "bookId": 14,
    "testament": "OT"
  },
  {
    "osis": "Ezra",
    "name": "Ezra",
    "chapters": 10,
    "aliases": [],
    "bookId": 15,
    "testament": "OT"
  },
  {
    "osis": "Neh",
    "name": "Nehemiah",
    "chapters": 13,
    "aliases": [
      "Neh"
    ],
    "bookId": 16,
    "testament": "OT"
  },
  {
    "osis": "Esth",
    "name": "Esther",
    "chapters": 10,
    "aliases": [
      "Est"
    ],
    "bookId": 17,
    "testament": "OT"
  },
  {
    "osis": "Job",
    "name": "Job",
    "chapters": 42,
    "aliases": [],
    "bookId": 18,
    "testament": "OT"
  },
  {
    "osis": "Ps",
    "name": "Psalms",
    "chapters": 150,
    "aliases": [
      "Psalm",
      "Ps"
    ],
    "bookId": 19,
    "testament": "OT"
  },
  {
    "osis": "Prov",
    "name": "Proverbs",
    "chapters": 31,
    "aliases": [
      "Pr",
      "Prov"
    ],
    "bookId": 20,
    "testament": "OT"
  },
  {
    "osis": "Eccl",
    "name": "Ecclesiastes",
    "chapters": 12,
    "aliases": [
      "Eccl",
      "Ecc"
    ],
    "bookId": 21,
    "testament": "OT"
  },
  {
    "osis": "Song",
    "name": "Song of Solomon",
    "chapters": 8,
    "aliases": [
      "Song of Songs",
      "Canticles",
      "Song"
    ],
    "bookId": 22,
    "testament": "OT"
  },
  {
    "osis": "Isa",
    "name": "Isaiah",
    "chapters": 66,
    "aliases": [
      "Is"
    ],
    "bookId": 23,
    "testament": "OT"
  },
  {
    "osis": "Jer",
    "name": "Jeremiah",
    "chapters": 52,
    "aliases": [
      "Je",
      "Jer"
    ],
    "bookId": 24,
    "testament": "OT"
  },
  {
    "osis": "Lam",
    "name": "Lamentations",
    "chapters": 5,
    "aliases": [
      "La"
    ],
    "bookId": 25,
    "testament": "OT"
  },
  {
    "osis": "Ezek",
    "name": "Ezekiel",
    "chapters": 48,
    "aliases": [
      "Eze",
      "Ez"
    ],
    "bookId": 26,
    "testament": "OT"
  },
  {
    "osis": "Dan",
    "name": "Daniel",
    "chapters": 12,
    "aliases": [
      "Da",
      "Dn"
    ],
    "bookId": 27,
    "testament": "OT"
  },
  {
    "osis": "Hos",
    "name": "Hosea",
    "chapters": 14,
    "aliases": [
      "Ho"
    ],
    "bookId": 28,
    "testament": "OT"
  },
  {
    "osis": "Joel",
    "name": "Joel",
    "chapters": 3,
    "aliases": [
      "Joe"
    ],
    "bookId": 29,
    "testament": "OT"
  },
  {
    "osis": "Amos",
    "name": "Amos",
    "chapters": 9,
    "aliases": [
      "Am"
    ],
    "bookId": 30,
    "testament": "OT"
  },
  {
    "osis": "Obad",
    "name": "Obadiah",
    "chapters": 1,
    "aliases": [
      "Ob"
    ],
    "bookId": 31,
    "testament": "OT"
  },
  {
    "osis": "Jonah",
    "name": "Jonah",
    "chapters": 4,
    "aliases": [
      "Jon"
    ],
    "bookId": 32,
    "testament": "OT"
  },
  {
    "osis": "Mic",
    "name": "Micah",
    "chapters": 7,
    "aliases": [
      "Mic"
    ],
    "bookId": 33,
    "testament": "OT"
  },
  {
    "osis": "Nah",
    "name": "Nahum",
    "chapters": 3,
    "aliases": [
      "Na"
    ],
    "bookId": 34,
    "testament": "OT"
  },
  {
    "osis": "Hab",
    "name": "Habakkuk",
    "chapters": 3,
    "aliases": [
      "Hab"
    ],
    "bookId": 35,
    "testament": "OT"
  },
  {
    "osis": "Zeph",
    "name": "Zephaniah",
    "chapters": 3,
    "aliases": [
      "Zep"
    ],
    "bookId": 36,
    "testament": "OT"
  },
  {
    "osis": "Hag",
    "name": "Haggai",
    "chapters": 2,
    "aliases": [
      "Hag"
    ],
    "bookId": 37,
    "testament": "OT"
  },
  {
    "osis": "Zech",
    "name": "Zechariah",
    "chapters": 14,
    "aliases": [
      "Zec"
    ],
    "bookId": 38,
    "testament": "OT"
  },
  {
    "osis": "Mal",
    "name": "Malachi",
    "chapters": 4,
    "aliases": [
      "Mal"
    ],
    "bookId": 39,
    "testament": "OT"
  },
  {
    "osis": "Matt",
    "name": "Matthew",
    "chapters": 28,
    "aliases": [
      "Mt"
    ],
    "bookId": 40,
    "testament": "NT"
  },
  {
    "osis": "Mark",
    "name": "Mark",
    "chapters": 16,
    "aliases": [
      "Mrk",
      "Mk"
    ],
    "bookId": 41,
    "testament": "NT"
  },
  {
    "osis": "Luke",
    "name": "Luke",
    "chapters": 24,
    "aliases": [
      "Lk"
    ],
    "bookId": 42,
    "testament": "NT"
  },
  {
    "osis": "John",
    "name": "John",
    "chapters": 21,
    "aliases": [
      "Jn"
    ],
    "bookId": 43,
    "testament": "NT"
  },
  {
    "osis": "Acts",
    "name": "Acts",
    "chapters": 28,
    "aliases": [
      "Ac"
    ],
    "bookId": 44,
    "testament": "NT"
  },
  {
    "osis": "Rom",
    "name": "Romans",
    "chapters": 16,
    "aliases": [
      "Ro",
      "Rm"
    ],
    "bookId": 45,
    "testament": "NT"
  },
  {
    "osis": "1Cor",
    "name": "1 Corinthians",
    "chapters": 16,
    "aliases": [
      "I Corinthians",
      "1 Cor"
    ],
    "bookId": 46,
    "testament": "NT"
  },
  {
    "osis": "2Cor",
    "name": "2 Corinthians",
    "chapters": 13,
    "aliases": [
      "II Corinthians",
      "2 Cor"
    ],
    "bookId": 47,
    "testament": "NT"
  },
  {
    "osis": "Gal",
    "name": "Galatians",
    "chapters": 6,
    "aliases": [
      "Ga"
    ],
    "bookId": 48,
    "testament": "NT"
  },
  {
    "osis": "Eph",
    "name": "Ephesians",
    "chapters": 6,
    "aliases": [
      "Eph"
    ],
    "bookId": 49,
    "testament": "NT"
  },
  {
    "osis": "Phil",
    "name": "Philippians",
    "chapters": 4,
    "aliases": [
      "Php",
      "Phil"
    ],
    "bookId": 50,
    "testament": "NT"
  },
  {
    "osis": "Col",
    "name": "Colossians",
    "chapters": 4,
    "aliases": [
      "Col"
    ],
    "bookId": 51,
    "testament": "NT"
  },
  {
    "osis": "1Thess",
    "name": "1 Thessalonians",
    "chapters": 5,
    "aliases": [
      "I Thessalonians",
      "1 Thess"
    ],
    "bookId": 52,
    "testament": "NT"
  },
  {
    "osis": "2Thess",
    "name": "2 Thessalonians",
    "chapters": 3,
    "aliases": [
      "II Thessalonians",
      "2 Thess"
    ],
    "bookId": 53,
    "testament": "NT"
  },
  {
    "osis": "1Tim",
    "name": "1 Timothy",
    "chapters": 6,
    "aliases": [
      "I Timothy",
      "1 Tim"
    ],
    "bookId": 54,
    "testament": "NT"
  },
  {
    "osis": "2Tim",
    "name": "2 Timothy",
    "chapters": 4,
    "aliases": [
      "II Timothy",
      "2 Tim"
    ],
    "bookId": 55,
    "testament": "NT"
  },
  {
    "osis": "Titus",
    "name": "Titus",
    "chapters": 3,
    "aliases": [
      "Tit"
    ],
    "bookId": 56,
    "testament": "NT"
  },
  {
    "osis": "Phlm",
    "name": "Philemon",
    "chapters": 1,
    "aliases": [
      "Phm"
    ],
    "bookId": 57,
    "testament": "NT"
  },
  {
    "osis": "Heb",
    "name": "Hebrews",
    "chapters": 13,
    "aliases": [
      "Heb"
    ],
    "bookId": 58,
    "testament": "NT"
  },
  {
    "osis": "Jas",
    "name": "James",
    "chapters": 5,
    "aliases": [
      "Jas",
      "Jm"
    ],
    "bookId": 59,
    "testament": "NT"
  },
  {
    "osis": "1Pet",
    "name": "1 Peter",
    "chapters": 5,
    "aliases": [
      "I Peter",
      "1 Pet"
    ],
    "bookId": 60,
    "testament": "NT"
  },
  {
    "osis": "2Pet",
    "name": "2 Peter",
    "chapters": 3,
    "aliases": [
      "II Peter",
      "2 Pet"
    ],
    "bookId": 61,
    "testament": "NT"
  },
  {
    "osis": "1John",
    "name": "1 John",
    "chapters": 5,
    "aliases": [
      "I John",
      "1 Jn"
    ],
    "bookId": 62,
    "testament": "NT"
  },
  {
    "osis": "2John",
    "name": "2 John",
    "chapters": 1,
    "aliases": [
      "II John",
      "2 Jn"
    ],
    "bookId": 63,
    "testament": "NT"
  },
  {
    "osis": "3John",
    "name": "3 John",
    "chapters": 1,
    "aliases": [
      "III John",
      "3 Jn"
    ],
    "bookId": 64,
    "testament": "NT"
  },
  {
    "osis": "Jude",
    "name": "Jude",
    "chapters": 1,
    "aliases": [
      "Jud"
    ],
    "bookId": 65,
    "testament": "NT"
  },
  {
    "osis": "Rev",
    "name": "Revelation",
    "chapters": 22,
    "aliases": [
      "Revelations",
      "Rev",
      "Apocalypse"
    ],
    "bookId": 66,
    "testament": "NT"
  }
];

const bookCache = new Map();
const CACHE_NAME = "jeremiah-bible-books-v2";
const RAW_BASE = "https://raw.githubusercontent.com/midvash/bible-data/main/";
const CDN_BASE = "https://cdn.jsdelivr.net/gh/midvash/bible-data@main/";

export function normalizeBibleBookName(value = "") {
  return String(value)
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]/g, "");
}

export function getBibleTranslation(id) {
  return (
    BIBLE_TRANSLATIONS.find((item) => item.id === id) ||
    BIBLE_TRANSLATIONS.find((item) => item.id === DEFAULT_BIBLE_TRANSLATION)
  );
}

export function findBibleBook(value) {
  const target = normalizeBibleBookName(value);
  if (!target) return BIBLE_BOOKS[0];

  return (
    BIBLE_BOOKS.find((book) => {
      const names = [book.name, book.osis, ...(book.aliases || [])];
      return names.some((name) => normalizeBibleBookName(name) === target);
    }) || BIBLE_BOOKS[0]
  );
}

function sourceUrls(translation, book) {
  const suffix = translation.sourcePath + "/books/" + book.osis + ".json";
  return [RAW_BASE + suffix, CDN_BASE + suffix];
}

async function readCached(url) {
  if (typeof window === "undefined" || !("caches" in window)) return null;
  try {
    const cache = await window.caches.open(CACHE_NAME);
    const response = await cache.match(url);
    return response || null;
  } catch {
    return null;
  }
}

async function storeCached(url, response) {
  if (typeof window === "undefined" || !("caches" in window)) return;
  try {
    const cache = await window.caches.open(CACHE_NAME);
    await cache.put(url, response.clone());
  } catch {
    // Cache support is optional. A successful network response still wins.
  }
}

export async function loadBibleBook(translationId, bookLike) {
  const translation = getBibleTranslation(translationId);
  const book = typeof bookLike === "string" ? findBibleBook(bookLike) : bookLike;
  const cacheKey = translation.id + ":" + book.osis;

  if (bookCache.has(cacheKey)) return bookCache.get(cacheKey);

  const urls = sourceUrls(translation, book);
  let lastError = null;

  for (const url of urls) {
    try {
      const cached = await readCached(url);
      const response = cached || (await fetch(url, { cache: "force-cache" }));
      if (!response.ok) {
        throw new Error("Bible source returned " + response.status + ".");
      }

      if (!cached) await storeCached(url, response);
      const data = await response.json();

      if (!Array.isArray(data?.chapters) || Number(data?.bookId) !== book.bookId) {
        throw new Error("Bible source returned an unexpected book shape.");
      }

      bookCache.set(cacheKey, data);
      return data;
    } catch (error) {
      lastError = error;
    }
  }

  throw new Error(
    "Could not load " + translation.shortName + " " + book.name + ". " +
    (lastError?.message || "Check the connection and try again.")
  );
}

export function getChapterVerses(bookData, chapterNumber) {
  const chapter = bookData?.chapters?.find(
    (item) => Number(item.chapter) === Number(chapterNumber)
  );

  return (chapter?.verses || []).map((verse) => ({
    verse: Number(verse.number),
    text: String(verse.text || ""),
  }));
}

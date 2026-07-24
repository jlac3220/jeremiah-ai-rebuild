// src/LessonDetailPage.js — Supabase details + milestones + slide-in panels + Bible Reader
// Quiz requires 70% to pass, text-based answers with auto-shuffle
import React, { useState, useMemo, useEffect, useRef } from "react";
import { createPortal } from "react-dom";

import PageHeader from "./PageHeader";
import { supabase } from "./supabaseClient";
import { theme as THEME } from "./theme";
import BibleReaderModal from "./BibleReaderModal";
import { Z_INDEX } from "./zIndex";

const theme = THEME || {};
const colors = theme.colors || {};
const gradients = theme.gradients || {};
const typography = theme.typography || {};
const roles = typography.roles || {};
const lineHeights = typography.lineHeights || { relaxed: "1.6" };

const STORAGE_KEY = "ignite_lesson_progress";
const PASS_THRESHOLD = 0.7;

const DETAIL_TABLE_MAP = {
  NB: "Lesson Details",
  OG: "Lesson_Detail_OG",
  PS: "Lesson_Detail_PS",
};

function loadProgressFromStorage() {
  if (typeof window === "undefined") return {};
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return {};
    return JSON.parse(raw) || {};
  } catch {
    return {};
  }
}

function saveProgressToStorage(progressObj) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(progressObj));
  } catch {}
}

function cleanBookKey(s = "") {
  return String(s).toLowerCase().replace(/\./g, "").replace(/\s+/g, " ").trim();
}

function parseNameField(name = "") {
  const raw = String(name).trim();
  const m = raw.match(/^(.*)\s+(\d+):(\d+)$/);
  if (!m) return null;
  return {
    book: m[1].trim(),
    chapter: parseInt(m[2], 10),
    verse: parseInt(m[3], 10),
  };
}

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
  "2tm":"2 Timothy",tt:"Titus",phm:"Philemon",hb2:"Hebrews",jm:"James",
  "1pe":"1 Peter","2pe":"2 Peter","1jo":"1 John","2jo":"2 John","3jo":"3 John",
  jd:"Jude",rv:"Revelation",
  // common alternates
  jon:"Jonah",jas:"James",heb:"Hebrews",rev:"Revelation",
};

function buildBibleIndexFromJson(data) {
  // Format 1: { books: [{ name, chapters: [{ chapter, verses: [{ verse, text }] }] }] }
  if (data?.books?.length && data.books[0]?.name) {
    const idx = {};
    for (const b of data.books) {
      const bk = b?.name;
      if (!bk) continue;
      const key = cleanBookKey(bk);
      idx[key] = idx[key] || { __display: bk, chapters: {} };
      for (const ch of b.chapters || []) {
        const chNum = ch.chapter;
        if (!chNum) continue;
        idx[key].chapters[chNum] = idx[key].chapters[chNum] || {};
        for (const v of ch.verses || []) {
          if (!v?.verse) continue;
          idx[key].chapters[chNum][v.verse] = v.text || "";
        }
      }
    }
    return idx;
  }

  // Format 2: [{ abbrev, chapters: [["verse1text","verse2text",...], ...] }]
  if (Array.isArray(data) && data[0]?.abbrev && Array.isArray(data[0]?.chapters)) {
    const idx = {};
    for (const b of data) {
      const name = ABBREV_TO_NAME[b.abbrev] || b.abbrev;
      const key = cleanBookKey(name);
      idx[key] = idx[key] || { __display: name, chapters: {} };
      (b.chapters || []).forEach((chVerses, chIdx) => {
        const chNum = chIdx + 1;
        idx[key].chapters[chNum] = {};
        (chVerses || []).forEach((text, vIdx) => {
          idx[key].chapters[chNum][vIdx + 1] = text;
        });
      });
    }
    return idx;
  }

  // Format 3: flat array of { book, chapter, verse, text } or { name, text }
  const list = Array.isArray(data)
    ? data
    : Array.isArray(data?.verses)
    ? data.verses
    : Array.isArray(data?.kjv)
    ? data.kjv
    : [];

  const idx = {};
  for (const row of list) {
    const parsed = row?.name ? parseNameField(row.name) : null;
    const book = row?.book || parsed?.book;
    const chapter = Number(row?.chapter || parsed?.chapter);
    const verse = Number(row?.verse || parsed?.verse);
    const text = row?.text ?? row?.t ?? row?.verse_text ?? "";
    if (!book || !chapter || !verse) continue;

    const key = cleanBookKey(book);
    if (!idx[key]) idx[key] = { __display: book, chapters: {} };
    if (!idx[key].chapters[chapter]) idx[key].chapters[chapter] = {};
    idx[key].chapters[chapter][verse] = String(text);
  }
  return idx;
}

function toRomanPrefix(bookName = "") {
  const m = String(bookName)
    .trim()
    .match(/^([1-3])\s+(.*)$/);
  if (!m) return bookName;
  const n = m[1];
  const rest = m[2];
  const roman = n === "1" ? "I" : n === "2" ? "II" : "III";
  return `${roman} ${rest}`;
}

function toArabicPrefix(bookName = "") {
  const m = String(bookName)
    .trim()
    .match(/^(I|II|III)\s+(.*)$/i);
  if (!m) return bookName;
  const roman = m[1].toUpperCase();
  const rest = m[2];
  const n = roman === "I" ? "1" : roman === "II" ? "2" : "3";
  return `${n} ${rest}`;
}

function resolveBookKey(name, bibleIndex) {
  if (!name || !bibleIndex) return null;

  const tryNames = [
    name,
    toRomanPrefix(name),
    toArabicPrefix(name),
    name.replace(/^1\s+Corinthians/i, "I Corinthians"),
    name.replace(/^2\s+Corinthians/i, "II Corinthians"),
    name.replace(/^1\s+Samuel/i, "I Samuel"),
    name.replace(/^2\s+Samuel/i, "II Samuel"),
    name.replace(/^1\s+Kings/i, "I Kings"),
    name.replace(/^2\s+Kings/i, "II Kings"),
    name.replace(/^1\s+Chronicles/i, "I Chronicles"),
    name.replace(/^2\s+Chronicles/i, "II Chronicles"),
  ];

  for (const nm of tryNames) {
    const key = cleanBookKey(nm);
    if (bibleIndex[key])
      return { key, display: bibleIndex[key].__display || nm };
  }

  const wanted = cleanBookKey(name);
  const keys = Object.keys(bibleIndex);
  const found =
    keys.find((k) => k === wanted) ||
    keys.find((k) => k.includes(wanted) || wanted.includes(k));

  if (found)
    return { key: found, display: bibleIndex[found].__display || name };
  return null;
}

function normalizeDashes(s = "") {
  return String(s).replace(/\u2013|\u2014/g, "-");
}

function splitRefs(refString = "") {
  return normalizeDashes(refString)
    .split(/[;,]/g)
    .map((s) => s.trim())
    .filter(Boolean);
}

function parseRefToken(token) {
  const t = normalizeDashes(token).trim();

  let m = t.match(/^(.*)\s+(\d+):(\d+)\s*-\s*(\d+)$/);
  if (m)
    return {
      label: t,
      book: m[1].trim(),
      chapterStart: parseInt(m[2], 10),
      chapterEnd: parseInt(m[2], 10),
      verseStart: parseInt(m[3], 10),
      verseEnd: parseInt(m[4], 10),
    };

  m = t.match(/^(.*)\s+(\d+):(\d+)$/);
  if (m)
    return {
      label: t,
      book: m[1].trim(),
      chapterStart: parseInt(m[2], 10),
      chapterEnd: parseInt(m[2], 10),
      verseStart: parseInt(m[3], 10),
      verseEnd: parseInt(m[3], 10),
    };

  m = t.match(/^(.*)\s+(\d+)\s*-\s*(\d+)$/);
  if (m)
    return {
      label: t,
      book: m[1].trim(),
      chapterStart: parseInt(m[2], 10),
      chapterEnd: parseInt(m[3], 10),
      verseStart: null,
      verseEnd: null,
    };

  m = t.match(/^(.*)\s+(\d+)$/);
  if (m)
    return {
      label: t,
      book: m[1].trim(),
      chapterStart: parseInt(m[2], 10),
      chapterEnd: parseInt(m[2], 10),
      verseStart: null,
      verseEnd: null,
    };

  return null;
}

function buildPassageList(refString = "") {
  const tokens = splitRefs(refString);
  const parsed = tokens.map(parseRefToken).filter(Boolean);
  const seen = new Set();
  const out = [];
  for (const p of parsed) {
    const key = `${p.book}|${p.chapterStart}|${p.chapterEnd}|${
      p.verseStart ?? ""
    }|${p.verseEnd ?? ""}`;
    if (seen.has(key)) continue;
    seen.add(key);
    out.push(p);
  }
  return out;
}

function getVersesForChapter(bibleIndex, bookKey, chapterNumber) {
  const chapterMap = bibleIndex?.[bookKey]?.chapters?.[chapterNumber] || {};
  const verseNums = Object.keys(chapterMap)
    .map((n) => Number(n))
    .filter(Boolean)
    .sort((a, b) => a - b);
  return verseNums.map((v) => ({ verse: v, text: chapterMap[v] }));
}

function getVersesForRef(bibleIndex, ref) {
  const resolved = resolveBookKey(ref.book, bibleIndex);
  if (!resolved)
    return { ok: false, error: `No verses found for "${ref.book}".` };

  const { key: bookKey } = resolved;

  const blocks = [];
  for (let ch = ref.chapterStart; ch <= ref.chapterEnd; ch++) {
    const verses = getVersesForChapter(bibleIndex, bookKey, ch);
    if (!verses.length) continue;

    if (ref.verseStart != null && ref.verseEnd != null) {
      const sliced = verses.filter(
        (v) => v.verse >= ref.verseStart && v.verse <= ref.verseEnd
      );
      blocks.push({ chapter: ch, verses: sliced });
    } else {
      blocks.push({ chapter: ch, verses });
    }
  }

  if (!blocks.length)
    return { ok: false, error: `No verses found for "${ref.label}".` };
  return { ok: true, resolvedBook: resolved.display, blocks };
}

function shuffleArray(arr) {
  const shuffled = [...arr];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

function isLetterAnswer(answer) {
  const trimmed = String(answer || "")
    .trim()
    .toUpperCase();
  return /^[A-D]$/.test(trimmed);
}

function letterToIndex(letter) {
  const l = String(letter || "")
    .trim()
    .toUpperCase();
  if (!l) return null;
  const c = l.charCodeAt(0);
  if (c < 65 || c > 68) return null;
  return c - 65;
}

function findCorrectIndexByText(choices, correctText) {
  const normalizedCorrect = String(correctText || "")
    .trim()
    .toLowerCase();
  for (let i = 0; i < choices.length; i++) {
    if (
      String(choices[i] || "")
        .trim()
        .toLowerCase() === normalizedCorrect
    )
      return i;
  }
  return null;
}

function parseQuizItems(raw = "") {
  const text = String(raw || "").trim();
  if (!text) return [];
  const blocks = text
    .split("||")
    .map((b) => b.trim())
    .filter(Boolean);

  const out = [];
  let n = 1;

  for (const block of blocks) {
    const lines = block
      .split("\n")
      .map((l) => l.trim())
      .filter(Boolean);

    const isMultiline =
      lines.length > 1 && lines.slice(1).some((l) => l.startsWith("|"));

    if (isMultiline) {
      const first = lines[0];
      const [typeRaw, ...qParts] = first.split("|");
      const type = String(typeRaw || "")
        .trim()
        .toUpperCase();
      const question = qParts.join("|").trim();

      const fields = lines
        .slice(1)
        .map((l) => (l.startsWith("|") ? l.slice(1) : l))
        .map((s) => String(s));

      if (type === "MC") {
        const A = (fields[0] ?? "").trim();
        const B = (fields[1] ?? "").trim();
        const C = (fields[2] ?? "").trim();
        const D = (fields[3] ?? "").trim();
        const correctField = (fields[4] ?? "").trim();
        const explanation = (fields[5] ?? "").trim();

        let choices = [A, B, C, D].filter(Boolean);
        let correctIndex;

        if (isLetterAnswer(correctField)) {
          const originalIndex = letterToIndex(correctField);
          const correctText = choices[originalIndex];
          choices = shuffleArray(choices);
          correctIndex = findCorrectIndexByText(choices, correctText);
        } else {
          choices = shuffleArray(choices);
          correctIndex = findCorrectIndexByText(choices, correctField);
        }

        if (!question || choices.length < 2 || correctIndex == null) continue;

        out.push({
          id: `q${n++}`,
          type: "MC",
          question,
          choices,
          correctIndex,
          explanation,
        });
        continue;
      }

      if (type === "TF") {
        const correctTF = (fields[0] ?? "").trim().toUpperCase();
        const explanation = (fields[1] ?? "").trim();
        const correctIndex =
          correctTF === "T" ? 0 : correctTF === "F" ? 1 : null;
        if (!question || correctIndex == null) continue;

        out.push({
          id: `q${n++}`,
          type: "TF",
          question,
          choices: ["True", "False"],
          correctIndex,
          explanation,
        });
        continue;
      }

      continue;
    }

    const parts = block.split("|");
    const type = String(parts[0] || "")
      .trim()
      .toUpperCase();

    if (type === "MC") {
      const question = String(parts[1] || "").trim();
      const A = String(parts[2] ?? "").trim();
      const B = String(parts[3] ?? "").trim();
      const C = String(parts[4] ?? "").trim();
      const D = String(parts[5] ?? "").trim();
      const correctField = String(parts[6] ?? "").trim();
      const explanation = String(parts[7] ?? "").trim();

      let choices = [A, B, C, D].filter(Boolean);
      let correctIndex;

      if (isLetterAnswer(correctField)) {
        const originalIndex = letterToIndex(correctField);
        const correctText = choices[originalIndex];
        choices = shuffleArray(choices);
        correctIndex = findCorrectIndexByText(choices, correctText);
      } else {
        choices = shuffleArray(choices);
        correctIndex = findCorrectIndexByText(choices, correctField);
      }

      if (!question || choices.length < 2 || correctIndex == null) continue;

      out.push({
        id: `q${n++}`,
        type: "MC",
        question,
        choices,
        correctIndex,
        explanation,
      });
      continue;
    }

    if (type === "TF") {
      const question = String(parts[1] || "").trim();
      const correctTF = String(parts[2] || "")
        .trim()
        .toUpperCase();
      const explanation = String(parts[3] || "").trim();
      const correctIndex = correctTF === "T" ? 0 : correctTF === "F" ? 1 : null;
      if (!question || correctIndex == null) continue;

      out.push({
        id: `q${n++}`,
        type: "TF",
        question,
        choices: ["True", "False"],
        correctIndex,
        explanation,
      });
      continue;
    }
  }

  return out;
}

export default function LessonDetailPage({
  studyId,
  lesson,
  onBack,
  backLabel,
  lessonProgress,
  onUpdateLessonProgress,
  onShowProfile,
  onShowAccount,
  profileImageUrl,
}) {
  const [detail, setDetail] = useState(null);
  const [loadingDetail, setLoadingDetail] = useState(true);
  const [activePanel, setActivePanel] = useState(null);

  const [bibleIndex, setBibleIndex] = useState(null);
  const [bibleLoading, setBibleLoading] = useState(false);
  const [bibleError, setBibleError] = useState(null);

  // Open + read dropdown state
  const [openRefKey, setOpenRefKey] = useState(null);

  // Bible Reader Modal state
  const [readerOpen, setReaderOpen] = useState(false);
  const [readerBook, setReaderBook] = useState("");
  const [readerChapter, setReaderChapter] = useState(1);
  const [readerHighlight, setReaderHighlight] = useState(null);

  const [quizState, setQuizState] = useState({
    index: 0,
    selectedIndex: null,
    submitted: false,
    score: 0,
    answered: 0,
    finished: false,
    passed: false,
  });
  const [parsedQuizItems, setParsedQuizItems] = useState([]);

  const [showExpandedList, setShowExpandedList] = useState(false);

  const effectiveStudyId = lesson ? (studyId || lesson.study_id || null) : null;
  const detailTable = DETAIL_TABLE_MAP[effectiveStudyId] || "Lesson Details";
  const lessonId = lesson?.lesson_id || null;

  useEffect(() => {
    if (!lessonId) {
      setLoadingDetail(false);
      setDetail(null);
      return;
    }

    let active = true;

    async function fetchDetail() {
      setLoadingDetail(true);
      const { data, error } = await supabase
        .from(detailTable)
        .select("*")
        .eq("lesson_id", lessonId)
        .maybeSingle();

      if (!active) return;

      if (error) {
        console.error("Error fetching lesson detail:", error);
        setDetail(null);
      } else {
        setDetail(data);
      }
      setLoadingDetail(false);
    }

    fetchDetail();
    return () => {
      active = false;
    };
  }, [lessonId, detailTable]);

  useEffect(() => {
    let active = true;

    async function loadBible() {
      if (activePanel !== "scriptures") return;
      if (bibleIndex) return;

      setBibleLoading(true);
      setBibleError(null);

      try {
        const res = await fetch("/kjv.json");
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = await res.json();
        const idx = buildBibleIndexFromJson(data);
        if (!active) return;
        setBibleIndex(idx);
      } catch (e) {
        console.error("Error loading KJV JSON:", e);
        if (!active) return;
        setBibleError(
          'Could not load Bible text. Make sure "kjv.json" is in /public.'
        );
      } finally {
        if (!active) return;
        setBibleLoading(false);
      }
    }

    loadBible();
    return () => {
      active = false;
    };
  }, [activePanel, bibleIndex]);

  const initialProgress = useMemo(() => {
    if (!effectiveStudyId || !lessonId) return lessonProgress || {};
    const all = loadProgressFromStorage();
    const studyMap = all[effectiveStudyId] || {};
    return studyMap[lessonId] || lessonProgress || {};
  }, [effectiveStudyId, lessonId, lessonProgress]);

  const initiallyComplete = !!initialProgress.isComplete;

  const [readingDone, setReadingDone] = useState(
    initialProgress.readingDone ?? initiallyComplete
  );
  const [scripturesDone, setScripturesDone] = useState(
    initialProgress.scripturesDone ?? initiallyComplete
  );
  const [quizPassed, setQuizPassed] = useState(
    initialProgress.quizPassed ?? initiallyComplete
  );
  const [isComplete, setIsComplete] = useState(initiallyComplete);

  // ============ WRITE started:true IMMEDIATELY ON MOUNT ============
  // This ensures the progress record exists as soon as the lesson opens,
  // so the lessons list shows 25% right away instead of 0%.
  useEffect(() => {
    if (!effectiveStudyId || !lessonId) return;
    if (initiallyComplete) return;

    const all = loadProgressFromStorage();
    const studyMap = all[effectiveStudyId] || {};
    const existing = studyMap[lessonId] || {};

    if (existing.started) return;

    const updated = { ...existing, started: true };
    const nextAll = {
      ...all,
      [effectiveStudyId]: { ...studyMap, [lessonId]: updated },
    };
    saveProgressToStorage(nextAll);

    if (typeof onUpdateLessonProgress === "function") {
      onUpdateLessonProgress(effectiveStudyId, lessonId, updated);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // mount only — intentionally no deps

  const completionPercent = useMemo(() => {
    if (isComplete) return 100;
    let count = 1; // started is always implicit
    if (scripturesDone) count += 1;
    if (readingDone) count += 1;
    if (quizPassed) count += 1;
    return (count / 4) * 100;
  }, [readingDone, scripturesDone, quizPassed, isComplete]);

  const allMilestonesDone = readingDone && scripturesDone && quizPassed;
  const quizLocked = !readingDone || !scripturesDone || isComplete;

  const prevProgressRef = useRef({
    readingDone,
    scripturesDone,
    quizPassed,
    isComplete,
  });

  useEffect(() => {
    if (!effectiveStudyId || !lessonId) return;

    const prev = prevProgressRef.current;
    if (
      prev.readingDone === readingDone &&
      prev.scripturesDone === scripturesDone &&
      prev.quizPassed === quizPassed &&
      prev.isComplete === isComplete
    ) {
      return;
    }

    prevProgressRef.current = {
      readingDone,
      scripturesDone,
      quizPassed,
      isComplete,
    };

    const shouldBeComplete = readingDone && scripturesDone && quizPassed;
    const all = loadProgressFromStorage();
    const studyMap = all[effectiveStudyId] || {};

    const updated = {
      ...(studyMap[lessonId] || {}),
      started: true,
      readingDone,
      scripturesDone,
      quizPassed,
      isComplete: isComplete || shouldBeComplete,
    };

    if (shouldBeComplete && !isComplete) setIsComplete(true);

    const nextAll = {
      ...all,
      [effectiveStudyId]: { ...studyMap, [lessonId]: updated },
    };

    saveProgressToStorage(nextAll);

    if (typeof onUpdateLessonProgress === "function") {
      onUpdateLessonProgress(effectiveStudyId, lessonId, updated);
    }
  }, [
    effectiveStudyId,
    lessonId,
    readingDone,
    scripturesDone,
    quizPassed,
    isComplete,
    onUpdateLessonProgress,
  ]);

  const handleOpenPanel = (panelId) => {
    if (isComplete) return;
    if (panelId === "quiz" && (!readingDone || !scripturesDone)) return;

    setActivePanel(panelId);

    if (panelId === "scriptures") {
      setOpenRefKey(null);
      setShowExpandedList(false);
    }

    if (panelId === "quiz") {
      const quizRaw = detail?.quiz_items || "";
      const items = parseQuizItems(quizRaw);
      setParsedQuizItems(items);
      setQuizState({
        index: 0,
        selectedIndex: null,
        submitted: false,
        score: 0,
        answered: 0,
        finished: false,
        passed: false,
      });
    }
  };

  const handleClosePanel = () => {
    setActivePanel(null);
    setOpenRefKey(null);
    setShowExpandedList(false);
  };

  const handleMarkPanelComplete = () => {
    if (!activePanel) return;
    if (activePanel === "reading") setReadingDone(true);
    if (activePanel === "scriptures") setScripturesDone(true);
    setActivePanel(null);
    setOpenRefKey(null);
    setShowExpandedList(false);
  };

  const handleMarkComplete = () => {
    if (effectiveStudyId && lessonId) {
      const all = loadProgressFromStorage();
      const studyMap = all[effectiveStudyId] || {};
      const updated = {
        ...(studyMap[lessonId] || {}),
        started: true,
        readingDone: true,
        scripturesDone: true,
        quizPassed: true,
        isComplete: true,
      };
      const nextAll = {
        ...all,
        [effectiveStudyId]: { ...studyMap, [lessonId]: updated },
      };
      saveProgressToStorage(nextAll);
      if (typeof onUpdateLessonProgress === "function") {
        onUpdateLessonProgress(effectiveStudyId, lessonId, updated);
      }
    }
    setReadingDone(true);
    setScripturesDone(true);
    setQuizPassed(true);
    setIsComplete(true);
    if (typeof onBack === "function") onBack();
  };

  // Open Bible Reader Modal
  const handleOpenReader = (bookName, chapter, highlightVerse = null) => {
    setReaderBook(bookName);
    setReaderChapter(chapter);
    setReaderHighlight(highlightVerse);
    setReaderOpen(true);
  };

  const overviewText = detail?.summary || lesson?.lesson_description || "";
  const commentaryText = detail?.commentary || "";

  const keyVersesRefString =
    detail?.key_verses ||
    detail?.scripture_list ||
    detail?.key_scriptures ||
    "";
  const expandedReadingRefString =
    detail?.expanded_reading || detail?.suggested_reading || "";

  const keyVerseItems = useMemo(
    () => buildPassageList(keyVersesRefString),
    [keyVersesRefString]
  );
  const expandedItems = useMemo(
    () => buildPassageList(expandedReadingRefString),
    [expandedReadingRefString]
  );

  const panelDone =
    activePanel === "reading"
      ? readingDone
      : activePanel === "scriptures"
      ? scripturesDone
      : activePanel === "quiz"
      ? quizPassed
      : false;

  const handlePickChoice = (idx) => {
    if (!parsedQuizItems[quizState.index]) return;
    if (quizState.submitted) return;
    setQuizState((s) => ({ ...s, selectedIndex: idx }));
  };

  const handleSubmitAnswer = () => {
    const currentQuiz = parsedQuizItems[quizState.index] || null;
    if (!currentQuiz) return;
    if (quizState.selectedIndex == null) return;
    if (quizState.submitted) return;
    if (currentQuiz.correctIndex == null) return;

    const correct = quizState.selectedIndex === currentQuiz.correctIndex;
    setQuizState((s) => ({
      ...s,
      submitted: true,
      answered: s.answered + 1,
      score: correct ? s.score + 1 : s.score,
    }));
  };

  const handleFinishQuiz = () => {
    const total = parsedQuizItems.length;
    const score = quizState.score;
    const percent = total > 0 ? score / total : 0;
    const passed = percent >= PASS_THRESHOLD;

    setQuizState((s) => ({ ...s, finished: true, passed }));
    if (passed) {
      setQuizPassed(true);

      const shouldBeComplete = readingDone && scripturesDone && true;
      const updated = {
        started: true,
        readingDone,
        scripturesDone,
        quizPassed: true,
        isComplete: shouldBeComplete,
      };

      if (effectiveStudyId && lessonId) {
        const all = loadProgressFromStorage();
        const studyMap = all[effectiveStudyId] || {};
        const nextAll = {
          ...all,
          [effectiveStudyId]: { ...studyMap, [lessonId]: updated },
        };
        saveProgressToStorage(nextAll);

        if (typeof onUpdateLessonProgress === "function") {
          onUpdateLessonProgress(effectiveStudyId, lessonId, updated);
        }
      }

      if (shouldBeComplete) setIsComplete(true);
    }
  };

  const handleNextQuestion = () => {
    if (!parsedQuizItems.length) return;
    const nextIndex = quizState.index + 1;
    if (nextIndex >= parsedQuizItems.length) {
      handleFinishQuiz();
      return;
    }
    setQuizState((s) => ({
      ...s,
      index: nextIndex,
      selectedIndex: null,
      submitted: false,
    }));
  };

  const handleRetakeQuiz = () => {
    const quizRaw = detail?.quiz_items || "";
    const items = parseQuizItems(quizRaw);
    setParsedQuizItems(items);
    setQuizState({
      index: 0,
      selectedIndex: null,
      submitted: false,
      score: 0,
      answered: 0,
      finished: false,
      passed: false,
    });
  };

  const getChoiceLabel = (q, idx) => {
    if (!q) return "•";
    if (q.type === "TF") return idx === 0 ? "T" : "F";
    return ["A", "B", "C", "D"][idx] || "•";
  };

  const getCorrectLabel = (q) => {
    if (!q) return "—";
    if (q.type === "TF") return q.correctIndex === 0 ? "True" : "False";
    return ["A", "B", "C", "D"][q.correctIndex] || "—";
  };

  const currentQuiz = parsedQuizItems[quizState.index] || null;
  const totalQuestions = parsedQuizItems.length;

  return (
    <div className="lesson-detail-page">
      <PageHeader
        onBack={onBack}
        backLabel={backLabel}
        onProfile={onShowProfile}
        onAccount={onShowAccount}
        profileImageUrl={profileImageUrl}
      />

      <main className="lesson-detail-content">
        {!lesson ? (
          <div className="empty-state">
            <h2>No lesson selected</h2>
            <p>Select a lesson from the list to see its details.</p>
          </div>
        ) : (
        <>
        <section className="hero-card">
          <div className="hero-pill">Lesson {lesson.lesson_order}</div>
          <h1 className="hero-title">{lesson.lesson_title}</h1>
          {lesson.lesson_description && (
            <p className="hero-sub">{lesson.lesson_description}</p>
          )}

          <div className="hero-progress-row">
            <div className="hero-progress-label">
              {isComplete ? "Lesson complete" : "Lesson progress"}
            </div>
            <div className="hero-progress-percent">
              {Math.round(completionPercent)}%
            </div>
          </div>

          <div className="hero-progress-bar">
            <div
              className="hero-progress-fill"
              style={{ width: `${completionPercent}%` }}
            />
          </div>

          {isComplete && (
            <div className="hero-complete-hint">
              This lesson is completed. You can review the steps again any time.
            </div>
          )}
        </section>

        {loadingDetail ? (
          <div className="loading-text">Loading lesson content...</div>
        ) : (
          overviewText && (
            <section className="content-section">
              <div className="section-title">OVERVIEW</div>
              <div className="content-card">
                <p>{overviewText}</p>
              </div>
            </section>
          )
        )}

        <section className="milestones-section">
          <div className="section-header-row">
            <div className="section-title">MILESTONES</div>
            <div className="section-caption">
              Tap a step to open it. Mark it complete inside the panel.
            </div>
          </div>

          <div className="milestones-list">
            <button type="button" className="milestone-card done" disabled>
              <div className="milestone-icon">✅</div>
              <div className="milestone-main">
                <div className="milestone-label">Started</div>
                <div className="milestone-text">
                  You opened this lesson and began working through it.
                </div>
              </div>
            </button>

            <button
              type="button"
              className={`milestone-card ${scripturesDone ? "done" : ""} ${
                isComplete ? "locked" : ""
              }`}
              onClick={() => handleOpenPanel("scriptures")}
              disabled={isComplete}
            >
              <div className="milestone-icon">
                {scripturesDone ? "✅" : "📜"}
              </div>
              <div className="milestone-main">
                <div className="milestone-label">Key verses &amp; passages</div>
                <div className="milestone-text">
                  Tap a reference to open and read it inline.
                </div>
              </div>
            </button>

            <button
              type="button"
              className={`milestone-card ${readingDone ? "done" : ""} ${
                isComplete ? "locked" : ""
              }`}
              onClick={() => handleOpenPanel("reading")}
              disabled={isComplete}
            >
              <div className="milestone-icon">{readingDone ? "✅" : "📖"}</div>
              <div className="milestone-main">
                <div className="milestone-label">Commentary</div>
                <div className="milestone-text">
                  Read the lesson commentary, then mark complete.
                </div>
              </div>
            </button>

            <button
              type="button"
              className={`milestone-card ${quizPassed ? "done" : ""} ${
                quizLocked ? "locked" : ""
              }`}
              onClick={() => handleOpenPanel("quiz")}
              disabled={quizLocked}
            >
              <div className="milestone-icon">{quizPassed ? "✅" : "✏️"}</div>
              <div className="milestone-main">
                <div className="milestone-label">Lesson quiz (70% to pass)</div>
                <div className="milestone-text">
                  Unlocks after passages and commentary are completed.
                </div>
              </div>
            </button>
          </div>
        </section>

        <section className="complete-section">
          {!isComplete && !allMilestonesDone && (
            <div className="incomplete-hint">
              Complete all milestones above to finish this lesson.
            </div>
          )}

          {!isComplete && allMilestonesDone && (
            <button
              type="button"
              className="mark-complete-btn"
              onClick={handleMarkComplete}
            >
              Mark "{lesson?.lesson_title}" Complete
            </button>
          )}

          {isComplete && (
            <div className="lesson-complete-banner">
              <div className="complete-icon">✅</div>
              <div className="complete-content">
                <div className="complete-title">Lesson Finished</div>
                <div className="complete-text">
                  You have completed this lesson. Great work!
                </div>
              </div>
            </div>
          )}
        </section>
        </>
        )}
      </main>

      {activePanel && createPortal(
        <div className="slide-overlay" onClick={handleClosePanel}>
          <div className="slide-panel" onClick={(e) => e.stopPropagation()}>
            <div className="slide-header">
              <button
                type="button"
                className="slide-close"
                onClick={handleClosePanel}
              >
                ✕
              </button>
              <div className="slide-tag">Lesson step</div>
            </div>

            <div className="slide-content">
              <div className="slide-icon">
                <div className="slide-icon-circle">
                  {activePanel === "reading" && "📖"}
                  {activePanel === "scriptures" && "📜"}
                  {activePanel === "quiz" && "✏️"}
                </div>
              </div>

              {/* ------------------ SCRIPTURES PANEL ------------------ */}
              {activePanel === "scriptures" && (
                <>
                  <h2 className="slide-title">Key verses</h2>
                  <p className="slide-subtitle">
                    Tap a reference to open it inline. Tap "Read Chapter" to see
                    the full context.
                  </p>

                  {!keyVerseItems.length ? (
                    <div className="hint-card">
                      No key verses found. Add refs in <b>key_verses</b> like:{" "}
                      <span className="hint-mono">
                        Deuteronomy 6:4; Isaiah 44:6-8
                      </span>
                    </div>
                  ) : (
                    <div className="ref-drop-list">
                      {keyVerseItems.map((p, i) => {
                        const key = `kv-${p.label}-${i}`;
                        const isOpen = openRefKey === key;

                        const result =
                          isOpen && bibleIndex
                            ? getVersesForRef(bibleIndex, p)
                            : null;

                        return (
                          <div
                            key={key}
                            className={`ref-drop ${isOpen ? "open" : ""}`}
                          >
                            <button
                              type="button"
                              className="ref-drop-head"
                              onClick={() => {
                                const next = isOpen ? null : key;
                                setOpenRefKey(next);
                              }}
                            >
                              <span className="ref-drop-left">
                                <span className="ref-index">{i + 1}</span>
                                <span className="ref-label">{p.label}</span>
                              </span>
                              <span className="ref-drop-right">
                                {isOpen ? "Hide" : "Open"}
                              </span>
                            </button>

                            {isOpen && (
                              <div className="ref-drop-body">
                                {bibleLoading ? (
                                  <div className="status-text">
                                    Loading Bible text...
                                  </div>
                                ) : bibleError ? (
                                  <div className="status-text error">
                                    {bibleError}
                                  </div>
                                ) : !bibleIndex ? (
                                  <div className="status-text">
                                    Loading Bible text...
                                  </div>
                                ) : !result?.ok ? (
                                  <div className="status-text error">
                                    {result?.error || "No verses found."}
                                  </div>
                                ) : (
                                  <div className="inline-passage">
                                    {result.blocks.map((block, bIdx) => (
                                      <div key={bIdx} className="passage-block">
                                        <div className="passage-header">
                                          <div className="passage-meta">
                                            {result.resolvedBook}{" "}
                                            {block.chapter}
                                          </div>
                                          <button
                                            type="button"
                                            className="read-chapter-btn"
                                            onClick={() =>
                                              handleOpenReader(
                                                p.book,
                                                block.chapter,
                                                p.verseStart
                                              )
                                            }
                                          >
                                            Read Chapter
                                          </button>
                                        </div>
                                        {block.verses.map((v, vIdx) => (
                                          <p key={vIdx} className="verse">
                                            <span className="verse-number">
                                              {v.verse}.
                                            </span>
                                            <span className="verse-text">
                                              {v.text}
                                            </span>
                                          </p>
                                        ))}
                                      </div>
                                    ))}
                                  </div>
                                )}
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  )}

                  {/* Divider before expanded */}
                  {!!expandedItems.length && (
                    <div className="divider-wrap">
                      <div className="divider-line" />
                      <div className="divider-chip">EXPANDED READING</div>
                      <div className="divider-line" />
                    </div>
                  )}

                  {!!expandedItems.length && (
                    <div className="expanded-wrap">
                      <button
                        type="button"
                        className="expanded-btn"
                        onClick={() => setShowExpandedList((v) => !v)}
                      >
                        {showExpandedList
                          ? "Hide expanded reading"
                          : `Expanded reading (${expandedItems.length})`}
                        <span className="expanded-arrow">
                          {showExpandedList ? "▴" : "▾"}
                        </span>
                      </button>

                      {showExpandedList && (
                        <div className="ref-drop-list compact">
                          {expandedItems.map((p, i) => {
                            const key = `exp-${p.label}-${i}`;
                            const isOpen = openRefKey === key;

                            const result =
                              isOpen && bibleIndex
                                ? getVersesForRef(bibleIndex, p)
                                : null;

                            return (
                              <div
                                key={key}
                                className={`ref-drop ${isOpen ? "open" : ""}`}
                              >
                                <button
                                  type="button"
                                  className="ref-drop-head compact"
                                  onClick={() => {
                                    const next = isOpen ? null : key;
                                    setOpenRefKey(next);
                                  }}
                                >
                                  <span className="ref-drop-left">
                                    <span className="ref-dot" />
                                    <span className="ref-label">{p.label}</span>
                                  </span>
                                  <span className="ref-drop-right">
                                    {isOpen ? "Hide" : "Open"}
                                  </span>
                                </button>

                                {isOpen && (
                                  <div className="ref-drop-body">
                                    {bibleLoading ? (
                                      <div className="status-text">
                                        Loading Bible text...
                                      </div>
                                    ) : bibleError ? (
                                      <div className="status-text error">
                                        {bibleError}
                                      </div>
                                    ) : !bibleIndex ? (
                                      <div className="status-text">
                                        Loading Bible text...
                                      </div>
                                    ) : !result?.ok ? (
                                      <div className="status-text error">
                                        {result?.error || "No verses found."}
                                      </div>
                                    ) : (
                                      <div className="inline-passage">
                                        {result.blocks.map((block, bIdx) => (
                                          <div
                                            key={bIdx}
                                            className="passage-block"
                                          >
                                            <div className="passage-header">
                                              <div className="passage-meta">
                                                {result.resolvedBook}{" "}
                                                {block.chapter}
                                              </div>
                                              <button
                                                type="button"
                                                className="read-chapter-btn"
                                                onClick={() =>
                                                  handleOpenReader(
                                                    p.book,
                                                    block.chapter,
                                                    p.verseStart
                                                  )
                                                }
                                              >
                                                Read Chapter
                                              </button>
                                            </div>
                                            {block.verses.map((v, vIdx) => (
                                              <p key={vIdx} className="verse">
                                                <span className="verse-number">
                                                  {v.verse}.
                                                </span>
                                                <span className="verse-text">
                                                  {v.text}
                                                </span>
                                              </p>
                                            ))}
                                          </div>
                                        ))}
                                      </div>
                                    )}
                                  </div>
                                )}
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  )}
                </>
              )}

              {/* ------------------ READING PANEL ------------------ */}
              {activePanel === "reading" && (
                <>
                  <h2 className="slide-title">Lesson Commentary</h2>
                  <p className="slide-subtitle">
                    Read the commentary below to complete this milestone.
                  </p>

                  <div className="commentary-content">
                    {loadingDetail ? (
                      <div className="status-text">Loading commentary...</div>
                    ) : commentaryText ? (
                      <div className="commentary-text">
                        {String(commentaryText)
                          .split(/\n\s*\n/g)
                          .map((para, i) => (
                            <p key={i}>{para.trim()}</p>
                          ))}
                      </div>
                    ) : (
                      <div className="hint-card">
                        No commentary found for this lesson.
                      </div>
                    )}
                  </div>
                </>
              )}

              {/* ------------------ QUIZ PANEL ------------------ */}
              {activePanel === "quiz" && (
                <>
                  <h2 className="slide-title">Lesson Quiz</h2>
                  <p className="slide-subtitle">
                    Answer all questions. You need a{" "}
                    <b>{PASS_THRESHOLD * 100}%</b> score to pass.
                  </p>

                  {!parsedQuizItems.length ? (
                    <div className="hint-card error">
                      No quiz questions found. Please add questions to the{" "}
                      <b>quiz_items</b> field.
                    </div>
                  ) : quizState.finished ? (
                    <div
                      className={`quiz-result-card ${
                        quizState.passed ? "passed" : "failed"
                      }`}
                    >
                      <div className="result-icon">
                        {quizState.passed ? "🏆" : "😔"}
                      </div>
                      <div className="result-content">
                        <div className="result-title">
                          {quizState.passed ? "Quiz Passed!" : "Quiz Failed"}
                        </div>
                        <div className="result-score">
                          Your Score: {quizState.score} / {totalQuestions} (
                          {Math.round((quizState.score / totalQuestions) * 100)}
                          %)
                        </div>
                        {quizState.passed && (
                          <div className="result-text">
                            You have completed this milestone.
                          </div>
                        )}
                      </div>

                      <button
                        type="button"
                        className="retake-quiz-btn"
                        onClick={handleRetakeQuiz}
                      >
                        Retake Quiz
                      </button>
                    </div>
                  ) : (
                    <>
                      <div className="quiz-progress-header">
                        Question {quizState.index + 1} of {totalQuestions}
                      </div>

                      <div className="quiz-progress-bar">
                        <div
                          className="quiz-progress-fill"
                          style={{
                            width: `${
                              totalQuestions
                                ? ((quizState.index + 1) / totalQuestions) * 100
                                : 0
                            }%`,
                          }}
                        />
                      </div>

                      <div className="quiz-card">
                        <p className="quiz-question">{currentQuiz?.question}</p>

                        <div className="quiz-choices">
                          {currentQuiz?.choices.map((choice, idx) => {
                            const isSelected = quizState.selectedIndex === idx;
                            const isCorrect =
                              quizState.submitted &&
                              idx === currentQuiz.correctIndex;
                            const isWrong =
                              quizState.submitted &&
                              isSelected &&
                              idx !== currentQuiz.correctIndex;

                            return (
                              <button
                                key={idx}
                                type="button"
                                className={`choice-btn ${
                                  isSelected ? "selected" : ""
                                } ${isCorrect ? "correct" : ""} ${
                                  isWrong ? "wrong" : ""
                                }`}
                                onClick={() => handlePickChoice(idx)}
                                disabled={quizState.submitted}
                              >
                                <span className="choice-label">
                                  {getChoiceLabel(currentQuiz, idx)}
                                </span>
                                <span className="choice-text">{choice}</span>
                              </button>
                            );
                          })}
                        </div>

                        {quizState.submitted && (
                          <div className="answer-feedback">
                            <div
                              className={`feedback-status ${
                                quizState.selectedIndex ===
                                currentQuiz.correctIndex
                                  ? "correct"
                                  : "wrong"
                              }`}
                            >
                              {quizState.selectedIndex ===
                              currentQuiz.correctIndex
                                ? "Correct Answer! 🎉"
                                : `Incorrect. The correct answer was ${getCorrectLabel(
                                    currentQuiz
                                  )}.`}
                            </div>

                            {currentQuiz?.explanation && (
                              <div className="feedback-explanation">
                                <b>Explanation:</b> {currentQuiz.explanation}
                              </div>
                            )}
                          </div>
                        )}
                      </div>

                      <div className="quiz-action-bar">
                        {!quizState.submitted ? (
                          <button
                            type="button"
                            className="submit-answer-btn"
                            onClick={handleSubmitAnswer}
                            disabled={quizState.selectedIndex == null}
                          >
                            Submit Answer
                          </button>
                        ) : quizState.index < totalQuestions - 1 ? (
                          <button
                            type="button"
                            className="next-question-btn"
                            onClick={handleNextQuestion}
                          >
                            Next Question →
                          </button>
                        ) : (
                          <button
                            type="button"
                            className="finish-quiz-btn"
                            onClick={handleFinishQuiz}
                          >
                            Finish Quiz
                          </button>
                        )}
                      </div>
                    </>
                  )}
                </>
              )}
            </div>

            <div className="slide-footer">
              {activePanel !== "quiz" && (
                <button
                  type="button"
                  className={`mark-panel-complete-btn ${
                    panelDone ? "done" : ""
                  }`}
                  onClick={handleMarkPanelComplete}
                >
                  {panelDone ? "Milestone Complete!" : "Mark as Complete"}
                </button>
              )}

              {activePanel === "quiz" && quizState.finished && (
                <button
                  type="button"
                  className="close-quiz-btn"
                  onClick={handleClosePanel}
                >
                  {quizState.passed ? "Continue" : "Close Quiz"}
                </button>
              )}
            </div>
          </div>
        </div>,
        document.body
      )}

      {/* Bible Reader Modal */}
      <BibleReaderModal
        isOpen={readerOpen}
        onClose={() => setReaderOpen(false)}
        bibleIndex={bibleIndex}
        bookName={readerBook}
        chapter={readerChapter}
        highlightVerse={readerHighlight}
      />

      <style>{styles}</style>
    </div>
  );
}

const styles = `
  .lesson-detail-page{
    min-height:100vh;
    background: linear-gradient(180deg,#f8fafc 0%, #f1f5f9 55%, #e9eef4 100%);
  }

  .lesson-detail-content{
    max-width: 960px;
    margin: 0 auto;
    padding: 0 1rem 4.8rem;
  }

  .empty-state{
    margin-top: 2rem;
    padding: 1.2rem;
    background:#fff;
    border-radius: 18px;
    border: 1px solid rgba(15,23,42,0.08);
    box-shadow: 0 10px 28px rgba(15,23,42,0.08);
  }

  .hero-card{
    margin-top: 1rem;
    margin-bottom: 1.25rem;
    padding: 1.4rem 1.5rem;
    border-radius: 24px;
    background: linear-gradient(135deg,
      ${colors?.blue?.dark || "#0b2a66"} 0%,
      ${colors?.blue?.deep || "#003da5"} 55%,
      ${colors?.blue?.dark || "#0b2a66"} 100%);
    color:#fff;
    box-shadow: 0 18px 40px rgba(15,23,42,0.30);
  }

  .hero-pill{
    display:inline-flex;
    align-items:center;
    padding:0.25rem 0.7rem;
    border-radius:999px;
    background: rgba(255,255,255,0.14);
    font-size: ${roles?.bodySmall?.fontSize || "0.78rem"};
    font-weight: 700;
    letter-spacing: 0.02em;
    text-transform: uppercase;
    margin-bottom: 0.6rem;
  }

  .hero-title{
    margin:0 0 0.35rem;
    font-size: ${roles?.heroTitle?.fontSize || "1.65rem"};
    font-weight: ${roles?.heroTitle?.fontWeight || 800};
    letter-spacing:-0.02em;
  }

  .hero-sub{
    margin:0 0 1rem;
    font-size:${roles?.body?.fontSize || "1rem"};
    line-height:${lineHeights?.relaxed || "1.6"};
    opacity:0.92;
  }

  .hero-progress-row{
    display:flex;
    align-items:baseline;
    justify-content:space-between;
    gap:0.75rem;
    margin-bottom: 0.35rem;
  }

  .hero-progress-label{
    font-size:${roles?.bodySmall?.fontSize || "0.85rem"};
    opacity:0.9;
  }

  .hero-progress-percent{
    font-size:${roles?.bodySmall?.fontSize || "0.85rem"};
    font-weight:800;
  }

  .hero-progress-bar{
    width:100%;
    height:6px;
    border-radius:999px;
    background: rgba(255,255,255,0.22);
    overflow:hidden;
  }

  .hero-progress-fill{
    height:100%;
    border-radius:999px;
    background: ${
      gradients?.flame || "linear-gradient(90deg,#ffb400,#ff6a00,#e02121)"
    };
    transition: width 260ms ease-out;
  }

  .hero-complete-hint{
    margin-top: 0.85rem;
    font-size:${roles?.bodySmall?.fontSize || "0.85rem"};
    opacity:0.92;
  }

  .loading-text{
    margin-top: 1.4rem;
    text-align:center;
    color:#6b7280;
    font-size:${roles?.body?.fontSize || "1rem"};
  }

  .content-section{ margin-bottom: 1.25rem; }

  .section-title{
    font-size: 0.72rem;
    font-weight: 800;
    letter-spacing: 0.14em;
    color: #6b7280;
    margin: 0.35rem 0 0.6rem;
  }

  .content-card{
    background:#fff;
    border-radius: 18px;
    border: 1px solid rgba(15,23,42,0.08);
    box-shadow: 0 10px 28px rgba(15,23,42,0.08);
    padding: 1rem 1.05rem;
    color:#111827;
  }
  .content-card p{ margin:0; line-height:1.6; }

  .milestones-section{ margin-top: 0.5rem; margin-bottom: 1.25rem; }

  .section-header-row{
    display:flex;
    flex-direction:column;
    gap:0.35rem;
    margin-bottom: 0.75rem;
  }

  .section-caption{
    font-size:${roles?.bodySmall?.fontSize || "0.85rem"};
    color:#6b7280;
  }

  .milestones-list{
    display:flex;
    flex-direction:column;
    gap:0.75rem;
  }

  .milestone-card{
    width:100%;
    display:flex;
    align-items:flex-start;
    gap:0.9rem;
    padding: 1rem 1.05rem;
    border-radius: 18px;
    border: 1px solid rgba(15,23,42,0.10);
    background:#fff;
    text-align:left;
    cursor:pointer;
    box-shadow: 0 6px 16px rgba(15,23,42,0.08);
    transition: transform 0.12s ease, box-shadow 0.12s ease, border-color 0.12s ease;
  }

  .milestone-card:active{ transform: scale(0.985); }
  .milestone-card:hover{
    box-shadow: 0 10px 22px rgba(15,23,42,0.10);
    border-color: rgba(29,78,216,0.22);
  }

  .milestone-card.locked{ opacity: 0.55; cursor: not-allowed; }

  .milestone-card.done{
    border-color: rgba(34,197,94,0.35);
    background: linear-gradient(135deg,#ecfdf5 0%, #f0fdf4 100%);
  }

  .milestone-icon{
    width: 46px;
    height: 46px;
    border-radius: 14px;
    display:flex;
    align-items:center;
    justify-content:center;
    font-size: 1.2rem;
    background: rgba(29,78,216,0.08);
    border: 1px solid rgba(29,78,216,0.15);
    flex-shrink:0;
  }

  .milestone-card.done .milestone-icon{
    background: linear-gradient(135deg,#22c55e,#16a34a);
    border-color:#16a34a;
    color:#fff;
  }

  .milestone-main{ flex:1; min-width:0; }
  .milestone-label{
    font-size:${roles?.cardTitle?.fontSize || "1rem"};
    font-weight:${roles?.cardTitle?.fontWeight || 800};
    color:#111827;
    margin-bottom:0.2rem;
  }
  .milestone-text{
    font-size:${roles?.bodySmall?.fontSize || "0.85rem"};
    color:#6b7280;
    line-height:${lineHeights?.relaxed || "1.6"};
  }

  .complete-section{ margin-top: 0.25rem; }

  .incomplete-hint{
    text-align:center;
    color:#6b7280;
    font-size:${roles?.bodySmall?.fontSize || "0.85rem"};
    margin: 0.8rem 0 0.6rem;
  }

  .mark-complete-btn{
    width:100%;
    border:none;
    cursor:pointer;
    padding: 0.95rem 1rem;
    border-radius: 16px;
    font-weight: 900;
    color:#0b1220;
    background: ${
      gradients?.flame || "linear-gradient(90deg,#ffb400,#ff6a00,#e02121)"
    };
    box-shadow: 0 14px 28px rgba(255,106,0,0.22);
  }

  .lesson-complete-banner{
    margin-top: 0.9rem;
    display:flex;
    gap:0.9rem;
    padding: 1rem 1.05rem;
    border-radius: 18px;
    background: linear-gradient(135deg,#ecfdf5 0%, #f0fdf4 100%);
    border: 1px solid rgba(34,197,94,0.35);
    box-shadow: 0 10px 22px rgba(22,163,74,0.12);
    align-items:flex-start;
  }
  .complete-icon{ font-size:1.35rem; }
  .complete-title{ font-weight:900; color:#065f46; margin-bottom:0.15rem; }
  .complete-text{ color:#065f46; opacity:0.9; font-size:${
    roles?.bodySmall?.fontSize || "0.85rem"
  }; }

  /* Slide panel */
  .slide-overlay{
    position:fixed;
    inset:0;
    background: rgba(2,6,23,0.60);
    display:flex;
    justify-content:flex-end;
    z-index: 2000;
    -webkit-overflow-scrolling: touch;
  }

  .slide-panel{
    width: min(520px, 100%);
    height:100%;
    background:#fff;
    box-shadow: -18px 0 48px rgba(2,6,23,0.35);
    display:flex;
    flex-direction:column;
    animation: slideIn 180ms ease-out;
    -webkit-overflow-scrolling: touch;
  }

  @keyframes slideIn{
    from{ transform: translateX(18px); opacity:0.7; }
    to{ transform: translateX(0); opacity:1; }
  }

  .slide-header{
    display:flex;
    align-items:center;
    justify-content:space-between;
    padding: 0.9rem 0.95rem;
    border-bottom: 1px solid rgba(15,23,42,0.08);
  }

  .slide-close{
    border:none;
    background: rgba(15,23,42,0.06);
    width: 40px;
    height: 40px;
    border-radius: 12px;
    cursor:pointer;
    font-size: 1.1rem;
  }

  .slide-tag{
    font-size: 0.72rem;
    font-weight: 900;
    letter-spacing: 0.14em;
    color:#6b7280;
    text-transform:uppercase;
  }

  .slide-content{
    padding: 1rem 1rem 0.8rem;
    overflow:auto;
    flex:1;
    min-height: 0;
    position: relative;
  }

  .slide-icon{ display:flex; justify-content:center; margin: 0.2rem 0 0.75rem; }
  .slide-icon-circle{
    width: 56px;
    height: 56px;
    border-radius: 18px;
    background: rgba(29,78,216,0.08);
    border: 1px solid rgba(29,78,216,0.14);
    display:flex;
    align-items:center;
    justify-content:center;
    font-size: 1.35rem;
  }

  .slide-title{
    margin: 0 0 0.35rem;
    font-size: 1.25rem;
    font-weight: 900;
    color:#111827;
  }

  .slide-subtitle{
    margin: 0 0 0.9rem;
    color:#6b7280;
    font-size:${roles?.bodySmall?.fontSize || "0.85rem"};
    line-height:${lineHeights?.relaxed || "1.6"};
  }

  .ref-drop-list{
    display:flex;
    flex-direction:column;
    gap: 0.75rem;
  }

  .ref-drop{
    border-radius: 18px;
    border: 1px solid rgba(15,23,42,0.10);
    background: #fff;
    box-shadow: 0 10px 22px rgba(15,23,42,0.08);
    overflow:hidden;
  }

  .ref-drop-head{
    width:100%;
    border:none;
    background: transparent;
    cursor:pointer;
    padding: 0.95rem 0.95rem;
    display:flex;
    align-items:center;
    justify-content:space-between;
    gap: 0.9rem;
    text-align:left;
  }

  .ref-drop-head:hover{ background: rgba(15,23,42,0.03); }

  .ref-drop-left{
    display:flex;
    align-items:center;
    gap: 0.75rem;
    min-width:0;
  }

  .ref-index{
    width: 28px;
    height: 28px;
    border-radius: 12px;
    display:flex;
    align-items:center;
    justify-content:center;
    font-weight: 950;
    font-size: 0.85rem;
    color:#0b1220;
    background: rgba(15,23,42,0.06);
    flex-shrink:0;
  }

  .ref-dot{
    width: 10px;
    height: 10px;
    border-radius: 999px;
    background: rgba(15,23,42,0.28);
    flex-shrink:0;
  }

  .ref-label{
    font-weight: 950;
    color:#0b1220;
    letter-spacing:-0.02em;
    white-space: nowrap;
    overflow:hidden;
    text-overflow: ellipsis;
  }

  .ref-drop-right{
    font-weight: 950;
    color: ${colors?.blue?.deep || "#003da5"};
    flex-shrink:0;
  }

  .ref-drop-body{
    border-top: 1px solid rgba(15,23,42,0.08);
    padding: 0.9rem 0.95rem 1rem;
    background: linear-gradient(180deg,#ffffff 0%, #fbfdff 100%);
  }

  .inline-passage .passage-block{ margin-bottom: 1rem; }
  .inline-passage .passage-block:last-child{ margin-bottom:0; }

  .passage-header{
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 0.75rem;
    margin-bottom: 0.55rem;
  }

  .passage-meta{
    font-weight: 950;
    color: ${colors?.blue?.deep || "#003da5"};
  }

  .read-chapter-btn{
    border: none;
    background: rgba(29,78,216,0.10);
    color: ${colors?.blue?.deep || "#003da5"};
    padding: 0.4rem 0.75rem;
    border-radius: 8px;
    font-size: 0.8rem;
    font-weight: 700;
    cursor: pointer;
    transition: background 0.15s ease;
    touch-action: manipulation;
    -webkit-tap-highlight-color: transparent;
  }

  .read-chapter-btn:hover{
    background: rgba(29,78,216,0.18);
  }

  .verse{
    margin: 0 0 0.55rem;
    line-height: 1.6;
    color:#111827;
  }
  .verse:last-child{ margin-bottom:0; }

  .verse-number{
    display:inline-block;
    min-width: 2.4rem;
    font-weight: 900;
    color:#6b7280;
  }
  .verse-text{ color:#111827; }

  .divider-wrap{
    display:flex;
    align-items:center;
    gap:0.75rem;
    margin: 0.95rem 0 1rem;
  }
  .divider-line{
    flex:1;
    height:1px;
    background: rgba(15,23,42,0.10);
  }
  .divider-chip{
    font-size: 0.72rem;
    font-weight: 950;
    letter-spacing: 0.14em;
    color: ${colors?.blue?.deep || "#003da5"};
    text-transform: uppercase;
    padding: 0.35rem 0.6rem;
    border-radius: 999px;
    background: rgba(29,78,216,0.08);
    border: 1px solid rgba(29,78,216,0.14);
    white-space: nowrap;
  }

  .expanded-wrap{ margin-top: 0.2rem; }

  .expanded-btn{
    width:100%;
    border:none;
    cursor:pointer;
    padding: 0.95rem 1rem;
    border-radius: 16px;
    font-weight: 950;
    color:#0b1220;
    background: ${
      gradients?.flame || "linear-gradient(90deg,#ffb400,#ff6a00,#e02121)"
    };
    box-shadow: 0 14px 28px rgba(255,106,0,0.18);
    display:flex;
    align-items:center;
    justify-content:space-between;
    gap:0.75rem;
    margin-bottom: 0.75rem;
  }

  .expanded-arrow{ font-weight: 950; opacity: 0.9; }

  .ref-drop-list.compact .ref-drop-head{ padding: 0.8rem 0.95rem; }

  .commentary-content{
    background:#fff;
    border-radius: 20px;
    border: 1px solid rgba(15,23,42,0.10);
    box-shadow: 0 12px 28px rgba(15,23,42,0.08);
    padding: 1.05rem 1.05rem;
  }
  .commentary-text{
    margin:0;
    color:#0b1220;
    line-height: 1.75;
    font-size: 1rem;
    letter-spacing: -0.01em;
  }
  .commentary-text p{ margin: 0 0 0.95rem; }
  .commentary-text p:last-child{ margin-bottom:0; }

  .quiz-progress-header{
    font-size: 0.78rem;
    font-weight: 950;
    color:#6b7280;
    letter-spacing: 0.14em;
    text-transform: uppercase;
    margin-bottom: 0.5rem;
  }

  .quiz-progress-bar{
    height: 7px;
    border-radius: 999px;
    background: rgba(15,23,42,0.08);
    overflow:hidden;
    margin-bottom: 0.85rem;
  }

  .quiz-progress-fill{
    height:100%;
    border-radius: 999px;
    background: linear-gradient(90deg,#ffb400,#ff6a00,#e02121);
    transition: width 240ms ease-out;
  }

  .quiz-card{
    background:#fff;
    border-radius: 20px;
    border: 1px solid rgba(15,23,42,0.10);
    box-shadow: 0 12px 28px rgba(15,23,42,0.08);
    padding: 1rem;
    margin-bottom: 0.95rem;
  }

  .quiz-question{
    margin:0 0 0.9rem;
    font-weight: 950;
    color:#0b1220;
    letter-spacing:-0.02em;
    line-height: 1.35;
  }

  .quiz-choices{
    display:flex;
    flex-direction:column;
    gap: 0.65rem;
  }

  .choice-btn{
    width:100%;
    display:flex;
    align-items:flex-start;
    gap:0.75rem;
    padding: 0.95rem 0.95rem;
    border-radius: 18px;
    border: 1px solid rgba(15,23,42,0.12);
    background: linear-gradient(180deg,#ffffff 0%, #fbfdff 100%);
    cursor:pointer;
    text-align:left;
    box-shadow: 0 10px 18px rgba(15,23,42,0.06);
    transition: transform 0.12s ease, box-shadow 0.12s ease, border-color 0.12s ease;
  }

  .choice-btn:hover{
    box-shadow: 0 14px 26px rgba(15,23,42,0.10);
    border-color: rgba(29,78,216,0.28);
  }
  .choice-btn:active{ transform: scale(0.988); }

  .choice-label{
    width: 32px;
    height: 32px;
    border-radius: 12px;
    background: rgba(15,23,42,0.06);
    border: 1px solid rgba(15,23,42,0.10);
    display:flex;
    align-items:center;
    justify-content:center;
    font-weight: 950;
    color:#0b1220;
    flex-shrink:0;
    margin-top: 1px;
  }

  .choice-text{
    color:#0b1220;
    line-height: 1.5;
    font-weight: 750;
    flex:1;
    min-width:0;
  }

  .choice-btn.selected{
    border-color: rgba(251,146,60,0.60);
    background: linear-gradient(180deg, rgba(255,237,213,0.55) 0%, rgba(255,237,213,0.30) 100%);
  }

  .choice-btn.correct{
    border-color: rgba(34,197,94,0.70);
    background: linear-gradient(180deg, rgba(236,253,245,0.85) 0%, rgba(236,253,245,0.55) 100%);
  }

  .choice-btn.wrong{
    border-color: rgba(239,68,68,0.70);
    background: linear-gradient(180deg, rgba(254,226,226,0.90) 0%, rgba(254,226,226,0.55) 100%);
  }

  .answer-feedback{
    margin-top: 0.95rem;
    border-top: 1px solid rgba(15,23,42,0.08);
    padding-top: 0.85rem;
  }

  .feedback-status{
    font-weight: 950;
    margin-bottom: 0.55rem;
    font-size: 1rem;
  }
  .feedback-status.correct{ color:#16a34a; }
  .feedback-status.wrong{ color:#b91c1c; }

  .feedback-explanation{
    color:#374151;
    line-height: 1.6;
    font-size: 0.95rem;
  }

  .quiz-action-bar{
    display:flex;
    gap:0.6rem;
  }

  .submit-answer-btn,
  .next-question-btn,
  .finish-quiz-btn,
  .retake-quiz-btn,
  .close-quiz-btn,
  .mark-panel-complete-btn{
    width:100%;
    border:none;
    cursor:pointer;
    padding: 0.9rem 0.95rem;
    border-radius: 16px;
    font-weight: 950;
  }

  .submit-answer-btn{
    background: ${
      gradients?.flame || "linear-gradient(90deg,#ffb400,#ff6a00,#e02121)"
    };
    color:#0b1220;
  }
  .next-question-btn,
  .finish-quiz-btn{
    background: rgba(29,78,216,0.10);
    color: ${colors?.blue?.deep || "#003da5"};
  }

  .quiz-result-card{
    border-radius: 18px;
    border: 1px solid rgba(15,23,42,0.08);
    box-shadow: 0 10px 22px rgba(15,23,42,0.08);
    background:#fff;
    padding: 0.95rem;
    display:flex;
    flex-direction:column;
    gap:0.8rem;
    align-items:flex-start;
  }
  .quiz-result-card.passed{
    border-color: rgba(34,197,94,0.35);
    background: linear-gradient(135deg,#ecfdf5 0%, #f0fdf4 100%);
  }
  .quiz-result-card.failed{
    border-color: rgba(239,68,68,0.30);
    background: linear-gradient(135deg,#fff5f5 0%, #fff 100%);
  }

  .result-icon{ font-size: 1.6rem; }
  .result-title{ font-weight: 950; margin-bottom: 0.2rem; }
  .result-score{ color:#374151; font-weight: 800; margin-bottom: 0.25rem; }
  .result-text{ color:#065f46; font-weight: 800; font-size:${
    roles?.bodySmall?.fontSize || "0.85rem"
  }; }

  .retake-quiz-btn{
    margin-top: 0.65rem;
    background: rgba(15,23,42,0.06);
    color:#111827;
  }

  .slide-footer{
    border-top: 1px solid rgba(15,23,42,0.08);
    padding: 0.9rem 1rem calc(0.9rem + env(safe-area-inset-bottom));
    background: #fff;
    flex-shrink: 0;
  }

  .mark-panel-complete-btn{
    background: rgba(29,78,216,0.10);
    color: ${colors?.blue?.deep || "#003da5"};
  }

  .mark-panel-complete-btn.done{
    background: linear-gradient(135deg,#22c55e,#16a34a);
    color:#fff;
  }

  .close-quiz-btn{
    background: rgba(15,23,42,0.06);
    color:#111827;
  }

  .status-text{
    margin-top: 0.75rem;
    color:#6b7280;
    text-align:center;
    font-size:${roles?.bodySmall?.fontSize || "0.85rem"};
  }
  .status-text.error{ color:#b91c1c; }

  .hint-card{
    background: #fffbeb;
    border: 1px solid #fcd34d;
    border-radius: 12px;
    padding: 0.85rem 1rem;
    color: #92400e;
    font-size: 0.9rem;
    line-height: 1.5;
  }

  .hint-card.error{
    background: #fef2f2;
    border-color: #fca5a5;
    color: #991b1b;
  }

  .hint-mono{
    font-family: monospace;
    background: rgba(0,0,0,0.06);
    padding: 0.15rem 0.35rem;
    border-radius: 4px;
  }

  @media (max-width: 640px){
    .lesson-detail-content{ padding: 0 0.75rem 3.8rem; }
    .hero-card{ padding: 1.2rem 1.1rem; border-radius: 20px; }
    .hero-title{ font-size: 1.5rem; }
    .milestone-icon{ width: 44px; height: 44px; border-radius: 14px; }
    .slide-panel{ width: 100%; }
  }
`;

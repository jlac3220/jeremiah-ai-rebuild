/**
 * askUtils.js – Utility and helper functions for AskPage.
 * Handles knowledge library search, text normalization, scoring, and context building.
 */

import { supabase } from "../supabaseClient";
import { expandSearchTerms } from "../theologicalTerms";

const STOP_WORDS = ["the","what","how","are","is","there","about","does","can","you","tell","me","many","much","some","any","this","that","these","those","have","has","had","was","were","been","being","will","would","could","should","may","might","must","shall","do","did","does","doing","for","from","with","into","through","during","before","after","above","below","between","under","again","further","then","once","and","but","or","nor","so","yet","both","either","neither","not","only","own","same","than","too","very","just","also","get","got","getting","need","want","know","believe","why","when","where","who","which","your","our","their","his","her","its"];

export function escapeRegExp(value) {
  return String(value || "").replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

export function tokenizeQuery(query) {
  let keywords = (query || "")
    .toLowerCase()
    .replace(/[?.,!'"():;[\]{}]/g, " ")
    .split(/\s+/)
    .filter((w) => w.length > 2 && !STOP_WORDS.includes(w));
  keywords = expandSearchTerms(keywords);
  return Array.from(new Set(keywords)).slice(0, 15);
}

export function extractStandardCode(query) {
  const match = String(query || "").match(/\b(OG|NB)\.\d+\.\d+\.18\b/i);
  return match ? match[0].toUpperCase() : null;
}

export function truncateText(text, max = 2200) {
  const clean = String(text || "").trim();
  return clean.length <= max ? clean : `${clean.slice(0, max)}…`;
}

export function scoreTextAgainstKeywords(text, keywords, multiplier = 1) {
  const hay = String(text || "").toLowerCase();
  let score = 0;
  for (const keyword of keywords) {
    const pattern = new RegExp(escapeRegExp(keyword), "g");
    score += (hay.match(pattern) || []).length * multiplier;
  }
  return score;
}

export function toInt(value, fallback = 0) {
  const num = Number(value);
  return Number.isFinite(num) ? num : fallback;
}

export function standardPrefix(code) {
  const match = String(code || "").match(/^(OG|NB)\.(\d+)/i);
  if (!match) return null;
  return `${match[1].toUpperCase()}.${match[2]}`;
}

export function getPurposeText(row) {
  return row?.purpose_text || row?.purpose_statement || row?.purpose || "";
}

export function getStandardText(row) {
  return row?.standard_text || row?.standard_statement || row?.statement || "";
}

export function getScopeText(row) {
  return row?.scope_text || row?.scope_clarifications || row?.scope || "";
}

export function getInstructionalFocus(row) {
  return row?.instructional_focus || row?.instructionalFocus || "";
}

export function getContentText(row) {
  return row?.content_text || row?.content || "";
}

export function normalizeDomain(row) {
  const n = { ...row };
  n.subject_code = String(row?.subject_code || "").toUpperCase();
  n.domain_number = toInt(row?.domain_number, 0);
  n.domain_code =
    row?.domain_code ||
    (n.subject_code && n.domain_number ? `${n.subject_code}.${n.domain_number}` : "");
  n.purpose_text = getPurposeText(row);
  n.content_text = getContentText(row);
  return n;
}

export function normalizeStandard(row) {
  const n = { ...row };
  n.subject_code = String(row?.subject_code || "").toUpperCase();
  n.standard_text = getStandardText(row);
  n.scope_text = getScopeText(row);
  n.instructional_focus = getInstructionalFocus(row);
  n.content_text = getContentText(row);
  n.domain_code_guess = standardPrefix(row?.standard_code);
  return n;
}

/** Fetches all knowledge library data from Supabase in parallel. */
export async function loadKnowledgeLibrary() {
  const [documentsRes, domainsRes, standardsRes, keywordsRes, scriptureRefsRes] =
    await Promise.all([
      supabase.from("knowledge_documents").select("*"),
      supabase.from("knowledge_domains").select("*"),
      supabase.from("knowledge_standards").select("*"),
      supabase.from("knowledge_keywords").select("*").limit(5000),
      supabase.from("knowledge_scripture_refs").select("*").limit(2000),
    ]);
  return {
    documents: documentsRes.data || [],
    domains: (domainsRes.data || []).map(normalizeDomain),
    standards: (standardsRes.data || []).map(normalizeStandard),
    keywords: keywordsRes.data || [],
    scriptureRefs: scriptureRefsRes.data || [],
    hasErrors: !!(
      documentsRes.error ||
      domainsRes.error ||
      standardsRes.error ||
      keywordsRes.error
    ),
  };
}

/** Builds a shuffled list of topic suggestions from the library. */
export function buildTopicsFromLibrary(library, limit = 8) {
  const items = [];
  const seen = new Set();

  for (const domain of library.domains || []) {
    const label = (domain.domain_title || "").trim();
    const content = truncateText(
      [domain.purpose_text, domain.anchor_scripture, domain.content_text]
        .filter(Boolean)
        .join("\n\n"),
      900
    );
    if (label && content && !seen.has(label)) {
      seen.add(label);
      items.push({ label, content, subjectCode: domain.subject_code, type: "domain" });
    }
  }

  for (const standard of library.standards || []) {
    const label = `${standard.standard_code} — ${standard.standard_title}`.trim();
    const content = truncateText(
      [standard.standard_text, standard.scope_text, standard.instructional_focus]
        .filter(Boolean)
        .join("\n\n"),
      900
    );
    if (label && content && !seen.has(label)) {
      seen.add(label);
      items.push({ label, content, subjectCode: standard.subject_code, type: "standard" });
    }
  }

  // Shuffle
  for (let i = items.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [items[i], items[j]] = [items[j], items[i]];
  }
  return items.slice(0, limit);
}

/** Builds a structured curriculum tree from the library. */
export function buildCurriculumFromLibrary(library) {
  const subjects = {
    OG: { title: "The One True God", code: "OG", color: "#003DA5", domains: [] },
    NB: { title: "The New Birth", code: "NB", color: "#dc2626", domains: [] },
  };
  const domainMapById = new Map();
  const domainMapByCode = new Map();

  (library.domains || [])
    .sort((a, b) => {
      if (a.subject_code !== b.subject_code)
        return a.subject_code.localeCompare(b.subject_code);
      return Number(a.domain_number || 0) - Number(b.domain_number || 0);
    })
    .forEach((domain) => {
      const domainCode =
        domain.domain_code || `${domain.subject_code}.${domain.domain_number}`;
      const entry = { code: domainCode, title: domain.domain_title, standards: [] };
      domainMapById.set(domain.domain_id, entry);
      domainMapByCode.set(domainCode, entry);
      if (subjects[domain.subject_code]) subjects[domain.subject_code].domains.push(entry);
    });

  (library.standards || [])
    .sort((a, b) =>
      (a.standard_code || "").localeCompare(b.standard_code || "", undefined, {
        numeric: true,
      })
    )
    .forEach((standard) => {
      let parent = domainMapById.get(standard.domain_id);
      if (!parent && standard.domain_code_guess)
        parent = domainMapByCode.get(standard.domain_code_guess);
      if (!parent && standard.domain_code_guess) {
        const subjectCode = String(
          standard.subject_code || standard.domain_code_guess.split(".")[0]
        ).toUpperCase();
        if (subjects[subjectCode]) {
          parent = {
            code: standard.domain_code_guess,
            title: standard.domain_code_guess,
            standards: [],
          };
          domainMapByCode.set(standard.domain_code_guess, parent);
          subjects[subjectCode].domains.push(parent);
        }
      }
      if (parent)
        parent.standards.push({
          code: standard.standard_code,
          title: standard.standard_title || "",
        });
    });

  Object.values(subjects).forEach((subject) => {
    subject.domains.sort(
      (a, b) =>
        toInt(String(a.code).split(".")[1], 0) - toInt(String(b.code).split(".")[1], 0)
    );
  });
  return subjects;
}

/** Returns the total number of standards across a curriculum tree. */
export function countCurriculumStandards(curriculum) {
  return Object.values(curriculum || {}).reduce(
    (sum, subject) =>
      sum +
      (subject.domains || []).reduce(
        (inner, domain) => inner + (domain.standards?.length || 0),
        0
      ),
    0
  );
}

/** Searches the knowledge library by query and returns scored results. */
export async function searchKnowledgeLibrary(query) {
  const standardCode = extractStandardCode(query);
  const keywords = tokenizeQuery(query);
  const library = await loadKnowledgeLibrary();
  const keywordMapByStandard = new Map();
  const keywordMapByDomain = new Map();

  for (const row of library.keywords || []) {
    const keyword = String(row.keyword || "").toLowerCase();
    if (row.standard_id) {
      if (!keywordMapByStandard.has(row.standard_id))
        keywordMapByStandard.set(row.standard_id, []);
      keywordMapByStandard.get(row.standard_id).push(keyword);
    }
    if (row.domain_id) {
      if (!keywordMapByDomain.has(row.domain_id))
        keywordMapByDomain.set(row.domain_id, []);
      keywordMapByDomain.get(row.domain_id).push(keyword);
    }
  }

  const domainsById = new Map(
    (library.domains || []).map((d) => [d.domain_id, d])
  );

  if (standardCode) {
    const exact = (library.standards || []).find(
      (s) => (s.standard_code || "").toUpperCase() === standardCode
    );
    if (exact) {
      const parentDomain = domainsById.get(exact.domain_id);
      return [
        {
          type: "standard",
          score: 999,
          code: exact.standard_code,
          title: exact.standard_title,
          subject_code: exact.subject_code,
          domain_title: parentDomain?.domain_title || exact.domain_code_guess || "",
          content: [
            exact.standard_text,
            exact.scope_text,
            exact.instructional_focus,
            exact.content_text,
          ]
            .filter(Boolean)
            .join("\n\n"),
        },
      ];
    }
  }

  const standardResults = (library.standards || []).map((standard) => {
    const parentDomain = domainsById.get(standard.domain_id);
    const standardKeywords = keywordMapByStandard.get(standard.standard_id) || [];
    let score = 0;
    score += scoreTextAgainstKeywords(standard.standard_title, keywords, 4);
    score += scoreTextAgainstKeywords(standard.standard_code, keywords, 8);
    score += scoreTextAgainstKeywords(standard.standard_text, keywords, 3);
    score += scoreTextAgainstKeywords(standard.scope_text, keywords, 2);
    score += scoreTextAgainstKeywords(standard.instructional_focus, keywords, 1);
    score += scoreTextAgainstKeywords(
      parentDomain?.domain_title || standard.domain_code_guess,
      keywords,
      2
    );
    score += scoreTextAgainstKeywords(standardKeywords.join(" "), keywords, 3);
    return {
      type: "standard",
      score,
      code: standard.standard_code,
      title: standard.standard_title,
      subject_code: standard.subject_code,
      domain_title: parentDomain?.domain_title || standard.domain_code_guess || "",
      content: [
        standard.standard_code,
        standard.standard_title,
        standard.standard_text,
        standard.scope_text,
        standard.instructional_focus,
        standard.content_text,
        parentDomain?.domain_title,
        parentDomain?.anchor_scripture,
        standardKeywords.join(" "),
      ]
        .filter(Boolean)
        .join("\n"),
    };
  });

  const domainResults = (library.domains || []).map((domain) => {
    const domainKeywords = keywordMapByDomain.get(domain.domain_id) || [];
    const relatedStandards = (library.standards || [])
      .filter((s) => s.domain_id === domain.domain_id)
      .slice(0, 4);
    let score = 0;
    score += scoreTextAgainstKeywords(domain.domain_title, keywords, 4);
    score += scoreTextAgainstKeywords(domain.anchor_scripture, keywords, 2);
    score += scoreTextAgainstKeywords(domain.purpose_text, keywords, 2);
    score += scoreTextAgainstKeywords(domain.content_text, keywords, 1);
    score += scoreTextAgainstKeywords(domainKeywords.join(" "), keywords, 3);
    return {
      type: "domain",
      score,
      code: domain.domain_code || `${domain.subject_code}.${domain.domain_number}`,
      title: domain.domain_title,
      subject_code: domain.subject_code,
      domain_title: domain.domain_title,
      content: [
        domain.domain_title,
        domain.anchor_scripture,
        domain.purpose_text,
        domain.content_text,
        relatedStandards
          .map((s) => `${s.standard_code} ${s.standard_title}`)
          .join("\n"),
        domainKeywords.join(" "),
      ]
        .filter(Boolean)
        .join("\n\n"),
    };
  });

  return [...standardResults, ...domainResults]
    .filter((item) => item.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, 6)
    .map((item) => ({ ...item, content: truncateText(item.content, 2400) }));
}

/** Builds a formatted study context string from search results. */
export async function buildStudyContext(query) {
  const results = await searchKnowledgeLibrary(query);
  if (!results || results.length === 0) return null;
  return results
    .map((item) => {
      const heading =
        item.type === "standard"
          ? `[${item.subject_code} | ${item.code} | ${item.title} | ${item.domain_title}]`
          : `[${item.subject_code} | DOMAIN | ${item.title}]`;
      return `${heading}\n${truncateText(item.content, 1800)}`;
    })
    .join("\n\n---\n\n");
}

/** Replaces mild profanity with cleaner alternatives before sending to Claude. */
export function sanitizeForClaude(text) {
  const replacements = [
    [/damn/gi, "dang"],
    [/hell/gi, "heck"],
    [/crap/gi, "crud"],
    [/ass/gi, "butt"],
    [/pissed/gi, "annoyed"],
    [/piss/gi, "tick"],
    [/screw/gi, "forget"],
    [/wth/gi, "what"],
    [/wtf/gi, "what"],
    [/bs/gi, "nonsense"],
    [/freaking/gi, "really"],
    [/freakin/gi, "really"],
  ];
  let out = text;
  for (const [pattern, replacement] of replacements) out = out.replace(pattern, replacement);
  return out;
}

/**
 * Generates a short title from the first message in a conversation.
 * Trims to 6 words and appends an ellipsis if truncated.
 */
export function generateTitle(firstMessage) {
  const words = firstMessage.trim().split(/\s+/).slice(0, 6).join(" ");
  return words.length < firstMessage.trim().length ? words + "…" : words;
}

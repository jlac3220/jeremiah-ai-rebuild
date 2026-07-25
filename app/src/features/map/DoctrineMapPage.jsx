import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  getSubjects,
  isSubjectUnlocked,
  isSubjectMastered,
  getNextUnmasteredStandard,
} from "../../core/standards/standardsRegistry";
import { getStandardProgress } from "../../core/standards/standardsProgress";
import { classroomPath } from "../../app/routes";
import { colors, ignite, radius, fonts, gradients, getSubjectAccent } from "../../shared/theme";
import { nodeHover, igniteGlow, currentPulse } from "../../shared/motion";
import RingProgress from "../../shared/ui/RingProgress";
import { LockIcon, FlameMark, ChevronIcon } from "../../shared/ui/icons";

// A short winding trail per domain (Khan/Duolingo-style path) instead of a
// flat grid of rectangles — nodes alternate horizontal offset along a
// vertical spine, with mastery shown as a filled ring around each node.
const ZIGZAG_OFFSETS = [0, 42, 0, -42];

function nodeStateFor(level, isNext) {
  if (level >= 4) return "mastered";
  if (isNext) return "current";
  if (level >= 1) return "inProgress";
  return "unstarted";
}

// Domains hold themselves collapsed until reached — a subject can have 15+
// domains and 70+ standards, so rendering every node open at once (a) made
// the night-to-dawn gradient invisible (stretched over tens of thousands of
// pixels, essentially flat in any normal view) and (b) was heavy enough to
// noticeably jank scrolling. Each domain now runs its OWN short light-to-dark
// journey when expanded, which keeps the gradient meaningful and the page light.
function domainStats(domain, progress) {
  let mastered = 0;
  let inProgress = 0;
  domain.standards.forEach((s) => {
    const level = progress[s.code] || 0;
    if (level >= 4) mastered += 1;
    else if (level >= 1) inProgress += 1;
  });
  return { mastered, inProgress, total: domain.standards.length };
}

function subjectStats(subject, progress) {
  let mastered = 0;
  let total = 0;
  subject.domains.forEach((domain) => {
    domain.standards.forEach((s) => {
      total += 1;
      if ((progress[s.code] || 0) >= 4) mastered += 1;
    });
  });
  return { mastered, total };
}

// Same reasoning as domains, one level up: a subject can eventually hold
// dozens of domains, so the default view only expands the ONE subject
// that's actually active right now — everything locked or fully mastered
// collapses to a single summary row. This keeps page weight proportional
// to what's relevant, not total content, no matter how much gets added.
function computeDefaultOpenSubjects(subjects, progress) {
  const initial = new Set();
  const active = subjects.find(
    (subject) => isSubjectUnlocked(subject.code, progress) && !isSubjectMastered(subject.code, progress)
  );
  if (active) {
    initial.add(active.code);
  } else if (subjects.length > 0) {
    initial.add(subjects[subjects.length - 1].code);
  }
  return initial;
}

function computeDefaultOpenDomains(subjects, progress, nextStandard) {
  const initial = new Set();
  subjects.forEach((subject) => {
    subject.domains.forEach((domain) => {
      const hasProgress = domain.standards.some((s) => (progress[s.code] || 0) > 0);
      const hasNext = domain.standards.some((s) => nextStandard?.code === s.code);
      if (hasProgress || hasNext) initial.add(domain.domainCode);
    });
  });
  return initial;
}

function standardMatchesQuery(standard, query) {
  return standard.title.toLowerCase().includes(query) || standard.code.toLowerCase().includes(query);
}

function domainMatchesQuery(domain, query) {
  return (
    domain.domainTitle.toLowerCase().includes(query) ||
    domain.domainCode.toLowerCase().includes(query) ||
    domain.standards.some((standard) => standardMatchesQuery(standard, query))
  );
}

// Within one expanded domain (a handful of nodes), pick a light/mid/dark
// text zone by position — short enough now that the gradient is always
// visible in a single view.
function nodeZoneFor(index, count) {
  const fraction = index / Math.max(count - 1, 1);
  if (fraction < 0.34) return "light";
  if (fraction < 0.62) return "mid";
  return "dark";
}

const ZONE_TEXT = {
  light: { code: colors.textFaint, title: colors.text, shadow: "none" },
  mid: { code: "rgba(243,241,246,0.7)", title: "#f8f4f6", shadow: "0 1px 5px rgba(0,0,0,0.3)" },
  dark: { code: colors.mistOnDark, title: "#f3f1f6", shadow: "0 1px 6px rgba(0,0,0,0.45)" },
};

export default function DoctrineMapPage() {
  const navigate = useNavigate();
  const progress = useMemo(() => getStandardProgress(), []);
  const subjects = getSubjects();
  const nextStandard = useMemo(() => getNextUnmasteredStandard(progress), [progress]);

  const [openSubjects, setOpenSubjects] = useState(() => computeDefaultOpenSubjects(subjects, progress));
  // Open by default: any domain with progress in it, or the one holding the
  // very next standard — everything else starts collapsed.
  const [openDomains, setOpenDomains] = useState(() => computeDefaultOpenDomains(subjects, progress, nextStandard));
  const [searchQuery, setSearchQuery] = useState("");
  const trimmedQuery = searchQuery.trim().toLowerCase();
  const isSearching = trimmedQuery.length > 0;

  function toggleSubject(subjectCode) {
    setOpenSubjects((current) => {
      const next = new Set(current);
      if (next.has(subjectCode)) next.delete(subjectCode);
      else next.add(subjectCode);
      return next;
    });
  }

  function toggleDomain(domainCode) {
    setOpenDomains((current) => {
      const next = new Set(current);
      if (next.has(domainCode)) next.delete(domainCode);
      else next.add(domainCode);
      return next;
    });
  }

  function expandAll() {
    setOpenSubjects(new Set(subjects.map((subject) => subject.code)));
    setOpenDomains(new Set(subjects.flatMap((subject) => subject.domains.map((domain) => domain.domainCode))));
  }

  function collapseToCurrent() {
    setOpenSubjects(computeDefaultOpenSubjects(subjects, progress));
    setOpenDomains(computeDefaultOpenDomains(subjects, progress, nextStandard));
  }

  return (
    <div style={pageStyle}>
      <div style={contentStyle}>
        <motion.section
          style={heroStyle}
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <p style={eyebrowStyle}>THE PATH OF FIRE</p>
          <h1 style={titleStyle}>
            Light dawns <em style={titleEmStyle}>one standard</em> at a time.
          </h1>
          <p style={subtitleStyle}>
            Every doctrine you've mastered sits lit behind you. What's ahead stays dark until
            you reach it — no percentage bar, just distance walked.
          </p>
        </motion.section>

        <div style={toolbarRowStyle}>
          <input
            type="text"
            value={searchQuery}
            onChange={(event) => setSearchQuery(event.target.value)}
            placeholder="Search a standard or domain…"
            style={searchInputStyle}
          />
          <div style={toolbarButtonsStyle}>
            <button type="button" onClick={expandAll} style={toolbarButtonStyle}>
              Expand All
            </button>
            <button type="button" onClick={collapseToCurrent} style={toolbarButtonStyle}>
              Collapse to Current
            </button>
          </div>
        </div>

        {subjects.map((subject) => {
          const unlocked = isSubjectUnlocked(subject.code, progress);
          const mastered = isSubjectMastered(subject.code, progress);
          const accent = getSubjectAccent(subject.code);
          const stats = subjectStats(subject, progress);

          const subjectHasMatch = isSearching && subject.domains.some((domain) => domainMatchesQuery(domain, trimmedQuery));
          if (isSearching && !subjectHasMatch) return null;
          const subjectOpen = isSearching ? true : openSubjects.has(subject.code);

          return (
            <section key={subject.code} style={subjectSectionStyle}>
              <button
                type="button"
                onClick={() => toggleSubject(subject.code)}
                style={subjectHeaderButtonStyle}
                aria-expanded={subjectOpen}
              >
                <div>
                  <p style={{ ...subjectEyebrowStyle, color: accent.base }}>Subject {subject.code}</p>
                  <h2 style={subjectTitleStyle}>{subject.title}</h2>
                </div>
                <div style={subjectHeaderRightStyle}>
                  <span style={subjectCountStyle}>{stats.mastered}/{stats.total} mastered</span>
                  <div
                    style={{
                      ...lockPillStyle,
                      ...(mastered
                        ? { background: colors.masteredBg, color: colors.masteredText }
                        : unlocked
                          ? { background: accent.soft, color: accent.text }
                          : { background: ignite.lockedBg, color: ignite.lockedText }),
                    }}
                  >
                    {mastered ? "Mastered" : unlocked ? "Unlocked" : "Locked"}
                  </div>
                  <ChevronIcon
                    size={18}
                    style={{
                      color: colors.textFaint,
                      transform: subjectOpen ? "rotate(90deg)" : "rotate(0deg)",
                      transition: "transform 180ms ease",
                    }}
                  />
                </div>
              </button>

              <AnimatePresence initial={false}>
                {subjectOpen ? (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.28, ease: "easeOut" }}
                    style={{ overflow: "hidden" }}
                  >
                    {!unlocked ? (
                      <p style={lockedTextStyle}>
                        This subject unlocks once every standard in the previous subject is mastered.
                      </p>
                    ) : null}

                    <div style={domainListStyle}>
                      {subject.domains.map((domain) => {
                        const domainMatch = isSearching && domainMatchesQuery(domain, trimmedQuery);
                        if (isSearching && !domainMatch) return null;
                        const isOpen = isSearching ? true : openDomains.has(domain.domainCode);
                        const dStats = domainStats(domain, progress);
                        const hasNext = domain.standards.some((s) => nextStandard?.code === s.code);

                        return (
                          <div key={domain.domainCode} style={domainBlockStyle}>
                            <button
                              type="button"
                              onClick={() => toggleDomain(domain.domainCode)}
                              style={domainSummaryButtonStyle}
                              aria-expanded={isOpen}
                            >
                              <span style={domainSummaryTextWrapStyle}>
                                <span style={domainCodeLabelStyle}>{domain.domainCode}</span>
                                <span style={domainTitleLabelStyle}>{domain.domainTitle}</span>
                              </span>
                              <span style={domainSummaryRightStyle}>
                                {hasNext ? <span style={{ ...nextPillStyle, color: colors.gold }}>Next up</span> : null}
                                <span style={domainCountStyle}>
                                  {dStats.mastered}/{dStats.total} mastered
                                </span>
                                <ChevronIcon
                                  size={16}
                                  style={{
                                    color: colors.textFaint,
                                    transform: isOpen ? "rotate(90deg)" : "rotate(0deg)",
                                    transition: "transform 180ms ease",
                                  }}
                                />
                              </span>
                            </button>

                            <AnimatePresence initial={false}>
                              {isOpen ? (
                                <motion.div
                                  initial={{ height: 0, opacity: 0 }}
                                  animate={{ height: "auto", opacity: 1 }}
                                  exit={{ height: 0, opacity: 0 }}
                                  transition={{ duration: 0.28, ease: "easeOut" }}
                                  style={{ overflow: "hidden" }}
                                >
                                  <div style={pathWrapStyle}>
                                    <div style={trailWrapStyle}>
                                      <div style={trailSpineStyle} aria-hidden="true" />
                                      <div style={trailNodesStyle}>
                                        {domain.standards.map((standard, i) => {
                                          const level = progress[standard.code] || 0;
                                          const isNext = unlocked && nextStandard?.code === standard.code;
                                          const state = nodeStateFor(level, isNext);
                                          const interactive = unlocked;
                                          const offset = ZIGZAG_OFFSETS[i % ZIGZAG_OFFSETS.length];
                                          const zoneText = ZONE_TEXT[nodeZoneFor(i, domain.standards.length)];
                                          const ringFill =
                                            state === "mastered"
                                              ? ignite.blaze
                                              : state === "current"
                                                ? colors.gold
                                                : state === "inProgress"
                                                  ? accent.base
                                                  : colors.textFaint;

                                          return (
                                            <div
                                              key={standard.code}
                                              style={{ ...trailNodeRowStyle, transform: `translateX(${offset}px)` }}
                                            >
                                              <motion.button
                                                type="button"
                                                disabled={!interactive}
                                                onClick={() => navigate(classroomPath(standard.code))}
                                                {...(interactive ? nodeHover : {})}
                                                {...(state === "mastered" ? igniteGlow : {})}
                                                {...(state === "current" ? currentPulse : {})}
                                                style={{
                                                  ...nodeCircleButtonStyle,
                                                  ...(state === "current" ? { border: `2px solid ${colors.gold}` } : null),
                                                  ...(interactive ? null : { cursor: "not-allowed", opacity: 0.65 }),
                                                }}
                                              >
                                                <RingProgress
                                                  percent={(level / 4) * 100}
                                                  size={64}
                                                  strokeWidth={5}
                                                  trackColor="#e2e8f0"
                                                  fillColor={ringFill}
                                                >
                                                  {!interactive ? (
                                                    <LockIcon size={20} />
                                                  ) : state === "mastered" ? (
                                                    <FlameMark size={24} />
                                                  ) : (
                                                    <span style={{ fontFamily: fonts.mono, fontSize: "1.1rem", fontWeight: 600 }}>
                                                      {i + 1}
                                                    </span>
                                                  )}
                                                </RingProgress>
                                              </motion.button>
                                              <div style={trailLabelStyle}>
                                                <p style={{ ...trailCodeStyle, color: zoneText.code }}>{standard.code}</p>
                                                <p style={{ ...trailTitleTextStyle, color: zoneText.title, textShadow: zoneText.shadow }}>
                                                  {standard.title}
                                                </p>
                                              </div>
                                            </div>
                                          );
                                        })}
                                      </div>
                                    </div>
                                  </div>
                                </motion.div>
                              ) : null}
                            </AnimatePresence>
                          </div>
                        );
                      })}
                    </div>
                  </motion.div>
                ) : null}
              </AnimatePresence>
            </section>
          );
        })}
      </div>
    </div>
  );
}

const pageStyle = {
  minHeight: "100%",
  background:
    "radial-gradient(ellipse 70% 50% at 10% 0%, rgba(255, 138, 0, 0.18) 0%, transparent 55%)," +
    "radial-gradient(ellipse 60% 40% at 95% 15%, rgba(220, 38, 38, 0.14) 0%, transparent 55%)," +
    "linear-gradient(180deg, #0b1228 0%, #16233b 45%, #f8fafc 45%)",
};

const contentStyle = {
  width: "100%",
  maxWidth: "1040px",
  margin: "0 auto",
  padding: "32px 20px 120px",
  boxSizing: "border-box",
};

const heroStyle = {
  marginBottom: "28px",
};

const eyebrowStyle = {
  margin: 0,
  fontFamily: fonts.mono,
  fontSize: "0.76rem",
  fontWeight: 500,
  letterSpacing: "0.16em",
  textTransform: "uppercase",
  color: colors.gold,
};

const titleStyle = {
  margin: "14px 0 0",
  fontFamily: fonts.display,
  fontStyle: "italic",
  fontVariationSettings: '"opsz" 90, "wght" 400, "SOFT" 15, "WONK" 1',
  fontSize: "clamp(2.4rem, 5.6vw, 3.8rem)",
  lineHeight: 1.06,
  color: "#ffffff",
};

const titleEmStyle = {
  fontStyle: "italic",
  background: gradients.flame,
  WebkitBackgroundClip: "text",
  backgroundClip: "text",
  color: "transparent",
};

const subtitleStyle = {
  margin: "18px 0 0",
  maxWidth: "720px",
  fontSize: "1.05rem",
  lineHeight: 1.7,
  color: "rgba(255,255,255,0.82)",
};

const subjectSectionStyle = {
  borderRadius: radius.lg,
  overflow: "hidden",
  boxShadow: colors.cardShadow,
  marginBottom: "22px",
};

const subjectHeaderButtonStyle = {
  width: "100%",
  display: "flex",
  justifyContent: "space-between",
  alignItems: "flex-start",
  gap: "16px",
  flexWrap: "wrap",
  padding: "26px 26px",
  background: "#f3f1f6",
  border: "none",
  cursor: "pointer",
  textAlign: "left",
};

const subjectHeaderRightStyle = {
  display: "flex",
  alignItems: "center",
  gap: "12px",
  flexShrink: 0,
};

const subjectCountStyle = {
  fontFamily: fonts.mono,
  fontSize: "0.8rem",
  color: colors.textFaint,
  whiteSpace: "nowrap",
};

const toolbarRowStyle = {
  display: "flex",
  gap: "12px",
  alignItems: "center",
  flexWrap: "wrap",
  marginBottom: "20px",
};

const searchInputStyle = {
  flex: "1 1 240px",
  padding: "12px 16px",
  borderRadius: radius.pill,
  border: "1px solid rgba(255,255,255,0.18)",
  background: "rgba(255,255,255,0.08)",
  color: "#ffffff",
  fontSize: "0.94rem",
  outline: "none",
};

const toolbarButtonsStyle = {
  display: "flex",
  gap: "8px",
  flexShrink: 0,
};

const toolbarButtonStyle = {
  padding: "10px 14px",
  borderRadius: radius.pill,
  border: "1px solid rgba(255,255,255,0.22)",
  background: "rgba(255,255,255,0.06)",
  color: "rgba(255,255,255,0.85)",
  fontSize: "0.82rem",
  fontWeight: 700,
  cursor: "pointer",
  whiteSpace: "nowrap",
};

const subjectEyebrowStyle = {
  margin: 0,
  fontSize: "0.8rem",
  textTransform: "uppercase",
  letterSpacing: "0.08em",
  color: colors.textFaint,
  fontWeight: 700,
};

const subjectTitleStyle = {
  margin: "8px 0 0",
  fontSize: "1.65rem",
  lineHeight: 1.15,
  color: colors.text,
  fontWeight: 900,
};

const lockPillStyle = {
  display: "inline-flex",
  alignItems: "center",
  padding: "10px 14px",
  borderRadius: radius.pill,
  fontSize: "0.85rem",
  fontWeight: 800,
};

const lockedTextStyle = {
  margin: 0,
  padding: "6px 26px 22px",
  fontSize: "0.95rem",
  lineHeight: 1.6,
  color: colors.textFaint,
  background: "#f3f1f6",
};

const pathWrapStyle = {
  background: gradients.pathOfFire,
  borderRadius: radius.md,
  padding: "20px 10px 32px",
  marginTop: "2px",
};

const domainListStyle = {
  background: "#f3f1f6",
  padding: "6px 26px 26px",
};

const domainBlockStyle = {
  borderTop: "1px solid rgba(28, 20, 32, 0.08)",
};

const domainSummaryButtonStyle = {
  width: "100%",
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  gap: "14px",
  padding: "16px 4px",
  border: "none",
  background: "transparent",
  cursor: "pointer",
  textAlign: "left",
};

const domainSummaryTextWrapStyle = {
  display: "flex",
  flexDirection: "column",
  gap: "3px",
  minWidth: 0,
};

const domainCodeLabelStyle = {
  fontFamily: fonts.mono,
  fontSize: "0.7rem",
  fontWeight: 500,
  letterSpacing: "0.1em",
  textTransform: "uppercase",
  color: colors.textFaint,
};

const domainTitleLabelStyle = {
  fontSize: "0.98rem",
  fontWeight: 800,
  color: colors.text,
};

const domainSummaryRightStyle = {
  display: "flex",
  alignItems: "center",
  gap: "12px",
  flexShrink: 0,
};

const nextPillStyle = {
  fontFamily: fonts.mono,
  fontSize: "0.68rem",
  fontWeight: 600,
  letterSpacing: "0.06em",
  textTransform: "uppercase",
};

const domainCountStyle = {
  fontFamily: fonts.mono,
  fontSize: "0.76rem",
  color: colors.textFaint,
  whiteSpace: "nowrap",
};

const trailWrapStyle = {
  position: "relative",
  padding: "4px 0",
};

const trailSpineStyle = {
  position: "absolute",
  left: "50%",
  top: "32px",
  bottom: "32px",
  width: "2px",
  transform: "translateX(-50%)",
  background: "repeating-linear-gradient(to bottom, rgba(255,210,63,0.55) 0, rgba(255,210,63,0.55) 5px, transparent 5px, transparent 13px)",
  zIndex: 0,
};

const trailNodesStyle = {
  position: "relative",
  zIndex: 1,
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  gap: "6px",
};

const trailNodeRowStyle = {
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  gap: "8px",
};

const nodeCircleButtonStyle = {
  width: "64px",
  height: "64px",
  borderRadius: "999px",
  border: "none",
  background: "#ffffff",
  boxShadow: "0 6px 16px rgba(15, 23, 42, 0.12)",
  cursor: "pointer",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  padding: 0,
};

const trailLabelStyle = {
  textAlign: "center",
  maxWidth: "180px",
};

const trailCodeStyle = {
  margin: 0,
  fontSize: "0.72rem",
  fontWeight: 800,
  letterSpacing: "0.05em",
  textTransform: "uppercase",
  color: colors.textFaint,
};

const trailTitleTextStyle = {
  margin: "2px 0 0",
  fontSize: "0.86rem",
  fontWeight: 700,
  color: colors.text,
  lineHeight: 1.3,
};

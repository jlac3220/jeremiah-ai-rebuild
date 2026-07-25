import { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
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
import { LockIcon, FlameMark } from "../../shared/ui/icons";

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

// The Path of Fire gradient runs light-to-dark top to bottom. Rather than
// track literal scroll position, each domain's text picks a zone by how far
// through the subject it sits — standards are learned in order, so this
// tracks the actual lit/unlit boundary closely enough to stay legible.
function zoneFor(domainIndex, domainCount) {
  const fraction = domainIndex / Math.max(domainCount - 1, 1);
  if (fraction < 0.32) return "light";
  if (fraction < 0.58) return "mid";
  return "dark";
}

const ZONE_TEXT = {
  light: { domain: colors.textMuted, code: colors.textFaint, title: colors.text, shadow: "none" },
  mid: { domain: "#f3e9ec", code: "rgba(243,241,246,0.7)", title: "#f8f4f6", shadow: "0 1px 5px rgba(0,0,0,0.3)" },
  dark: { domain: colors.gold, code: colors.mistOnDark, title: "#f3f1f6", shadow: "0 1px 6px rgba(0,0,0,0.45)" },
};

export default function DoctrineMapPage() {
  const navigate = useNavigate();
  const progress = useMemo(() => getStandardProgress(), []);
  const subjects = getSubjects();
  const nextStandard = useMemo(() => getNextUnmasteredStandard(progress), [progress]);

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

        {subjects.map((subject) => {
          const unlocked = isSubjectUnlocked(subject.code, progress);
          const mastered = isSubjectMastered(subject.code, progress);
          const accent = getSubjectAccent(subject.code);

          return (
            <section key={subject.code} style={subjectSectionStyle}>
              <div style={subjectHeaderStyle}>
                <div>
                  <p style={{ ...subjectEyebrowStyle, color: accent.base }}>Subject {subject.code}</p>
                  <h2 style={subjectTitleStyle}>{subject.title}</h2>
                </div>
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
              </div>

              {!unlocked ? (
                <p style={lockedTextStyle}>
                  This subject unlocks once every standard in the previous subject is mastered.
                </p>
              ) : null}

              <div style={pathWrapStyle}>
                {subject.domains.map((domain, domainIndex) => {
                  const zone = zoneFor(domainIndex, subject.domains.length);
                  const zoneText = ZONE_TEXT[zone];

                  return (
                    <div key={domain.domainCode} style={domainBlockStyle}>
                      <p style={{ ...domainTitleStyle, color: zoneText.domain, textShadow: zoneText.shadow }}>
                        {domain.domainCode} — {domain.domainTitle}
                      </p>

                      <div style={trailWrapStyle}>
                        <div style={trailSpineStyle} aria-hidden="true" />
                        <div style={trailNodesStyle}>
                          {domain.standards.map((standard, i) => {
                            const level = progress[standard.code] || 0;
                            const isNext = unlocked && nextStandard?.code === standard.code;
                            const state = nodeStateFor(level, isNext);
                            const interactive = unlocked;
                            const offset = ZIGZAG_OFFSETS[i % ZIGZAG_OFFSETS.length];
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
                  );
                })}
              </div>
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

const subjectHeaderStyle = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "flex-start",
  gap: "16px",
  flexWrap: "wrap",
  padding: "26px 26px 8px",
  background: "#f3f1f6",
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
  padding: "18px 26px 40px",
};

const domainBlockStyle = {
  marginTop: "24px",
};

const domainTitleStyle = {
  margin: "0 0 16px",
  fontFamily: fonts.mono,
  fontSize: "0.72rem",
  fontWeight: 500,
  letterSpacing: "0.1em",
  textTransform: "uppercase",
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

import { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  getSubjects,
  isSubjectUnlocked,
  isSubjectMastered,
} from "../../core/standards/standardsRegistry";
import { getStandardProgress } from "../../core/standards/standardsProgress";
import { classroomPath } from "../../app/routes";
import { colors, ignite, radius, getSubjectAccent } from "../../shared/theme";
import { nodeHover, igniteGlow } from "../../shared/motion";
import RingProgress from "../../shared/ui/RingProgress";
import { LockIcon } from "../../shared/ui/icons";

// A short winding trail per domain (Khan/Duolingo-style path) instead of a
// flat grid of rectangles — nodes alternate horizontal offset along a
// vertical spine, with mastery shown as a filled ring around each node.
const ZIGZAG_OFFSETS = [0, 42, 0, -42];

function nodeStateFor(level) {
  if (level >= 4) return "mastered";
  if (level >= 1) return "inProgress";
  return "unstarted";
}

export default function DoctrineMapPage() {
  const navigate = useNavigate();
  const progress = useMemo(() => getStandardProgress(), []);
  const subjects = getSubjects();

  return (
    <div style={pageStyle}>
      <div style={contentStyle}>
        <motion.section
          style={heroStyle}
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <p style={eyebrowStyle}>JEREMIAH AI DOCTRINE MAP</p>
          <h1 style={titleStyle}>The mind, laid open</h1>
          <p style={subtitleStyle}>
            Follow the path through each domain. A filled ring means mastered, a partial ring
            means in progress. Choose any node to enter a live session on that exact doctrine.
          </p>
        </motion.section>

        {subjects.map((subject) => {
          const unlocked = isSubjectUnlocked(subject.code, progress);
          const mastered = isSubjectMastered(subject.code, progress);
          const accent = getSubjectAccent(subject.code);

          return (
            <section
              key={subject.code}
              style={{ ...subjectSectionStyle, borderTop: `4px solid ${accent.base}` }}
            >
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

              {subject.domains.map((domain) => (
                <div key={domain.domainCode} style={domainBlockStyle}>
                  <p style={domainTitleStyle}>
                    {domain.domainCode} — {domain.domainTitle}
                  </p>

                  <div style={trailWrapStyle}>
                    <div style={trailSpineStyle} aria-hidden="true" />
                    <div style={trailNodesStyle}>
                      {domain.standards.map((standard, i) => {
                        const level = progress[standard.code] || 0;
                        const state = nodeStateFor(level);
                        const interactive = unlocked;
                        const offset = ZIGZAG_OFFSETS[i % ZIGZAG_OFFSETS.length];
                        const ringFill =
                          state === "mastered" ? ignite.blaze : state === "inProgress" ? accent.base : colors.textFaint;

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
                              style={{
                                ...nodeCircleButtonStyle,
                                ...(interactive ? null : { cursor: "not-allowed", opacity: 0.65 }),
                              }}
                            >
                              <RingProgress percent={(level / 4) * 100} size={64} strokeWidth={5} trackColor="#e2e8f0" fillColor={ringFill}>
                                {interactive ? (
                                  <span style={{ fontSize: "1.3rem" }}>
                                    {state === "mastered" ? "🔥" : i + 1}
                                  </span>
                                ) : (
                                  <LockIcon size={20} />
                                )}
                              </RingProgress>
                            </motion.button>
                            <div style={trailLabelStyle}>
                              <p style={trailCodeStyle}>{standard.code}</p>
                              <p style={trailTitleTextStyle}>{standard.title}</p>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              ))}
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
  fontSize: "0.82rem",
  fontWeight: 800,
  letterSpacing: "0.08em",
  textTransform: "uppercase",
  color: "rgba(255,255,255,0.7)",
};

const titleStyle = {
  margin: "10px 0 0",
  fontSize: "clamp(2.5rem, 6vw, 4rem)",
  lineHeight: 1.02,
  fontWeight: 900,
  color: "#ffffff",
};

const subtitleStyle = {
  margin: "16px 0 0",
  maxWidth: "720px",
  fontSize: "1.05rem",
  lineHeight: 1.7,
  color: "rgba(255,255,255,0.82)",
};

const subjectSectionStyle = {
  background: colors.cardBg,
  border: `1px solid ${colors.cardBorder}`,
  boxShadow: colors.cardShadow,
  borderRadius: radius.lg,
  padding: "26px",
  marginBottom: "22px",
};

const subjectHeaderStyle = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "flex-start",
  gap: "16px",
  flexWrap: "wrap",
  marginBottom: "8px",
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
  margin: "6px 0 18px",
  fontSize: "0.95rem",
  lineHeight: 1.6,
  color: colors.textFaint,
};

const domainBlockStyle = {
  marginTop: "24px",
};

const domainTitleStyle = {
  margin: "0 0 16px",
  fontSize: "0.98rem",
  fontWeight: 800,
  color: colors.textMuted,
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
  width: "3px",
  transform: "translateX(-50%)",
  background: "repeating-linear-gradient(to bottom, #e2e8f0 0, #e2e8f0 6px, transparent 6px, transparent 12px)",
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

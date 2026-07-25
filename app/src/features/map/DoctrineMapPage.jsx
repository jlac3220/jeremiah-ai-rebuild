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
import { staggerContainer, staggerItem, nodeHover, igniteGlow } from "../../shared/motion";

function nodeStateFor(level) {
  if (level >= 4) return "mastered";
  if (level >= 1) return "inProgress";
  return "unstarted";
}

function nodeStyleFor(state, accent) {
  if (state === "mastered") {
    return {
      background: `linear-gradient(135deg, ${ignite.ember} 0%, ${ignite.blaze} 100%)`,
      color: "#ffffff",
      border: "1px solid rgba(255,255,255,0.4)",
    };
  }
  if (state === "inProgress") {
    return {
      background: accent.soft,
      color: accent.text,
      boxShadow: `0 0 16px ${accent.base}33`,
      border: `1px solid ${accent.base}66`,
    };
  }
  return {
    background: "#f8fafc",
    color: colors.textFaint,
    border: `1px solid ${colors.cardBorder}`,
  };
}

const NODE_LABELS = {
  mastered: "Mastered",
  inProgress: "In Progress",
  unstarted: "Not Started",
};

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
            Every standard below is a point of understanding. Unlit nodes
            haven't been engaged yet, glowing amber ones are in progress, and
            fully ignited ones are mastered. Choose any standard to enter a
            live session with Jeremiah on that exact doctrine.
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
                  This subject unlocks once every standard in the previous
                  subject is mastered.
                </p>
              ) : null}

              {subject.domains.map((domain) => (
                <div key={domain.domainCode} style={domainBlockStyle}>
                  <p style={domainTitleStyle}>
                    {domain.domainCode} — {domain.domainTitle}
                  </p>

                  <motion.div
                    style={nodeGridStyle}
                    variants={staggerContainer}
                    initial="initial"
                    animate="animate"
                  >
                    {domain.standards.map((standard) => {
                      const level = progress[standard.code] || 0;
                      const state = nodeStateFor(level);
                      const nodeStyle = nodeStyleFor(state, accent);
                      const interactive = unlocked;

                      return (
                        <motion.button
                          key={standard.code}
                          type="button"
                          disabled={!interactive}
                          onClick={() => navigate(classroomPath(standard.code))}
                          variants={staggerItem}
                          {...(interactive ? nodeHover : {})}
                          {...(state === "mastered" ? igniteGlow : {})}
                          style={{
                            ...nodeButtonStyle,
                            ...nodeStyle,
                            ...(interactive ? null : { cursor: "not-allowed", opacity: 0.7 }),
                          }}
                        >
                          <span style={nodeCodeStyle}>{standard.code}</span>
                          <span style={nodeTitleStyle}>{standard.title}</span>
                          <span style={nodeStateStyle}>
                            {interactive ? NODE_LABELS[state] : "Locked"}
                          </span>
                        </motion.button>
                      );
                    })}
                  </motion.div>
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
  marginTop: "20px",
};

const domainTitleStyle = {
  margin: "0 0 12px",
  fontSize: "0.98rem",
  fontWeight: 800,
  color: colors.textMuted,
};

const nodeGridStyle = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))",
  gap: "12px",
};

const nodeButtonStyle = {
  textAlign: "left",
  borderRadius: radius.md,
  padding: "16px",
  display: "flex",
  flexDirection: "column",
  gap: "8px",
  cursor: "pointer",
  fontFamily: "inherit",
};

const nodeCodeStyle = {
  fontSize: "0.78rem",
  fontWeight: 800,
  letterSpacing: "0.06em",
  textTransform: "uppercase",
  opacity: 0.85,
};

const nodeTitleStyle = {
  fontSize: "1.02rem",
  fontWeight: 800,
  lineHeight: 1.3,
};

const nodeStateStyle = {
  fontSize: "0.82rem",
  fontWeight: 700,
  opacity: 0.85,
};

import { useMemo } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { homeData } from "../../data/homeData";
import {
  getAllStandards,
  getNextUnmasteredStandard,
  getStandardByCode,
} from "../../core/standards/standardsRegistry";
import { getStandardProgress, getDueForReview } from "../../core/standards/standardsProgress";
import { getDrillPoolStats } from "../../core/drill/drillEngine";
import { getStreak, hasEngagedToday } from "../../core/streak/streak";
import { ROUTES, classroomPath, defendPath } from "../../app/routes";
import Card from "../../shared/ui/Card";
import StatGrid from "../../shared/ui/StatGrid";
import ProgressBar from "../../shared/ui/ProgressBar";
import Pill from "../../shared/ui/Pill";
import PrimaryButton from "../../shared/ui/PrimaryButton";
import SecondaryButton from "../../shared/ui/SecondaryButton";
import { colors, fonts } from "../../shared/theme";
import { fadeInUp } from "../../shared/motion";
import { FlameMark } from "../../shared/ui/icons";

export default function HomePage() {
  const progress = useMemo(() => getStandardProgress(), []);
  const allStandards = useMemo(() => getAllStandards(), []);
  const nextStandard = useMemo(() => getNextUnmasteredStandard(progress), [progress]);
  const streak = useMemo(() => getStreak(), []);
  const engagedToday = useMemo(() => hasEngagedToday(), []);
  const dueForReview = useMemo(
    () => getDueForReview(progress).map((code) => getStandardByCode(code)).filter(Boolean),
    [progress]
  );
  const drillStats = useMemo(() => getDrillPoolStats(progress), [progress]);

  const mastered = allStandards.filter((s) => (progress[s.code] || 0) >= 4).length;
  const inProgress = allStandards.filter((s) => {
    const level = progress[s.code] || 0;
    return level > 0 && level < 4;
  }).length;
  const notStarted = allStandards.length - mastered - inProgress;
  const overallPercent = Math.round((mastered / allStandards.length) * 100);
  const nextStandardLevel = nextStandard ? progress[nextStandard.code] || 0 : 0;
  // Teacher-led: don't offer to start something new while a review has
  // slipped — consistent mastery means confirming you still hold it before
  // moving on, not just once. A standard already in progress is exempt;
  // this only guards what starts NEXT.
  const blockedByReview = nextStandardLevel === 0 && dueForReview.length > 0;

  return (
    <div style={pageStyle}>
      <div style={contentStyle}>
        <motion.section style={heroStyle} {...fadeInUp}>
          <p style={eyebrowStyle}>JEREMIAH AI</p>
          <h1 style={titleStyle}>{homeData.welcomeTitle}</h1>
          <p style={subtitleStyle}>{homeData.welcomeSubtitle}</p>
          {streak.count > 0 ? (
            <div style={hearthRowStyle}>
              <motion.div
                style={hearthGlowStyle}
                animate={{ scale: [1, 1.08, 1] }}
                transition={{ duration: 3.2, repeat: Infinity, ease: "easeInOut" }}
              >
                <FlameMark size={22} />
              </motion.div>
              <div>
                <p style={hearthCountStyle}>{streak.count}-day streak</p>
                <p style={hearthCaptionStyle}>
                  {engagedToday ? "Lit for today — come back tomorrow." : "Engage today to keep it lit."}
                </p>
              </div>
            </div>
          ) : null}
        </motion.section>

        <Card variant="dark" style={{ marginBottom: "20px" }}>
          {blockedByReview ? (
            <>
              <p style={pillStyle}>Before New Material</p>
              <h2 style={standardTitleStyle}>Let's confirm what's already yours.</h2>
              <p style={descriptionStyle}>
                {dueForReview.length} standard{dueForReview.length === 1 ? "" : "s"} came due for
                review. Consistent mastery means holding it, not just having passed it once —
                {nextStandard ? ` ${nextStandard.title} waits until these are clear.` : ""}
              </p>
              <div style={{ marginTop: "16px", display: "grid", gap: "10px" }}>
                {dueForReview.map((s) => (
                  <Link key={s.code} to={defendPath(s.code)} style={reviewLinkStyle}>
                    <div style={reviewItemStyle}>
                      <div>
                        <p style={itemTitleStyle}>{s.title}</p>
                        <p style={itemMetaStyle}>{s.code}</p>
                      </div>
                      <Pill tone="review">Defend</Pill>
                    </div>
                  </Link>
                ))}
              </div>
            </>
          ) : (
            <>
              <p style={pillStyle}>Continue Learning</p>
              {nextStandard ? (
                <>
                  <p style={trackLabelStyle}>{nextStandard.subjectTitle}</p>
                  <h2 style={standardTitleStyle}>{nextStandard.title}</h2>
                  <p style={descriptionStyle}>{nextStandard.statement}</p>
                  <div style={{ marginTop: "20px" }}>
                    <div style={evidenceRowStyle}>
                      <span>Evidence of learning</span>
                      <span>{nextStandardLevel} of 4</span>
                    </div>
                    <ProgressBar percent={(nextStandardLevel / 4) * 100} tone="light" />
                  </div>
                  <div style={cardFooterStyle}>
                    <Link to={classroomPath(nextStandard.code)}>
                      <PrimaryButton>Continue Classroom Session</PrimaryButton>
                    </Link>
                  </div>
                </>
              ) : (
                <>
                  <h2 style={standardTitleStyle}>Every standard is mastered</h2>
                  <p style={descriptionStyle}>
                    You've mastered everything currently in the Brain. Check the Map for what's next.
                  </p>
                  <div style={cardFooterStyle}>
                    <Link to={ROUTES.MAP}>
                      <PrimaryButton>Open Doctrine Map</PrimaryButton>
                    </Link>
                  </div>
                </>
              )}
            </>
          )}
        </Card>

        <Card style={{ marginBottom: "20px" }}>
          <h3 style={sectionTitleStyle}>Progress Snapshot</h3>
          <p style={sectionTextStyle}>
            {overallPercent}% of the full doctrine map is mastered.
          </p>
          <div style={{ marginTop: "16px" }}>
            <StatGrid
              stats={[
                { value: mastered, label: "Mastered" },
                { value: inProgress, label: "In Progress" },
                { value: notStarted, label: "Not Started" },
              ]}
            />
          </div>
        </Card>

        {dueForReview.length > 0 && !blockedByReview ? (
          <Card style={{ marginBottom: "20px" }}>
            <h3 style={sectionTitleStyle}>Review Queue</h3>
            <p style={sectionTextStyle}>
              {dueForReview.length} standard{dueForReview.length === 1 ? "" : "s"} due for spaced
              review — Jeremiah will argue the other side to see if it still holds.
            </p>
            <div style={{ marginTop: "14px", display: "grid", gap: "10px" }}>
              {dueForReview.map((standard) => (
                <Link key={standard.code} to={defendPath(standard.code)} style={reviewLinkStyle}>
                  <div style={reviewItemStyle}>
                    <div>
                      <p style={itemTitleStyle}>{standard.title}</p>
                      <p style={itemMetaStyle}>{standard.code}</p>
                    </div>
                    <Pill tone="review">Defend</Pill>
                  </div>
                </Link>
              ))}
            </div>
          </Card>
        ) : null}

        <Card variant="checkpoint" style={{ marginBottom: "20px" }}>
          <p style={reviewPillStyle}>Ask Jeremiah</p>
          <h3 style={reviewTitleStyle}>Have a doctrinal question right now?</h3>
          <p style={reviewTextStyle}>
            Ask Jeremiah directly — every answer is grounded in the real standards, not a
            generic chatbot guess.
          </p>
          <div style={{ marginTop: "16px" }}>
            <Link to={ROUTES.ASK}>
              <SecondaryButton>Open Ask Jeremiah</SecondaryButton>
            </Link>
          </div>
        </Card>

        {drillStats.total > 0 ? (
          <Card>
            <p style={reviewPillStyle}>Jeremiah AI · Quick Drill</p>
            <h3 style={reviewTitleStyle}>
              {drillStats.referenceCount} verses, {drillStats.vocabularyCount} terms,{" "}
              {drillStats.truthCount} truths ready to drill
            </h3>
            <p style={reviewTextStyle}>
              Mixed together, pulled from what you've actually studied — same classroom, faster
              pace.
            </p>
            <div style={{ marginTop: "16px" }}>
              <Link to={ROUTES.RAPID_FIRE}>
                <SecondaryButton>Quiz Me</SecondaryButton>
              </Link>
            </div>
          </Card>
        ) : null}
      </div>
    </div>
  );
}

const pageStyle = { minHeight: "100%", background: colors.pageGradient };

const contentStyle = {
  width: "100%",
  maxWidth: "760px",
  margin: "0 auto",
  padding: "32px 20px 120px",
  boxSizing: "border-box",
};

const heroStyle = { marginBottom: "24px", textAlign: "center" };

const eyebrowStyle = {
  margin: 0,
  fontFamily: fonts.mono,
  fontSize: "0.76rem",
  fontWeight: 500,
  letterSpacing: "0.16em",
  textTransform: "uppercase",
  color: colors.textMuted,
};

const titleStyle = {
  margin: "14px 0 0",
  fontFamily: fonts.display,
  fontStyle: "italic",
  fontVariationSettings: '"opsz" 90, "wght" 420, "SOFT" 12, "WONK" 1',
  fontSize: "clamp(2.4rem, 5.6vw, 3.6rem)",
  lineHeight: 1.05,
  color: colors.text,
};

const subtitleStyle = {
  margin: "16px auto 0",
  maxWidth: "560px",
  fontSize: "1.05rem",
  lineHeight: 1.65,
  color: colors.textMuted,
};

const pillStyle = {
  display: "inline-flex",
  padding: "9px 14px",
  borderRadius: "999px",
  background: "rgba(255,255,255,0.14)",
  fontSize: "0.82rem",
  fontWeight: 800,
  color: "#ffffff",
  margin: 0,
};

const trackLabelStyle = {
  margin: "18px 0 0",
  fontSize: "0.82rem",
  textTransform: "uppercase",
  letterSpacing: "0.08em",
  color: "rgba(255,255,255,0.6)",
  fontWeight: 700,
};

const standardTitleStyle = {
  margin: "8px 0 0",
  fontSize: "1.9rem",
  lineHeight: 1.1,
  fontWeight: 900,
  color: "#ffffff",
};

const descriptionStyle = {
  margin: "14px 0 0",
  fontSize: "1rem",
  lineHeight: 1.7,
  color: "rgba(255,255,255,0.84)",
};

const cardFooterStyle = { marginTop: "20px" };

const hearthRowStyle = {
  marginTop: "22px",
  display: "inline-flex",
  alignItems: "center",
  gap: "14px",
  padding: "12px 18px 12px 12px",
  borderRadius: "999px",
  background: "linear-gradient(160deg, #0f0b10, #241a22)",
  boxShadow: "0 12px 28px rgba(15, 11, 16, 0.28)",
};

const hearthGlowStyle = {
  width: "40px",
  height: "40px",
  borderRadius: "999px",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  background: "radial-gradient(circle, rgba(255,138,0,0.35) 0%, transparent 72%)",
};

const hearthCountStyle = {
  margin: 0,
  fontSize: "0.92rem",
  fontWeight: 800,
  color: "#f3f1f6",
  textAlign: "left",
};

const hearthCaptionStyle = {
  margin: "2px 0 0",
  fontSize: "0.78rem",
  color: "rgba(243,241,246,0.7)",
  textAlign: "left",
};

const evidenceRowStyle = {
  display: "flex",
  justifyContent: "space-between",
  fontSize: "0.85rem",
  color: "rgba(255,255,255,0.75)",
  marginBottom: "6px",
};

const reviewLinkStyle = { textDecoration: "none" };

const reviewItemStyle = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  gap: "16px",
  padding: "14px",
  borderRadius: "14px",
  background: "#f8fafc",
  border: `1px solid ${colors.cardBorder}`,
};

const itemTitleStyle = { margin: 0, fontSize: "0.98rem", fontWeight: 800, color: colors.text };
const itemMetaStyle = { margin: "4px 0 0", fontSize: "0.86rem", color: colors.textFaint };

const sectionTitleStyle = { margin: 0, fontSize: "1.18rem", fontWeight: 800, color: colors.text };
const sectionTextStyle = { margin: "8px 0 0", fontSize: "0.96rem", color: colors.textFaint };

const reviewPillStyle = {
  display: "inline-flex",
  padding: "7px 12px",
  borderRadius: "999px",
  background: "#ffedd5",
  color: colors.checkpointTextMid,
  fontSize: "0.8rem",
  fontWeight: 700,
  margin: 0,
};

const reviewTitleStyle = { margin: "12px 0 0", fontSize: "1.15rem", fontWeight: 800, color: colors.checkpointTextDark };
const reviewTextStyle = { margin: "10px 0 0", fontSize: "0.98rem", lineHeight: 1.65, color: colors.checkpointTextMid };

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
import { getStreak, hasEngagedToday } from "../../core/streak/streak";
import { ROUTES, classroomPath, defendPath } from "../../app/routes";
import Card from "../../shared/ui/Card";
import StatGrid from "../../shared/ui/StatGrid";
import ProgressBar from "../../shared/ui/ProgressBar";
import Pill from "../../shared/ui/Pill";
import PrimaryButton from "../../shared/ui/PrimaryButton";
import SecondaryButton from "../../shared/ui/SecondaryButton";
import { colors } from "../../shared/theme";
import { fadeInUp } from "../../shared/motion";

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

  const mastered = allStandards.filter((s) => (progress[s.code] || 0) >= 4).length;
  const inProgress = allStandards.filter((s) => {
    const level = progress[s.code] || 0;
    return level > 0 && level < 4;
  }).length;
  const notStarted = allStandards.length - mastered - inProgress;
  const overallPercent = Math.round((mastered / allStandards.length) * 100);
  const nextStandardLevel = nextStandard ? progress[nextStandard.code] || 0 : 0;

  return (
    <div style={pageStyle}>
      <div style={contentStyle}>
        <motion.section style={heroStyle} {...fadeInUp}>
          <p style={eyebrowStyle}>JEREMIAH AI</p>
          <h1 style={titleStyle}>{homeData.welcomeTitle}</h1>
          <p style={subtitleStyle}>{homeData.welcomeSubtitle}</p>
          {streak.count > 0 ? (
            <div style={streakRowStyle}>
              <Pill tone={engagedToday ? "mastered" : "review"}>
                🔥 {streak.count}-day streak{!engagedToday ? " — keep it alive today" : ""}
              </Pill>
            </div>
          ) : null}
        </motion.section>

        <Card variant="dark" style={{ marginBottom: "20px" }}>
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

        {dueForReview.length > 0 ? (
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

        <Card variant="checkpoint">
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
  fontSize: "0.82rem",
  fontWeight: 800,
  letterSpacing: "0.08em",
  textTransform: "uppercase",
  color: colors.textMuted,
};

const titleStyle = {
  margin: "10px 0 0",
  fontSize: "clamp(2.5rem, 6vw, 4rem)",
  lineHeight: 0.98,
  fontWeight: 900,
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

const streakRowStyle = { marginTop: "16px", display: "flex", justifyContent: "center" };

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

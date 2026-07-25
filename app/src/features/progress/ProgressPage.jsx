import { useMemo } from "react";
import { Link } from "react-router-dom";
import { getAllStandards } from "../../core/standards/standardsRegistry";
import { getStandardProgress } from "../../core/standards/standardsProgress";
import { getDrillPoolStats } from "../../core/drill/drillEngine";
import { ROUTES, classroomPath } from "../../app/routes";
import Card from "../../shared/ui/Card";
import StatGrid from "../../shared/ui/StatGrid";
import Pill from "../../shared/ui/Pill";
import PrimaryButton from "../../shared/ui/PrimaryButton";
import { BoltIcon } from "../../shared/ui/icons";
import { colors, fonts, gradients } from "../../shared/theme";

export default function ProgressPage() {
  const progress = useMemo(() => getStandardProgress(), []);
  const allStandards = useMemo(() => getAllStandards(), []);
  const drillStats = useMemo(() => getDrillPoolStats(progress), [progress]);

  const mastered = allStandards.filter((s) => (progress[s.code] || 0) >= 4);
  const inProgress = allStandards.filter((s) => {
    const level = progress[s.code] || 0;
    return level > 0 && level < 4;
  });
  const notStarted = allStandards.filter((s) => !(progress[s.code] || 0));

  return (
    <div style={pageStyle}>
      <div style={contentStyle}>
        <section style={heroStyle}>
          <p style={eyebrowStyle}>JEREMIAH AI PROGRESS</p>
          <h1 style={titleStyle}>Learning progress</h1>
          <p style={subtitleStyle}>
            Real mastery, tracked per standard — not a mock summary.
          </p>
        </section>

        <Card style={{ marginBottom: "20px" }}>
          <h2 style={sectionTitleStyle}>Current standing</h2>
          <div style={{ marginTop: "16px" }}>
            <StatGrid
              stats={[
                { value: mastered.length, label: "Mastered" },
                { value: inProgress.length, label: "In Progress" },
                { value: notStarted.length, label: "Not Started" },
              ]}
            />
          </div>
        </Card>

        {drillStats.total > 0 ? (
          <Card variant="dark" style={{ marginBottom: "20px" }}>
            <div style={drillHeaderRowStyle}>
              <div style={drillIconWrapStyle}>
                <BoltIcon size={26} />
              </div>
              <div>
                <p style={drillEyebrowStyle}>Jeremiah AI · Quick Drill</p>
                <h3 style={drillTitleStyle}>Ready to drill right now</h3>
              </div>
            </div>
            <div style={drillStatsRowStyle}>
              <span style={drillStatStyle}>{drillStats.referenceCount} verses</span>
              <span style={drillStatDotStyle}>·</span>
              <span style={drillStatStyle}>{drillStats.vocabularyCount} terms</span>
              <span style={drillStatDotStyle}>·</span>
              <span style={drillStatStyle}>{drillStats.truthCount} truths</span>
            </div>
            <p style={drillTextStyle}>
              Pulled straight from what you've actually studied — scripture, vocabulary, and
              the standards themselves, mixed together.
            </p>
            <div style={{ marginTop: "16px" }}>
              <Link to={ROUTES.RAPID_FIRE}>
                <PrimaryButton
                  style={{ background: gradients.flame, color: "#ffffff", boxShadow: "0 10px 28px rgba(249,115,22,0.35)", border: "none" }}
                >
                  Quiz Me
                </PrimaryButton>
              </Link>
            </div>
          </Card>
        ) : null}

        {inProgress.length > 0 ? (
          <Card style={{ marginBottom: "20px" }}>
            <h3 style={listTitleStyle}>Continue where you left off</h3>
            <div style={listStyle}>
              {inProgress.map((standard) => (
                <Link key={standard.code} to={classroomPath(standard.code)} style={listItemLinkStyle}>
                  <div style={listItemStyle}>
                    <div>
                      <p style={itemTitleStyle}>{standard.title}</p>
                      <p style={itemMetaStyle}>{standard.code} · {progress[standard.code] || 0}/4</p>
                    </div>
                    <Pill tone="review">Continue</Pill>
                  </div>
                </Link>
              ))}
            </div>
          </Card>
        ) : null}

        {mastered.length > 0 ? (
          <Card>
            <h3 style={listTitleStyle}>What has been learned</h3>
            <div style={listStyle}>
              {mastered.map((standard) => (
                <div key={standard.code} style={listItemStyle}>
                  <div>
                    <p style={itemTitleStyle}>{standard.title}</p>
                    <p style={itemMetaStyle}>{standard.code}</p>
                  </div>
                  <Pill tone="mastered">Mastered</Pill>
                </div>
              ))}
            </div>
          </Card>
        ) : (
          <Card>
            <p style={itemMetaStyle}>
              Nothing mastered yet — head to the Map and pick a standard to begin.
            </p>
          </Card>
        )}
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

const heroStyle = { marginBottom: "24px" };

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
  fontSize: "clamp(2.2rem, 5vw, 3.4rem)",
  lineHeight: 1.05,
  color: colors.text,
};

const subtitleStyle = { margin: "14px 0 0", fontSize: "1.05rem", color: colors.textMuted };

const sectionTitleStyle = { margin: 0, fontSize: "1.3rem", fontWeight: 900, color: colors.text };
const listTitleStyle = { margin: "0 0 14px", fontSize: "1.2rem", fontWeight: 900, color: colors.text };

const listStyle = { display: "grid", gap: "12px" };

const listItemLinkStyle = { textDecoration: "none" };

const listItemStyle = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  gap: "16px",
  padding: "16px",
  borderRadius: "16px",
  background: "#f8fafc",
  border: `1px solid ${colors.cardBorder}`,
};

const itemTitleStyle = { margin: 0, fontSize: "1rem", fontWeight: 800, color: colors.text };
const itemMetaStyle = { margin: "6px 0 0", fontSize: "0.9rem", color: colors.textFaint };

const drillHeaderRowStyle = {
  display: "flex",
  alignItems: "center",
  gap: "14px",
};

const drillIconWrapStyle = {
  width: "48px",
  height: "48px",
  borderRadius: "999px",
  flexShrink: 0,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  background: "radial-gradient(circle, rgba(255,138,0,0.3) 0%, transparent 70%)",
};

const drillEyebrowStyle = {
  margin: 0,
  fontFamily: fonts.mono,
  fontSize: "0.72rem",
  fontWeight: 500,
  letterSpacing: "0.1em",
  textTransform: "uppercase",
  color: "rgba(255,255,255,0.6)",
};

const drillTitleStyle = { margin: "4px 0 0", fontSize: "1.2rem", fontWeight: 900, color: "#ffffff" };

const drillStatsRowStyle = {
  marginTop: "16px",
  display: "flex",
  alignItems: "center",
  gap: "8px",
  flexWrap: "wrap",
};

const drillStatStyle = { fontSize: "0.9rem", fontWeight: 700, color: "rgba(255,255,255,0.88)" };
const drillStatDotStyle = { color: "rgba(255,255,255,0.4)" };

const drillTextStyle = { margin: "12px 0 0", lineHeight: 1.65, fontSize: "0.92rem", color: "rgba(255,255,255,0.72)" };

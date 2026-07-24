import { useMemo } from "react";
import { Link } from "react-router-dom";
import { getAllStandards } from "../../core/standards/standardsRegistry";
import { getStandardProgress } from "../../core/standards/standardsProgress";
import { classroomPath } from "../../app/routes";
import Card from "../../shared/ui/Card";
import StatGrid from "../../shared/ui/StatGrid";
import Pill from "../../shared/ui/Pill";
import { colors } from "../../shared/theme";

export default function ProgressPage() {
  const progress = useMemo(() => getStandardProgress(), []);
  const allStandards = useMemo(() => getAllStandards(), []);

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
  fontSize: "0.82rem",
  fontWeight: 800,
  letterSpacing: "0.08em",
  textTransform: "uppercase",
  color: colors.textMuted,
};

const titleStyle = {
  margin: "8px 0 0",
  fontSize: "clamp(2.3rem, 5vw, 3.8rem)",
  lineHeight: 1.02,
  fontWeight: 900,
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

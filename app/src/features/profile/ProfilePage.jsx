import { useMemo, useState } from "react";
import { profileData } from "../../data/profileData";
import { getAllStandards } from "../../core/standards/standardsRegistry";
import { getStandardProgress } from "../../core/standards/standardsProgress";
import {
  getActiveLearnerAgeBand,
  setActiveLearnerAgeBand,
} from "../../core/classroom/classroomSessionData";
import Card from "../../shared/ui/Card";
import StatGrid from "../../shared/ui/StatGrid";
import { colors, radius, fonts } from "../../shared/theme";

const AGE_BAND_OPTIONS = [
  { value: "child", label: "Child (5-12)", description: "Short sentences, warm, concrete." },
  { value: "teen", label: "Teen", description: "Direct, respectful, vocabulary explained." },
  { value: "adult", label: "Adult", description: "Full doctrinal precision." },
  { value: "senior", label: "Senior", description: "Full precision, no basics re-explained." },
];

export default function ProfilePage() {
  const data = profileData;
  const [ageBand, setAgeBand] = useState(() => getActiveLearnerAgeBand());

  const progress = useMemo(() => getStandardProgress(), []);
  const allStandards = useMemo(() => getAllStandards(), []);
  const mastered = allStandards.filter((s) => (progress[s.code] || 0) >= 4).length;
  const inProgress = allStandards.filter((s) => {
    const level = progress[s.code] || 0;
    return level > 0 && level < 4;
  }).length;

  function handleSelectAgeBand(value) {
    setAgeBand(value);
    setActiveLearnerAgeBand(value);
  }

  return (
    <div style={pageStyle}>
      <div style={contentStyle}>
        <section style={heroStyle}>
          <p style={eyebrowStyle}>JEREMIAH AI PROFILE</p>
          <h1 style={titleStyle}>Learner profile</h1>
          <p style={subtitleStyle}>
            Identity and age-band live here — age-band shapes how Jeremiah speaks, never
            what he teaches.
          </p>
        </section>

        <Card style={{ marginBottom: "20px" }}>
          <div style={identityTopStyle}>
            <div style={avatarStyle}>{data.learner.initial}</div>
            <div>
              <p style={identityEyebrowStyle}>Active Learner</p>
              <h2 style={identityNameStyle}>{data.learner.name}</h2>
            </div>
          </div>
          <div style={{ marginTop: "20px" }}>
            <StatGrid
              stats={[
                { value: mastered, label: "Mastered" },
                { value: inProgress, label: "In Progress" },
              ]}
            />
          </div>
        </Card>

        <Card>
          <h3 style={sectionTitleStyle}>Age band</h3>
          <p style={sectionTextStyle}>
            This changes Jeremiah's tone and vocabulary in both the Classroom and Ask Jeremiah
            — the doctrine itself never changes.
          </p>

          <div style={optionsGridStyle}>
            {AGE_BAND_OPTIONS.map((option) => {
              const isActive = option.value === ageBand;
              return (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => handleSelectAgeBand(option.value)}
                  style={{
                    ...optionButtonStyle,
                    ...(isActive ? optionButtonActiveStyle : null),
                  }}
                >
                  <p style={optionLabelStyle}>{option.label}</p>
                  <p style={optionDescriptionStyle}>{option.description}</p>
                </button>
              );
            })}
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

const identityTopStyle = { display: "flex", alignItems: "center", gap: "16px" };

const avatarStyle = {
  width: "64px",
  height: "64px",
  borderRadius: "999px",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  background: colors.primaryGradient,
  color: "#ffffff",
  fontSize: "1.6rem",
  fontWeight: 900,
};

const identityEyebrowStyle = {
  margin: 0,
  fontSize: "0.8rem",
  textTransform: "uppercase",
  letterSpacing: "0.08em",
  color: colors.textFaint,
  fontWeight: 700,
};

const identityNameStyle = { margin: "6px 0 0", fontSize: "1.6rem", color: colors.text, fontWeight: 900 };

const sectionTitleStyle = { margin: 0, fontSize: "1.3rem", fontWeight: 900, color: colors.text };
const sectionTextStyle = { margin: "10px 0 0", fontSize: "0.96rem", lineHeight: 1.65, color: colors.textMuted };

const optionsGridStyle = {
  marginTop: "18px",
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))",
  gap: "12px",
};

const optionButtonStyle = {
  textAlign: "left",
  borderRadius: radius.md,
  padding: "16px",
  border: `1px solid ${colors.cardBorder}`,
  background: "#f8fafc",
  cursor: "pointer",
  fontFamily: "inherit",
};

const optionButtonActiveStyle = {
  border: "1px solid #0f172a",
  background: "#0f172a",
  color: "#ffffff",
};

const optionLabelStyle = { margin: 0, fontWeight: 800, color: "inherit" };
const optionDescriptionStyle = { margin: "8px 0 0", fontSize: "0.86rem", lineHeight: 1.5, color: "inherit", opacity: 0.75 };

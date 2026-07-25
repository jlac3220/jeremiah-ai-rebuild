import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { getStandardByCode } from "../../core/standards/standardsRegistry";
import { classroomPath } from "../../app/routes";
import Card from "../../shared/ui/Card";
import SecondaryButton from "../../shared/ui/SecondaryButton";
import { colors, fonts, gradients, getSubjectAccent } from "../../shared/theme";

export default function BibleSupportPage() {
  const { standardCode } = useParams();
  const standard = getStandardByCode(standardCode);
  const verses = standard?.anchorScriptures || [];
  const [manualReference, setManualReference] = useState(null);
  const accent = standard ? getSubjectAccent(standard.subjectCode) : getSubjectAccent();

  if (!standard) {
    return (
      <div style={pageStyle}>
        <div style={contentStyle}>
          <Card>
            <p>Standard not found.</p>
          </Card>
        </div>
      </div>
    );
  }

  const selectedReference =
    manualReference && verses.some((verse) => verse.reference === manualReference)
      ? manualReference
      : verses[0]?.reference || "";

  const selectedVerse = verses.find((verse) => verse.reference === selectedReference) || verses[0] || null;

  return (
    <div style={pageStyle}>
      <div style={contentStyle}>
        <section style={heroStyle}>
          <p style={eyebrowStyle}>JEREMIAH AI BIBLE SUPPORT</p>
          <h1 style={titleStyle}>Scripture support</h1>
          <p style={subtitleStyle}>
            Passages tied to {standard.code} — {standard.title}.
          </p>
        </section>

        <Card variant="dark" style={{ marginBottom: "20px" }}>
          <div style={topRowStyle}>
            <h2 style={cardTitleStyle}>{standard.title}</h2>
            <Link to={classroomPath(standard.code)}>
              <SecondaryButton>Back to Classroom</SecondaryButton>
            </Link>
          </div>
          <p style={statementStyle}>{standard.statement}</p>
        </Card>

        <Card style={{ marginBottom: "20px" }}>
          <h3 style={listTitleStyle}>Passage List</h3>
          <div style={verseListStyle}>
            {verses.map((verse) => {
              const isSelected = verse.reference === selectedReference;
              return (
                <div
                  key={verse.reference}
                  style={{
                    ...verseRowStyle,
                    borderLeft: `4px solid ${isSelected ? accent.base : "transparent"}`,
                    background: isSelected ? accent.soft : "#f8fafc",
                  }}
                >
                  <p style={{ ...verseRefStyle, color: isSelected ? accent.text : colors.text }}>
                    {verse.reference}
                  </p>
                  <button
                    type="button"
                    onClick={() => setManualReference(verse.reference)}
                    style={{
                      ...openButtonStyle,
                      ...(isSelected ? { border: `1px solid ${accent.base}`, background: accent.base, color: "#ffffff" } : null),
                    }}
                  >
                    {isSelected ? "Reading" : "Open"}
                  </button>
                </div>
              );
            })}
          </div>
        </Card>

        <Card>
          <h3 style={listTitleStyle}>Passage Reader</h3>
          {selectedVerse ? (
            <div
              style={{
                ...readerCardStyle,
                background: `radial-gradient(ellipse 65% 55% at 10% 0%, ${accent.soft} 0%, transparent 60%), #fffdfa`,
              }}
            >
              <span style={cornerTopLeftStyle} aria-hidden="true" />
              <span style={cornerBottomRightStyle} aria-hidden="true" />
              <p style={readerTagStyle}>
                <span style={{ ...readerTagDotStyle, background: accent.base }} />
                {standard.code} — {standard.title}
              </p>
              <p style={readerTextStyle}>
                <span style={dropCapStyle}>{selectedVerse.text.charAt(0)}</span>
                {selectedVerse.text.slice(1)}
              </p>
              <p style={readerRefStyle}>{selectedVerse.reference.toUpperCase()}</p>
            </div>
          ) : (
            <p style={{ color: colors.textFaint }}>No passages available.</p>
          )}
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
  fontSize: "0.82rem",
  fontWeight: 800,
  letterSpacing: "0.08em",
  textTransform: "uppercase",
  color: colors.textMuted,
};

const titleStyle = {
  margin: "8px 0 0",
  fontSize: "clamp(2.1rem, 5vw, 3.2rem)",
  lineHeight: 1.02,
  fontWeight: 900,
  color: colors.text,
};

const subtitleStyle = { margin: "12px 0 0", fontSize: "1rem", color: colors.textMuted };

const topRowStyle = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "flex-start",
  gap: "14px",
  flexWrap: "wrap",
};

const cardTitleStyle = { margin: 0, fontSize: "1.4rem", fontWeight: 900, color: "#ffffff" };
const statementStyle = { margin: "14px 0 0", lineHeight: 1.7, color: "rgba(255,255,255,0.85)" };

const listTitleStyle = { margin: "0 0 14px", fontSize: "1.2rem", fontWeight: 900, color: colors.text };

const verseListStyle = { display: "grid", gap: "10px" };

const verseRowStyle = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  padding: "14px",
  borderRadius: "14px",
  background: "#f8fafc",
  border: `1px solid ${colors.cardBorder}`,
};

const verseRefStyle = { margin: 0, fontWeight: 800, color: colors.text };

const openButtonStyle = {
  border: `1px solid ${colors.cardBorder}`,
  background: "#ffffff",
  color: colors.text,
  padding: "8px 14px",
  borderRadius: "999px",
  fontSize: "0.86rem",
  fontWeight: 800,
  cursor: "pointer",
};

const readerCardStyle = {
  position: "relative",
  borderRadius: "4px",
  padding: "32px 30px 28px",
  border: "1px solid rgba(255, 178, 46, 0.4)",
  overflow: "hidden",
};

const cornerBracketBase = {
  position: "absolute",
  width: "20px",
  height: "20px",
  borderColor: "#ffb22e",
  pointerEvents: "none",
};

const cornerTopLeftStyle = {
  ...cornerBracketBase,
  top: "10px",
  left: "10px",
  borderTop: "1px solid #ffb22e",
  borderLeft: "1px solid #ffb22e",
};

const cornerBottomRightStyle = {
  ...cornerBracketBase,
  bottom: "10px",
  right: "10px",
  borderBottom: "1px solid #ffb22e",
  borderRight: "1px solid #ffb22e",
};

const readerTagStyle = {
  margin: "0 0 22px",
  display: "flex",
  alignItems: "center",
  gap: "8px",
  fontFamily: fonts.mono,
  fontSize: "0.72rem",
  fontWeight: 500,
  letterSpacing: "0.1em",
  textTransform: "uppercase",
  color: colors.textMuted,
};

const readerTagDotStyle = { width: "7px", height: "7px", borderRadius: "999px", flexShrink: 0 };

const dropCapStyle = {
  float: "left",
  fontFamily: fonts.display,
  fontStyle: "italic",
  fontSize: "4.6rem",
  lineHeight: 0.72,
  fontVariationSettings: '"opsz" 144, "wght" 480, "WONK" 1',
  padding: "6px 8px 0 0",
  background: gradients.flame,
  WebkitBackgroundClip: "text",
  backgroundClip: "text",
  color: "transparent",
};

const readerTextStyle = {
  margin: 0,
  fontSize: "1.2rem",
  lineHeight: 1.65,
  color: "#1e1420",
  fontFamily: fonts.display,
  fontStyle: "italic",
  fontVariationSettings: '"opsz" 30, "wght" 440',
};

const readerRefStyle = {
  clear: "both",
  margin: "20px 0 0",
  fontFamily: fonts.mono,
  fontSize: "0.78rem",
  letterSpacing: "0.06em",
  color: colors.textFaint,
};

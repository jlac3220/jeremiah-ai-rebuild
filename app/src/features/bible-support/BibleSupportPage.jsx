import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { getStandardByCode } from "../../core/standards/standardsRegistry";
import { classroomPath } from "../../app/routes";
import Card from "../../shared/ui/Card";
import SecondaryButton from "../../shared/ui/SecondaryButton";
import { colors } from "../../shared/theme";

export default function BibleSupportPage() {
  const { standardCode } = useParams();
  const standard = getStandardByCode(standardCode);
  const verses = standard?.anchorScriptures || [];
  const [manualReference, setManualReference] = useState(null);

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
                <div key={verse.reference} style={verseRowStyle}>
                  <p style={verseRefStyle}>{verse.reference}</p>
                  <button
                    type="button"
                    onClick={() => setManualReference(verse.reference)}
                    style={{
                      ...openButtonStyle,
                      ...(isSelected ? openButtonActiveStyle : null),
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
            <>
              <h4 style={readerRefStyle}>{selectedVerse.reference}</h4>
              <p style={readerTextStyle}>{selectedVerse.text}</p>
            </>
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

const openButtonActiveStyle = { border: "1px solid #1d4ed8", background: "#1d4ed8", color: "#ffffff" };

const readerRefStyle = { margin: 0, fontSize: "1.2rem", fontWeight: 900, color: colors.text };
const readerTextStyle = { margin: "14px 0 0", fontSize: "1.1rem", lineHeight: 1.85, color: colors.text };

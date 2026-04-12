import { useEffect, useState } from "react";
import { ROUTES } from "../../app/routes";
import { getCurrentSession } from "../../core/classroom/classroomSessionData";

const SESSION_TYPE_LABELS = {
  resume: "Resume Path",
  review: "Review Path",
  adaptation: "Learner Adaptation Path",
  direct: "Direct Classroom Path",
};

export default function BibleSupportPage({ onNavigate }) {
  const session = getCurrentSession();
  const verses = session.verses || [];
  const [selectedReference, setSelectedReference] = useState(
    verses[0]?.reference || ""
  );

  useEffect(() => {
    setSelectedReference((currentReference) => {
      const hasCurrentReference = verses.some(
        (verse) => verse.reference === currentReference
      );

      if (hasCurrentReference) {
        return currentReference;
      }

      return verses[0]?.reference || "";
    });
  }, [session.standardId, session.sessionType, verses]);

  const selectedVerse =
    verses.find((verse) => verse.reference === selectedReference) ||
    verses[0] ||
    null;

  return (
    <div style={pageStyle}>
      <div style={contentStyle}>
        <section style={heroStyle}>
          <p style={eyebrowStyle}>JEREMIAH AI BIBLE SUPPORT</p>
          <h1 style={titleStyle}>Scripture support</h1>
          <p style={subtitleStyle}>
            Bible Support serves the active Classroom session by opening the
            passages tied to the current doctrinal standard in a cleaner reading
            environment.
          </p>
        </section>

        <section style={primaryCardStyle}>
          <div style={primaryTopStyle}>
            <div>
              <p style={sectionEyebrowLightStyle}>Current Session Support</p>
              <h2 style={primaryTitleStyle}>
                Key verses for "{session.standardTitle}"
              </h2>
            </div>

            <div style={primaryActionsStyle}>
              <div style={trackPillStyle}>{session.studyTitle}</div>
              <button
                type="button"
                style={returnButtonStyle}
                onClick={() => onNavigate?.(ROUTES.CLASSROOM)}
              >
                Back to Classroom
              </button>
            </div>
          </div>

          <p style={primaryTextStyle}>{session.truthExplanation}</p>

          <div style={summaryGridStyle}>
            <div style={summaryCardStyle}>
              <p style={summaryLabelStyle}>Standard</p>
              <p style={summaryValueStyle}>{session.standardId}</p>
            </div>

            <div style={summaryCardStyle}>
              <p style={summaryLabelStyle}>Truth Statement</p>
              <p style={summaryValueStyle}>{session.truthStatement}</p>
            </div>

            <div style={summaryCardStyle}>
              <p style={summaryLabelStyle}>Session Type</p>
              <p style={summaryValueStyle}>{SESSION_TYPE_LABELS[session.sessionType] || session.sessionType}</p>
            </div>
          </div>
        </section>

        <section style={sectionCardStyle}>
          <div style={sectionHeaderStyle}>
            <div>
              <p style={sectionEyebrowStyle}>Passage List</p>
              <h3 style={sectionTitleStyle}>Open scriptures in this session</h3>
            </div>

            <div style={countPillStyle}>
              {verses.length} passage{verses.length === 1 ? "" : "s"}
            </div>
          </div>

          {verses.length ? (
            <div style={verseListStyle}>
              {verses.map((verse) => {
                const isSelected = verse.reference === selectedReference;

                return (
                  <div key={verse.reference} style={verseCardStyle}>
                    <div style={verseContentStyle}>
                      <p style={verseRefStyle}>{verse.reference}</p>
                      <p style={verseMetaStyle}>{verse.note}</p>
                    </div>

                    <button
                      type="button"
                      style={
                        isSelected
                          ? { ...openButtonStyle, ...openButtonActiveStyle }
                          : openButtonStyle
                      }
                      onClick={() => setSelectedReference(verse.reference)}
                    >
                      {isSelected ? "Reading" : "Open Passage"}
                    </button>
                  </div>
                );
              })}
            </div>
          ) : (
            <div style={emptyCardStyle}>
              <p style={emptyTitleStyle}>No passages found</p>
              <p style={emptyTextStyle}>
                The current session does not yet include verse support data.
              </p>
            </div>
          )}
        </section>

        <section style={readerCardStyle}>
          <p style={sectionEyebrowStyle}>Passage Reader</p>

          {selectedVerse ? (
            <>
              <div style={readerHeaderStyle}>
                <h3 style={sectionTitleStyle}>{selectedVerse.reference}</h3>
                <div style={readerPillStyle}>{session.standardTitle}</div>
              </div>

              <p style={readerTextStyle}>{selectedVerse.text}</p>

              <p style={readerNoteStyle}>{selectedVerse.note}</p>

              <div style={readerSupportCardStyle}>
                <p style={readerSupportLabelStyle}>Why this passage matters</p>
                <p style={readerSupportTextStyle}>
                  This passage is part of the active Classroom session and
                  supports the doctrinal claim: {session.truthStatement}
                </p>
              </div>
            </>
          ) : (
            <p style={readerNoteStyle}>
              Select a passage to open the scripture reader.
            </p>
          )}
        </section>
      </div>
    </div>
  );
}

const pageStyle = {
  minHeight: "100%",
  background: "linear-gradient(180deg, #f8fafc 0%, #eef2ff 100%)",
};

const contentStyle = {
  width: "100%",
  maxWidth: "1040px",
  margin: "0 auto",
  padding: "32px 20px 120px",
  boxSizing: "border-box",
};

const heroStyle = {
  marginBottom: "24px",
};

const eyebrowStyle = {
  margin: 0,
  fontSize: "0.82rem",
  fontWeight: 800,
  letterSpacing: "0.08em",
  textTransform: "uppercase",
  color: "#475569",
};

const titleStyle = {
  margin: "8px 0 0",
  fontSize: "clamp(2.3rem, 5vw, 3.8rem)",
  lineHeight: 1.02,
  fontWeight: 900,
  color: "#0f172a",
};

const subtitleStyle = {
  margin: "14px 0 0",
  maxWidth: "760px",
  fontSize: "1.05rem",
  lineHeight: 1.7,
  color: "#475569",
};

const primaryCardStyle = {
  background: "linear-gradient(135deg, #0b1228 0%, #16233b 55%, #1f2f4b 100%)",
  color: "#ffffff",
  borderRadius: "28px",
  padding: "26px",
  boxShadow: "0 28px 70px rgba(15, 23, 42, 0.18)",
  marginBottom: "20px",
};

const primaryTopStyle = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "flex-start",
  gap: "16px",
  flexWrap: "wrap",
};

const primaryActionsStyle = {
  display: "flex",
  alignItems: "center",
  gap: "12px",
  flexWrap: "wrap",
};

const sectionEyebrowLightStyle = {
  margin: 0,
  fontSize: "0.8rem",
  textTransform: "uppercase",
  letterSpacing: "0.08em",
  color: "rgba(255,255,255,0.65)",
  fontWeight: 700,
};

const primaryTitleStyle = {
  margin: "10px 0 0",
  fontSize: "1.65rem",
  lineHeight: 1.15,
  color: "#ffffff",
  fontWeight: 900,
};

const trackPillStyle = {
  display: "inline-flex",
  alignItems: "center",
  padding: "10px 14px",
  borderRadius: "999px",
  background: "rgba(255,255,255,0.14)",
  fontSize: "0.9rem",
  fontWeight: 800,
};

const returnButtonStyle = {
  border: "1px solid rgba(255,255,255,0.24)",
  background: "#ffffff",
  color: "#0f172a",
  padding: "10px 14px",
  borderRadius: "999px",
  fontSize: "0.9rem",
  fontWeight: 800,
  cursor: "pointer",
};

const primaryTextStyle = {
  margin: "14px 0 0",
  fontSize: "1rem",
  lineHeight: 1.75,
  color: "rgba(255,255,255,0.84)",
  maxWidth: "760px",
};

const summaryGridStyle = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
  gap: "14px",
  marginTop: "18px",
};

const summaryCardStyle = {
  borderRadius: "18px",
  padding: "16px",
  background: "rgba(255,255,255,0.09)",
  border: "1px solid rgba(255,255,255,0.12)",
};

const summaryLabelStyle = {
  margin: 0,
  fontSize: "0.76rem",
  letterSpacing: "0.08em",
  textTransform: "uppercase",
  color: "rgba(255,255,255,0.62)",
  fontWeight: 700,
};

const summaryValueStyle = {
  margin: "8px 0 0",
  fontSize: "0.98rem",
  lineHeight: 1.5,
  color: "#ffffff",
  fontWeight: 800,
};

const sectionCardStyle = {
  background: "#ffffff",
  borderRadius: "26px",
  padding: "24px",
  boxShadow: "0 12px 36px rgba(15, 23, 42, 0.08)",
  marginBottom: "20px",
};

const sectionHeaderStyle = {
  marginBottom: "18px",
  display: "flex",
  justifyContent: "space-between",
  alignItems: "flex-start",
  gap: "14px",
  flexWrap: "wrap",
};

const sectionEyebrowStyle = {
  margin: 0,
  fontSize: "0.8rem",
  textTransform: "uppercase",
  letterSpacing: "0.08em",
  color: "#64748b",
  fontWeight: 700,
};

const sectionTitleStyle = {
  margin: "10px 0 0",
  fontSize: "1.35rem",
  lineHeight: 1.2,
  color: "#0f172a",
  fontWeight: 900,
};

const countPillStyle = {
  display: "inline-flex",
  alignItems: "center",
  padding: "10px 14px",
  borderRadius: "999px",
  background: "#eef2ff",
  color: "#3730a3",
  fontSize: "0.88rem",
  fontWeight: 800,
};

const verseListStyle = {
  display: "grid",
  gap: "14px",
};

const verseCardStyle = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  gap: "16px",
  padding: "18px",
  borderRadius: "20px",
  background: "#f8fafc",
  border: "1px solid #e2e8f0",
};

const verseContentStyle = {
  minWidth: 0,
  flex: 1,
};

const verseRefStyle = {
  margin: 0,
  fontSize: "1rem",
  lineHeight: 1.4,
  color: "#0f172a",
  fontWeight: 800,
};

const verseMetaStyle = {
  margin: "6px 0 0",
  fontSize: "0.94rem",
  lineHeight: 1.6,
  color: "#64748b",
};

const openButtonStyle = {
  border: "1px solid #cbd5e1",
  background: "#ffffff",
  color: "#0f172a",
  padding: "12px 14px",
  borderRadius: "14px",
  fontSize: "0.92rem",
  fontWeight: 800,
  cursor: "pointer",
  minWidth: "120px",
};

const openButtonActiveStyle = {
  border: "1px solid #1d4ed8",
  background: "#1d4ed8",
  color: "#ffffff",
};

const emptyCardStyle = {
  borderRadius: "20px",
  padding: "20px",
  background: "#f8fafc",
  border: "1px dashed #cbd5e1",
};

const emptyTitleStyle = {
  margin: 0,
  fontSize: "1rem",
  fontWeight: 800,
  color: "#0f172a",
};

const emptyTextStyle = {
  margin: "8px 0 0",
  fontSize: "0.95rem",
  lineHeight: 1.6,
  color: "#64748b",
};

const readerCardStyle = {
  background: "#ffffff",
  borderRadius: "26px",
  padding: "24px",
  boxShadow: "0 12px 36px rgba(15, 23, 42, 0.08)",
};

const readerHeaderStyle = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  gap: "14px",
  flexWrap: "wrap",
};

const readerPillStyle = {
  display: "inline-flex",
  alignItems: "center",
  padding: "10px 14px",
  borderRadius: "999px",
  background: "#eff6ff",
  color: "#1d4ed8",
  fontSize: "0.88rem",
  fontWeight: 800,
};

const readerTextStyle = {
  margin: "18px 0 0",
  fontSize: "1.15rem",
  lineHeight: 1.9,
  color: "#0f172a",
  fontWeight: 500,
};

const readerNoteStyle = {
  margin: "16px 0 0",
  fontSize: "0.98rem",
  lineHeight: 1.7,
  color: "#475569",
};

const readerSupportCardStyle = {
  marginTop: "18px",
  borderRadius: "18px",
  padding: "18px",
  background: "#f8fafc",
  border: "1px solid #e2e8f0",
};

const readerSupportLabelStyle = {
  margin: 0,
  fontSize: "0.78rem",
  letterSpacing: "0.08em",
  textTransform: "uppercase",
  color: "#64748b",
  fontWeight: 700,
};

const readerSupportTextStyle = {
  margin: "8px 0 0",
  fontSize: "0.98rem",
  lineHeight: 1.7,
  color: "#0f172a",
};

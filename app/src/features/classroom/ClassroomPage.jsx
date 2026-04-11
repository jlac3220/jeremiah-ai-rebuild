import { ROUTES } from "../../app/routes";

export default function ClassroomPage({ onNavigate }) {
  return (
    <div style={pageStyle}>
      <div style={contentStyle}>
        <section style={heroStyle}>
          <p style={eyebrowStyle}>JEREMIAH AI CLASSROOM</p>
          <h1 style={titleStyle}>Current Standard Session</h1>
          <p style={subtitleStyle}>
            A guided doctrinal session built around scripture, understanding,
            correction, and mastery.
          </p>
        </section>

        <section style={sessionFrameStyle}>
          <div style={sessionTopRowStyle}>
            <div>
              <p style={smallLabelStyle}>Current Standard</p>
              <h2 style={sessionTitleStyle}>God is One</h2>
            </div>

            <div style={statusPillStyle}>Resume Session</div>
          </div>

          <div style={metaGridStyle}>
            <div style={metaCardStyle}>
              <p style={metaLabelStyle}>Track</p>
              <p style={metaValueStyle}>The One True God</p>
            </div>

            <div style={metaCardStyle}>
              <p style={metaLabelStyle}>Current Stage</p>
              <p style={metaValueStyle}>Scripture Review</p>
            </div>

            <div style={metaCardStyle}>
              <p style={metaLabelStyle}>Learner Level</p>
              <p style={metaValueStyle}>Adult Endpoint Path</p>
            </div>
          </div>
        </section>

        <section style={truthCardStyle}>
          <p style={sectionEyebrowStyle}>Truth Statement</p>
          <h3 style={sectionTitleStyle}>There is one God.</h3>
          <p style={sectionTextStyle}>
            This session teaches the biblical truth that God is one, not many.
            Jeremiah AI will guide the learner through the scriptures that prove
            this, correct weak understanding, and move toward mastery.
          </p>
        </section>

        <section style={teachingSurfaceStyle}>
          <div style={surfaceHeaderStyle}>
            <div>
              <p style={surfaceEyebrowStyle}>Teaching Surface</p>
              <h3 style={surfaceTitleStyle}>Scripture and guided checkpoint</h3>
            </div>
          </div>

          <div style={surfaceGridStyle}>
            <div style={leftColumnStyle}>
              <div style={columnCardStyle}>
                <p style={sectionEyebrowStyle}>Scripture Evidence</p>
                <h4 style={columnTitleStyle}>Key verses in this session</h4>

                <div style={verseListStyle}>
                  <div style={verseCardStyle}>
                    <p style={verseRefStyle}>Deuteronomy 6:4</p>
                    <p style={verseTextStyle}>
                      Hear, O Israel: The LORD our God is one LORD.
                    </p>
                    <p style={verseNoteStyle}>
                      This verse states the oneness of God directly and serves
                      as a foundational testimony.
                    </p>
                  </div>

                  <div style={verseCardStyle}>
                    <p style={verseRefStyle}>Isaiah 44:6</p>
                    <p style={verseTextStyle}>
                      I am the first, and I am the last; and beside me there is
                      no God.
                    </p>
                    <p style={verseNoteStyle}>
                      This verse rules out the existence of another divine being
                      alongside God.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div style={rightColumnStyle}>
              <div style={checkpointCardStyle}>
                <p style={sectionEyebrowDarkStyle}>Guided Checkpoint</p>
                <h4 style={checkpointTitleStyle}>
                  What do these verses require you to confess?
                </h4>
                <p style={checkpointTextStyle}>
                  Jeremiah AI is checking whether the learner understands what
                  these passages prove, not just whether they can repeat the
                  words.
                </p>

                <div style={teacherPromptStyle}>
                  <p style={teacherPromptLabelStyle}>Jeremiah AI Prompt</p>
                  <p style={teacherPromptTextStyle}>
                    These verses do not merely mention God. They make a
                    doctrinal claim. What do they rule out, and what do they
                    require you to confess instead?
                  </p>
                </div>

                <div style={responseBoxStyle}>
                  <p style={responseLabelStyle}>Learner Response Area</p>
                  <p style={responseHintStyle}>
                    Type or speak the learner response here in the real build.
                  </p>
                </div>

                <div style={actionsRowStyle}>
                  <button type="button" style={primaryActionStyle}>
                    Submit Response
                  </button>
                  <button
                    type="button"
                    style={secondaryActionStyle}
                    onClick={() => onNavigate?.(ROUTES.BIBLE_SUPPORT)}
                  >
                    Review Verses Again
                  </button>
                </div>
              </div>
            </div>
          </div>
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

const sessionFrameStyle = {
  background: "linear-gradient(135deg, #0b1228 0%, #16233b 55%, #1f2f4b 100%)",
  color: "#ffffff",
  borderRadius: "30px",
  padding: "28px",
  boxShadow: "0 28px 70px rgba(15, 23, 42, 0.18)",
  marginBottom: "20px",
};

const sessionTopRowStyle = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "flex-start",
  gap: "16px",
  flexWrap: "wrap",
};

const smallLabelStyle = {
  margin: 0,
  fontSize: "0.8rem",
  textTransform: "uppercase",
  letterSpacing: "0.08em",
  color: "rgba(255,255,255,0.65)",
  fontWeight: 700,
};

const sessionTitleStyle = {
  margin: "10px 0 0",
  fontSize: "2.25rem",
  lineHeight: 1.05,
  fontWeight: 900,
  color: "#ffffff",
};

const statusPillStyle = {
  display: "inline-flex",
  alignItems: "center",
  padding: "10px 14px",
  borderRadius: "999px",
  background: "rgba(255,255,255,0.14)",
  fontSize: "0.88rem",
  fontWeight: 800,
};

const metaGridStyle = {
  marginTop: "22px",
  display: "grid",
  gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
  gap: "14px",
};

const metaCardStyle = {
  background: "rgba(255,255,255,0.08)",
  border: "1px solid rgba(255,255,255,0.08)",
  borderRadius: "22px",
  padding: "18px",
};

const metaLabelStyle = {
  margin: 0,
  fontSize: "0.78rem",
  textTransform: "uppercase",
  letterSpacing: "0.08em",
  color: "rgba(255,255,255,0.65)",
  fontWeight: 700,
};

const metaValueStyle = {
  margin: "10px 0 0",
  fontSize: "1rem",
  lineHeight: 1.45,
  color: "#ffffff",
  fontWeight: 800,
};

const truthCardStyle = {
  background: "#ffffff",
  borderRadius: "26px",
  padding: "26px",
  boxShadow: "0 12px 36px rgba(15, 23, 42, 0.08)",
  marginBottom: "20px",
};

const teachingSurfaceStyle = {
  background: "#ffffff",
  borderRadius: "28px",
  padding: "26px",
  boxShadow: "0 12px 36px rgba(15, 23, 42, 0.08)",
};

const surfaceHeaderStyle = {
  marginBottom: "18px",
};

const surfaceEyebrowStyle = {
  margin: 0,
  fontSize: "0.8rem",
  textTransform: "uppercase",
  letterSpacing: "0.08em",
  color: "#64748b",
  fontWeight: 700,
};

const surfaceTitleStyle = {
  margin: "10px 0 0",
  fontSize: "1.5rem",
  lineHeight: 1.2,
  color: "#0f172a",
  fontWeight: 900,
};

const surfaceGridStyle = {
  display: "grid",
  gridTemplateColumns: "1.1fr 0.9fr",
  gap: "18px",
  alignItems: "start",
};

const leftColumnStyle = {};
const rightColumnStyle = {};

const columnCardStyle = {
  borderRadius: "24px",
  padding: "22px",
  background: "#f8fafc",
  border: "1px solid #e2e8f0",
};

const checkpointCardStyle = {
  background: "#fff7ed",
  border: "1px solid #fed7aa",
  borderRadius: "24px",
  padding: "22px",
  boxShadow: "0 10px 24px rgba(249, 115, 22, 0.08)",
};

const sectionEyebrowStyle = {
  margin: 0,
  fontSize: "0.8rem",
  textTransform: "uppercase",
  letterSpacing: "0.08em",
  color: "#64748b",
  fontWeight: 700,
};

const sectionEyebrowDarkStyle = {
  margin: 0,
  fontSize: "0.8rem",
  textTransform: "uppercase",
  letterSpacing: "0.08em",
  color: "#9a3412",
  fontWeight: 700,
};

const sectionTitleStyle = {
  margin: "10px 0 0",
  fontSize: "1.5rem",
  lineHeight: 1.2,
  color: "#0f172a",
  fontWeight: 900,
};

const columnTitleStyle = {
  margin: "10px 0 0",
  fontSize: "1.3rem",
  lineHeight: 1.2,
  color: "#0f172a",
  fontWeight: 900,
};

const checkpointTitleStyle = {
  margin: "10px 0 0",
  fontSize: "1.35rem",
  lineHeight: 1.25,
  color: "#7c2d12",
  fontWeight: 900,
};

const sectionTextStyle = {
  margin: "12px 0 0",
  fontSize: "1rem",
  lineHeight: 1.75,
  color: "#475569",
};

const checkpointTextStyle = {
  margin: "12px 0 0",
  fontSize: "1rem",
  lineHeight: 1.75,
  color: "#9a3412",
};

const verseListStyle = {
  display: "grid",
  gap: "14px",
  marginTop: "18px",
};

const verseCardStyle = {
  borderRadius: "20px",
  padding: "20px",
  background: "#ffffff",
  border: "1px solid #e2e8f0",
};

const verseRefStyle = {
  margin: 0,
  fontSize: "0.95rem",
  fontWeight: 800,
  color: "#0f172a",
};

const verseTextStyle = {
  margin: "10px 0 0",
  fontSize: "1.02rem",
  lineHeight: 1.7,
  color: "#1e293b",
};

const verseNoteStyle = {
  margin: "12px 0 0",
  fontSize: "0.96rem",
  lineHeight: 1.65,
  color: "#64748b",
};

const teacherPromptStyle = {
  marginTop: "18px",
  borderRadius: "20px",
  padding: "18px",
  background: "#ffffff",
  border: "1px solid #fed7aa",
};

const teacherPromptLabelStyle = {
  margin: 0,
  fontSize: "0.78rem",
  textTransform: "uppercase",
  letterSpacing: "0.08em",
  color: "#9a3412",
  fontWeight: 700,
};

const teacherPromptTextStyle = {
  margin: "10px 0 0",
  fontSize: "1rem",
  lineHeight: 1.7,
  color: "#7c2d12",
  fontWeight: 600,
};

const responseBoxStyle = {
  marginTop: "16px",
  minHeight: "130px",
  borderRadius: "20px",
  background: "#ffffff",
  border: "1px solid #fed7aa",
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  padding: "20px",
  boxSizing: "border-box",
};

const responseLabelStyle = {
  margin: 0,
  fontSize: "1rem",
  fontWeight: 700,
  color: "#9a3412",
};

const responseHintStyle = {
  margin: "8px 0 0",
  fontSize: "0.92rem",
  lineHeight: 1.6,
  color: "#c2410c",
  textAlign: "center",
};

const actionsRowStyle = {
  marginTop: "16px",
  display: "flex",
  gap: "12px",
  flexWrap: "wrap",
};

const primaryActionStyle = {
  border: "none",
  background: "#9a3412",
  color: "#ffffff",
  padding: "13px 16px",
  borderRadius: "16px",
  fontSize: "0.95rem",
  fontWeight: 800,
  cursor: "pointer",
};

const secondaryActionStyle = {
  border: "1px solid #fdba74",
  background: "#fff7ed",
  color: "#9a3412",
  padding: "13px 16px",
  borderRadius: "16px",
  fontSize: "0.95rem",
  fontWeight: 800,
  cursor: "pointer",
};
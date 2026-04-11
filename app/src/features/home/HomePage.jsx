export default function HomePage() {
  return (
    <div style={pageStyle}>
      <div style={contentStyle}>
        <section style={heroStyle}>
          <p style={eyebrowStyle}>JEREMIAH AI</p>
          <h1 style={titleStyle}>Welcome back</h1>
          <p style={subtitleStyle}>
            Continue your doctrinal learning with the next right step.
          </p>
        </section>

        <section style={primaryCardStyle}>
          <div style={cardHeaderStyle}>
            <div>
              <div style={pillStyle}>Continue Learning</div>
              <p style={trackLabelStyle}>Current Track</p>
              <h2 style={trackTitleStyle}>The One True God</h2>
            </div>

            <div style={stageBoxStyle}>
              <span style={stageLabelStyle}>Session Type</span>
              <span style={stageValueStyle}>Resume Session</span>
            </div>
          </div>

          <div style={cardBodyStyle}>
            <div style={mainInfoStyle}>
              <p style={sectionEyebrowStyle}>Current Standard</p>
              <h3 style={standardTitleStyle}>God is One</h3>
              <p style={descriptionStyle}>
                Resume your active classroom session and continue building
                understanding from scripture through guided teaching,
                checkpoint review, and mastery.
              </p>
            </div>

            <div style={nextStepCardStyle}>
              <p style={nextStepEyebrowStyle}>Next Step</p>
              <p style={nextStepTitleStyle}>Return to guided scripture review</p>
              <p style={nextStepTextStyle}>
                You left off before the next checkpoint. Jeremiah AI will bring
                you back into the exact session stage you were working on.
              </p>
            </div>
          </div>

          <div style={progressWrapStyle}>
            <div style={progressHeaderStyle}>
              <span style={progressLabelStyle}>Session progress</span>
              <span style={progressValueStyle}>40%</span>
            </div>

            <div style={progressTrackStyle}>
              <div style={progressFillStyle} />
            </div>
          </div>

          <div style={cardFooterStyle}>
            <button type="button" style={primaryButtonStyle}>
              Continue Classroom Session
            </button>
          </div>
        </section>

        <section style={snapshotSectionStyle}>
          <div style={sectionHeaderStyle}>
            <h3 style={sectionTitleStyle}>Progress Snapshot</h3>
            <p style={sectionTextStyle}>
              A quick view of what is mastered, in progress, and waiting for
              review.
            </p>
          </div>

          <div style={statsGridStyle}>
            <div style={statCardStyle}>
              <div style={statValueStyle}>12</div>
              <div style={statLabelStyle}>Mastered</div>
            </div>

            <div style={statCardStyle}>
              <div style={statValueStyle}>3</div>
              <div style={statLabelStyle}>In Progress</div>
            </div>

            <div style={statCardStyle}>
              <div style={statValueStyle}>1</div>
              <div style={statLabelStyle}>Review Needed</div>
            </div>
          </div>
        </section>

        <section style={reviewCardStyle}>
          <div style={reviewTopStyle}>
            <span style={reviewPillStyle}>Review</span>
          </div>

          <h3 style={reviewTitleStyle}>Reinforce a weak point</h3>

          <p style={reviewTextStyle}>
            Review the last checkpoint from your current standard before moving
            deeper into the session.
          </p>
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
  maxWidth: "980px",
  margin: "0 auto",
  padding: "32px 20px 120px",
  boxSizing: "border-box",
};

const heroStyle = {
  marginBottom: "24px",
  textAlign: "center",
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
  margin: "10px 0 0",
  fontSize: "clamp(2.5rem, 6vw, 4.5rem)",
  lineHeight: 0.98,
  fontWeight: 900,
  color: "#0f172a",
};

const subtitleStyle = {
  margin: "16px auto 0",
  maxWidth: "700px",
  fontSize: "1.08rem",
  lineHeight: 1.65,
  color: "#475569",
};

const primaryCardStyle = {
  background: "linear-gradient(135deg, #0b1228 0%, #16233b 55%, #1f2f4b 100%)",
  color: "#ffffff",
  borderRadius: "32px",
  padding: "28px",
  boxShadow: "0 30px 70px rgba(15, 23, 42, 0.18)",
  marginBottom: "20px",
};

const cardHeaderStyle = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "flex-start",
  gap: "18px",
  flexWrap: "wrap",
};

const pillStyle = {
  display: "inline-flex",
  alignItems: "center",
  padding: "9px 14px",
  borderRadius: "999px",
  background: "rgba(255,255,255,0.14)",
  fontSize: "0.82rem",
  fontWeight: 800,
  color: "#ffffff",
};

const trackLabelStyle = {
  margin: "18px 0 0",
  fontSize: "0.82rem",
  textTransform: "uppercase",
  letterSpacing: "0.08em",
  color: "rgba(255,255,255,0.6)",
  fontWeight: 700,
};

const trackTitleStyle = {
  margin: "8px 0 0",
  fontSize: "1.4rem",
  lineHeight: 1.2,
  fontWeight: 800,
  color: "#ffffff",
};

const stageBoxStyle = {
  minWidth: "180px",
  padding: "14px 16px",
  borderRadius: "20px",
  background: "rgba(255,255,255,0.08)",
  border: "1px solid rgba(255,255,255,0.08)",
};

const stageLabelStyle = {
  display: "block",
  fontSize: "0.76rem",
  textTransform: "uppercase",
  letterSpacing: "0.08em",
  color: "rgba(255,255,255,0.6)",
  fontWeight: 700,
};

const stageValueStyle = {
  display: "block",
  marginTop: "8px",
  fontSize: "1rem",
  fontWeight: 800,
  color: "#ffffff",
};

const cardBodyStyle = {
  display: "grid",
  gridTemplateColumns: "1.5fr 1fr",
  gap: "18px",
  marginTop: "24px",
};

const mainInfoStyle = {
  padding: "22px",
  borderRadius: "24px",
  background: "rgba(255,255,255,0.04)",
  border: "1px solid rgba(255,255,255,0.08)",
};

const sectionEyebrowStyle = {
  margin: 0,
  fontSize: "0.8rem",
  textTransform: "uppercase",
  letterSpacing: "0.08em",
  color: "rgba(255,255,255,0.62)",
  fontWeight: 700,
};

const standardTitleStyle = {
  margin: "10px 0 0",
  fontSize: "2.15rem",
  lineHeight: 1.05,
  fontWeight: 900,
  color: "#ffffff",
};

const descriptionStyle = {
  margin: "14px 0 0",
  fontSize: "1.02rem",
  lineHeight: 1.75,
  color: "rgba(255,255,255,0.84)",
  maxWidth: "620px",
};

const nextStepCardStyle = {
  padding: "22px",
  borderRadius: "24px",
  background: "rgba(255,255,255,0.08)",
  border: "1px solid rgba(255,255,255,0.08)",
};

const nextStepEyebrowStyle = {
  margin: 0,
  fontSize: "0.8rem",
  textTransform: "uppercase",
  letterSpacing: "0.08em",
  color: "rgba(255,255,255,0.62)",
  fontWeight: 700,
};

const nextStepTitleStyle = {
  margin: "10px 0 0",
  fontSize: "1.1rem",
  lineHeight: 1.35,
  fontWeight: 800,
  color: "#ffffff",
};

const nextStepTextStyle = {
  margin: "12px 0 0",
  fontSize: "0.96rem",
  lineHeight: 1.7,
  color: "rgba(255,255,255,0.8)",
};

const progressWrapStyle = {
  marginTop: "22px",
};

const progressHeaderStyle = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  marginBottom: "10px",
};

const progressLabelStyle = {
  fontSize: "0.94rem",
  color: "rgba(255,255,255,0.78)",
};

const progressValueStyle = {
  fontSize: "0.94rem",
  fontWeight: 800,
  color: "#ffffff",
};

const progressTrackStyle = {
  width: "100%",
  height: "12px",
  borderRadius: "999px",
  background: "rgba(255,255,255,0.14)",
  overflow: "hidden",
};

const progressFillStyle = {
  width: "40%",
  height: "100%",
  borderRadius: "999px",
  background: "#ffffff",
};

const cardFooterStyle = {
  marginTop: "22px",
  display: "flex",
  justifyContent: "flex-start",
};

const primaryButtonStyle = {
  border: "none",
  background: "#ffffff",
  color: "#0f172a",
  padding: "15px 20px",
  borderRadius: "18px",
  fontSize: "1rem",
  fontWeight: 800,
  cursor: "pointer",
  boxShadow: "0 10px 24px rgba(255,255,255,0.12)",
};

const snapshotSectionStyle = {
  background: "#ffffff",
  borderRadius: "26px",
  padding: "24px",
  boxShadow: "0 12px 36px rgba(15, 23, 42, 0.08)",
  marginBottom: "20px",
};

const sectionHeaderStyle = {
  marginBottom: "18px",
};

const sectionTitleStyle = {
  margin: 0,
  fontSize: "1.18rem",
  fontWeight: 800,
  color: "#0f172a",
};

const sectionTextStyle = {
  margin: "8px 0 0",
  fontSize: "0.96rem",
  lineHeight: 1.65,
  color: "#64748b",
};

const statsGridStyle = {
  display: "grid",
  gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
  gap: "14px",
};

const statCardStyle = {
  background: "#f8fafc",
  borderRadius: "20px",
  padding: "18px",
  border: "1px solid #e2e8f0",
};

const statValueStyle = {
  fontSize: "1.85rem",
  fontWeight: 900,
  color: "#0f172a",
};

const statLabelStyle = {
  marginTop: "6px",
  fontSize: "0.92rem",
  color: "#64748b",
  fontWeight: 700,
};

const reviewCardStyle = {
  background: "#fff7ed",
  border: "1px solid #fed7aa",
  borderRadius: "24px",
  padding: "22px",
  boxShadow: "0 10px 24px rgba(249, 115, 22, 0.08)",
};

const reviewTopStyle = {
  marginBottom: "10px",
};

const reviewPillStyle = {
  display: "inline-flex",
  alignItems: "center",
  padding: "7px 12px",
  borderRadius: "999px",
  background: "#ffedd5",
  color: "#9a3412",
  fontSize: "0.8rem",
  fontWeight: 700,
};

const reviewTitleStyle = {
  margin: 0,
  fontSize: "1.15rem",
  fontWeight: 800,
  color: "#7c2d12",
};

const reviewTextStyle = {
  margin: "10px 0 0",
  fontSize: "0.98rem",
  lineHeight: 1.65,
  color: "#9a3412",
};
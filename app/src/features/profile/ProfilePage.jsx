import { ROUTES } from "../../app/routes";
import { profileData } from "../../data/profileData";
import {
  CLASSROOM_ENTRY_INTENTS,
  setClassroomEntryIntent,
} from "../../core/classroom/classroomEntryIntent";

export default function ProfilePage({ onNavigate }) {
  const data = profileData;

  return (
    <div style={pageStyle}>
      <div style={contentStyle}>
        <section style={heroStyle}>
          <p style={eyebrowStyle}>JEREMIAH AI PROFILE</p>
          <h1 style={titleStyle}>Learner profile</h1>
          <p style={subtitleStyle}>
            Identity, continuity, and learner-level expectations all live here.
          </p>
        </section>

        <section style={identityCardStyle}>
          <div style={identityTopStyle}>
            <div style={avatarStyle}>{data.learner.initial}</div>

            <div>
              <p style={identityEyebrowStyle}>Active Learner</p>
              <h2 style={identityNameStyle}>{data.learner.name}</h2>
              <p style={identityMetaStyle}>
                {data.learner.levelLabel} • {data.learner.trackTitle}
              </p>
            </div>
          </div>

          <div style={snapshotGridStyle}>
            <div style={snapshotCardStyle}>
              <p style={snapshotValueStyle}>{data.snapshot.mastered}</p>
              <p style={snapshotLabelStyle}>Mastered</p>
            </div>

            <div style={snapshotCardStyle}>
              <p style={snapshotValueStyle}>{data.snapshot.inProgress}</p>
              <p style={snapshotLabelStyle}>In Progress</p>
            </div>

            <div style={snapshotCardStyle}>
              <p style={snapshotValueStyle}>{data.snapshot.reviewNeeded}</p>
              <p style={snapshotLabelStyle}>Review Needed</p>
            </div>
          </div>
        </section>

        <section style={continueCardStyle}>
          <p style={sectionEyebrowLightStyle}>Continue Learning</p>
          <h3 style={continueTitleStyle}>{data.continueCard.title}</h3>
          <p style={continueTextStyle}>{data.continueCard.text}</p>

          <button
            type="button"
            style={primaryButtonStyle}
            onClick={() => {
            setClassroomEntryIntent(CLASSROOM_ENTRY_INTENTS.ADAPTATION);
            onNavigate?.(ROUTES.CLASSROOM);
          }}
          >
            {data.continueCard.buttonLabel}
          </button>
        </section>

        <section style={sectionCardStyle}>
          <div style={sectionHeaderStyle}>
            <div>
              <p style={sectionEyebrowStyle}>Learner Adaptation</p>
              <h3 style={sectionTitleStyle}>Instructional expectations</h3>
            </div>
          </div>

          <div style={adaptationCardStyle}>
            <p style={adaptationTitleStyle}>{data.adaptation.title}</p>
            <p style={adaptationTextStyle}>{data.adaptation.text}</p>
          </div>
        </section>

        <section style={sectionCardStyle}>
          <div style={sectionHeaderStyle}>
            <div>
              <p style={sectionEyebrowStyle}>Profile Management</p>
              <h3 style={sectionTitleStyle}>Support actions</h3>
            </div>
          </div>

          <div style={actionsListStyle}>
            {data.actions.map((action) => (
              <button key={action} type="button" style={secondaryActionStyle}>
                {action}
              </button>
            ))}
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

const identityCardStyle = {
  background: "#ffffff",
  borderRadius: "28px",
  padding: "26px",
  boxShadow: "0 12px 36px rgba(15, 23, 42, 0.08)",
  marginBottom: "20px",
};

const identityTopStyle = {
  display: "flex",
  alignItems: "center",
  gap: "16px",
  marginBottom: "22px",
};

const avatarStyle = {
  width: "72px",
  height: "72px",
  borderRadius: "999px",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  background: "linear-gradient(135deg, #0b1228 0%, #1f2f4b 100%)",
  color: "#ffffff",
  fontSize: "1.8rem",
  fontWeight: 900,
  boxShadow: "0 14px 30px rgba(15, 23, 42, 0.18)",
};

const identityEyebrowStyle = {
  margin: 0,
  fontSize: "0.8rem",
  textTransform: "uppercase",
  letterSpacing: "0.08em",
  color: "#64748b",
  fontWeight: 700,
};

const identityNameStyle = {
  margin: "8px 0 0",
  fontSize: "1.9rem",
  lineHeight: 1.1,
  color: "#0f172a",
  fontWeight: 900,
};

const identityMetaStyle = {
  margin: "8px 0 0",
  fontSize: "0.98rem",
  lineHeight: 1.6,
  color: "#64748b",
};

const snapshotGridStyle = {
  display: "grid",
  gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
  gap: "14px",
};

const snapshotCardStyle = {
  background: "#f8fafc",
  borderRadius: "22px",
  padding: "20px",
  border: "1px solid #e2e8f0",
};

const snapshotValueStyle = {
  margin: 0,
  fontSize: "2rem",
  fontWeight: 900,
  color: "#0f172a",
};

const snapshotLabelStyle = {
  margin: "8px 0 0",
  fontSize: "0.95rem",
  color: "#64748b",
  fontWeight: 700,
};

const continueCardStyle = {
  background: "linear-gradient(135deg, #0b1228 0%, #16233b 55%, #1f2f4b 100%)",
  color: "#ffffff",
  borderRadius: "28px",
  padding: "26px",
  boxShadow: "0 28px 70px rgba(15, 23, 42, 0.18)",
  marginBottom: "20px",
};

const sectionEyebrowLightStyle = {
  margin: 0,
  fontSize: "0.8rem",
  textTransform: "uppercase",
  letterSpacing: "0.08em",
  color: "rgba(255,255,255,0.65)",
  fontWeight: 700,
};

const continueTitleStyle = {
  margin: "10px 0 0",
  fontSize: "1.65rem",
  lineHeight: 1.15,
  color: "#ffffff",
  fontWeight: 900,
};

const continueTextStyle = {
  margin: "12px 0 0",
  fontSize: "1rem",
  lineHeight: 1.75,
  color: "rgba(255,255,255,0.84)",
  maxWidth: "720px",
};

const primaryButtonStyle = {
  marginTop: "20px",
  border: "none",
  background: "#ffffff",
  color: "#0f172a",
  padding: "14px 18px",
  borderRadius: "16px",
  fontSize: "0.98rem",
  fontWeight: 800,
  cursor: "pointer",
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

const adaptationCardStyle = {
  borderRadius: "22px",
  padding: "20px",
  background: "#f8fafc",
  border: "1px solid #e2e8f0",
};

const adaptationTitleStyle = {
  margin: 0,
  fontSize: "1rem",
  lineHeight: 1.4,
  color: "#0f172a",
  fontWeight: 800,
};

const adaptationTextStyle = {
  margin: "10px 0 0",
  fontSize: "0.96rem",
  lineHeight: 1.75,
  color: "#475569",
};

const actionsListStyle = {
  display: "grid",
  gap: "12px",
};

const secondaryActionStyle = {
  border: "1px solid #e2e8f0",
  background: "#f8fafc",
  color: "#0f172a",
  padding: "14px 16px",
  borderRadius: "16px",
  fontSize: "0.96rem",
  fontWeight: 800,
  cursor: "pointer",
  textAlign: "left",
};
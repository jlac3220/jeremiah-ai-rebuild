import { ROUTES } from "../../app/routes";
import { progressData } from "../../data/progressData";
import {
  CLASSROOM_ENTRY_INTENTS,
  setClassroomEntryIntent,
} from "../../core/classroom/classroomEntryIntent";
import {
  selectProgressSessionPreset,
  setActiveClassroomSessionPreset,
} from "../../core/classroom/classroomSessionData";

export default function ProgressPage({ onNavigate }) {
  const data = progressData;
  const progressWidth = `${data.activeLearning.progressPercent}%`;

  return (
    <div style={pageStyle}>
      <div style={contentStyle}>
        <section style={heroStyle}>
          <p style={eyebrowStyle}>JEREMIAH AI PROGRESS</p>
          <h1 style={titleStyle}>Learning progress</h1>
          <p style={subtitleStyle}>
            See what is mastered, what is still developing, and what needs
            review next.
          </p>
        </section>

        <section style={summaryCardStyle}>
          <div style={summaryHeaderStyle}>
            <div>
              <p style={summaryEyebrowStyle}>Mastery Summary</p>
              <h2 style={summaryTitleStyle}>Current standing</h2>
            </div>

            <div style={activeTrackPillStyle}>{data.trackTitle}</div>
          </div>

          <div style={statsGridStyle}>
            <div style={statCardStyle}>
              <p style={statValueStyle}>{data.masterySummary.mastered}</p>
              <p style={statLabelStyle}>Mastered</p>
            </div>

            <div style={statCardStyle}>
              <p style={statValueStyle}>{data.masterySummary.inProgress}</p>
              <p style={statLabelStyle}>In Progress</p>
            </div>

            <div style={statCardStyle}>
              <p style={statValueStyle}>{data.masterySummary.reviewNeeded}</p>
              <p style={statLabelStyle}>Review Needed</p>
            </div>
          </div>
        </section>

        <section style={activeLearningCardStyle}>
          <p style={sectionEyebrowLightStyle}>Active Learning</p>
          <h3 style={activeLearningTitleStyle}>
            Current standard: {data.activeLearning.standardTitle}
          </h3>
          <p style={activeLearningTextStyle}>{data.activeLearning.description}</p>

          <div style={progressWrapStyle}>
            <div style={progressHeaderStyle}>
              <span style={progressLabelStyle}>Standard progress</span>
              <span style={progressValueStyle}>
                {data.activeLearning.progressPercent}%
              </span>
            </div>

            <div style={progressTrackStyle}>
              <div style={{ ...progressFillStyle, width: progressWidth }} />
            </div>
          </div>

          <button
            type="button"
            style={continueButtonStyle}
            onClick={() => {
            setClassroomEntryIntent(CLASSROOM_ENTRY_INTENTS.REVIEW);
            setActiveClassroomSessionPreset(selectProgressSessionPreset(progressData));
            onNavigate?.(ROUTES.CLASSROOM);
          }}
          >
            {data.activeLearning.buttonLabel}
          </button>
        </section>

        <section style={sectionCardStyle}>
          <div style={sectionHeaderStyle}>
            <div>
              <p style={sectionEyebrowStyle}>Mastered Standards</p>
              <h3 style={sectionTitleStyle}>What has been learned</h3>
            </div>
          </div>

          <div style={listStyle}>
            {data.masteredStandards.map((item) => (
              <div key={item.title} style={listItemStyle}>
                <div>
                  <p style={itemTitleStyle}>{item.title}</p>
                  <p style={itemMetaStyle}>{item.meta}</p>
                </div>
                <div style={masteredChipStyle}>Mastered</div>
              </div>
            ))}
          </div>
        </section>

        <section style={sectionCardStyle}>
          <div style={sectionHeaderStyle}>
            <div>
              <p style={sectionEyebrowStyle}>Review Needed</p>
              <h3 style={sectionTitleStyle}>Areas to reinforce</h3>
            </div>
          </div>

          <div style={reviewItemStyle}>
            <div>
              <p style={itemTitleStyle}>{data.reviewNeeded.title}</p>
              <p style={itemMetaStyle}>{data.reviewNeeded.meta}</p>
            </div>
            <div style={reviewChipStyle}>Review</div>
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

const summaryCardStyle = {
  background: "#ffffff",
  borderRadius: "28px",
  padding: "26px",
  boxShadow: "0 12px 36px rgba(15, 23, 42, 0.08)",
  marginBottom: "20px",
};

const summaryHeaderStyle = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "flex-start",
  gap: "16px",
  flexWrap: "wrap",
  marginBottom: "18px",
};

const summaryEyebrowStyle = {
  margin: 0,
  fontSize: "0.8rem",
  textTransform: "uppercase",
  letterSpacing: "0.08em",
  color: "#64748b",
  fontWeight: 700,
};

const summaryTitleStyle = {
  margin: "10px 0 0",
  fontSize: "1.5rem",
  lineHeight: 1.2,
  color: "#0f172a",
  fontWeight: 900,
};

const activeTrackPillStyle = {
  display: "inline-flex",
  alignItems: "center",
  padding: "10px 14px",
  borderRadius: "999px",
  background: "#eff6ff",
  color: "#1d4ed8",
  fontSize: "0.9rem",
  fontWeight: 800,
};

const statsGridStyle = {
  display: "grid",
  gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
  gap: "14px",
};

const statCardStyle = {
  background: "#f8fafc",
  borderRadius: "22px",
  padding: "20px",
  border: "1px solid #e2e8f0",
};

const statValueStyle = {
  margin: 0,
  fontSize: "2rem",
  fontWeight: 900,
  color: "#0f172a",
};

const statLabelStyle = {
  margin: "8px 0 0",
  fontSize: "0.95rem",
  color: "#64748b",
  fontWeight: 700,
};

const activeLearningCardStyle = {
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

const activeLearningTitleStyle = {
  margin: "10px 0 0",
  fontSize: "1.7rem",
  lineHeight: 1.15,
  color: "#ffffff",
  fontWeight: 900,
};

const activeLearningTextStyle = {
  margin: "12px 0 0",
  fontSize: "1rem",
  lineHeight: 1.75,
  color: "rgba(255,255,255,0.84)",
  maxWidth: "720px",
};

const progressWrapStyle = {
  marginTop: "20px",
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
  height: "100%",
  borderRadius: "999px",
  background: "#ffffff",
};

const continueButtonStyle = {
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

const listStyle = {
  display: "grid",
  gap: "14px",
};

const listItemStyle = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  gap: "16px",
  padding: "18px",
  borderRadius: "20px",
  background: "#f8fafc",
  border: "1px solid #e2e8f0",
};

const reviewItemStyle = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  gap: "16px",
  padding: "18px",
  borderRadius: "20px",
  background: "#fff7ed",
  border: "1px solid #fed7aa",
};

const itemTitleStyle = {
  margin: 0,
  fontSize: "1rem",
  lineHeight: 1.5,
  color: "#0f172a",
  fontWeight: 800,
};

const itemMetaStyle = {
  margin: "6px 0 0",
  fontSize: "0.94rem",
  lineHeight: 1.6,
  color: "#64748b",
};

const masteredChipStyle = {
  display: "inline-flex",
  alignItems: "center",
  padding: "9px 12px",
  borderRadius: "999px",
  background: "#ecfdf5",
  color: "#047857",
  fontSize: "0.85rem",
  fontWeight: 800,
};

const reviewChipStyle = {
  display: "inline-flex",
  alignItems: "center",
  padding: "9px 12px",
  borderRadius: "999px",
  background: "#ffedd5",
  color: "#9a3412",
  fontSize: "0.85rem",
  fontWeight: 800,
};
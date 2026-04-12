import { useEffect, useMemo, useState } from "react";
import { ROUTES } from "../../app/routes";
import {
  getActiveClassroomSessionPreset,
  getCurrentSession,
} from "../../core/classroom/classroomSessionData";
import { evaluateResponse } from "../../core/classroom/evaluateResponse";
import { sessionStages } from "../../core/classroom/sessionStages";
import { advanceSessionStage } from "../../core/classroom/advanceSessionStage";
import { stageContent } from "../../core/classroom/stageContent";
import {
  classroomEntryIntentContent,
  clearClassroomEntryIntent,
  getClassroomEntryIntent,
} from "../../core/classroom/classroomEntryIntent";

const SESSION_PRESET_LABELS = {
  resume: "Resume Path",
  review: "Review Path",
  adaptation: "Learner Adaptation Path",
  direct: "Direct Classroom Path",
};

function formatStageLabel(stageId = "") {
  if (!stageId) return "Unknown Stage";

  return stageId
    .split("_")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

function describeStageMovement(entryIndex, liveIndex) {
  if (entryIndex < 0 || liveIndex < 0) {
    return {
      label: "Stage relationship unavailable",
      text:
        "Jeremiah AI could not compare the preset entry stage to the live stage.",
    };
  }

  const delta = liveIndex - entryIndex;

  if (delta === 0) {
    return {
      label: "Still at preset entry stage",
      text:
        "The live session is still working at the same stage the selected preset opened with.",
    };
  }

  if (delta > 0) {
    return {
      label: `Advanced ${delta} stage${delta === 1 ? "" : "s"} beyond preset entry`,
      text:
        "The learner has moved forward from the original preset entry stage as strong responses advanced the live session.",
    };
  }

  const stepsBack = Math.abs(delta);

  return {
    label: `Moved ${stepsBack} stage${stepsBack === 1 ? "" : "s"} before preset entry`,
    text:
      "The live stage is earlier than the preset entry stage, which usually means the session state was reset or reopened differently.",
  };
}

export default function ClassroomPage({ onNavigate }) {
  const session = getCurrentSession();
  const activeSessionPresetId = getActiveClassroomSessionPreset();

  const [currentStageId, setCurrentStageId] = useState(session.currentStageId);
  const [responseText, setResponseText] = useState("");
  const [submittedResponse, setSubmittedResponse] = useState("");
  const [feedbackMessage, setFeedbackMessage] = useState("");
  const [evaluationStatus, setEvaluationStatus] = useState("");
  const [transitionMessage, setTransitionMessage] = useState("");

  const currentStage = useMemo(() => {
    return (
      sessionStages.find((stage) => stage.id === currentStageId) || {
        id: currentStageId,
        label: "Unknown",
        description: "",
      }
    );
  }, [currentStageId]);

  const currentStageContent =
    stageContent[currentStageId] || stageContent.checkpoint;

  const [entryIntent] = useState(() => getClassroomEntryIntent());

  useEffect(() => {
    clearClassroomEntryIntent();
  }, []);

  const entryIntentDisplay =
    classroomEntryIntentContent[entryIntent] ||
    classroomEntryIntentContent.direct;

  const feedbackTone =
    entryIntentDisplay.feedbackTone?.[evaluationStatus] || null;

  const activeSessionPresetLabel =
    SESSION_PRESET_LABELS[activeSessionPresetId] || "Direct Classroom Path";

  function handleSubmitResponse() {
    const result = evaluateResponse(responseText, session.standardId, currentStageId);

    setEvaluationStatus(result.status);
    setFeedbackMessage(result.feedback);

    if (result.status === "empty") {
      setSubmittedResponse("");
      setTransitionMessage("");
      return;
    }

    const trimmed = responseText.trim();
    setSubmittedResponse(trimmed);

    const nextStageId = advanceSessionStage(currentStageId, result.status);

    if (nextStageId !== currentStageId) {
      const nextStage = sessionStages.find((stage) => stage.id === nextStageId);
      setCurrentStageId(nextStageId);
      setResponseText("");
      setTransitionMessage(
        nextStage
          ? `Session advanced to ${nextStage.label}. Jeremiah AI is now using the next teaching surface.`
          : ""
      );
      return;
    }

    setTransitionMessage("");
  }

  const currentStageIndex = sessionStages.findIndex(
    (stage) => stage.id === currentStageId
  );

  const presetEntryStageIndex = sessionStages.findIndex(
    (stage) => stage.id === session.currentStageId
  );

  const sessionMovement = describeStageMovement(
    presetEntryStageIndex,
    currentStageIndex
  );

  const feedbackStyle =
    evaluationStatus === "strong"
      ? strongFeedbackCardStyle
      : evaluationStatus === "partial"
        ? partialFeedbackCardStyle
        : evaluationStatus === "weak" || evaluationStatus === "empty"
          ? weakFeedbackCardStyle
          : feedbackCardStyle;

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

        <section
          style={{
            background: "#ffffff",
            borderRadius: "24px",
            padding: "22px",
            boxShadow: "0 12px 36px rgba(15, 23, 42, 0.08)",
            border: "1px solid #e2e8f0",
            marginBottom: "20px",
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "flex-start",
              gap: "16px",
              flexWrap: "wrap",
            }}
          >
            <div>
              <p
                style={{
                  margin: 0,
                  fontSize: "0.8rem",
                  textTransform: "uppercase",
                  letterSpacing: "0.08em",
                  color: "#64748b",
                  fontWeight: 700,
                }}
              >
                {entryIntentDisplay.eyebrow}
              </p>
              <h2
                style={{
                  margin: "10px 0 0",
                  fontSize: "1.4rem",
                  lineHeight: 1.2,
                  color: "#0f172a",
                  fontWeight: 900,
                  maxWidth: "720px",
                }}
              >
                {entryIntentDisplay.title}
              </h2>
            </div>

            <div
              style={{
                display: "inline-flex",
                alignItems: "center",
                padding: "10px 14px",
                borderRadius: "999px",
                background: "#eef2ff",
                color: "#3730a3",
                fontSize: "0.88rem",
                fontWeight: 800,
              }}
            >
              Current Stage: {currentStage.label}
            </div>
          </div>

          <p
            style={{
              margin: "12px 0 0",
              fontSize: "1rem",
              lineHeight: 1.75,
              color: "#475569",
              maxWidth: "760px",
            }}
          >
            {entryIntentDisplay.text}
          </p>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
              gap: "14px",
              marginTop: "18px",
            }}
          >
            <div
              style={{
                borderRadius: "18px",
                padding: "16px",
                background: "#f8fafc",
                border: "1px solid #e2e8f0",
              }}
            >
              <p
                style={{
                  margin: 0,
                  fontSize: "0.78rem",
                  letterSpacing: "0.08em",
                  textTransform: "uppercase",
                  color: "#64748b",
                  fontWeight: 700,
                }}
              >
                {entryIntentDisplay.emphasisLabel}
              </p>
              <p
                style={{
                  margin: "8px 0 0",
                  fontSize: "0.98rem",
                  lineHeight: 1.7,
                  color: "#0f172a",
                  fontWeight: 600,
                }}
              >
                {entryIntentDisplay.emphasisText}
              </p>
            </div>

            <div
              style={{
                borderRadius: "18px",
                padding: "16px",
                background: "#f8fafc",
                border: "1px solid #e2e8f0",
              }}
            >
              <p
                style={{
                  margin: 0,
                  fontSize: "0.78rem",
                  letterSpacing: "0.08em",
                  textTransform: "uppercase",
                  color: "#64748b",
                  fontWeight: 700,
                }}
              >
                {entryIntentDisplay.actionLabel}
              </p>
              <p
                style={{
                  margin: "8px 0 0",
                  fontSize: "0.98rem",
                  lineHeight: 1.7,
                  color: "#0f172a",
                  fontWeight: 600,
                }}
              >
                {entryIntentDisplay.actionText}
              </p>
            </div>

            <div
              style={{
                borderRadius: "18px",
                padding: "16px",
                background: "#0f172a",
                color: "#ffffff",
              }}
            >
              <p
                style={{
                  margin: 0,
                  fontSize: "0.78rem",
                  letterSpacing: "0.08em",
                  textTransform: "uppercase",
                  color: "rgba(255,255,255,0.68)",
                  fontWeight: 700,
                }}
              >
                Active Standard
              </p>
              <p
                style={{
                  margin: "8px 0 0",
                  fontSize: "1rem",
                  lineHeight: 1.6,
                  color: "#ffffff",
                  fontWeight: 700,
                }}
              >
                {session.standardId} — {session.standardTitle}
              </p>
              <p
                style={{
                  margin: "10px 0 0",
                  fontSize: "0.95rem",
                  lineHeight: 1.7,
                  color: "rgba(255,255,255,0.82)",
                }}
              >
                {session.truthStatement}
              </p>
            </div>
          </div>
        </section>

        <section
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
            gap: "14px",
            marginBottom: "20px",
          }}
        >
          <div
            style={{
              background: "#ffffff",
              borderRadius: "20px",
              padding: "18px",
              border: "1px solid #e2e8f0",
              boxShadow: "0 12px 32px rgba(15, 23, 42, 0.06)",
            }}
          >
            <p
              style={{
                margin: 0,
                fontSize: "0.76rem",
                letterSpacing: "0.08em",
                textTransform: "uppercase",
                color: "#64748b",
                fontWeight: 700,
              }}
            >
              Active Session Path
            </p>
            <p
              style={{
                margin: "8px 0 0",
                fontSize: "1rem",
                lineHeight: 1.5,
                color: "#0f172a",
                fontWeight: 800,
              }}
            >
              {activeSessionPresetLabel}
            </p>
            <p
              style={{
                margin: "8px 0 0",
                fontSize: "0.92rem",
                lineHeight: 1.6,
                color: "#475569",
              }}
            >
              Preset key: {activeSessionPresetId}
            </p>
          </div>

          <div
            style={{
              background: "#ffffff",
              borderRadius: "20px",
              padding: "18px",
              border: "1px solid #e2e8f0",
              boxShadow: "0 12px 32px rgba(15, 23, 42, 0.06)",
            }}
          >
            <p
              style={{
                margin: 0,
                fontSize: "0.76rem",
                letterSpacing: "0.08em",
                textTransform: "uppercase",
                color: "#64748b",
                fontWeight: 700,
              }}
            >
              Preset Entry Stage
            </p>
            <p
              style={{
                margin: "8px 0 0",
                fontSize: "1rem",
                lineHeight: 1.5,
                color: "#0f172a",
                fontWeight: 800,
              }}
            >
              {formatStageLabel(session.currentStageId)}
            </p>
            <p
              style={{
                margin: "8px 0 0",
                fontSize: "0.92rem",
                lineHeight: 1.6,
                color: "#475569",
              }}
            >
              This is the fixed stage the selected session preset opened with.
            </p>
          </div>

          <div
            style={{
              background: "#ffffff",
              borderRadius: "20px",
              padding: "18px",
              border: "1px solid #e2e8f0",
              boxShadow: "0 12px 32px rgba(15, 23, 42, 0.06)",
            }}
          >
            <p
              style={{
                margin: 0,
                fontSize: "0.76rem",
                letterSpacing: "0.08em",
                textTransform: "uppercase",
                color: "#64748b",
                fontWeight: 700,
              }}
            >
              Live Stage
            </p>
            <p
              style={{
                margin: "8px 0 0",
                fontSize: "1rem",
                lineHeight: 1.5,
                color: "#0f172a",
                fontWeight: 800,
              }}
            >
              {currentStage.label}
            </p>
            <p
              style={{
                margin: "8px 0 0",
                fontSize: "0.92rem",
                lineHeight: 1.6,
                color: "#475569",
              }}
            >
              This live stage updates as Jeremiah AI advances the learner through the session.
            </p>
          </div>

          <div
            style={{
              background: "#ffffff",
              borderRadius: "20px",
              padding: "18px",
              border: "1px solid #e2e8f0",
              boxShadow: "0 12px 32px rgba(15, 23, 42, 0.06)",
            }}
          >
            <p
              style={{
                margin: 0,
                fontSize: "0.76rem",
                letterSpacing: "0.08em",
                textTransform: "uppercase",
                color: "#64748b",
                fontWeight: 700,
              }}
            >
              Learner Path
            </p>
            <p
              style={{
                margin: "8px 0 0",
                fontSize: "1rem",
                lineHeight: 1.5,
                color: "#0f172a",
                fontWeight: 800,
              }}
            >
              {session.learnerLevel}
            </p>
            <p
              style={{
                margin: "8px 0 0",
                fontSize: "0.92rem",
                lineHeight: 1.6,
                color: "#475569",
              }}
            >
              {session.standardId} — {session.standardTitle}
            </p>
          </div>

          <div
            style={{
              background: "#ffffff",
              borderRadius: "20px",
              padding: "18px",
              border: "1px solid #e2e8f0",
              boxShadow: "0 12px 32px rgba(15, 23, 42, 0.06)",
            }}
          >
            <p
              style={{
                margin: 0,
                fontSize: "0.76rem",
                letterSpacing: "0.08em",
                textTransform: "uppercase",
                color: "#64748b",
                fontWeight: 700,
              }}
            >
              Session Movement
            </p>
            <p
              style={{
                margin: "8px 0 0",
                fontSize: "1rem",
                lineHeight: 1.5,
                color: "#0f172a",
                fontWeight: 800,
              }}
            >
              {sessionMovement.label}
            </p>
            <p
              style={{
                margin: "8px 0 0",
                fontSize: "0.92rem",
                lineHeight: 1.6,
                color: "#475569",
              }}
            >
              {sessionMovement.text}
            </p>
          </div>
        </section>

        <section style={sessionFrameStyle}>
          <div style={sessionTopRowStyle}>
            <div>
              <p style={smallLabelStyle}>Current Standard</p>
              <h2 style={sessionTitleStyle}>{session.standardTitle}</h2>
            </div>

            <div style={statusPillStyle}>{entryIntentDisplay.eyebrow}</div>
          </div>

          <div style={metaGridStyle}>
            <div style={metaCardStyle}>
              <p style={metaLabelStyle}>Track</p>
              <p style={metaValueStyle}>{session.studyTitle}</p>
            </div>

            <div style={metaCardStyle}>
              <p style={metaLabelStyle}>Current Stage</p>
              <p style={metaValueStyle}>{currentStage.label}</p>
            </div>

            <div style={metaCardStyle}>
              <p style={metaLabelStyle}>Learner Level</p>
              <p style={metaValueStyle}>{session.learnerLevel}</p>
            </div>
          </div>

          <div style={stageStripWrapStyle}>
            <p style={stageStripLabelStyle}>Session Progression</p>

            <div style={stageStripStyle}>
              {sessionStages.map((stage, index) => {
                const isCurrent = stage.id === currentStageId;
                const isComplete =
                  currentStageIndex >= 0 && index < currentStageIndex;

                return (
                  <div
                    key={stage.id}
                    style={{
                      ...stageItemStyle,
                      ...(isCurrent
                        ? currentStageItemStyle
                        : isComplete
                          ? completedStageItemStyle
                          : upcomingStageItemStyle),
                    }}
                  >
                    <span style={stageBadgeStyle}>{index + 1}</span>
                    <div>
                      <p style={stageNameStyle}>{stage.label}</p>
                      <p style={stageDescriptionStyle}>{stage.description}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        <section style={truthCardStyle}>
          <p style={sectionEyebrowStyle}>Truth Statement</p>
          <h3 style={sectionTitleStyle}>{session.truthStatement}</h3>
          <p style={sectionTextStyle}>{session.truthExplanation}</p>
        </section>

        <section style={teachingSurfaceStyle}>
          <div style={surfaceHeaderStyle}>
            <div>
              <p style={surfaceEyebrowStyle}>Teaching Surface</p>
              <h3 style={surfaceTitleStyle}>{currentStageContent.title}</h3>
            </div>
          </div>

          {transitionMessage ? (
            <div style={transitionCardStyle}>
              <p style={transitionLabelStyle}>Stage Transition</p>
              <p style={transitionTextStyle}>{transitionMessage}</p>
            </div>
          ) : null}

          <div style={surfaceGridStyle}>
            <div style={leftColumnStyle}>
              <div style={columnCardStyle}>
                <p style={sectionEyebrowStyle}>Scripture Evidence</p>
                <h4 style={columnTitleStyle}>Key verses in this session</h4>

                <div style={verseListStyle}>
                  {session.verses.map((verse) => (
                    <div key={verse.reference} style={verseCardStyle}>
                      <p style={verseRefStyle}>{verse.reference}</p>
                      <p style={verseTextStyle}>{verse.text}</p>
                      <p style={verseNoteStyle}>{verse.note}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div style={rightColumnStyle}>
              <div style={checkpointCardStyle}>
                <p style={sectionEyebrowDarkStyle}>{currentStage.label}</p>
                <div
                  style={{
                    marginTop: "14px",
                    marginBottom: "14px",
                    borderRadius: "18px",
                    padding: "16px",
                    background: "rgba(255,255,255,0.08)",
                    border: "1px solid rgba(255,255,255,0.14)",
                  }}
                >
                  <p
                    style={{
                      margin: 0,
                      fontSize: "0.76rem",
                      letterSpacing: "0.08em",
                      textTransform: "uppercase",
                      color: "rgba(255,255,255,0.68)",
                      fontWeight: 700,
                    }}
                  >
                    {entryIntentDisplay.lessonLabel}
                  </p>
                  <p
                    style={{
                      margin: "8px 0 0",
                      fontSize: "0.96rem",
                      lineHeight: 1.7,
                      color: "rgba(255,255,255,0.92)",
                      fontWeight: 500,
                    }}
                  >
                    {entryIntentDisplay.lessonText}
                  </p>
                </div>
                <h4 style={checkpointTitleStyle}>{currentStageContent.title}</h4>
                <p style={checkpointTextStyle}>
                  {currentStageContent.description}
                </p>

                <div style={teacherPromptStyle}>
                  <p style={teacherPromptLabelStyle}>Jeremiah AI Prompt</p>
                  <p style={teacherPromptTextStyle}>
                    {currentStageContent.prompt}
                  </p>
                </div>

                <div style={responseBoxStyle}>
                  <label htmlFor="learner-response" style={responseLabelStyle}>
                    Learner Response
                  </label>

                  <div
                    style={{
                      marginBottom: "14px",
                      borderRadius: "18px",
                      padding: "16px",
                      background: "#f8fafc",
                      border: "1px solid #e2e8f0",
                    }}
                  >
                    <p
                      style={{
                        margin: 0,
                        fontSize: "0.78rem",
                        letterSpacing: "0.08em",
                        textTransform: "uppercase",
                        color: "#64748b",
                        fontWeight: 700,
                      }}
                    >
                      {entryIntentDisplay.responseActionLabel}
                    </p>
                    <p
                      style={{
                        margin: "8px 0 0",
                        fontSize: "0.96rem",
                        lineHeight: 1.7,
                        color: "#0f172a",
                      }}
                    >
                      {entryIntentDisplay.responseActionText}
                    </p>
                  </div>

                  <textarea
                    id="learner-response"
                    value={responseText}
                    onChange={(event) => setResponseText(event.target.value)}
                    placeholder={entryIntentDisplay.responseHint}
                    style={textareaStyle}
                  />
                </div>

                <div style={actionsRowStyle}>
                  <button
                    type="button"
                    style={primaryActionStyle}
                    onClick={handleSubmitResponse}
                  >
                    {entryIntentDisplay.submitButtonLabel}
                  </button>
                  <button
                    type="button"
                    style={secondaryActionStyle}
                    onClick={() => onNavigate?.(ROUTES.BIBLE_SUPPORT)}
                  >
                    Review Verses Again
                  </button>
                </div>

                {feedbackMessage ? (
                  <div style={feedbackStyle}>
                    <p style={feedbackLabelStyle}>{feedbackTone?.surfaceLabel || "Jeremiah AI Evaluation"}</p>
                    {feedbackTone ? (
                      <div
                        style={{
                          marginBottom: "14px",
                          borderRadius: "16px",
                          padding: "14px",
                          background: "rgba(255,255,255,0.55)",
                          border: "1px solid rgba(15, 23, 42, 0.08)",
                        }}
                      >
                        <p
                          style={{
                            margin: 0,
                            fontSize: "0.76rem",
                            letterSpacing: "0.08em",
                            textTransform: "uppercase",
                            color: "#334155",
                            fontWeight: 700,
                          }}
                        >
                          {feedbackTone.label}
                        </p>
                        <p
                          style={{
                            margin: "8px 0 0",
                            fontSize: "0.95rem",
                            lineHeight: 1.7,
                            color: "#0f172a",
                          }}
                        >
                          {feedbackTone.text}
                        </p>
                      </div>
                    ) : null}
                    <p style={feedbackTextStyle}>{feedbackMessage}</p>

                    {submittedResponse ? (
                      <>
                        <p style={submittedLabelStyle}>Submitted Response</p>
                        <p style={submittedTextStyle}>{submittedResponse}</p>
                      </>
                    ) : null}
                  </div>
                ) : null}
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

const stageStripWrapStyle = {
  marginTop: "22px",
};

const stageStripLabelStyle = {
  margin: 0,
  fontSize: "0.78rem",
  textTransform: "uppercase",
  letterSpacing: "0.08em",
  color: "rgba(255,255,255,0.65)",
  fontWeight: 700,
};

const stageStripStyle = {
  display: "grid",
  gap: "10px",
  marginTop: "12px",
};

const stageItemStyle = {
  display: "flex",
  gap: "12px",
  alignItems: "flex-start",
  borderRadius: "18px",
  padding: "14px 16px",
  border: "1px solid rgba(255,255,255,0.08)",
};

const currentStageItemStyle = {
  background: "rgba(255,255,255,0.16)",
};

const completedStageItemStyle = {
  background: "rgba(134,239,172,0.16)",
};

const upcomingStageItemStyle = {
  background: "rgba(255,255,255,0.06)",
};

const stageBadgeStyle = {
  width: "28px",
  height: "28px",
  borderRadius: "999px",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  background: "rgba(255,255,255,0.16)",
  color: "#ffffff",
  fontSize: "0.82rem",
  fontWeight: 800,
  flexShrink: 0,
};

const stageNameStyle = {
  margin: 0,
  fontSize: "0.95rem",
  fontWeight: 800,
  color: "#ffffff",
};

const stageDescriptionStyle = {
  margin: "6px 0 0",
  fontSize: "0.9rem",
  lineHeight: 1.55,
  color: "rgba(255,255,255,0.76)",
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

const transitionCardStyle = {
  marginBottom: "18px",
  borderRadius: "20px",
  padding: "18px",
  background: "#eff6ff",
  border: "1px solid #bfdbfe",
};

const transitionLabelStyle = {
  margin: 0,
  fontSize: "0.78rem",
  textTransform: "uppercase",
  letterSpacing: "0.08em",
  color: "#1d4ed8",
  fontWeight: 700,
};

const transitionTextStyle = {
  margin: "10px 0 0",
  fontSize: "0.96rem",
  lineHeight: 1.7,
  color: "#1e3a8a",
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
};

const responseLabelStyle = {
  display: "block",
  margin: 0,
  fontSize: "0.88rem",
  fontWeight: 800,
  color: "#9a3412",
};

const textareaStyle = {
  width: "100%",
  minHeight: "130px",
  marginTop: "10px",
  borderRadius: "20px",
  background: "#ffffff",
  border: "1px solid #fed7aa",
  padding: "16px",
  boxSizing: "border-box",
  resize: "vertical",
  outline: "none",
  fontSize: "0.98rem",
  lineHeight: 1.6,
  color: "#7c2d12",
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

const feedbackCardStyle = {
  marginTop: "16px",
  borderRadius: "20px",
  padding: "18px",
  background: "#ffffff",
  border: "1px solid #fed7aa",
};

const strongFeedbackCardStyle = {
  ...feedbackCardStyle,
  border: "1px solid #86efac",
  background: "#f0fdf4",
};

const partialFeedbackCardStyle = {
  ...feedbackCardStyle,
  border: "1px solid #fdba74",
  background: "#fff7ed",
};

const weakFeedbackCardStyle = {
  ...feedbackCardStyle,
  border: "1px solid #fca5a5",
  background: "#fef2f2",
};

const feedbackLabelStyle = {
  margin: 0,
  fontSize: "0.78rem",
  textTransform: "uppercase",
  letterSpacing: "0.08em",
  color: "#9a3412",
  fontWeight: 700,
};

const feedbackTextStyle = {
  margin: "10px 0 0",
  fontSize: "0.96rem",
  lineHeight: 1.7,
  color: "#7c2d12",
};

const submittedLabelStyle = {
  margin: "14px 0 0",
  fontSize: "0.78rem",
  textTransform: "uppercase",
  letterSpacing: "0.08em",
  color: "#c2410c",
  fontWeight: 700,
};

const submittedTextStyle = {
  margin: "10px 0 0",
  fontSize: "0.98rem",
  lineHeight: 1.7,
  color: "#7c2d12",
};
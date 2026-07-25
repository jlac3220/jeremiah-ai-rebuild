import { useEffect, useMemo, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { getStandardByCode } from "../../core/standards/standardsRegistry";
import { raiseStandardProgressLevel, getStandardProgressLevel, scheduleNextReview } from "../../core/standards/standardsProgress";
import { recordEngagement } from "../../core/streak/streak";
import {
  getSavedLiveStageForStandard,
  setSavedLiveStageForStandard,
  getActiveLearnerAgeBand,
} from "../../core/classroom/classroomSessionData";
import { evaluateResponse } from "../../core/classroom/evaluateResponse";
import { sessionStages } from "../../core/classroom/sessionStages";
import { advanceSessionStage } from "../../core/classroom/advanceSessionStage";
import { stageContent, buildStagePrompt } from "../../core/classroom/stageContent";
import { ROUTES, bibleSupportPath } from "../../app/routes";
import Card from "../../shared/ui/Card";
import Pill from "../../shared/ui/Pill";
import PrimaryButton from "../../shared/ui/PrimaryButton";
import SecondaryButton from "../../shared/ui/SecondaryButton";
import { FlameMark } from "../../shared/ui/icons";
import { colors, gradients, shadows, getSubjectAccent } from "../../shared/theme";
import { stageTransition, thinkingPulse, igniteGlow } from "../../shared/motion";

const AGE_BAND_LABELS = { child: "Child Path", teen: "Teen Path", adult: "Adult Path", senior: "Senior Path" };

export default function ClassroomPage() {
  const { standardCode } = useParams();
  const navigate = useNavigate();
  const standard = getStandardByCode(standardCode);
  const ageBand = getActiveLearnerAgeBand();

  const [currentStageId, setCurrentStageId] = useState(
    () => getSavedLiveStageForStandard(standardCode) || "focus"
  );
  const [responseText, setResponseText] = useState("");
  const [submittedResponse, setSubmittedResponse] = useState("");
  const [feedbackMessage, setFeedbackMessage] = useState("");
  const [evaluationStatus, setEvaluationStatus] = useState("");
  const [transitionMessage, setTransitionMessage] = useState("");
  const [isGrading, setIsGrading] = useState(false);
  const [justMastered, setJustMastered] = useState(false);
  // Retrieval-first: verses stay hidden until the learner has attempted an
  // answer from memory for the current stage. Research on active recall is
  // clear that attempt-then-check beats read-then-answer for retention.
  const [hasAttempted, setHasAttempted] = useState(false);

  useEffect(() => {
    setCurrentStageId(getSavedLiveStageForStandard(standardCode) || "focus");
    setResponseText("");
    setSubmittedResponse("");
    setFeedbackMessage("");
    setEvaluationStatus("");
    setTransitionMessage("");
    setJustMastered(false);
    setHasAttempted(false);
  }, [standardCode]);

  const currentStage = useMemo(
    () => sessionStages.find((stage) => stage.id === currentStageId) || sessionStages[0],
    [currentStageId]
  );
  const currentStageIndex = sessionStages.findIndex((stage) => stage.id === currentStageId);
  const currentStageContent = stageContent[currentStageId] || stageContent.focus;

  const stagePrompt = useMemo(
    () => (standard ? buildStagePrompt(currentStageId, standard) : ""),
    [currentStageId, standard]
  );

  const accent = standard ? getSubjectAccent(standard.subjectCode) : getSubjectAccent("OG");

  if (!standard) {
    return (
      <div style={pageStyle}>
        <div style={contentStyle}>
          <Card>
            <h1 style={{ margin: 0, fontSize: "1.5rem", fontWeight: 900, color: colors.text }}>
              Standard not found
            </h1>
            <p style={{ marginTop: "12px", color: colors.textMuted }}>
              "{standardCode}" isn't a real standard. Head back to the map to pick one.
            </p>
            <div style={{ marginTop: "18px" }}>
              <Link to={ROUTES.MAP}>
                <SecondaryButton>Back to Map</SecondaryButton>
              </Link>
            </div>
          </Card>
        </div>
      </div>
    );
  }

  async function handleSubmitResponse() {
    if (isGrading) return;
    setIsGrading(true);

    let result;
    try {
      result = await evaluateResponse(responseText, standard.code, currentStageId, ageBand);
    } finally {
      setIsGrading(false);
    }

    setEvaluationStatus(result.status);
    setFeedbackMessage(result.feedback);

    if (result.status === "empty") {
      setSubmittedResponse("");
      setTransitionMessage("");
      return;
    }

    // Reveal the verses on any real attempt, even if grading itself failed —
    // retrieval-first is about the learner trying before seeing the answer,
    // not about whether the mouthpiece happened to be reachable.
    setHasAttempted(true);
    setSubmittedResponse(responseText.trim());

    if (result.gradingUnavailable) {
      setTransitionMessage("");
      return;
    }

    recordEngagement();

    if (currentStageId === "mastery" && result.status === "strong") {
      raiseStandardProgressLevel(standard.code, 4);
      scheduleNextReview(standard.code, true);
      setJustMastered(true);
      setTransitionMessage(`${standard.title} is now mastered.`);
      return;
    }

    const nextStageId = advanceSessionStage(currentStageId, result.status);
    if (nextStageId !== currentStageId) {
      const nextIndex = sessionStages.findIndex((stage) => stage.id === nextStageId);
      if (nextIndex > 0) raiseStandardProgressLevel(standard.code, nextIndex);
      setCurrentStageId(nextStageId);
      setSavedLiveStageForStandard(standard.code, nextStageId);
      setResponseText("");
      setSubmittedResponse("");
      setFeedbackMessage("");
      setEvaluationStatus("");
      setHasAttempted(false);
      const nextStage = sessionStages.find((stage) => stage.id === nextStageId);
      setTransitionMessage(nextStage ? `Advanced to ${nextStage.label}.` : "");
    } else {
      setTransitionMessage("");
    }
  }

  const feedbackTone =
    evaluationStatus === "strong"
      ? { bg: colors.strongBg, border: colors.strongBorder }
      : evaluationStatus === "partial"
        ? { bg: colors.partialBg, border: colors.partialBorder }
        : evaluationStatus
          ? { bg: colors.weakBg, border: colors.weakBorder }
          : null;

  const progressLevel = getStandardProgressLevel(standard.code);

  return (
    <div style={pageStyle}>
      <div style={contentStyle}>
        <div style={breadcrumbRowStyle}>
          <Link to={ROUTES.MAP} style={breadcrumbLinkStyle}>
            ← Doctrine Map
          </Link>
          <Pill style={{ background: accent.soft, color: accent.text }}>{standard.subjectTitle}</Pill>
        </div>

        <Card variant="dark" style={{ marginBottom: "20px", borderTop: `4px solid ${accent.base}` }}>
          <p style={smallLabelStyle}>{standard.code} — {standard.domainTitle}</p>
          <h1 style={titleStyle}>{standard.title}</h1>
          <p style={truthTextStyle}>{standard.statement}</p>

          <div style={stageStripStyle}>
            {sessionStages.map((stage, index) => {
              const isCurrent = stage.id === currentStageId;
              const isComplete = currentStageIndex >= 0 && index < currentStageIndex;
              return (
                <div
                  key={stage.id}
                  style={{
                    ...stageChipStyle,
                    ...(isCurrent
                      ? { background: "rgba(255,255,255,0.2)" }
                      : isComplete
                        ? { background: "rgba(134,239,172,0.2)" }
                        : { background: "rgba(255,255,255,0.06)" }),
                  }}
                >
                  <span style={stageChipBadgeStyle}>{index + 1}</span>
                  <span style={stageChipLabelStyle}>{stage.label}</span>
                </div>
              );
            })}
          </div>
        </Card>

        <AnimatePresence mode="wait">
          {justMastered ? (
            <motion.div key="mastered" {...stageTransition}>
              <Card style={{ textAlign: "center", marginBottom: "20px" }}>
                <motion.div
                  {...igniteGlow}
                  style={{
                    width: "80px",
                    height: "80px",
                    margin: "0 auto",
                    borderRadius: "999px",
                    background: gradients.flame,
                    boxShadow: shadows.flame,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <FlameMark size={38} />
                </motion.div>
                <h2 style={{ margin: "18px 0 0", fontSize: "1.6rem", fontWeight: 900, color: colors.text }}>
                  {standard.title} — Mastered
                </h2>
                <p style={{ margin: "12px 0 0", color: colors.textMuted, lineHeight: 1.7 }}>
                  You've shown recognition, explanation, application, and defense of this
                  standard. It's now lit on the Doctrine Map.
                </p>
                <div style={{ marginTop: "20px", display: "flex", gap: "12px", justifyContent: "center" }}>
                  <Link to={ROUTES.MAP}>
                    <PrimaryButton>Back to Map</PrimaryButton>
                  </Link>
                  <Link to={ROUTES.ASK}>
                    <SecondaryButton>Ask Jeremiah About This</SecondaryButton>
                  </Link>
                </div>
              </Card>
            </motion.div>
          ) : (
            <motion.div key={currentStageId} {...stageTransition}>
              <Card variant="checkpoint" style={{ marginBottom: "20px" }}>
                <p style={sectionEyebrowDarkStyle}>{currentStage.label}</p>
                <h3 style={stageTitleStyle}>{currentStageContent.title}</h3>
                <p style={stageDescriptionStyle}>{currentStageContent.description}</p>

                <div style={promptBoxStyle}>
                  <p style={promptLabelStyle}>Jeremiah AI Prompt</p>
                  <p style={promptTextStyle}>{stagePrompt}</p>
                </div>

                {!hasAttempted ? (
                  <p style={retrievalHintStyle}>
                    Answer from memory first — the verses will appear once you submit, so you
                    can check and correct yourself.
                  </p>
                ) : null}

                <textarea
                  value={responseText}
                  onChange={(event) => setResponseText(event.target.value)}
                  placeholder="Respond in your own words..."
                  style={textareaStyle}
                />

                {transitionMessage ? <p style={transitionTextStyle}>{transitionMessage}</p> : null}

                {isGrading ? (
                  <motion.p style={gradingTextStyle} {...thinkingPulse}>
                    Jeremiah is thinking…
                  </motion.p>
                ) : null}

                <div style={actionsRowStyle}>
                  <PrimaryButton
                    onClick={handleSubmitResponse}
                    disabled={isGrading}
                    style={{ background: gradients.flame, color: "#ffffff", boxShadow: shadows.flame, border: "none" }}
                  >
                    {isGrading ? "Grading…" : "Submit Response"}
                  </PrimaryButton>
                  <Link to={bibleSupportPath(standard.code)}>
                    <SecondaryButton>Review Verses Again</SecondaryButton>
                  </Link>
                </div>

                {feedbackMessage ? (
                  <div
                    style={{
                      marginTop: "16px",
                      borderRadius: "18px",
                      padding: "16px",
                      background: feedbackTone?.bg || "#ffffff",
                      border: `1px solid ${feedbackTone?.border || colors.checkpointBorder}`,
                    }}
                  >
                    <p style={feedbackLabelStyle}>Jeremiah AI Evaluation</p>
                    <p style={feedbackTextStyle}>{feedbackMessage}</p>
                    {submittedResponse ? (
                      <>
                        <p style={submittedLabelStyle}>Your Response</p>
                        <p style={submittedTextStyle}>{submittedResponse}</p>
                      </>
                    ) : null}
                  </div>
                ) : null}
              </Card>

              {hasAttempted ? (
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
                  <Card style={{ marginBottom: "20px" }}>
                    <p style={sectionEyebrowStyle}>Scripture Evidence — Check Yourself</p>
                    <div style={verseListStyle}>
                      {standard.anchorScriptures.map((verse) => (
                        <div
                          key={verse.reference}
                          style={{
                            ...verseCardStyle,
                            background: `linear-gradient(135deg, ${accent.soft} 0%, #ffffff 70%)`,
                            borderLeft: `4px solid ${accent.base}`,
                          }}
                        >
                          <span style={{ ...verseQuoteMarkStyle, color: accent.base }}>"</span>
                          <p style={{ ...verseRefStyle, color: accent.text }}>{verse.reference}</p>
                          <p style={verseTextStyle}>{verse.text}</p>
                        </div>
                      ))}
                    </div>
                    <div style={{ marginTop: "12px" }}>
                      <Link to={bibleSupportPath(standard.code)} style={breadcrumbLinkStyle}>
                        Open in Bible Support →
                      </Link>
                    </div>
                  </Card>
                </motion.div>
              ) : null}
            </motion.div>
          )}
        </AnimatePresence>

        <div style={footerRowStyle}>
          <Pill tone={progressLevel >= 4 ? "mastered" : "neutral"}>
            {AGE_BAND_LABELS[ageBand] || "Adult Path"} · Progress {progressLevel}/4
          </Pill>
          <SecondaryButton onClick={() => navigate(ROUTES.MAP)}>Exit to Map</SecondaryButton>
        </div>
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

const breadcrumbRowStyle = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  marginBottom: "18px",
};

const breadcrumbLinkStyle = {
  color: colors.infoText,
  fontWeight: 700,
  fontSize: "0.92rem",
  textDecoration: "none",
};

const smallLabelStyle = {
  margin: 0,
  fontSize: "0.8rem",
  textTransform: "uppercase",
  letterSpacing: "0.08em",
  color: "rgba(255,255,255,0.65)",
  fontWeight: 700,
};

const titleStyle = {
  margin: "10px 0 0",
  fontSize: "1.9rem",
  lineHeight: 1.1,
  fontWeight: 900,
  color: "#ffffff",
};

const truthTextStyle = {
  margin: "12px 0 0",
  fontSize: "1rem",
  lineHeight: 1.7,
  color: "rgba(255,255,255,0.86)",
};

const stageStripStyle = {
  display: "flex",
  gap: "8px",
  marginTop: "20px",
  flexWrap: "wrap",
};

const stageChipStyle = {
  display: "flex",
  alignItems: "center",
  gap: "8px",
  borderRadius: "999px",
  padding: "8px 14px",
  border: "1px solid rgba(255,255,255,0.08)",
};

const stageChipBadgeStyle = {
  width: "20px",
  height: "20px",
  borderRadius: "999px",
  background: "rgba(255,255,255,0.18)",
  color: "#ffffff",
  fontSize: "0.72rem",
  fontWeight: 800,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
};

const stageChipLabelStyle = {
  fontSize: "0.85rem",
  fontWeight: 700,
  color: "#ffffff",
};

const sectionEyebrowStyle = {
  margin: 0,
  fontSize: "0.8rem",
  textTransform: "uppercase",
  letterSpacing: "0.08em",
  color: colors.textFaint,
  fontWeight: 700,
};

const sectionEyebrowDarkStyle = {
  margin: 0,
  fontSize: "0.8rem",
  textTransform: "uppercase",
  letterSpacing: "0.08em",
  color: colors.checkpointTextMid,
  fontWeight: 700,
};

const verseListStyle = { display: "grid", gap: "12px", marginTop: "14px" };

const verseCardStyle = {
  position: "relative",
  borderRadius: "16px",
  padding: "20px 18px 18px",
  border: `1px solid ${colors.cardBorder}`,
  overflow: "hidden",
};

const verseQuoteMarkStyle = {
  position: "absolute",
  top: "-6px",
  right: "14px",
  fontSize: "3.2rem",
  fontFamily: "Georgia, serif",
  fontWeight: 900,
  opacity: 0.22,
  lineHeight: 1,
  pointerEvents: "none",
};

const verseRefStyle = { margin: 0, fontWeight: 800, letterSpacing: "0.02em" };
const verseTextStyle = {
  margin: "10px 0 0",
  lineHeight: 1.75,
  color: "#1e293b",
  fontFamily: "Georgia, 'Times New Roman', serif",
  fontSize: "1.05rem",
};

const stageTitleStyle = {
  margin: "10px 0 0",
  fontSize: "1.35rem",
  fontWeight: 900,
  color: colors.checkpointTextDark,
};

const stageDescriptionStyle = {
  margin: "10px 0 0",
  lineHeight: 1.7,
  color: colors.checkpointTextMid,
};

const promptBoxStyle = {
  marginTop: "16px",
  borderRadius: "16px",
  padding: "16px",
  background: "#ffffff",
  border: `1px solid ${colors.checkpointBorder}`,
};

const promptLabelStyle = {
  margin: 0,
  fontSize: "0.76rem",
  textTransform: "uppercase",
  letterSpacing: "0.08em",
  color: colors.checkpointTextMid,
  fontWeight: 700,
};

const retrievalHintStyle = {
  margin: "14px 0 0",
  fontSize: "0.88rem",
  fontStyle: "italic",
  color: colors.checkpointTextMid,
};

const promptTextStyle = {
  margin: "8px 0 0",
  lineHeight: 1.7,
  color: colors.checkpointTextDark,
  fontWeight: 600,
};

const textareaStyle = {
  width: "100%",
  minHeight: "120px",
  marginTop: "16px",
  borderRadius: "16px",
  border: `1px solid ${colors.checkpointBorder}`,
  padding: "14px",
  boxSizing: "border-box",
  resize: "vertical",
  outline: "none",
  fontSize: "0.98rem",
  lineHeight: 1.6,
  fontFamily: "inherit",
};

const transitionTextStyle = {
  marginTop: "12px",
  fontSize: "0.9rem",
  fontWeight: 700,
  color: colors.infoText,
};

const gradingTextStyle = {
  marginTop: "12px",
  fontSize: "0.9rem",
  fontWeight: 700,
  color: colors.checkpointTextMid,
};

const actionsRowStyle = {
  marginTop: "16px",
  display: "flex",
  gap: "12px",
  flexWrap: "wrap",
};

const feedbackLabelStyle = {
  margin: 0,
  fontSize: "0.76rem",
  textTransform: "uppercase",
  letterSpacing: "0.08em",
  color: colors.checkpointTextMid,
  fontWeight: 700,
};

const feedbackTextStyle = { margin: "10px 0 0", lineHeight: 1.7, color: colors.text };
const submittedLabelStyle = { margin: "14px 0 0", fontSize: "0.76rem", textTransform: "uppercase", color: colors.textFaint, fontWeight: 700 };
const submittedTextStyle = { margin: "8px 0 0", lineHeight: 1.6, color: colors.textMuted };

const footerRowStyle = {
  marginTop: "24px",
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  flexWrap: "wrap",
  gap: "12px",
};

import { useEffect, useMemo, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import {
  getStandardByCode,
  getNextUnmasteredStandard,
  getPreviousStandard,
  getUnlockBlockReason,
} from "../../core/standards/standardsRegistry";
import { getVocabularyDefinition } from "../../core/standards/vocabularyGlossary";
import {
  raiseStandardProgressLevel,
  getStandardProgressLevel,
  getStandardProgress,
  scheduleNextReview,
} from "../../core/standards/standardsProgress";
import { recordEngagement } from "../../core/streak/streak";
import {
  getSavedLiveStageForStandard,
  setSavedLiveStageForStandard,
  getActiveLearnerAgeBand,
  getIntroSeenForStandard,
  setIntroSeenForStandard,
} from "../../core/classroom/classroomSessionData";
import { evaluateResponse } from "../../core/classroom/evaluateResponse";
import { sessionStages } from "../../core/classroom/sessionStages";
import { advanceSessionStage } from "../../core/classroom/advanceSessionStage";
import { stageContent, buildStagePrompt } from "../../core/classroom/stageContent";
import { buildStandardDrillRound } from "../../core/drill/drillEngine";
import DefendExchangePanel from "../defend/components/DefendExchangePanel";
import InlineAskPanel from "./components/InlineAskPanel";
import { ROUTES, bibleSupportPath, classroomPath, defendPath } from "../../app/routes";
import Card from "../../shared/ui/Card";
import Pill from "../../shared/ui/Pill";
import PrimaryButton from "../../shared/ui/PrimaryButton";
import SecondaryButton from "../../shared/ui/SecondaryButton";
import { FlameMark, BoltIcon } from "../../shared/ui/icons";
import { colors, gradients, shadows, fonts, getSubjectAccent } from "../../shared/theme";
import { stageTransition, thinkingPulse, igniteGlow } from "../../shared/motion";

const RECALL_ADVANCE_DELAY_MS = 1000;

const RECALL_TYPE_BADGE = {
  reference: "Scripture",
  vocabulary: "Vocabulary",
  truth: "Truth",
};

const AGE_BAND_LABELS = { child: "Child Path", teen: "Teen Path", adult: "Adult Path", senior: "Senior Path" };

function VocabularyList({ terms, accent }) {
  return (
    <div style={vocabListStyle}>
      {terms.map((term) => {
        const definition = getVocabularyDefinition(term);
        return (
          <div key={term} style={{ ...vocabEntryStyle, borderLeftColor: accent.base }}>
            <p style={{ ...vocabTermStyle, color: accent.text }}>{term}</p>
            {definition ? <p style={vocabDefinitionStyle}>{definition}</p> : null}
          </div>
        );
      })}
    </div>
  );
}

export default function ClassroomPage() {
  const { standardCode } = useParams();
  const navigate = useNavigate();
  const standard = getStandardByCode(standardCode);
  const ageBand = getActiveLearnerAgeBand();

  const [currentStageId, setCurrentStageId] = useState(
    () => getSavedLiveStageForStandard(standardCode) || "focus"
  );
  // A learner's first-ever encounter with a standard gets a real lesson
  // before anything is graded — retrieval-first (verses hidden until you
  // attempt an answer) is right for review, not for material never taught.
  const [introAcknowledged, setIntroAcknowledged] = useState(
    () => getIntroSeenForStandard(standardCode)
  );
  // Cognitive load theory: novices learn better from a worked example before
  // independent practice than from problem-solving cold. This gates one
  // "watch Jeremiah work through it" card between the Introduction and the
  // first graded attempt, only on a learner's first-ever pass at a standard.
  const [modelAcknowledged, setModelAcknowledged] = useState(false);
  const [responseText, setResponseText] = useState("");
  const [submittedResponse, setSubmittedResponse] = useState("");
  const [feedbackMessage, setFeedbackMessage] = useState("");
  const [evaluationStatus, setEvaluationStatus] = useState("");
  const [transitionMessage, setTransitionMessage] = useState("");
  const [isGrading, setIsGrading] = useState(false);
  // Once the 5-stage grading track is mastered, the session keeps going in
  // this same component rather than dead-ending: a quick Recall check on
  // just this standard's own verses, then a Pressure round (Defend the
  // Faith) on just this standard, then the Complete screen. Nothing here
  // navigates away — that page-hopping was the actual source of the
  // "detached" feeling, not the content itself.
  const [sessionPhase, setSessionPhase] = useState("stages"); // stages | recall | pressure | complete
  const [recallIndex, setRecallIndex] = useState(0);
  const [recallScore, setRecallScore] = useState(0);
  const [recallSelected, setRecallSelected] = useState(null);
  const [pressureOutcome, setPressureOutcome] = useState(null);
  // Retrieval-first: verses stay hidden until the learner has attempted an
  // answer from memory for the current stage. Research on active recall is
  // clear that attempt-then-check beats read-then-answer for retention.
  const [hasAttempted, setHasAttempted] = useState(false);
  // Vocabulary needs to stay reachable during the graded stages too, not
  // just on the one-time Introduction screen — a learner shouldn't have to
  // remember a definition from a screen they've already clicked past.
  const [showVocabReference, setShowVocabReference] = useState(false);
  // This is study, not a locked-book test — scripture stays available on
  // demand at any point, not only after a graded attempt. The automatic
  // reveal on submit (hasAttempted) still happens too; this just adds a
  // manual way to look before answering.
  const [showScriptureReference, setShowScriptureReference] = useState(false);
  const [showTeachingNote, setShowTeachingNote] = useState(false);
  // Students should be able to ask questions during instruction, not just
  // in a disconnected chat elsewhere — this stays open across stage
  // transitions within the same standard so a side conversation isn't lost
  // just because the learner advanced a stage.
  const [showAskPanel, setShowAskPanel] = useState(false);
  // Distinguishes "the mouthpiece is genuinely unreachable" from a real
  // weak grade — only true lets the learner preview further stages without
  // faking a verdict or touching real progress/mastery data.
  const [gradingWasUnavailable, setGradingWasUnavailable] = useState(false);

  useEffect(() => {
    setCurrentStageId(getSavedLiveStageForStandard(standardCode) || "focus");
    setIntroAcknowledged(getIntroSeenForStandard(standardCode));
    setModelAcknowledged(false);
    setResponseText("");
    setSubmittedResponse("");
    setFeedbackMessage("");
    setEvaluationStatus("");
    setTransitionMessage("");
    setSessionPhase("stages");
    setRecallIndex(0);
    setRecallScore(0);
    setRecallSelected(null);
    setPressureOutcome(null);
    setHasAttempted(false);
    setShowVocabReference(false);
    setShowScriptureReference(false);
    setShowTeachingNote(false);
    setShowAskPanel(false);
    setGradingWasUnavailable(false);
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

  // Deliberately memoized on the standard alone, not sessionPhase — the
  // Complete screen's recap ("Recall 4/6") needs this same round's length
  // after sessionPhase has already moved past "recall".
  const recallRound = useMemo(
    () => (standard ? buildStandardDrillRound(standard) : []),
    [standard]
  );
  const recallQuestion = recallRound[recallIndex];

  // A standard with no anchor scriptures (shouldn't happen in practice) has
  // nothing to recall — skip straight to the Pressure round rather than
  // stalling the session on an empty quiz.
  useEffect(() => {
    if (sessionPhase === "recall" && recallRound.length === 0) {
      setSessionPhase("pressure");
    }
  }, [sessionPhase, recallRound.length]);

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

  const blockReason = getUnlockBlockReason(standard.code, getStandardProgress());
  if (blockReason) {
    return (
      <div style={pageStyle}>
        <div style={contentStyle}>
          <Card>
            <p style={sectionEyebrowStyle}>Not Yet</p>
            <h1 style={{ margin: "10px 0 0", fontSize: "1.5rem", fontWeight: 900, color: colors.text }}>
              {standard.title} isn't ready for you yet.
            </h1>
            {blockReason.type === "sequence" ? (
              <>
                <p style={{ marginTop: "12px", lineHeight: 1.7, color: colors.textMuted }}>
                  We build this sequentially — {blockReason.standard.title} comes first. Jeremiah
                  doesn't skip ahead, even when you're eager to.
                </p>
                <div style={{ marginTop: "18px" }}>
                  <Link to={classroomPath(blockReason.standard.code)}>
                    <PrimaryButton
                      style={{ background: gradients.flame, color: "#ffffff", boxShadow: shadows.flame, border: "none" }}
                    >
                      Go to {blockReason.standard.title}
                    </PrimaryButton>
                  </Link>
                </div>
              </>
            ) : (
              <>
                <p style={{ marginTop: "12px", lineHeight: 1.7, color: colors.textMuted }}>
                  Before new material, let's confirm you still hold what's already mastered —
                  {" "}
                  {blockReason.codes.length} standard{blockReason.codes.length === 1 ? "" : "s"}{" "}
                  came due for review. Consistent mastery means it stays held, not just passed once.
                </p>
                <div style={{ marginTop: "18px" }}>
                  <Link to={defendPath(blockReason.codes[0])}>
                    <PrimaryButton
                      style={{ background: gradients.flame, color: "#ffffff", boxShadow: shadows.flame, border: "none" }}
                    >
                      Defend What's Due
                    </PrimaryButton>
                  </Link>
                </div>
              </>
            )}
            <div style={{ marginTop: "12px" }}>
              <Link to={ROUTES.MAP} style={breadcrumbLinkStyle}>
                ← Back to Map
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
      setGradingWasUnavailable(true);
      setTransitionMessage("");
      return;
    }

    setGradingWasUnavailable(false);
    recordEngagement();

    if (currentStageId === "mastery" && result.status === "strong") {
      raiseStandardProgressLevel(standard.code, 4);
      // Initial schedule so a review exists even if the learner exits before
      // finishing Recall/Pressure below — the Pressure round reschedules
      // with the real outcome once it completes.
      scheduleNextReview(standard.code, true);
      setTransitionMessage(`${standard.title} is now mastered.`);
      setSessionPhase("recall");
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
      setShowVocabReference(false);
      setShowScriptureReference(false);
      setShowTeachingNote(false);
      const nextStage = sessionStages.find((stage) => stage.id === nextStageId);
      setTransitionMessage(nextStage ? `Advanced to ${nextStage.label}.` : "");
    } else {
      setTransitionMessage("");
    }
  }

  function handleBeginSession() {
    setIntroSeenForStandard(standard.code);
    setIntroAcknowledged(true);
  }

  function handleRecallChoose(choice) {
    if (recallSelected) return;
    const isCorrect = choice === recallQuestion.correctLabel;
    setRecallSelected(choice);
    if (isCorrect) setRecallScore((current) => current + 1);

    setTimeout(() => {
      if (recallIndex + 1 >= recallRound.length) {
        setSessionPhase("pressure");
      } else {
        setRecallIndex((current) => current + 1);
        setRecallSelected(null);
      }
    }, RECALL_ADVANCE_DELAY_MS);
  }

  function handlePressureComplete(outcome) {
    setPressureOutcome(outcome);
  }

  // Only reachable when the mouthpiece itself is unreachable (not on a real
  // weak/partial grade) — moves the view forward WITHOUT recording any
  // mastery, review schedule, or engagement, so it can never substitute for
  // a real grade. Exists purely so the session's later stages are visible
  // when grading genuinely can't run right now.
  function handlePreviewAdvance() {
    setGradingWasUnavailable(false);
    setResponseText("");
    setSubmittedResponse("");
    setFeedbackMessage("");
    setEvaluationStatus("");
    setHasAttempted(false);
    setShowVocabReference(false);
    setShowScriptureReference(false);
    setShowTeachingNote(false);

    if (currentStageId === "mastery") {
      setTransitionMessage("");
      setSessionPhase("recall");
      return;
    }

    const currentIndex = sessionStages.findIndex((stage) => stage.id === currentStageId);
    const nextStage = sessionStages[currentIndex + 1];
    if (nextStage) {
      setCurrentStageId(nextStage.id);
      setTransitionMessage(`Previewing ${nextStage.label} — not recorded as real progress.`);
    }
  }

  const feedbackTone =
    evaluationStatus === "strong"
      ? { bg: colors.strongBg, border: colors.strongBorder }
      : evaluationStatus === "partial"
        ? { bg: colors.partialBg, border: colors.partialBorder }
        : evaluationStatus === "empty"
          ? { bg: "#f8fafc", border: colors.checkpointBorder }
          : evaluationStatus
            ? { bg: colors.weakBg, border: colors.weakBorder }
            : null;

  const progressLevel = getStandardProgressLevel(standard.code);
  const showIntro = progressLevel === 0 && !introAcknowledged;
  const showModel = progressLevel === 0 && introAcknowledged && !modelAcknowledged;
  const previousStandard = showIntro ? getPreviousStandard(standard.code) : null;
  const previousMastered = previousStandard && getStandardProgressLevel(previousStandard.code) >= 4;
  const nextStandard =
    sessionPhase === "complete" ? getNextUnmasteredStandard(getStandardProgress()) : null;

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
          {sessionPhase === "complete" ? (
            <motion.div key="complete" {...stageTransition}>
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
                <div style={sessionRecapRowStyle}>
                  {recallRound.length > 0 ? (
                    <Pill tone="neutral">Recall {recallScore}/{recallRound.length}</Pill>
                  ) : null}
                  {pressureOutcome ? (
                    <Pill tone={pressureOutcome.unavailable ? "neutral" : pressureOutcome.success ? "mastered" : "review"}>
                      {pressureOutcome.unavailable
                        ? "Pressure round unavailable"
                        : pressureOutcome.success
                          ? "Held the line under pressure"
                          : "Wavered under pressure"}
                    </Pill>
                  ) : null}
                </div>
                <div style={{ marginTop: "20px", display: "flex", gap: "12px", justifyContent: "center", flexWrap: "wrap" }}>
                  {nextStandard ? (
                    <Link to={classroomPath(nextStandard.code)}>
                      <PrimaryButton
                        style={{ background: gradients.flame, color: "#ffffff", boxShadow: shadows.flame, border: "none" }}
                      >
                        Next Standard
                      </PrimaryButton>
                    </Link>
                  ) : (
                    <Link to={ROUTES.MAP}>
                      <PrimaryButton
                        style={{ background: gradients.flame, color: "#ffffff", boxShadow: shadows.flame, border: "none" }}
                      >
                        Back to Map
                      </PrimaryButton>
                    </Link>
                  )}
                  <Link to={ROUTES.ASK}>
                    <SecondaryButton>Ask Jeremiah About This</SecondaryButton>
                  </Link>
                </div>
              </Card>
            </motion.div>
          ) : sessionPhase === "pressure" ? (
            <motion.div key="pressure" {...stageTransition}>
              <Card variant="dark" style={{ marginBottom: "16px", borderTop: `4px solid ${accent.base}` }}>
                <p style={sectionEyebrowStyle}>Pressure Test</p>
                <h3 style={{ ...introTitleStyle, color: "#ffffff" }}>
                  Defend what you just learned
                </h3>
                <p style={{ margin: "10px 0 0", lineHeight: 1.7, color: "rgba(255,255,255,0.82)" }}>
                  Jeremiah is going to argue the other side of {standard.title} right now, while
                  it's fresh. Hold the line using Scripture.
                </p>
              </Card>

              <DefendExchangePanel standard={standard} ageBand={ageBand} onRoundComplete={handlePressureComplete} />

              {pressureOutcome ? (
                <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} style={{ marginTop: "16px" }}>
                  <Card style={{ textAlign: "center" }}>
                    <h3 style={{ margin: 0, fontSize: "1.1rem", fontWeight: 900, color: colors.text }}>
                      {pressureOutcome.unavailable
                        ? "Couldn't reach Jeremiah just now."
                        : pressureOutcome.success
                          ? "You held the line."
                          : "This one needs more work."}
                    </h3>
                    <p style={{ margin: "10px 0 0", color: colors.textMuted }}>
                      {pressureOutcome.unavailable
                        ? "Connection issue — review is rescheduled soon so you can try again."
                        : pressureOutcome.success
                          ? "Review scheduled further out — you've shown you can still defend this."
                          : "Review scheduled sooner so you get another pass at it."}
                    </p>
                    <div style={{ marginTop: "16px" }}>
                      <PrimaryButton
                        onClick={() => setSessionPhase("complete")}
                        style={{ background: gradients.flame, color: "#ffffff", boxShadow: shadows.flame, border: "none" }}
                      >
                        Continue
                      </PrimaryButton>
                    </div>
                  </Card>
                </motion.div>
              ) : null}
            </motion.div>
          ) : sessionPhase === "recall" ? (
            <motion.div key="recall" {...stageTransition}>
              <Card variant="dark" style={{ marginBottom: "16px", borderTop: `4px solid ${accent.base}` }}>
                <p style={sectionEyebrowStyle}>Quick Recall</p>
                <h3 style={{ ...introTitleStyle, color: "#ffffff" }}>
                  Before we move on — a fast check.
                </h3>
                <p style={{ margin: "10px 0 0", lineHeight: 1.7, color: "rgba(255,255,255,0.82)" }}>
                  Scripture, vocabulary, and the truth itself — everything from {standard.title}{" "}
                  you just studied.
                </p>
              </Card>

              {recallQuestion ? (
                <>
                  <div style={recallProgressRowStyle}>
                    <p style={recallProgressTextStyle}>
                      Question {recallIndex + 1} of {recallRound.length}
                    </p>
                    <p style={recallScoreTextStyle}>Score {recallScore}</p>
                  </div>

                  <Card
                    style={{
                      marginBottom: "16px",
                      background: `radial-gradient(ellipse 70% 60% at 8% 0%, ${accent.soft} 0%, transparent 60%), #fffdfa`,
                    }}
                  >
                    <div style={recallQuestionLabelRowStyle}>
                      <BoltIcon size={18} />
                      <p style={recallQuestionLabelStyle}>{recallQuestion.prompt}</p>
                      <span style={{ ...recallTypeBadgeStyle, background: accent.soft, color: accent.text }}>
                        {RECALL_TYPE_BADGE[recallQuestion.type] || "Scripture"}
                      </span>
                    </div>
                    <p style={recallQuestionTextStyle}>&ldquo;{recallQuestion.text}&rdquo;</p>
                  </Card>

                  <div style={recallChoiceGridStyle}>
                    {recallQuestion.choices.map((choice) => {
                      const isSelected = recallSelected === choice;
                      const isCorrectChoice = choice === recallQuestion.correctLabel;
                      const showState = recallSelected !== null;
                      return (
                        <motion.button
                          key={choice}
                          type="button"
                          onClick={() => handleRecallChoose(choice)}
                          disabled={recallSelected !== null}
                          whileHover={recallSelected === null ? { scale: 1.02 } : undefined}
                          whileTap={recallSelected === null ? { scale: 0.98 } : undefined}
                          style={{
                            ...recallChoiceButtonStyle,
                            ...(showState && isCorrectChoice ? recallChoiceCorrectStyle : null),
                            ...(showState && isSelected && !isCorrectChoice ? recallChoiceWrongStyle : null),
                            ...(showState && !isSelected && !isCorrectChoice ? { opacity: 0.55 } : null),
                          }}
                        >
                          {choice}
                        </motion.button>
                      );
                    })}
                  </div>
                </>
              ) : null}
            </motion.div>
          ) : showIntro ? (
            <motion.div key="intro" {...stageTransition}>
              <Card style={{ marginBottom: "20px" }}>
                <p style={sectionEyebrowStyle}>Before You Begin</p>
                <h3 style={introTitleStyle}>{standard.title}</h3>
                <p style={introStatementStyle}>{standard.statement}</p>

                {previousMastered ? (
                  <div style={buildingOnBoxStyle}>
                    <p style={promptLabelStyle}>Building On What You Know</p>
                    <p style={buildingOnTextStyle}>
                      Last time, you mastered <strong>{previousStandard.title}</strong> —{" "}
                      {previousStandard.statement}
                    </p>
                    <p style={buildingOnTextStyle}>{standard.title} builds directly on that.</p>
                  </div>
                ) : null}

                {standard.vocabulary?.length ? (
                  <div style={{ marginTop: "20px" }}>
                    <p style={promptLabelStyle}>Key Vocabulary</p>
                    <VocabularyList terms={standard.vocabulary} accent={accent} />
                  </div>
                ) : null}

                <div style={{ marginTop: "22px" }}>
                  <p style={promptLabelStyle}>Anchor Scriptures</p>
                  <div style={verseListStyle}>
                    {standard.anchorScriptures.map((verse) => (
                      <div
                        key={verse.reference}
                        style={{
                          ...verseCardStyle,
                          background: `radial-gradient(ellipse 70% 60% at 8% 0%, ${accent.soft} 0%, transparent 60%), #fffdfa`,
                        }}
                      >
                        <span style={verseQuoteMarkStyle}>&ldquo;</span>
                        <p style={verseTagStyle}>
                          <span style={{ ...verseTagDotStyle, background: accent.base }} />
                          {verse.reference}
                        </p>
                        <p style={verseTextStyle}>{verse.text}</p>
                      </div>
                    ))}
                  </div>
                </div>

                <div style={actionsRowStyle}>
                  <PrimaryButton
                    onClick={handleBeginSession}
                    style={{ background: gradients.flame, color: "#ffffff", boxShadow: shadows.flame, border: "none" }}
                  >
                    Begin Session
                  </PrimaryButton>
                </div>
              </Card>
            </motion.div>
          ) : showModel ? (
            <motion.div key="model" {...stageTransition}>
              <Card variant="dark" style={{ marginBottom: "20px", borderTop: `4px solid ${accent.base}` }}>
                <p style={sectionEyebrowStyle}>Watch First</p>
                <h3 style={{ ...introTitleStyle, color: "#ffffff" }}>
                  Here&rsquo;s how I&rsquo;d think through this.
                </h3>
                <p style={{ margin: "12px 0 0", lineHeight: 1.75, color: "rgba(255,255,255,0.86)" }}>
                  Before you try it yourself, watch how I&rsquo;d work through {standard.title}. I&rsquo;m
                  not going to argue this from outside Scripture — I&rsquo;m going to let the text carry
                  the weight.
                </p>

                {standard.anchorScriptures?.[0] ? (
                  <div
                    style={{
                      ...verseCardStyle,
                      marginTop: "18px",
                      background: `radial-gradient(ellipse 70% 60% at 8% 0%, ${accent.soft} 0%, transparent 60%), #fffdfa`,
                    }}
                  >
                    <span style={verseQuoteMarkStyle}>&ldquo;</span>
                    <p style={verseTagStyle}>
                      <span style={{ ...verseTagDotStyle, background: accent.base }} />
                      {standard.anchorScriptures[0].reference}
                    </p>
                    <p style={verseTextStyle}>{standard.anchorScriptures[0].text}</p>
                  </div>
                ) : null}

                <p style={{ margin: "16px 0 0", lineHeight: 1.75, color: "rgba(255,255,255,0.86)" }}>
                  That&rsquo;s the anchor. {standard.statement}
                </p>

                {standard.instructionalFocus ? (
                  <div style={modelApproachBoxStyle}>
                    <p style={{ ...promptLabelStyle, color: "rgba(255,255,255,0.6)" }}>My Approach to This</p>
                    <p style={{ ...teachingNoteTextStyle, color: "rgba(255,255,255,0.86)" }}>
                      {standard.instructionalFocus}
                    </p>
                  </div>
                ) : null}

                <div style={actionsRowStyle}>
                  <PrimaryButton
                    onClick={() => setModelAcknowledged(true)}
                    style={{ background: gradients.flame, color: "#ffffff", boxShadow: shadows.flame, border: "none" }}
                  >
                    Your Turn
                  </PrimaryButton>
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

                {!hasAttempted && !showScriptureReference ? (
                  <p style={retrievalHintStyle}>
                    Try answering from memory first — or open Scripture below any time you want
                    to study it before answering. This is practice, not a locked-book test.
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

                <div style={submitRowStyle}>
                  <PrimaryButton
                    onClick={handleSubmitResponse}
                    disabled={isGrading}
                    style={{ background: gradients.flame, color: "#ffffff", boxShadow: shadows.flame, border: "none" }}
                  >
                    {isGrading ? "Grading…" : "Submit Response"}
                  </PrimaryButton>
                </div>

                <div style={toolsWrapStyle}>
                  <p style={toolsLabelStyle}>Need a hand while you think?</p>
                  <div style={toolsRowStyle}>
                    <SecondaryButton
                      onClick={() => setShowScriptureReference((current) => !current)}
                      style={toolButtonStyle}
                    >
                      {hasAttempted || showScriptureReference ? "Hide Scripture" : "Study Scripture"}
                    </SecondaryButton>
                    {standard.vocabulary?.length ? (
                      <SecondaryButton
                        onClick={() => setShowVocabReference((current) => !current)}
                        style={toolButtonStyle}
                      >
                        {showVocabReference ? "Hide Vocabulary" : "Vocabulary"}
                      </SecondaryButton>
                    ) : null}
                    {standard.instructionalFocus ? (
                      <SecondaryButton
                        onClick={() => setShowTeachingNote((current) => !current)}
                        style={toolButtonStyle}
                      >
                        {showTeachingNote ? "Hide Teaching Note" : "Teaching Note"}
                      </SecondaryButton>
                    ) : null}
                    <SecondaryButton
                      onClick={() => setShowAskPanel((current) => !current)}
                      style={toolButtonStyle}
                    >
                      {showAskPanel ? "Hide Ask Jeremiah" : "Ask Jeremiah"}
                    </SecondaryButton>
                  </div>
                </div>

                {showAskPanel ? (
                  <InlineAskPanel standard={standard} ageBand={ageBand} />
                ) : null}

                {showTeachingNote && standard.instructionalFocus ? (
                  <motion.div
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    style={vocabReferenceBoxStyle}
                  >
                    <p style={promptLabelStyle}>How Jeremiah Approaches This Lesson</p>
                    <p style={teachingNoteTextStyle}>{standard.instructionalFocus}</p>
                  </motion.div>
                ) : null}

                {showVocabReference ? (
                  <motion.div
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    style={vocabReferenceBoxStyle}
                  >
                    <p style={promptLabelStyle}>Key Vocabulary</p>
                    <VocabularyList terms={standard.vocabulary} accent={accent} />
                  </motion.div>
                ) : null}

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
                    {gradingWasUnavailable ? (
                      <div style={{ marginTop: "14px" }}>
                        <SecondaryButton onClick={handlePreviewAdvance} style={toolButtonStyle}>
                          Preview Next Stage (Not Recorded)
                        </SecondaryButton>
                      </div>
                    ) : null}
                  </div>
                ) : null}
              </Card>

              {hasAttempted || showScriptureReference ? (
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
                  <Card style={{ marginBottom: "20px" }}>
                    <p style={sectionEyebrowStyle}>
                      {hasAttempted ? "Scripture Evidence — Check Yourself" : "Scripture — Study Reference"}
                    </p>
                    <div style={verseListStyle}>
                      {standard.anchorScriptures.map((verse) => (
                        <div
                          key={verse.reference}
                          style={{
                            ...verseCardStyle,
                            background: `radial-gradient(ellipse 70% 60% at 8% 0%, ${accent.soft} 0%, transparent 60%), #fffdfa`,
                          }}
                        >
                          <span style={verseQuoteMarkStyle}>&ldquo;</span>
                          <p style={verseTagStyle}>
                            <span style={{ ...verseTagDotStyle, background: accent.base }} />
                            {verse.reference}
                          </p>
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
  borderRadius: "4px",
  padding: "20px 20px 18px",
  border: "1px solid rgba(255, 178, 46, 0.4)",
  overflow: "hidden",
};

const verseQuoteMarkStyle = {
  position: "absolute",
  top: "-4px",
  right: "16px",
  fontSize: "2.6rem",
  fontFamily: fonts.display,
  fontStyle: "italic",
  fontWeight: 700,
  color: "#ffb22e",
  opacity: 0.3,
  lineHeight: 1,
  pointerEvents: "none",
};

const verseTagStyle = {
  margin: 0,
  display: "flex",
  alignItems: "center",
  gap: "8px",
  fontFamily: fonts.mono,
  fontSize: "0.72rem",
  fontWeight: 500,
  letterSpacing: "0.08em",
  textTransform: "uppercase",
  color: colors.textMuted,
};

const verseTagDotStyle = { width: "7px", height: "7px", borderRadius: "999px", flexShrink: 0 };

const verseTextStyle = {
  margin: "12px 0 0",
  lineHeight: 1.7,
  color: "#1e1420",
  fontFamily: fonts.display,
  fontStyle: "italic",
  fontVariationSettings: '"opsz" 30, "wght" 440',
  fontSize: "1.1rem",
};

const stageTitleStyle = {
  margin: "10px 0 0",
  fontSize: "1.35rem",
  fontWeight: 900,
  color: colors.checkpointTextDark,
};

const introTitleStyle = {
  margin: "10px 0 0",
  fontFamily: fonts.display,
  fontStyle: "italic",
  fontVariationSettings: '"opsz" 60, "wght" 460, "WONK" 1',
  fontSize: "1.6rem",
  lineHeight: 1.15,
  color: colors.text,
};

const introStatementStyle = {
  margin: "14px 0 0",
  lineHeight: 1.75,
  fontSize: "1.05rem",
  color: colors.textMuted,
};

const teachingNoteTextStyle = {
  margin: "8px 0 0",
  lineHeight: 1.7,
  fontSize: "0.94rem",
  color: colors.textMuted,
  fontStyle: "italic",
};

const buildingOnBoxStyle = {
  marginTop: "18px",
  borderRadius: "16px",
  padding: "16px",
  background: "#fff7ed",
  border: "1px solid #fed7aa",
};

const buildingOnTextStyle = {
  margin: "8px 0 0",
  lineHeight: 1.65,
  fontSize: "0.94rem",
  color: "#7c2d12",
};

const modelApproachBoxStyle = {
  marginTop: "16px",
  borderRadius: "16px",
  padding: "16px",
  background: "rgba(255,255,255,0.08)",
  border: "1px solid rgba(255,255,255,0.14)",
};

const vocabReferenceBoxStyle = {
  marginTop: "16px",
  borderRadius: "16px",
  padding: "16px",
  background: "#ffffff",
  border: `1px solid ${colors.checkpointBorder}`,
};

const vocabListStyle = {
  marginTop: "10px",
  display: "grid",
  gap: "12px",
};

const vocabEntryStyle = {
  borderLeft: "3px solid #e2e8f0",
  paddingLeft: "12px",
};

const vocabTermStyle = {
  margin: 0,
  fontWeight: 800,
  fontSize: "0.95rem",
};

const vocabDefinitionStyle = {
  margin: "4px 0 0",
  fontSize: "0.9rem",
  lineHeight: 1.55,
  color: colors.textMuted,
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

const submitRowStyle = {
  marginTop: "16px",
};

const toolsWrapStyle = {
  marginTop: "18px",
  paddingTop: "16px",
  borderTop: `1px solid ${colors.checkpointBorder}`,
};

const toolsLabelStyle = {
  margin: "0 0 10px",
  fontSize: "0.76rem",
  textTransform: "uppercase",
  letterSpacing: "0.08em",
  color: colors.checkpointTextMid,
  fontWeight: 700,
};

const toolsRowStyle = {
  display: "flex",
  gap: "8px",
  flexWrap: "wrap",
};

const toolButtonStyle = {
  padding: "9px 14px",
  fontSize: "0.85rem",
  borderRadius: "999px",
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

const sessionRecapRowStyle = {
  marginTop: "16px",
  display: "flex",
  gap: "10px",
  justifyContent: "center",
  flexWrap: "wrap",
};

const recallProgressRowStyle = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  marginBottom: "10px",
};

const recallProgressTextStyle = {
  margin: 0,
  fontFamily: fonts.mono,
  fontSize: "0.8rem",
  letterSpacing: "0.04em",
  color: colors.textFaint,
};

const recallScoreTextStyle = {
  margin: 0,
  fontFamily: fonts.mono,
  fontSize: "0.8rem",
  fontWeight: 700,
  color: colors.text,
};

const recallQuestionLabelRowStyle = {
  display: "flex",
  alignItems: "center",
  gap: "8px",
  flexWrap: "wrap",
};

const recallTypeBadgeStyle = {
  display: "inline-flex",
  padding: "3px 9px",
  borderRadius: "999px",
  fontSize: "0.66rem",
  fontWeight: 800,
  letterSpacing: "0.04em",
  textTransform: "uppercase",
  marginLeft: "auto",
};

const recallQuestionLabelStyle = {
  margin: 0,
  fontFamily: fonts.mono,
  fontSize: "0.72rem",
  fontWeight: 500,
  letterSpacing: "0.1em",
  textTransform: "uppercase",
  color: colors.textFaint,
};

const recallQuestionTextStyle = {
  margin: "14px 0 0",
  fontFamily: fonts.display,
  fontStyle: "italic",
  fontVariationSettings: '"opsz" 40, "wght" 440',
  fontSize: "1.2rem",
  lineHeight: 1.6,
  color: "#1e1420",
};

const recallChoiceGridStyle = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
  gap: "12px",
};

const recallChoiceButtonStyle = {
  padding: "16px",
  borderRadius: "16px",
  border: `1px solid ${colors.cardBorder}`,
  background: "#ffffff",
  color: colors.text,
  fontSize: "0.98rem",
  fontWeight: 700,
  cursor: "pointer",
  textAlign: "left",
};

const recallChoiceCorrectStyle = {
  background: colors.strongBg,
  border: `1px solid ${colors.strongBorder}`,
  color: "#166534",
};

const recallChoiceWrongStyle = {
  background: colors.weakBg,
  border: `1px solid ${colors.weakBorder}`,
  color: "#991b1b",
};

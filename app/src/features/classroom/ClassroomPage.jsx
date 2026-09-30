import { useEffect, useMemo, useRef, useState } from "react";
import { ROUTES } from "../../app/routes";
import {
  getActiveClassroomSessionPreset,
  getCurrentSession,
  setSavedLiveStageForPreset,
} from "../../core/classroom/classroomSessionData";
import {
  advanceLearningState,
  advanceUnscoredMove,
  clearLearningState,
  getInstructionalMove,
  getStandardProgress,
  loadLearningState,
  saveLearningState,
} from "../../core/classroom/learningEngine";
import { getClassroomContentByStandardId } from "../../core/classroom/content/classroomContentRegistry";
import { askJeremiahTeacher } from "../../services/jeremiahTeacher";
import "./ClassroomPage.css";

const PATH_LABELS = {
  direct: "Guided",
  resume: "Resume",
  review: "Review",
  adaptation: "Adaptive",
};

const UNSCORED_TYPES = new Set([
  "launch",
  "teach",
  "scripture_teach",
  "synthesis",
  "guided_reflection",
]);

function stageLabel(stageId) {
  const labels = {
    focus: "Focus",
    truth: "Build",
    scripture: "Scripture",
    checkpoint: "Practice",
    mastery: "Mastery",
  };
  return labels[stageId] || "Learn";
}

function getResponsePayload(move, selectedChoiceId, responseText) {
  if (["free_response", "mastery_response"].includes(move.type)) {
    return { text: responseText.trim() };
  }

  return { choiceIds: selectedChoiceId ? [selectedChoiceId] : [] };
}

function responseIsReady(move, selectedChoiceId, responseText) {
  if (["free_response", "mastery_response"].includes(move.type)) {
    return responseText.trim().length >= 2;
  }

  if (move.choices?.length) return Boolean(selectedChoiceId);
  return true;
}

function ScriptureStack({ scripture = [] }) {
  if (!scripture.length) return null;

  return (
    <section className="jc-scripture" aria-label="Scripture for this lesson">
      {scripture.map((verse) => (
        <article className="jc-verse" key={verse.id || verse.reference}>
          <div className="jc-verse-ref">{verse.reference}</div>
          <blockquote>“{verse.text}”</blockquote>
        </article>
      ))}
    </section>
  );
}

function TeachingContent({ move }) {
  const teaching = move.teaching || [];
  const phrases = move.focusPhrases || [];
  const insights = move.insights || [];

  if (!teaching.length && !phrases.length && !insights.length) return null;

  return (
    <div className="jc-teaching">
      {teaching.length > 0 && (
        <div className="jc-teaching-copy">
          {teaching.map((paragraph, index) => (
            <p key={index}>{paragraph}</p>
          ))}
        </div>
      )}

      {phrases.length > 0 && (
        <div className="jc-focus-block">
          <span>Hold onto this</span>
          <div className="jc-focus-phrases">
            {phrases.map((phrase) => (
              <strong key={phrase}>“{phrase}”</strong>
            ))}
          </div>
          {move.focusNote && <p>{move.focusNote}</p>}
        </div>
      )}

      {insights.length > 0 && (
        <div className="jc-insight-stack">
          {insights.map((insight) => (
            <div className="jc-insight" key={insight.label}>
              <span>{insight.label}</span>
              <p>{insight.text}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function GuidedReflection({
  move,
  value,
  onChange,
  revealed,
  onReveal,
  onContinue,
}) {
  const ready = value.trim().length >= 8;

  return (
    <div className="jc-reflection">
      <div className="jc-reflection-prompt">
        <span>Think before Jeremiah explains it</span>
        <h2>{move.prompt}</h2>
      </div>

      {!revealed && (
        <>
          <textarea
            value={value}
            onChange={(event) => onChange(event.target.value)}
            placeholder={move.placeholder || "Write what you notice..."}
            rows={5}
          />
          <div className="jc-reflection-note">
            This is not graded. The point is to notice before being told.
          </div>
          <button
            type="button"
            className="jc-secondary-action"
            onClick={onReveal}
            disabled={!ready}
          >
            {move.revealLabel || "Compare your thought"}
            <span>→</span>
          </button>
        </>
      )}

      {revealed && (
        <div className="jc-reflection-reveal">
          <div className="jc-reflection-your-thought">
            <span>Your observation</span>
            <p>{value}</p>
          </div>

          <div className="jc-reflection-teaching">
            <span>Now notice this</span>
            {(move.revealTeaching || []).map((paragraph, index) => (
              <p key={index}>{paragraph}</p>
            ))}
          </div>

          {move.revealInsight && (
            <div className="jc-reflection-insight">
              <span>{move.revealInsight.label}</span>
              <p>{move.revealInsight.text}</p>
            </div>
          )}

          <button type="button" className="jc-primary" onClick={onContinue}>
            {move.ctaLabel || "Continue"}
            <span>→</span>
          </button>
        </div>
      )}
    </div>
  );
}

function ChoiceGrid({ choices = [], selectedChoiceId, onSelect, disabled }) {
  return (
    <div className="jc-choice-grid">
      {choices.map((choice, index) => {
        const selected = selectedChoiceId === choice.id;
        return (
          <button
            type="button"
            key={choice.id}
            className={"jc-choice " + (selected ? "is-selected" : "")}
            onClick={() => onSelect(choice.id)}
            disabled={disabled}
          >
            <span className="jc-choice-number">{String(index + 1).padStart(2, "0")}</span>
            <span>{choice.label}</span>
            <i aria-hidden="true">{selected ? "✓" : ""}</i>
          </button>
        );
      })}
    </div>
  );
}

function MasteryNudge({ content, visible, onToggle }) {
  const scripture = content.brain?.requiredScripture || [];

  return (
    <div className="jc-mastery-nudge">
      <button type="button" onClick={onToggle}>
        {visible ? "Hide Scripture nudge" : "Need a Scripture nudge?"}
      </button>

      {visible && (
        <div>
          <span>Try one of these references—without reopening the whole lesson.</span>
          <p>{scripture.map((verse) => verse.reference).join(" · ")}</p>
        </div>
      )}
    </div>
  );
}

export default function ClassroomPage({ onNavigate }) {
  const session = useMemo(() => getCurrentSession(), []);
  const presetId = getActiveClassroomSessionPreset();
  const content = getClassroomContentByStandardId(session.standardId);

  const [learningState, setLearningState] = useState(() =>
    content ? loadLearningState(content, presetId) : null
  );
  const [selectedChoiceId, setSelectedChoiceId] = useState("");
  const [responseText, setResponseText] = useState("");
  const [teacherDecision, setTeacherDecision] = useState(null);
  const [pendingState, setPendingState] = useState(null);
  const [isThinking, setIsThinking] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [showResetPrompt, setShowResetPrompt] = useState(false);
  const [reflectionText, setReflectionText] = useState("");
  const [reflectionRevealed, setReflectionRevealed] = useState(false);
  const [masteryNudgeVisible, setMasteryNudgeVisible] = useState(false);
  const abortRef = useRef(null);

  const currentMove =
    content && learningState
      ? getInstructionalMove(content, learningState.currentMoveId) ||
        content.instructionalMoves[0]
      : null;

  const progress =
    content && learningState ? getStandardProgress(content, learningState) : 0;
  const ready =
    currentMove && responseIsReady(currentMove, selectedChoiceId, responseText);

  const presetEntryMoveId =
    content?.presets?.[presetId]?.currentMoveId ||
    content?.instructionalMoves?.[0]?.id;

  const canReset =
    learningState &&
    (learningState.currentMoveId !== presetEntryMoveId ||
      (learningState.completedMoveIds?.length || 0) > 0);

  useEffect(() => {
    if (learningState) saveLearningState(learningState);
  }, [learningState]);

  useEffect(() => {
    if (currentMove?.stageId) {
      setSavedLiveStageForPreset(presetId, currentMove.stageId);
    }
  }, [presetId, currentMove?.stageId]);

  useEffect(() => {
    return () => abortRef.current?.abort();
  }, []);

  function clearInteraction() {
    setSelectedChoiceId("");
    setResponseText("");
    setTeacherDecision(null);
    setPendingState(null);
    setErrorMessage("");
    setReflectionText("");
    setReflectionRevealed(false);
    setMasteryNudgeVisible(false);
  }

  function handleContinue() {
    if (!learningState || !currentMove) return;
    const next = advanceUnscoredMove(learningState, currentMove);
    setLearningState(next);
    clearInteraction();
  }

  async function handleSubmit() {
    if (!currentMove || !learningState || !ready || isThinking || teacherDecision) {
      return;
    }

    setErrorMessage("");
    setIsThinking(true);
    abortRef.current?.abort();

    const controller = new AbortController();
    abortRef.current = controller;

    try {
      const learnerResponse = getResponsePayload(
        currentMove,
        selectedChoiceId,
        responseText
      );

      const decision = await askJeremiahTeacher(
        {
          standardId: content.standardId,
          moveId: currentMove.id,
          learnerResponse,
          learnerState: {
            completedMoveIds: learningState.completedMoveIds,
            evidenceIds: learningState.evidenceIds,
            misconceptions: learningState.misconceptions,
            attemptsByMove: learningState.attemptsByMove,
          },
        },
        controller.signal
      );

      setTeacherDecision(decision);
      setPendingState(advanceLearningState(learningState, currentMove, decision));
    } catch (error) {
      if (error?.name !== "AbortError") {
        setErrorMessage(error?.message || "Jeremiah could not respond right now.");
      }
    } finally {
      setIsThinking(false);
    }
  }

  function handleTeacherContinue() {
    if (!pendingState) return;
    setLearningState(pendingState);
    clearInteraction();
  }

  function handleReset() {
    if (!content) return;
    clearLearningState(content, presetId);
    setLearningState(loadLearningState(content, presetId));
    setShowResetPrompt(false);
    clearInteraction();
  }

  if (!content || !learningState || !currentMove) {
    return (
      <div className="jc-missing">
        <h1>Classroom content unavailable</h1>
        <button type="button" onClick={() => onNavigate(ROUTES.HOME)}>
          Return home
        </button>
      </div>
    );
  }

  const isUnscored = UNSCORED_TYPES.has(currentMove.type);

  return (
    <div className={"jc-page stage-" + currentMove.stageId}>
      <div className="jc-atmosphere" aria-hidden="true">
        <span className="jc-ambient jc-ambient-warm" />
        <span className="jc-ambient jc-ambient-cool" />
      </div>

      <header className="jc-header">
        <button
          type="button"
          className="jc-brand"
          onClick={() => onNavigate(ROUTES.HOME)}
          aria-label="Return home"
        >
          <span className="jc-brand-mark">J</span>
          <strong>Jeremiah</strong>
        </button>

        <div className="jc-header-progress" aria-label={progress + " percent complete"}>
          <span>{content.standardId}</span>
          <div><i style={{ width: progress + "%" }} /></div>
          <strong>{progress}%</strong>
        </div>

        <button
          type="button"
          className="jc-reset"
          onClick={() => setShowResetPrompt(true)}
          disabled={!canReset}
        >
          Reset
        </button>
      </header>

      {showResetPrompt && (
        <div className="jc-reset-panel" role="dialog" aria-label="Reset this learning path">
          <p><strong>Restart this path?</strong> Your saved progress for this route will be cleared.</p>
          <div>
            <button type="button" onClick={() => setShowResetPrompt(false)}>Cancel</button>
            <button type="button" className="is-danger" onClick={handleReset}>Reset</button>
          </div>
        </div>
      )}

      <main className="jc-shell">
        <div className="jc-pathline">
          <span>{PATH_LABELS[presetId] || "Guided"}</span>
          <i />
          <span>{stageLabel(currentMove.stageId)}</span>
        </div>

        <section className={"jc-lesson move-" + currentMove.type}>
          <div className="jc-move-head">
            <div className="jc-eyebrow">{currentMove.eyebrow || stageLabel(currentMove.stageId)}</div>
            <h1>{currentMove.title}</h1>
          </div>

          {currentMove.teacherLine && (
            <div className="jc-teacher-line">
              <span>J</span>
              <p>{currentMove.teacherLine}</p>
            </div>
          )}

          {currentMove.body && <p className="jc-body-copy">{currentMove.body}</p>}

          <ScriptureStack scripture={currentMove.scripture} />

          <TeachingContent move={currentMove} />

          {currentMove.type === "guided_reflection" && (
            <GuidedReflection
              move={currentMove}
              value={reflectionText}
              onChange={setReflectionText}
              revealed={reflectionRevealed}
              onReveal={() => setReflectionRevealed(true)}
              onContinue={handleContinue}
            />
          )}

          {currentMove.type === "mastery_response" && !teacherDecision && (
            <MasteryNudge
              content={content}
              visible={masteryNudgeVisible}
              onToggle={() => setMasteryNudgeVisible((value) => !value)}
            />
          )}

          {currentMove.prompt && !isUnscored && currentMove.type !== "complete" && (
            <div className="jc-question">
              <span>
                {currentMove.type === "scenario"
                  ? "Check your understanding"
                  : currentMove.type === "mastery_response"
                    ? "Mastery"
                    : "Teach it back"}
              </span>
              <h2>{currentMove.prompt}</h2>
            </div>
          )}

          {currentMove.choices && !teacherDecision && (
            <ChoiceGrid
              choices={currentMove.choices}
              selectedChoiceId={selectedChoiceId}
              onSelect={setSelectedChoiceId}
              disabled={isThinking}
            />
          )}

          {["free_response", "mastery_response"].includes(currentMove.type) &&
            !teacherDecision && (
              <div className="jc-response">
                <textarea
                  value={responseText}
                  onChange={(event) => setResponseText(event.target.value)}
                  placeholder={currentMove.placeholder || "Write your response..."}
                  disabled={isThinking}
                  rows={7}
                />
                <div className="jc-response-note">
                  <span>
                    {responseText.trim()
                      ? responseText.trim().split(/\s+/).length + " words"
                      : "Use your own words"}
                  </span>
                  <span>Jeremiah reads meaning, not exact phrasing.</span>
                </div>
              </div>
            )}

          {errorMessage && (
            <div className="jc-error" role="alert">
              <strong>Connection issue</strong>
              <span>{errorMessage}</span>
            </div>
          )}

          {isThinking && (
            <div className="jc-thinking" aria-live="polite">
              <span className="jc-thinking-mark">J</span>
              <div>
                <strong>Jeremiah is reading your response</strong>
                <p>Checking the meaning against this standard and the Scripture you just studied.</p>
              </div>
            </div>
          )}

          {teacherDecision && (
            <div className={"jc-feedback verdict-" + teacherDecision.verdict}>
              <div className="jc-feedback-label">
                <span>Jeremiah</span>
                <strong>
                  {teacherDecision.verdict === "strong"
                    ? "That holds."
                    : teacherDecision.verdict === "partial"
                      ? "Almost there."
                      : "Let’s rebuild this."}
                </strong>
              </div>
              <p>{teacherDecision.teacherMessage}</p>
              {teacherDecision.followUpPrompt && (
                <small>{teacherDecision.followUpPrompt}</small>
              )}
              <button type="button" className="jc-primary" onClick={handleTeacherContinue}>
                {teacherDecision.verdict === "strong" ? "Continue" : "Show me another way"}
                <span>→</span>
              </button>
            </div>
          )}

          {isUnscored &&
            currentMove.type !== "guided_reflection" &&
            !teacherDecision && (
            <button type="button" className="jc-primary" onClick={handleContinue}>
              {currentMove.ctaLabel || "Continue"}
              <span>→</span>
            </button>
          )}

          {!isUnscored &&
            currentMove.type !== "complete" &&
            !teacherDecision && (
              <button
                type="button"
                className="jc-primary"
                onClick={handleSubmit}
                disabled={!ready || isThinking}
              >
                {isThinking
                  ? "Reading…"
                  : currentMove.type === "mastery_response"
                    ? "Submit mastery"
                    : currentMove.type === "free_response"
                      ? "Let Jeremiah respond"
                      : "Check this"}
                <span>→</span>
              </button>
            )}

          {currentMove.type === "complete" && (
            <div className="jc-complete">
              <div className="jc-complete-mark">✓</div>
              <p>{currentMove.teacherLine}</p>
              <button
                type="button"
                className="jc-primary"
                onClick={() => onNavigate(ROUTES.HOME)}
              >
                {currentMove.ctaLabel || "Return home"}
                <span>→</span>
              </button>
            </div>
          )}
        </section>
      </main>
    </div>
  );
}

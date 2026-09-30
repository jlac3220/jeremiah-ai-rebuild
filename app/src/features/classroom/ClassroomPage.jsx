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
  direct: "Guided Path",
  resume: "Resume Path",
  review: "Review Path",
  adaptation: "Adaptive Path",
};

const MOVE_META = {
  launch: {
    verb: "Arrive",
    cue: "Set your attention before the lesson begins.",
    promptLabel: "Begin here",
  },
  scripture_observation: {
    verb: "Observe",
    cue: "Slow down. Notice what the text actually says before explaining it.",
    promptLabel: "Notice",
  },
  choice: {
    verb: "Name it",
    cue: "Turn what you observed into a clear statement.",
    promptLabel: "Make the claim",
  },
  contrast: {
    verb: "Distinguish",
    cue: "Put the ideas under pressure and separate what the text says from what it does not.",
    promptLabel: "Look again",
  },
  compare: {
    verb: "Connect",
    cue: "Let one passage sharpen the meaning of another.",
    promptLabel: "Connect the passages",
  },
  fill: {
    verb: "Rebuild",
    cue: "Use the scriptural frame to reconstruct the idea accurately.",
    promptLabel: "Complete the idea",
  },
  scenario: {
    verb: "Pressure test",
    cue: "Apply the foundation when a competing idea pushes against it.",
    promptLabel: "What holds?",
  },
  free_response: {
    verb: "Teach back",
    cue: "Explain the truth in your own words. Jeremiah is listening for meaning.",
    promptLabel: "Teach it back",
  },
  guided_build: {
    verb: "Build together",
    cue: "Use a stronger frame, then return to your own explanation.",
    promptLabel: "Choose the frame",
  },
  mastery_response: {
    verb: "Demonstrate",
    cue: "Bring the whole standard together without leaning on a canned answer.",
    promptLabel: "Mastery evidence",
  },
  complete: {
    verb: "Complete",
    cue: "This standard is established for now. Retrieval will make it durable.",
    promptLabel: "Standard complete",
  },
};

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

function moveIcon(type) {
  const icons = {
    launch: "✦",
    scripture_observation: "⌁",
    choice: "◉",
    contrast: "⇄",
    compare: "↔",
    fill: "＋",
    scenario: "◇",
    free_response: "✎",
    guided_build: "▦",
    mastery_response: "◆",
    complete: "✓",
  };
  return icons[type] || "•";
}

function moveMeta(type) {
  return MOVE_META[type] || {
    verb: "Learn",
    cue: "Stay with the idea until it is clear.",
    promptLabel: "Jeremiah asks",
  };
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
  return Boolean(selectedChoiceId);
}

function ScriptureStack({ scripture = [], moveType }) {
  if (!scripture.length) return null;

  const comparison = scripture.length > 1;

  return (
    <div
      className={"jc-scripture-stack " + (comparison ? "is-comparison" : "is-single")}
      aria-label="Scripture for this learning move"
      data-move={moveType}
    >
      <div className="jc-scripture-field-label">
        <span>Scripture field</span>
        {comparison && <small>{scripture.length} passages in view</small>}
      </div>

      <div className="jc-scripture-grid">
        {scripture.map((verse, index) => (
          <article
            className="jc-scripture-card"
            key={verse.id || verse.reference}
            style={{ "--verse-delay": index * 90 + "ms" }}
          >
            <div className="jc-scripture-reference">{verse.reference}</div>
            <blockquote>“{verse.text}”</blockquote>
          </article>
        ))}
      </div>
    </div>
  );
}

function ChoiceGrid({
  choices = [],
  selectedChoiceId,
  onSelect,
  disabled,
  moveType,
}) {
  return (
    <div className={"jc-choice-grid choice-mode-" + moveType}>
      {choices.map((choice, index) => {
        const selected = selectedChoiceId === choice.id;
        return (
          <button
            type="button"
            key={choice.id}
            className={"jc-choice " + (selected ? "is-selected" : "")}
            onClick={() => onSelect(choice.id)}
            disabled={disabled}
            style={{ "--choice-delay": index * 65 + "ms" }}
          >
            <span className="jc-choice-index">{String(index + 1).padStart(2, "0")}</span>
            <span className="jc-choice-copy">{choice.label}</span>
            <span className="jc-choice-select" aria-hidden="true">
              {selected ? "✓" : ""}
            </span>
          </button>
        );
      })}
    </div>
  );
}

function ExperienceSignal({ currentMove, learningState, content, isThinking }) {
  const meta = moveMeta(currentMove.type);
  const totalEvidence = content.brain?.requiredKnowledge?.length || 0;
  const earned = learningState.evidenceIds?.length || 0;

  return (
    <div className="jc-experience-signal">
      <div className="jc-signal-mode">
        <span className="jc-signal-icon">{moveIcon(currentMove.type)}</span>
        <div>
          <strong>{isThinking ? "Jeremiah is thinking" : meta.verb}</strong>
          <p>{isThinking ? "Reading the learner, standard, and current evidence." : meta.cue}</p>
        </div>
      </div>

      <div className="jc-evidence-pips" aria-label={earned + " of " + totalEvidence + " core truths established"}>
        {Array.from({ length: Math.max(totalEvidence, 1) }).map((_, index) => (
          <span key={index} className={index < earned ? "is-earned" : ""} />
        ))}
      </div>
    </div>
  );
}

function LearningRail({ content, state, currentMove }) {
  const knowledge = content.brain?.requiredKnowledge || [];
  const stageOrder = ["focus", "scripture", "truth", "checkpoint", "mastery"];
  const currentIndex = stageOrder.indexOf(currentMove.stageId);

  return (
    <aside className="jc-rail" aria-label="Learning map">
      <div className="jc-rail-topline">
        <span>Learning map</span>
        <span>{getStandardProgress(content, state)}%</span>
      </div>

      <div className="jc-rail-progress" aria-hidden="true">
        <span style={{ width: getStandardProgress(content, state) + "%" }} />
      </div>

      <div className="jc-rail-map">
        {stageOrder.map((stage, index) => (
          <div
            key={stage}
            className={
              "jc-rail-stage " +
              (index < currentIndex ? "is-done " : "") +
              (stage === currentMove.stageId ? "is-current" : "")
            }
          >
            <span className="jc-rail-dot" />
            <span>{stageLabel(stage)}</span>
          </div>
        ))}
      </div>

      <div className="jc-rail-truths">
        <div className="jc-rail-kicker">Knowledge taking shape</div>
        {knowledge.map((item) => {
          const established = state.evidenceIds?.includes(item.id);
          return (
            <div className={"jc-rail-truth " + (established ? "is-established" : "")} key={item.id}>
              <span className={established ? "is-lit" : ""} />
              <div>
                <strong>{item.title}</strong>
                <p>{established ? item.truth : "Not established yet"}</p>
              </div>
            </div>
          );
        })}
      </div>
    </aside>
  );
}

function MasteryLens({ content, moveType }) {
  if (moveType !== "mastery_response") return null;

  const evidence = content.brain?.evidenceOfUnderstanding || [];
  if (!evidence.length) return null;

  return (
    <div className="jc-mastery-lens">
      <div className="jc-mastery-lens-head">
        <span>Mastery lens</span>
        <small>Jeremiah is looking for evidence, not exact wording.</small>
      </div>
      <div className="jc-mastery-lens-grid">
        {evidence.map((item, index) => (
          <div key={item} className="jc-mastery-lens-item">
            <span>{String(index + 1).padStart(2, "0")}</span>
            <p>{item}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

function ResponseCoach({ moveType }) {
  if (!["free_response", "mastery_response"].includes(moveType)) return null;

  const prompts =
    moveType === "mastery_response"
      ? ["State the confession", "Ground it in Scripture", "Show what Scripture excludes"]
      : ["Say it in your words", "Use the text", "Make the connection clear"];

  return (
    <div className="jc-response-coach" aria-label="Response guidance">
      {prompts.map((prompt) => (
        <span key={prompt}>{prompt}</span>
      ))}
    </div>
  );
}

export default function ClassroomPage({ onNavigate }) {
  const session = useMemo(() => getCurrentSession(), []);
  const presetId = getActiveClassroomSessionPreset();
  const content = getClassroomContentByStandardId(session.standardId);

  const [learningState, setLearningState] = useState(() =>
    loadLearningState(content, presetId)
  );
  const [selectedChoiceId, setSelectedChoiceId] = useState("");
  const [responseText, setResponseText] = useState("");
  const [teacherDecision, setTeacherDecision] = useState(null);
  const [pendingState, setPendingState] = useState(null);
  const [isThinking, setIsThinking] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [resetConfirmation, setResetConfirmation] = useState("");
  const [showResetPrompt, setShowResetPrompt] = useState(false);
  const [transitionKey, setTransitionKey] = useState(0);
  const abortRef = useRef(null);

  const currentMove =
    getInstructionalMove(content, learningState.currentMoveId) ||
    content.instructionalMoves[0];

  const progress = getStandardProgress(content, learningState);
  const ready = responseIsReady(currentMove, selectedChoiceId, responseText);
  const meta = moveMeta(currentMove.type);
  const presetEntryMoveId =
    content.presets?.[presetId]?.currentMoveId || content.instructionalMoves[0]?.id;
  const canReset =
    learningState.currentMoveId !== presetEntryMoveId ||
    (learningState.completedMoveIds?.length || 0) > 0;

  useEffect(() => {
    saveLearningState(learningState);
  }, [learningState]);

  useEffect(() => {
    if (currentMove?.stageId) {
      setSavedLiveStageForPreset(presetId, currentMove.stageId);
    }
  }, [presetId, currentMove?.stageId]);

  useEffect(() => {
    return () => abortRef.current?.abort();
  }, []);

  function resetInteraction() {
    setSelectedChoiceId("");
    setResponseText("");
    setTeacherDecision(null);
    setPendingState(null);
    setErrorMessage("");
    setResetConfirmation("");
    setShowResetPrompt(false);
    setTransitionKey((value) => value + 1);
  }

  function handleLaunch() {
    const next = advanceUnscoredMove(learningState, currentMove);
    setLearningState(next);
    resetInteraction();
  }

  async function handleSubmit() {
    if (!ready || isThinking || teacherDecision) return;

    setResetConfirmation("");
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
    resetInteraction();
  }

  function handleReset() {
    clearLearningState(content, presetId);
    const fresh = loadLearningState(content, presetId);
    setLearningState(fresh);
    setSelectedChoiceId("");
    setResponseText("");
    setTeacherDecision(null);
    setPendingState(null);
    setErrorMessage("");
    setShowResetPrompt(false);
    setResetConfirmation("Path reset. Jeremiah returned you to the beginning of this route.");
    setTransitionKey((value) => value + 1);
  }

  if (!content) {
    return (
      <div className="jc-missing">
        <h1>Classroom content unavailable</h1>
        <button type="button" onClick={() => onNavigate(ROUTES.HOME)}>
          Return home
        </button>
      </div>
    );
  }

  const pageStateClass =
    "jc-page stage-" +
    currentMove.stageId +
    " move-" +
    currentMove.type +
    (isThinking ? " is-thinking" : "") +
    (teacherDecision ? " has-feedback feedback-" + teacherDecision.verdict : "");

  return (
    <div className={pageStateClass}>
      <div className="jc-atmosphere" aria-hidden="true">
        <span className="jc-glow jc-glow-fire" />
        <span className="jc-glow jc-glow-water" />
        <span className="jc-light-column" />
        <span className="jc-grain" />
      </div>

      <header className="jc-header">
        <button
          type="button"
          className="jc-brand"
          onClick={() => onNavigate(ROUTES.HOME)}
          aria-label="Return to Jeremiah home"
        >
          <span className="jc-brand-mark">J</span>
          <span>
            <strong>Jeremiah</strong>
            <small>AI Classroom</small>
          </span>
        </button>

        <div className="jc-session-meta">
          <span className="jc-live-dot" aria-hidden="true" />
          <span>{PATH_LABELS[presetId] || "Guided Path"}</span>
          <span className="jc-meta-divider" />
          <span>{content.standardId}</span>
        </div>

        {canReset ? (
          <button type="button" className="jc-reset" onClick={() => setShowResetPrompt(true)}>
            Reset path
          </button>
        ) : (
          <span />
        )}
      </header>

      {showResetPrompt && (
        <div className="jc-reset-prompt" role="dialog" aria-label="Reset learning path">
          <div>
            <strong>Restart this path?</strong>
            <span>Your saved progress for this route will be cleared.</span>
          </div>
          <div className="jc-reset-actions">
            <button type="button" onClick={() => setShowResetPrompt(false)}>Keep learning</button>
            <button type="button" className="is-danger" onClick={handleReset}>Reset</button>
          </div>
        </div>
      )}

      {resetConfirmation && (
        <div className="jc-reset-confirmation" role="status">
          {resetConfirmation}
        </div>
      )}

      <div className="jc-mobile-progress">
        <span>{stageLabel(currentMove.stageId)}</span>
        <div><i style={{ width: progress + "%" }} /></div>
        <strong>{progress}%</strong>
      </div>

      <main className="jc-layout">
        <LearningRail content={content} state={learningState} currentMove={currentMove} />

        <section className="jc-classroom" key={currentMove.id + "-" + transitionKey}>
          <div className="jc-presence" aria-hidden="true">
            <span className="jc-presence-core" />
            <span className="jc-presence-ring ring-one" />
            <span className="jc-presence-ring ring-two" />
            <span className="jc-presence-spark spark-one" />
            <span className="jc-presence-spark spark-two" />
          </div>

          <ExperienceSignal
            currentMove={currentMove}
            learningState={learningState}
            content={content}
            isThinking={isThinking}
          />

          <div className="jc-move-head">
            <div>
              <div className="jc-eyebrow">
                <span>{moveIcon(currentMove.type)}</span>
                {currentMove.eyebrow || stageLabel(currentMove.stageId)}
              </div>
              <h1>{currentMove.title}</h1>
            </div>
            <div className="jc-stage-pill">{stageLabel(currentMove.stageId)}</div>
          </div>

          {currentMove.teacherLine && (
            <div className="jc-teacher-line">
              <span className="jc-teacher-avatar">J</span>
              <div>
                <small>Jeremiah</small>
                <p>{currentMove.teacherLine}</p>
              </div>
            </div>
          )}

          {currentMove.body && <p className="jc-body-copy">{currentMove.body}</p>}

          <ScriptureStack scripture={currentMove.scripture} moveType={currentMove.type} />

          <MasteryLens content={content} moveType={currentMove.type} />

          {currentMove.prompt && currentMove.type !== "complete" && (
            <div className="jc-prompt-block">
              <div className="jc-prompt-label">{meta.promptLabel}</div>
              <h2>{currentMove.prompt}</h2>
            </div>
          )}

          {currentMove.choices && !teacherDecision && (
            <ChoiceGrid
              choices={currentMove.choices}
              selectedChoiceId={selectedChoiceId}
              onSelect={setSelectedChoiceId}
              disabled={isThinking}
              moveType={currentMove.type}
            />
          )}

          {["free_response", "mastery_response"].includes(currentMove.type) &&
            !teacherDecision && (
              <div className="jc-response-wrap">
                <ResponseCoach moveType={currentMove.type} />
                <textarea
                  value={responseText}
                  onChange={(event) => setResponseText(event.target.value)}
                  placeholder={currentMove.placeholder || "Write your response..."}
                  disabled={isThinking}
                  rows={6}
                />
                <div className="jc-response-meter">
                  <span>
                    {responseText.trim()
                      ? responseText.trim().split(/\s+/).length + " words"
                      : "Start in your own words"}
                  </span>
                  <span>Meaning over matching</span>
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
              <span className="jc-thinking-orb">
                <i />
              </span>
              <div>
                <strong>Jeremiah is reading your response</strong>
                <span>Checking it against this standard, your evidence, and the next legal teaching move.</span>
              </div>
            </div>
          )}

          {teacherDecision && (
            <div className={"jc-feedback verdict-" + teacherDecision.verdict}>
              <div className="jc-feedback-top">
                <div className="jc-teacher-avatar">J</div>
                <div>
                  <span>Jeremiah</span>
                  <small>
                    {teacherDecision.source === "openai"
                      ? "Adaptive teacher"
                      : teacherDecision.source === "fallback"
                        ? "Guardrail mode"
                        : "Learning engine"}
                  </small>
                </div>
                <div className="jc-verdict">
                  {teacherDecision.verdict === "strong"
                    ? "Established"
                    : teacherDecision.verdict === "partial"
                      ? "Developing"
                      : "Rebuild"}
                </div>
              </div>
              <p>{teacherDecision.teacherMessage}</p>
              {teacherDecision.followUpPrompt && (
                <div className="jc-followup">{teacherDecision.followUpPrompt}</div>
              )}
              <button type="button" className="jc-primary" onClick={handleTeacherContinue}>
                {teacherDecision.verdict === "strong"
                  ? "Move forward"
                  : "Teach it another way"}
                <span>→</span>
              </button>
            </div>
          )}

          {currentMove.type === "launch" && !teacherDecision && (
            <button type="button" className="jc-primary jc-launch" onClick={handleLaunch}>
              {currentMove.ctaLabel || "Begin"}
              <span>→</span>
            </button>
          )}

          {!["launch", "complete"].includes(currentMove.type) && !teacherDecision && (
            <button
              type="button"
              className="jc-primary jc-submit"
              onClick={handleSubmit}
              disabled={!ready || isThinking}
            >
              {isThinking ? "Jeremiah is thinking…" : currentMove.type === "mastery_response" ? "Submit mastery evidence" : "Continue with Jeremiah"}
              <span>→</span>
            </button>
          )}

          {currentMove.type === "complete" && (
            <div className="jc-complete-actions">
              <div className="jc-complete-mark">
                <span>✓</span>
              </div>
              <div>
                <strong>Standard established</strong>
                <p>{currentMove.teacherLine}</p>
              </div>
              <button type="button" className="jc-primary" onClick={() => onNavigate(ROUTES.HOME)}>
                {currentMove.ctaLabel || "Return home"}
                <span>→</span>
              </button>
            </div>
          )}
        </section>

        <aside className="jc-context-panel">
          <div className="jc-context-kicker">CURRENT STANDARD</div>
          <h2>{content.standardTitle}</h2>
          <p>{content.brain?.essentialQuestion}</p>

          <div className="jc-context-divider" />

          <div className="jc-context-kicker">MASTERY TARGET</div>
          <p className="jc-mastery-target">{content.brain?.masteryTarget}</p>

          <div className="jc-context-divider" />

          <div className="jc-context-kicker">JEREMIAH REMEMBERS</div>
          <div className="jc-memory-line">
            <span>{learningState.completedMoveIds?.length || 0}</span>
            <p>learning moves completed</p>
          </div>
          <div className="jc-memory-line">
            <span>{learningState.misconceptions?.length || 0}</span>
            <p>misconceptions being watched</p>
          </div>

          <div className="jc-context-divider" />

          <div className="jc-context-kicker">RIGHT NOW</div>
          <div className="jc-now-card">
            <span>{moveIcon(currentMove.type)}</span>
            <div>
              <strong>{meta.verb}</strong>
              <p>{meta.cue}</p>
            </div>
          </div>
        </aside>
      </main>
    </div>
  );
}

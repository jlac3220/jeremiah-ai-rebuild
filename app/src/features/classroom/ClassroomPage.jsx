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

function EncounterExperience({ move, onComplete, onExit }) {
  const encounter = move.encounter || {};
  const [phase, setPhase] = useState("threshold");
  const [primaryMarks, setPrimaryMarks] = useState([]);
  const [bridgeMarks, setBridgeMarks] = useState([]);
  const [showSourceShelf, setShowSourceShelf] = useState(false);
  const sources = encounter.curatedSources || [];
  const sourceMoments = encounter.sourceMoments || [];
  const mediaMoments = encounter.mediaMoments || [];
  const primaryWords = String(encounter.primaryVerse?.text || "").split(/\s+/);
  const bridgeWords = String(encounter.bridgeVerse?.text || "").split(/\s+/);

  useEffect(() => {
    return () => {
      if (typeof window !== "undefined" && window.speechSynthesis) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  function beginListening() {
    setPhase("notice");

    if (
      typeof window === "undefined" ||
      !window.speechSynthesis ||
      typeof window.SpeechSynthesisUtterance === "undefined"
    ) {
      return;
    }

    window.speechSynthesis.cancel();
    const utterance = new window.SpeechSynthesisUtterance(
      encounter.primaryVerse?.text || ""
    );
    utterance.rate = 0.82;
    utterance.pitch = 0.96;
    window.speechSynthesis.speak(utterance);
  }

  function toggleMark(setter, marks, index) {
    setter(
      marks.includes(index)
        ? marks.filter((item) => item !== index)
        : [...marks, index]
    );
  }

  function renderWordField(words, marks, setter, label) {
    return (
      <div className="jc-encounter-words" aria-label={label}>
        {words.map((word, index) => (
          <button
            type="button"
            key={index + "-" + word}
            className={marks.includes(index) ? "is-marked" : ""}
            aria-pressed={marks.includes(index)}
            onClick={() => toggleMark(setter, marks, index)}
          >
            {word}
          </button>
        ))}
      </div>
    );
  }

  const videoSource = sources.find((source) => source.type === "video");
  const artifactMoments = mediaMoments.filter((moment) => {
    const source = sources.find((item) => item.id === moment.sourceId);
    return source?.type === "image";
  });

  return (
    <div className="jc-encounter-page">
      <div className="jc-encounter-atmosphere" aria-hidden="true">
        <span className="jc-encounter-glow one" />
        <span className="jc-encounter-glow two" />
      </div>

      <button type="button" className="jc-encounter-exit" onClick={onExit}>
        ← Home
      </button>

      <main className="jc-encounter-shell">
        {phase === "threshold" && (
          <section className="jc-encounter-scene is-threshold">
            <div className="jc-encounter-kicker">ENTER THE CLASSROOM</div>
            <h1>{move.title}</h1>
            <p className="jc-encounter-opening">{encounter.opening}</p>

            <div className="jc-encounter-entry-grid">
              <button type="button" onClick={beginListening}>
                <span className="jc-entry-icon">◖</span>
                <strong>{encounter.listenLabel || "Listen"}</strong>
                <small>Hear the confession before anything is explained.</small>
              </button>

              <button type="button" onClick={() => setPhase("notice")}>
                <span className="jc-entry-icon">Aa</span>
                <strong>{encounter.readLabel || "Read it myself"}</strong>
                <small>Enter through the words and notice what pulls your attention.</small>
              </button>

              {videoSource && (
                <button type="button" onClick={() => setPhase("mediaIntro")}>
                  <span className="jc-entry-icon">▶</span>
                  <strong>Watch a short introduction</strong>
                  <small>{videoSource.provider} · {videoSource.duration}</small>
                </button>
              )}
            </div>

            <div className="jc-encounter-whisper">
              No score. No correct answer yet. Just encounter the idea.
            </div>
          </section>
        )}

        {phase === "mediaIntro" && videoSource && (
          <section className="jc-encounter-scene is-media">
            <div className="jc-encounter-step">00 · WATCH</div>
            <h2>{videoSource.title}</h2>
            <p className="jc-encounter-subcopy">{videoSource.hook}</p>

            <div className="jc-video-frame">
              <iframe
                src={videoSource.embedUrl}
                title={videoSource.title}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
              />
            </div>

            <div className="jc-media-source-line">
              <span>{videoSource.provider}</span>
              <span>{videoSource.duration}</span>
              <a href={videoSource.url} target="_blank" rel="noreferrer">
                Open source ↗
              </a>
            </div>

            <button
              type="button"
              className="jc-encounter-next"
              onClick={() => setPhase("notice")}
            >
              Now read the words yourself <span>→</span>
            </button>
          </section>
        )}

        {phase === "notice" && (
          <section className="jc-encounter-scene">
            <div className="jc-encounter-step">01 · HEAR</div>
            <div className="jc-encounter-reference">
              {encounter.primaryVerse?.reference}
            </div>
            {renderWordField(
              primaryWords,
              primaryMarks,
              setPrimaryMarks,
              "Tap words in the Shema that stand out"
            )}
            <p className="jc-encounter-prompt">{encounter.noticePrompt}</p>

            <div className="jc-encounter-actions">
              <button type="button" className="jc-encounter-ghost" onClick={beginListening}>
                Listen again
              </button>
              <button
                type="button"
                className="jc-encounter-next"
                onClick={() => setPhase("bridge")}
                disabled={!primaryMarks.length}
              >
                Hold that thought <span>→</span>
              </button>
            </div>
          </section>
        )}

        {phase === "bridge" && (
          <section className="jc-encounter-scene">
            <div className="jc-encounter-step">02 · HOLD TWO TEXTS TOGETHER</div>
            <p className="jc-encounter-bridge-line">{encounter.bridgeLine}</p>

            <div className="jc-encounter-pair">
              <article>
                <span>{encounter.primaryVerse?.reference}</span>
                <p>{encounter.primaryVerse?.text}</p>
              </article>
              <div className="jc-pair-symbol">+</div>
              <article>
                <span>{encounter.bridgeVerse?.reference}</span>
                {renderWordField(
                  bridgeWords,
                  bridgeMarks,
                  setBridgeMarks,
                  "Tap words in Isaiah that stand out"
                )}
              </article>
            </div>

            <p className="jc-encounter-prompt">{encounter.bridgePrompt}</p>

            <button
              type="button"
              className="jc-encounter-next"
              onClick={() => setPhase("artifacts")}
              disabled={!bridgeMarks.length}
            >
              See the text in the real world <span>→</span>
            </button>
          </section>
        )}

        {phase === "artifacts" && (
          <section className="jc-encounter-scene is-artifacts">
            <div className="jc-encounter-step">03 · THE WORDS HAVE A PHYSICAL HISTORY</div>
            <h2>Before this was a lesson screen, it was ink, parchment, memory, and practice.</h2>
            <p className="jc-encounter-subcopy">
              Look first. Then read the context.
            </p>

            <div className="jc-artifact-grid">
              {artifactMoments.map((moment) => {
                const source = sources.find((item) => item.id === moment.sourceId);
                if (!source) return null;

                return (
                  <article className="jc-artifact-card" key={moment.id}>
                    <div className="jc-artifact-image-wrap">
                      <img
                        src={source.imageUrl}
                        alt={source.title}
                        loading="lazy"
                      />
                    </div>
                    <div className="jc-artifact-copy">
                      <span>{moment.eyebrow}</span>
                      <h3>{source.title}</h3>
                      <p>{moment.prompt}</p>
                      <small>{source.date}</small>
                      <a href={source.url} target="_blank" rel="noreferrer">
                        {source.attribution} ↗
                      </a>
                    </div>
                  </article>
                );
              })}
            </div>

            <button
              type="button"
              className="jc-encounter-next"
              onClick={() => setPhase("voices")}
            >
              Hear voices around the text <span>→</span>
            </button>
          </section>
        )}

        {phase === "voices" && (
          <section className="jc-encounter-scene">
            <div className="jc-encounter-step">04 · THE VERSE HAS A HISTORY</div>
            <h2>People have been hearing, reciting, and arguing about these words for centuries.</h2>
            <p className="jc-encounter-subcopy">
              Jeremiah can bring those voices into the room without handing them authority over the standard.
            </p>

            <div className="jc-voice-stack">
              {sourceMoments.slice(0, 3).map((moment) => {
                const source = sources.find((item) => item.id === moment.sourceId);
                return (
                  <article className="jc-voice-card" key={moment.id}>
                    <div>
                      <span>{moment.label}</span>
                      <small>{source?.provider || "Source"}</small>
                    </div>
                    <p>{moment.text}</p>
                    {source?.quote && <blockquote>{source.quote}</blockquote>}
                    {source?.url && (
                      <a href={source.url} target="_blank" rel="noreferrer">
                        Explore source ↗
                      </a>
                    )}
                  </article>
                );
              })}
            </div>

            <div className="jc-source-shelf-wrap">
              <button
                type="button"
                className="jc-source-shelf-toggle"
                onClick={() => setShowSourceShelf((value) => !value)}
              >
                {showSourceShelf ? "Close source shelf" : "Open the source shelf"}
                <span>{showSourceShelf ? "−" : "+"}</span>
              </button>

              {showSourceShelf && (
                <div className="jc-source-shelf">
                  {sources
                    .filter((source) => source.url)
                    .map((source) => (
                      <a
                        key={source.id}
                        href={source.url}
                        target="_blank"
                        rel="noreferrer"
                        className="jc-source-item"
                      >
                        <div>
                          <span>{String(source.type || "source").replaceAll("_", " ")}</span>
                          <small>{source.provider}</small>
                        </div>
                        <strong>{source.title}</strong>
                        <p>{source.hook}</p>
                        {source.attribution && <em>{source.attribution}</em>}
                      </a>
                    ))}
                </div>
              )}
            </div>

            <button
              type="button"
              className="jc-encounter-next"
              onClick={() => setPhase("destination")}
            >
              Show me where this lesson is going <span>→</span>
            </button>
          </section>
        )}

        {phase === "destination" && (
          <section className="jc-encounter-scene is-destination">
            <div className="jc-encounter-step">YOUR TASK</div>
            <h2>{encounter.destination}</h2>
            <p>
              Everything Jeremiah teaches next should help you accomplish that—not just answer a string of questions.
            </p>
            <button type="button" className="jc-encounter-next" onClick={onComplete}>
              {move.ctaLabel || "Enter the lesson"} <span>→</span>
            </button>
          </section>
        )}
      </main>
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

  if (currentMove.type === "encounter") {
    return (
      <EncounterExperience
        move={currentMove}
        onComplete={handleContinue}
        onExit={() => onNavigate(ROUTES.HOME)}
      />
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

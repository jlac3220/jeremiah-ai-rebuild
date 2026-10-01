import { useEffect, useState } from "react";
import "./ShemaContinuation.css";

function emptyRetrievalState() {
  return {
    index: 0,
    selectedIndex: null,
    submitted: false,
    score: 0,
    answered: 0,
    finished: false,
    passed: false,
  };
}

export default function ShemaContinuation({
  move,
  encounterData,
  selectedChoiceId,
  onSelectChoice,
  responseText,
  onResponseText,
  draft,
  onDraftChange,
  teacherDecision,
  isThinking,
  errorMessage,
  ready,
  onSubmit,
  onContinue,
  onTeacherContinue,
  onExit,
  onHome,
}) {
  const isResponse = ["free_response", "mastery_response"].includes(move.type);
  const isUnscored = ["teach", "synthesis"].includes(move.type);
  const isComplete = move.type === "complete";
  const witnessBuilder = move.witnessBuilder;
  const retrievalCheck = move.retrievalCheck;
  const [witnessSelections, setWitnessSelections] = useState(
    draft?.witnessSelections || {}
  );
  const [retrievalState, setRetrievalState] = useState(
    draft?.retrievalState || emptyRetrievalState()
  );

  useEffect(() => {
    setWitnessSelections(draft?.witnessSelections || {});
    setRetrievalState(draft?.retrievalState || emptyRetrievalState());
  }, [move.id]);

  function chooseWitness(stepIndex, optionIndex) {
    const next = { ...witnessSelections, [stepIndex]: optionIndex };
    setWitnessSelections(next);
    onDraftChange?.({ witnessSelections: next });

    if (!witnessBuilder) return;
    const complete = witnessBuilder.steps.every((_, index) => next[index] !== undefined);
    if (!complete) return;

    const built = witnessBuilder.steps
      .map((step, index) => step.options[next[index]])
      .join(" ");
    onResponseText(built);
  }

  const witnessReady =
    !witnessBuilder ||
    witnessBuilder.steps.every((_, index) => witnessSelections[index] !== undefined);

  function commitRetrieval(next) {
    setRetrievalState(next);
    onDraftChange?.({ retrievalState: next });
  }

  function selectRetrievalOption(optionIndex) {
    if (retrievalState.submitted || retrievalState.finished) return;
    commitRetrieval({ ...retrievalState, selectedIndex: optionIndex });
  }

  function submitRetrievalAnswer() {
    const item = retrievalCheck?.items?.[retrievalState.index];
    if (!item || retrievalState.selectedIndex == null || retrievalState.submitted) return;
    const correct = retrievalState.selectedIndex === item.correctIndex;

    commitRetrieval({
      ...retrievalState,
      submitted: true,
      answered: retrievalState.answered + 1,
      score: retrievalState.score + (correct ? 1 : 0),
    });
  }

  function advanceRetrieval() {
    if (!retrievalCheck) return;
    const isLast = retrievalState.index >= retrievalCheck.items.length - 1;

    if (isLast) {
      const percent =
        retrievalCheck.items.length > 0
          ? retrievalState.score / retrievalCheck.items.length
          : 0;
      commitRetrieval({
        ...retrievalState,
        finished: true,
        passed: percent >= (retrievalCheck.passThreshold || 0.7),
      });
      return;
    }

    commitRetrieval({
      ...retrievalState,
      index: retrievalState.index + 1,
      selectedIndex: null,
      submitted: false,
    });
  }

  function retryRetrieval() {
    commitRetrieval(emptyRetrievalState());
  }

  const retrievalReady = !retrievalCheck || retrievalState.passed;
  const thread = [
    ...(encounterData?.primaryPhrases || []),
    ...(encounterData?.bridgePhrases || []),
  ].filter(Boolean);

  return (
    <div className="scl-page">
      <header className="scl-topbar">
        <button type="button" onClick={onExit} aria-label="Leave Classroom">←</button>
        <div className="scl-title">The One True God</div>
        <span />
      </header>

      <main className="scl-shell">
        {thread.length > 0 && !isComplete && (
          <div className="scl-thread">
            {thread.slice(0, 2).map((item, index) => (
              <span key={item + index}>{item}</span>
            ))}
          </div>
        )}

        <section className="scl-scene">
          <span className="scl-kicker">
            {move.type === "scenario"
              ? "Pressure test"
              : move.type === "free_response"
                ? "Teach it back"
                : move.type === "mastery_response"
                  ? "Mastery"
                  : move.type === "complete"
                    ? "Complete"
                    : "Jeremiah"}
          </span>

          <h1>{move.title}</h1>

          {move.body && <p className="scl-body">{move.body}</p>}

          {(move.teaching || []).length > 0 && (
            <div className="scl-teaching">
              {move.teaching.map((paragraph, index) => (
                <p key={index}>{paragraph}</p>
              ))}
            </div>
          )}

          {(move.insights || []).length > 0 && (
            <div className="scl-insights">
              {move.insights.map((insight) => (
                <div key={insight.label}>
                  <small>{insight.label}</small>
                  <strong>{insight.text}</strong>
                </div>
              ))}
            </div>
          )}

          {witnessBuilder && !teacherDecision && (
            <div className="scl-witness-builder">
              <p className="scl-witness-intro">{witnessBuilder.intro}</p>

              {witnessBuilder.steps.map((step, stepIndex) => (
                <section className="scl-witness-step" key={step.id}>
                  <div className="scl-witness-step-head">
                    <span>{String(stepIndex + 1).padStart(2, "0")}</span>
                    <div>
                      <small>{step.label}</small>
                      <strong>{step.prompt}</strong>
                    </div>
                  </div>

                  <div className="scl-witness-options">
                    {step.options.map((option, optionIndex) => {
                      const selected = witnessSelections[stepIndex] === optionIndex;
                      return (
                        <button
                          type="button"
                          key={optionIndex}
                          className={selected ? "is-selected" : ""}
                          onClick={() => chooseWitness(stepIndex, optionIndex)}
                        >
                          <span>{option}</span>
                          <i>{selected ? "✓" : ""}</i>
                        </button>
                      );
                    })}
                  </div>
                </section>
              ))}

              {witnessReady && (
                <div className="scl-witness-built">
                  <small>Your witness</small>
                  <p>{responseText}</p>
                  <span>Make it sound like you before sending it to Jeremiah.</span>
                </div>
              )}
            </div>
          )}

          {move.prompt && !teacherDecision && !isComplete && (
            <div className="scl-question">
              <h2>{move.prompt}</h2>
            </div>
          )}

          {move.choices && !teacherDecision && (
            <div className="scl-options">
              {move.choices.map((choice) => (
                <button
                  type="button"
                  key={choice.id}
                  className={selectedChoiceId === choice.id ? "is-selected" : ""}
                  onClick={() => onSelectChoice(choice.id)}
                  disabled={isThinking}
                >
                  <span>{choice.label}</span>
                  <i>{selectedChoiceId === choice.id ? "✓" : ""}</i>
                </button>
              ))}
            </div>
          )}

          {retrievalCheck && !teacherDecision && (
            <div className="scl-retrieval">
              <div className="scl-retrieval-head">
                <div>
                  <span>Quick recall</span>
                  <strong>
                    {retrievalState.finished
                      ? "Recall check"
                      : `Question ${retrievalState.index + 1} of ${retrievalCheck.items.length}`}
                  </strong>
                </div>
                {!retrievalState.finished && (
                  <small>
                    {Math.round((retrievalState.index / retrievalCheck.items.length) * 100)}%
                  </small>
                )}
              </div>

              {!retrievalState.finished && (
                <>
                  {retrievalState.index === 0 && (
                    <p className="scl-retrieval-intro">{retrievalCheck.intro}</p>
                  )}

                  <h3>{retrievalCheck.items[retrievalState.index]?.prompt}</h3>

                  <div className="scl-retrieval-options">
                    {retrievalCheck.items[retrievalState.index]?.options.map((option, optionIndex) => {
                      const item = retrievalCheck.items[retrievalState.index];
                      const selected = retrievalState.selectedIndex === optionIndex;
                      const correct = retrievalState.submitted && optionIndex === item.correctIndex;
                      const wrongSelected =
                        retrievalState.submitted && selected && optionIndex !== item.correctIndex;

                      return (
                        <button
                          type="button"
                          key={optionIndex}
                          className={[
                            selected ? "is-selected" : "",
                            correct ? "is-correct" : "",
                            wrongSelected ? "is-wrong" : "",
                          ].filter(Boolean).join(" ")}
                          onClick={() => selectRetrievalOption(optionIndex)}
                          disabled={retrievalState.submitted}
                        >
                          <span>{option}</span>
                          <i>{correct ? "✓" : wrongSelected ? "×" : selected ? "•" : ""}</i>
                        </button>
                      );
                    })}
                  </div>

                  {retrievalState.submitted && (
                    <div className="scl-retrieval-explanation">
                      <strong>
                        {retrievalState.selectedIndex ===
                        retrievalCheck.items[retrievalState.index]?.correctIndex
                          ? "Correct"
                          : "Notice this"}
                      </strong>
                      <p>{retrievalCheck.items[retrievalState.index]?.explanation}</p>
                    </div>
                  )}

                  {!retrievalState.submitted ? (
                    <button
                      type="button"
                      className="scl-action"
                      onClick={submitRetrievalAnswer}
                      disabled={retrievalState.selectedIndex == null}
                    >
                      Check answer <span>→</span>
                    </button>
                  ) : (
                    <button type="button" className="scl-action" onClick={advanceRetrieval}>
                      {retrievalState.index >= retrievalCheck.items.length - 1
                        ? "See result"
                        : "Next question"} <span>→</span>
                    </button>
                  )}
                </>
              )}

              {retrievalState.finished && (
                <div className={"scl-retrieval-result " + (retrievalState.passed ? "is-pass" : "is-retry")}>
                  <strong>
                    {retrievalState.passed ? "Recall is holding." : "Rebuild it once more."}
                  </strong>
                  <p>
                    You answered {retrievalState.score} of {retrievalCheck.items.length} correctly.
                    {retrievalState.passed
                      ? " Now explain the foundation from memory."
                      : " Review the explanations and try the recall check again."}
                  </p>
                  {!retrievalState.passed && (
                    <button type="button" className="scl-secondary" onClick={retryRetrieval}>
                      Retry recall
                    </button>
                  )}
                </div>
              )}
            </div>
          )}

          {isResponse && !teacherDecision && (!witnessBuilder || witnessReady) && retrievalReady && (
            <div className="scl-response">
              <textarea
                value={responseText}
                onChange={(event) => onResponseText(event.target.value)}
                placeholder={move.placeholder || "Write your response..."}
                disabled={isThinking}
                rows={7}
              />
              <small>Use your own words. Jeremiah is reading for meaning.</small>
            </div>
          )}

          {isThinking && (
            <div className="scl-thinking">
              <span>J</span>
              <p>Jeremiah is reading your response…</p>
            </div>
          )}

          {errorMessage && (
            <div className="scl-error">{errorMessage}</div>
          )}

          {teacherDecision && (
            <div className="scl-feedback">
              <div className="scl-teacher">
                <span>J</span>
                <div>
                  <small>Jeremiah</small>
                  <strong>
                    {teacherDecision.verdict === "strong"
                      ? "That holds."
                      : teacherDecision.verdict === "partial"
                        ? "Almost there."
                        : "Let’s rebuild this."}
                  </strong>
                </div>
              </div>
              <p>{teacherDecision.teacherMessage}</p>
              {teacherDecision.followUpPrompt && <small>{teacherDecision.followUpPrompt}</small>}
              <button type="button" className="scl-action" onClick={onTeacherContinue}>
                {teacherDecision.verdict === "strong" ? "Continue" : "Show me another way"} <span>→</span>
              </button>
            </div>
          )}

          {!teacherDecision && !isComplete && isUnscored && (
            <button type="button" className="scl-action" onClick={onContinue}>
              {move.ctaLabel || "Continue"} <span>→</span>
            </button>
          )}

          {!teacherDecision && !isComplete && !isUnscored && (
            <button
              type="button"
              className="scl-action"
              onClick={onSubmit}
              disabled={!ready || isThinking || !witnessReady || !retrievalReady}
            >
              {isThinking
                ? "Reading…"
                : move.type === "mastery_response"
                  ? "Submit mastery"
                  : move.type === "free_response"
                    ? "Let Jeremiah respond"
                    : "Check this"} <span>→</span>
            </button>
          )}

          {isComplete && (
            <div className="scl-complete">
              <div>✓</div>
              <p>{move.teacherLine || move.body}</p>
              <button type="button" className="scl-action" onClick={onHome}>
                {move.ctaLabel || "Return home"} <span>→</span>
              </button>
            </div>
          )}
        </section>
      </main>
    </div>
  );
}

import { useEffect, useState } from "react";
import "./ShemaContinuation.css";

export default function ShemaContinuation({
  move,
  encounterData,
  selectedChoiceId,
  onSelectChoice,
  responseText,
  onResponseText,
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
  const [witnessSelections, setWitnessSelections] = useState({});

  useEffect(() => {
    setWitnessSelections({});
  }, [move.id]);

  function chooseWitness(stepIndex, optionIndex) {
    const next = { ...witnessSelections, [stepIndex]: optionIndex };
    setWitnessSelections(next);

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

          {isResponse && !teacherDecision && (!witnessBuilder || witnessReady) && (
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
              disabled={!ready || isThinking || !witnessReady}
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

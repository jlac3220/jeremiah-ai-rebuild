import { useEffect, useMemo, useRef, useState } from "react";
import { ROUTES } from "../../app/routes";
import {
  getActiveClassroomSessionPreset,
  getCurrentSession,
  setSavedLiveStageForPreset,
} from "../../core/classroom/classroomSessionData";
import {
  advanceEncounterMove,
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

function getEmbeddedMediaUrl(source) {
  if (!source?.embedUrl) return "";

  try {
    const url = new URL(source.embedUrl);

    if (url.hostname.includes("youtube.com") || url.hostname.includes("youtube-nocookie.com")) {
      url.searchParams.set("rel", "0");
      url.searchParams.set("playsinline", "1");
      url.searchParams.set("enablejsapi", "1");

      if (typeof window !== "undefined") {
        url.searchParams.set("origin", window.location.origin);
        url.searchParams.set("widget_referrer", window.location.origin);
      }
    }

    return url.toString();
  } catch {
    return source.embedUrl;
  }
}

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
  const [primaryPhraseId, setPrimaryPhraseId] = useState("");
  const [bridgePhraseId, setBridgePhraseId] = useState("");
  const [showSourceShelf, setShowSourceShelf] = useState(false);
  const [selectedSource, setSelectedSource] = useState(null);
  const [entryMode, setEntryMode] = useState("");
  const [viewedSourceIds, setViewedSourceIds] = useState([]);
  const sources = encounter.curatedSources || [];
  const sourceMoments = encounter.sourceMoments || [];
  const mediaMoments = encounter.mediaMoments || [];
  const primaryPhraseOptions = encounter.primaryPhraseOptions || [];
  const bridgePhraseOptions = encounter.bridgePhraseOptions || [];
  const primaryPhrase = primaryPhraseOptions.find((item) => item.id === primaryPhraseId);
  const bridgePhrase = bridgePhraseOptions.find((item) => item.id === bridgePhraseId);

  function openSource(source) {
    if (!source) return;
    setSelectedSource(source);
    setViewedSourceIds((ids) =>
      ids.includes(source.id) ? ids : [...ids, source.id]
    );
  }

  function finishEncounter() {
    onComplete({
      entryMode: entryMode || "read",
      primaryPhrases: primaryPhrase ? [primaryPhrase.text] : [],
      bridgePhrases: bridgePhrase ? [bridgePhrase.text] : [],
      viewedSourceIds,
      sourceShelfOpened: showSourceShelf,
    });
  }

  function renderPhraseChoices(options, selectedId, onSelect, label) {
    return (
      <div className="jc-phrase-choices" aria-label={label}>
        {options.map((option) => {
          const selected = option.id === selectedId;
          return (
            <button
              type="button"
              key={option.id}
              className={selected ? "is-selected" : ""}
              aria-pressed={selected}
              onClick={() => onSelect(option.id)}
            >
              <span>{option.text}</span>
              <i aria-hidden="true">{selected ? "✓" : ""}</i>
            </button>
          );
        })}
      </div>
    );
  }

  const videoSource = sources.find((source) => source.type === "video");
  const heroArtifact = sources.find((source) => source.id === "nash-papyrus");
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
            <div className="jc-threshold-grid">
              <div className="jc-threshold-copy">
                <div className="jc-encounter-kicker">THE ONE TRUE GOD · OG.1.1.18</div>
                <h1>{move.title}</h1>
                <p className="jc-encounter-opening">{encounter.opening}</p>

                <div className="jc-threshold-actions">
                  <button
                    type="button"
                    className="jc-threshold-primary"
                    onClick={() => {
                      setEntryMode("read");
                      setPhase("notice");
                    }}
                  >
                    <span className="jc-threshold-primary-copy">
                      <strong>Start with the confession</strong>
                      <small>Deuteronomy 6:4</small>
                    </span>
                    <i>→</i>
                  </button>
                </div>

                <div className="jc-encounter-whisper">
                  No quiz yet. First, encounter the confession itself.
                </div>
              </div>

              <div className="jc-threshold-media">
                {videoSource && (
                  <div className="jc-threshold-video-feature">
                    <div className="jc-threshold-video-label">
                      <span>WATCH · 3:26</span>
                      <small>{videoSource.provider}</small>
                    </div>

                    <div className="jc-threshold-video-frame">
                      <iframe
                        src={getEmbeddedMediaUrl(videoSource)}
                        title={videoSource.title}
                        referrerPolicy="strict-origin-when-cross-origin"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                        allowFullScreen
                      />
                    </div>

                    <div className="jc-threshold-video-copy">
                      <strong>{videoSource.title}</strong>
                      <p>{videoSource.hook}</p>
                      <div className="jc-threshold-video-note">
                        Watch here, then start with the confession when you are ready.
                      </div>
                    </div>
                  </div>
                )}

                {heroArtifact?.imageUrl && (
                  <div className="jc-threshold-artifact-strip">
                    <img src={heroArtifact.imageUrl} alt="" />
                    <div className="jc-threshold-artifact-copy">
                      <span>Ancient witness</span>
                      <strong>Nash Papyrus</strong>
                      <small>An early manuscript containing the Shema</small>
                    </div>
                  </div>
                )}
              </div>
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
                src={getEmbeddedMediaUrl(videoSource)}
                title={videoSource.title}
                referrerPolicy="strict-origin-when-cross-origin"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
              />
            </div>

            <div className="jc-media-source-line">
              <span>{videoSource.provider}</span>
              <span>{videoSource.duration}</span>
              <button type="button" onClick={() => openSource(videoSource)}>
                About this source
              </button>
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
          <section className="jc-encounter-scene jc-notice-scene">
            <div className="jc-scene-topline">
              <div className="jc-encounter-step">01 · NOTICE</div>
              <div className="jc-scene-progress" aria-label="Encounter step 1 of 4">
                <i className="is-active" />
                <i />
                <i />
                <i />
              </div>
            </div>

            <div className="jc-notice-intro">
              <span>{encounter.primaryVerse?.reference}</span>
              <h2>Read the confession as a whole.</h2>
              <p>{encounter.noticePrompt}</p>
            </div>

            <blockquote className="jc-notice-verse">
              “{encounter.primaryVerse?.text}”
            </blockquote>

            {renderPhraseChoices(
              primaryPhraseOptions,
              primaryPhraseId,
              setPrimaryPhraseId,
              "Choose a phrase from Deuteronomy 6:4 to carry forward"
            )}

            <div className="jc-encounter-actions jc-scene-actions">
              <button
                type="button"
                className="jc-encounter-ghost"
                onClick={() => setPrimaryPhraseId("")}
                disabled={!primaryPhraseId}
              >
                Choose again
              </button>
              <button
                type="button"
                className="jc-encounter-next"
                onClick={() => setPhase("bridge")}
                disabled={!primaryPhraseId}
              >
                Carry this phrase forward <span>→</span>
              </button>
            </div>
          </section>
        )}

        {phase === "bridge" && (
          <section className="jc-encounter-scene jc-compare-scene">
            <div className="jc-scene-topline">
              <div className="jc-encounter-step">02 · COMPARE</div>
              <div className="jc-scene-progress" aria-label="Encounter step 2 of 4">
                <i className="is-done" />
                <i className="is-active" />
                <i />
                <i />
              </div>
            </div>

            <div className="jc-continuity-thread">
              <span>You carried forward</span>
              <strong>“{primaryPhrase?.text}”</strong>
            </div>

            <div className="jc-compare-intro">
              <h2>Now put Isaiah beside it.</h2>
              <p>{encounter.bridgeLine}</p>
            </div>

            <div className="jc-encounter-pair">
              <article className="is-first">
                <span>{encounter.primaryVerse?.reference}</span>
                <p>{encounter.primaryVerse?.text}</p>
                <small>Your first text</small>
              </article>

              <div className="jc-pair-symbol">+</div>

              <article className="is-second">
                <span>{encounter.bridgeVerse?.reference}</span>
                <p>{encounter.bridgeVerse?.text}</p>
                <small>Read Isaiah as a whole before choosing a phrase.</small>
              </article>
            </div>

            <div className="jc-compare-question">
              <span>Hold these together</span>
              <p>{encounter.bridgePrompt}</p>
            </div>

            {renderPhraseChoices(
              bridgePhraseOptions,
              bridgePhraseId,
              setBridgePhraseId,
              "Choose the phrase in Isaiah that sharpens the confession"
            )}

            <div className="jc-scene-actions">
              <button
                type="button"
                className="jc-encounter-next"
                onClick={() => setPhase("artifacts")}
                disabled={!bridgePhraseId}
              >
                See why that matters <span>→</span>
              </button>
            </div>
          </section>
        )}

        {phase === "artifacts" && (
          <section className="jc-encounter-scene is-artifacts">
            <div className="jc-continuity-thread is-compact">
              <span>Your thread</span>
              <strong>“{primaryPhrase?.text}” → “{bridgePhrase?.text}”</strong>
            </div>
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
                      <button
                        type="button"
                        className="jc-source-detail-action"
                        onClick={() => openSource(source)}
                      >
                        View source details <span>→</span>
                      </button>
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
            <div className="jc-continuity-thread is-compact">
              <span>Your thread</span>
              <strong>“{primaryPhrase?.text}” → “{bridgePhrase?.text}”</strong>
            </div>
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
                    <div className="jc-voice-card-head">
                      <span>{moment.label}</span>
                      <small className="jc-source-provider">{source?.provider || "Source"}</small>
                    </div>
                    <p>{moment.text}</p>
                    {source?.quote && <blockquote>{source.quote}</blockquote>}
                    {source && (
                      <button
                        type="button"
                        className="jc-source-detail-action"
                        onClick={() => openSource(source)}
                      >
                        View source details <span>→</span>
                      </button>
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
                {showSourceShelf ? "Close source library" : "Browse all sources"}
                <span>{showSourceShelf ? "−" : "+"}</span>
              </button>

              {showSourceShelf && (
                <div className="jc-source-shelf">
                  {sources
                    .filter((source) => source.url)
                    .map((source) => (
                      <button
                        type="button"
                        key={source.id}
                        className="jc-source-item"
                        onClick={() => openSource(source)}
                      >
                        <div>
                          <span>{String(source.type || "source").replaceAll("_", " ")}</span>
                          <small>{source.provider}</small>
                        </div>
                        <strong>{source.title}</strong>
                        <p>{source.hook}</p>
                        {source.attribution && <em>{source.attribution}</em>}
                      </button>
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
            <div className="jc-continuity-thread is-compact">
              <span>You have already started building the answer</span>
              <strong>“{primaryPhrase?.text}” → “{bridgePhrase?.text}”</strong>
            </div>
            <div className="jc-encounter-step">YOUR TASK</div>
            <h2>{encounter.destination}</h2>
            <p>
              Everything Jeremiah teaches next should help you accomplish that—not just answer a string of questions.
            </p>
            <button type="button" className="jc-encounter-next" onClick={finishEncounter}>
              {move.ctaLabel || "Enter the lesson"} <span>→</span>
            </button>
          </section>
        )}
      </main>

      {selectedSource && (
        <div
          className="jc-source-viewer-backdrop"
          role="presentation"
          onClick={() => setSelectedSource(null)}
        >
          <aside
            className="jc-source-viewer"
            role="dialog"
            aria-modal="true"
            aria-label={selectedSource.title}
            onClick={(event) => event.stopPropagation()}
          >
            <button
              type="button"
              className="jc-source-viewer-close"
              onClick={() => setSelectedSource(null)}
              aria-label="Close source"
            >
              ×
            </button>

            <div className="jc-source-viewer-meta">
              <span>{String(selectedSource.type || "source").replaceAll("_", " ")}</span>
              <small>{selectedSource.provider}</small>
            </div>

            <h3>{selectedSource.title}</h3>

            {selectedSource.imageUrl && (
              <div className="jc-source-viewer-image">
                <img src={selectedSource.imageUrl} alt={selectedSource.title} />
              </div>
            )}

            {selectedSource.embedUrl && (
              <div className="jc-source-viewer-video">
                <iframe
                  src={getEmbeddedMediaUrl(selectedSource)}
                  title={selectedSource.title}
                  referrerPolicy="strict-origin-when-cross-origin"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                />
              </div>
            )}

            {selectedSource.quote && (
              <blockquote>{selectedSource.quote}</blockquote>
            )}

            {selectedSource.hook && <p>{selectedSource.hook}</p>}

            {selectedSource.summary && (
              <div className="jc-source-viewer-summary">
                <span>Context</span>
                <p>{selectedSource.summary}</p>
              </div>
            )}

            {selectedSource.purpose && (
              <div className="jc-source-viewer-why">
                <span>Why Jeremiah brought this in</span>
                <p>{selectedSource.purpose}</p>
              </div>
            )}

            {(selectedSource.attribution || selectedSource.date || selectedSource.license) && (
              <div className="jc-source-viewer-foot">
                {selectedSource.attribution && <span>{selectedSource.attribution}</span>}
                {selectedSource.date && <span>{selectedSource.date}</span>}
                {selectedSource.license && <span>{selectedSource.license}</span>}
              </div>
            )}

            {selectedSource.url && (
              <a
                className="jc-source-original"
                href={selectedSource.url}
                target="_blank"
                rel="noreferrer"
              >
                View original source ↗
              </a>
            )}
          </aside>
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

function renderVerseWithPhrase(text = "", phrase = "") {
  if (!phrase || !text.includes(phrase)) return text;
  const [before, ...rest] = text.split(phrase);
  return (
    <>
      {before}
      <mark>{phrase}</mark>
      {rest.join(phrase)}
    </>
  );
}

function EncounterHandoff({ move, encounterData, onContinue, onExit }) {
  const verse = move.scripture?.[0];
  const noticed = [
    ...(encounterData?.primaryPhrases || []),
    ...(encounterData?.bridgePhrases || []),
  ];
  const primaryPhrase = encounterData?.primaryPhrases?.[0] || "";

  return (
    <div className="jc-encounter-page jc-handoff-page">
      <div className="jc-encounter-atmosphere" aria-hidden="true">
        <span className="jc-encounter-glow one" />
        <span className="jc-encounter-glow two" />
      </div>

      <button type="button" className="jc-encounter-exit" onClick={onExit}>
        ← Home
      </button>

      <main className="jc-handoff-shell">
        <section className="jc-handoff-scene">
          <div className="jc-encounter-step">
            {move.handoff?.kicker || "STAY WITH THE WORDS"}
          </div>

          <p className="jc-handoff-opening">
            {move.handoff?.opening}
          </p>

          {noticed.length > 0 && (
            <div className="jc-handoff-memory">
              <span>{move.handoff?.memoryLabel || "What caught your eye"}</span>
              <div>
                {noticed.slice(0, 8).map((word, index) => (
                  <strong key={word + index}>{word}</strong>
                ))}
              </div>
            </div>
          )}

          {verse && (
            <div className="jc-handoff-scripture">
              <span>{verse.reference}</span>
              <blockquote>
                “{renderVerseWithPhrase(verse.text, primaryPhrase)}”
              </blockquote>
            </div>
          )}

          <div className="jc-handoff-teacher">
            <div className="jc-handoff-teacher-head">
              <span>J</span>
              <div>
                <small>Jeremiah</small>
                <strong>{move.title}</strong>
              </div>
            </div>

            {move.handoff?.teacherBridge && (
              <p className="jc-handoff-bridge">{move.handoff.teacherBridge}</p>
            )}

            <div className="jc-handoff-teaching">
              {(move.teaching || []).map((paragraph, index) => (
                <p key={index}>{paragraph}</p>
              ))}
            </div>

            {move.focusPhrases?.length > 0 && (
              <div className="jc-handoff-focus">
                <span>Hold onto this</span>
                <strong>“{move.focusPhrases.join(" · ")}”</strong>
                {move.focusNote && <p>{move.focusNote}</p>}
              </div>
            )}
          </div>

          <button type="button" className="jc-encounter-next" onClick={onContinue}>
            {move.ctaLabel || "Continue"} <span>→</span>
          </button>
        </section>
      </main>
    </div>
  );
}

function EncounterThread({ encounterData }) {
  if (!encounterData) return null;

  const noticed = [
    ...(encounterData.primaryPhrases || []),
    ...(encounterData.bridgePhrases || []),
  ].slice(0, 4);

  if (!noticed.length) return null;

  return (
    <div className="jc-encounter-thread">
      <span>From your entrance</span>
      <p>
        You noticed{" "}
        <strong>{noticed.join(" · ")}</strong>
        . Jeremiah will keep that thread in view.
      </p>
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

  function handleEncounterComplete(encounterData) {
    if (!learningState || !currentMove) return;
    const next = advanceEncounterMove(learningState, currentMove, encounterData);
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
            encounterData: learningState.encounterData,
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
        onComplete={handleEncounterComplete}
        onExit={() => onNavigate(ROUTES.HOME)}
      />
    );
  }

  if (currentMove.handoff && learningState.encounterData) {
    return (
      <EncounterHandoff
        move={currentMove}
        encounterData={learningState.encounterData}
        onContinue={handleContinue}
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

          {["hear_the_shema", "oneness_first", "isaiah_exclusion", "teach_it_back"].includes(
            currentMove.id
          ) && (
            <EncounterThread encounterData={learningState.encounterData} />
          )}

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

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
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
  markLearningMilestones,
  saveLearningState,
  updateLearningExperience,
} from "../../core/classroom/learningEngine";
import { getClassroomContentByStandardId } from "../../core/classroom/content/classroomContentRegistry";
import { setBibleReaderIntent } from "../../core/bible/bibleReaderIntent";
import { askJeremiahTeacher } from "../../services/jeremiahTeacher";
import CurriculumLesson from "./CurriculumLesson";
import ShemaClassroom from "./ShemaClassroom";
import ShemaContinuation from "./ShemaContinuation";
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
  const [artifactIndex, setArtifactIndex] = useState(0);
  const [voiceIndex, setVoiceIndex] = useState(0);
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
  const artifactMoment = artifactMoments[artifactIndex] || null;
  const artifactSource = artifactMoment
    ? sources.find((item) => item.id === artifactMoment.sourceId)
    : null;
  const voiceMoment = sourceMoments[voiceIndex] || null;
  const voiceSource = voiceMoment
    ? sources.find((item) => item.id === voiceMoment.sourceId)
    : null;

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
            <div className="jc-threshold-cover">
              <section className="jc-threshold-reading-panel">
                <div className="jc-threshold-wordmark" aria-hidden="true">SHEMA</div>

                <div className="jc-threshold-overline">
                  <span>THE ONE TRUE GOD</span>
                  <i />
                  <small>OG.1.1.18</small>
                </div>

                <div className="jc-threshold-copy-block">
                  <div className="jc-threshold-index" aria-hidden="true">01</div>
                  <h1>{move.title}</h1>
                  <p>{encounter.opening}</p>
                </div>

                <div className="jc-threshold-route" aria-label="Learning route">
                  <div className="is-current">
                    <span>01</span>
                    <strong>Listen</strong>
                    <small>Meet the confession</small>
                  </div>
                  <div>
                    <span>02</span>
                    <strong>Compare</strong>
                    <small>Place Isaiah beside it</small>
                  </div>
                  <div>
                    <span>03</span>
                    <strong>Explain</strong>
                    <small>Build the doctrine</small>
                  </div>
                </div>

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

                <p className="jc-threshold-helper">
                  No quiz yet. First, hear what Scripture puts in front of you.
                </p>
              </section>

              <section className="jc-threshold-media-stage">
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
                      <div>
                        <strong>{videoSource.title}</strong>
                        <p>{videoSource.hook}</p>
                      </div>
                      <span className="jc-threshold-watch-note">Optional context · stays inside Jeremiah</span>
                    </div>
                  </div>
                )}

                {heroArtifact?.imageUrl && (
                  <button
                    type="button"
                    className="jc-threshold-artifact-float"
                    onClick={() => openSource(heroArtifact)}
                  >
                    <img src={heroArtifact.imageUrl} alt="" />
                    <span>
                      <small>Ancient witness</small>
                      <strong>Nash Papyrus</strong>
                      <em>See the physical text →</em>
                    </span>
                  </button>
                )}
              </section>
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

        {phase === "artifacts" && artifactMoment && artifactSource && (
          <section className="jc-encounter-scene jc-story-reel">
            <div className="jc-story-topbar">
              <div className="jc-continuity-thread is-compact">
                <span>Your thread</span>
                <strong>“{primaryPhrase?.text}” → “{bridgePhrase?.text}”</strong>
              </div>

              <div
                className="jc-story-progress"
                aria-label={"Artifact " + (artifactIndex + 1) + " of " + artifactMoments.length}
              >
                {artifactMoments.map((item, index) => (
                  <i key={item.id} className={index <= artifactIndex ? "is-active" : ""} />
                ))}
              </div>
            </div>

            <article className="jc-story-panel is-artifact">
              <div className="jc-story-media">
                <img src={artifactSource.imageUrl} alt={artifactSource.title} />
              </div>

              <div className="jc-story-copy">
                <div className="jc-story-kicker">{artifactMoment.eyebrow}</div>
                <h2>{artifactSource.title}</h2>
                <p className="jc-story-hook">{artifactMoment.prompt}</p>

                {artifactSource.quote && (
                  <blockquote>{artifactSource.quote}</blockquote>
                )}

                <div className="jc-story-meta">
                  <span>{artifactSource.provider}</span>
                  {artifactSource.date && <span>{artifactSource.date}</span>}
                </div>

                <button
                  type="button"
                  className="jc-source-detail-action"
                  onClick={() => openSource(artifactSource)}
                >
                  See the source in Jeremiah <span>→</span>
                </button>
              </div>
            </article>

            <div className="jc-story-actions">
              <button
                type="button"
                className="jc-story-back"
                onClick={() => setArtifactIndex((value) => Math.max(0, value - 1))}
                disabled={artifactIndex === 0}
              >
                ← Previous
              </button>

              {artifactIndex < artifactMoments.length - 1 ? (
                <button
                  type="button"
                  className="jc-encounter-next"
                  onClick={() => setArtifactIndex((value) => value + 1)}
                >
                  Next artifact <span>→</span>
                </button>
              ) : (
                <button
                  type="button"
                  className="jc-encounter-next"
                  onClick={() => setPhase("voices")}
                >
                  Hear how people carried these words <span>→</span>
                </button>
              )}
            </div>
          </section>
        )}

        {phase === "voices" && voiceMoment && voiceSource && (
          <section className="jc-encounter-scene jc-story-reel">
            <div className="jc-story-topbar">
              <div className="jc-continuity-thread is-compact">
                <span>Your thread</span>
                <strong>“{primaryPhrase?.text}” → “{bridgePhrase?.text}”</strong>
              </div>

              <div
                className="jc-story-progress"
                aria-label={"Source voice " + (voiceIndex + 1) + " of " + sourceMoments.length}
              >
                {sourceMoments.map((item, index) => (
                  <i key={item.id} className={index <= voiceIndex ? "is-active" : ""} />
                ))}
              </div>
            </div>

            <article className="jc-story-panel is-voice">
              <div className="jc-story-voice-rail">
                <span>{String(voiceIndex + 1).padStart(2, "0")}</span>
                <small>{voiceSource.provider}</small>
              </div>

              <div className="jc-story-copy">
                <div className="jc-story-kicker">{voiceMoment.label}</div>
                <h2>{voiceSource.title}</h2>
                <p className="jc-story-hook">{voiceMoment.text}</p>

                {voiceSource.quote && (
                  <blockquote>“{voiceSource.quote.replace(/^“|”$/g, "")}”</blockquote>
                )}

                <div className="jc-story-why">
                  <span>Why this is here</span>
                  <p>
                    This source adds historical context to the confession. It does not define the doctrine—the standard and Scripture do.
                  </p>
                </div>

                <button
                  type="button"
                  className="jc-source-detail-action"
                  onClick={() => openSource(voiceSource)}
                >
                  See the source in Jeremiah <span>→</span>
                </button>
              </div>
            </article>

            <div className="jc-story-actions">
              <button
                type="button"
                className="jc-story-back"
                onClick={() => setVoiceIndex((value) => Math.max(0, value - 1))}
                disabled={voiceIndex === 0}
              >
                ← Previous
              </button>

              {voiceIndex < sourceMoments.length - 1 ? (
                <button
                  type="button"
                  className="jc-encounter-next"
                  onClick={() => setVoiceIndex((value) => value + 1)}
                >
                  Next voice <span>→</span>
                </button>
              ) : (
                <button
                  type="button"
                  className="jc-encounter-next"
                  onClick={() => setPhase("destination")}
                >
                  Bring it back to the lesson <span>→</span>
                </button>
              )}
            </div>

            {voiceIndex === sourceMoments.length - 1 && (
              <div className="jc-source-shelf-wrap jc-story-library">
                <button
                  type="button"
                  className="jc-source-shelf-toggle"
                  onClick={() => setShowSourceShelf((value) => !value)}
                >
                  {showSourceShelf ? "Close source library" : "Want to explore deeper? Browse all sources"}
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
            )}
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
  ].slice(0, 2);
  const primaryPhrase = encounterData?.primaryPhrases?.[0] || "";
  const teaching = move.teaching || [];

  return (
    <div className="jc-reading-page">
      <header className="jc-reading-header">
        <button type="button" onClick={onExit} aria-label="Leave Classroom">←</button>
        <strong>The One True God</strong>
        <span />
      </header>

      <main className="jc-reading-shell">
        {noticed.length > 0 && (
          <p className="jc-reading-noticed">
            You noticed <strong>{noticed.join(" · ")}</strong>
          </p>
        )}

        {verse && (
          <section className="jc-reading-scripture">
            <span>{verse.reference}</span>
            <blockquote>
              “{renderVerseWithPhrase(verse.text, primaryPhrase)}”
            </blockquote>
          </section>
        )}

        <section className="jc-reading-teacher">
          <div className="jc-reading-teacher-head">
            <span>J</span>
            <div>
              <small>Jeremiah</small>
              <strong>{move.title}</strong>
            </div>
          </div>

          <div className="jc-reading-copy">
            {teaching.map((paragraph, index) => (
              <p key={index}>{paragraph}</p>
            ))}
          </div>
        </section>

        {move.focusPhrases?.length > 0 && (
          <p className="jc-reading-keyline">
            <span>Keep this with you</span>
            <strong>“{move.focusPhrases.join(" · ")}”</strong>
          </p>
        )}

        <button type="button" className="jc-reading-continue" onClick={onContinue}>
          {move.ctaLabel || "Continue"} <span>→</span>
        </button>
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
      <div>
        <span>Your thread</span>
        <small>Carried from the opening encounter</small>
      </div>
      <strong>{noticed.map((item) => "“" + item + "”").join("  →  ")}</strong>
    </div>
  );
}

function IsaiahPatternReveal({ move, encounterData, value, onChange, onContinue }) {
  const [revealed, setRevealed] = useState(false);
  const verses = move.scripture || [];
  const ready = value.trim().length >= 8;

  function highlightClaim(text = "") {
    const phrases = [
      "beside me there is no God",
      "there is none else",
      "there is no God beside me",
    ];

    let parts = [text];
    phrases.forEach((phrase) => {
      parts = parts.flatMap((part) => {
        if (typeof part !== "string" || !part.includes(phrase)) return [part];
        const split = part.split(phrase);
        return split.flatMap((segment, index) =>
          index < split.length - 1
            ? [segment, <mark key={phrase + index}>{phrase}</mark>]
            : [segment]
        );
      });
    });

    return parts;
  }

  return (
    <section className={"jc-pattern-scene " + (revealed ? "is-revealed" : "")}>
      <EncounterThread encounterData={encounterData} />

      <div className="jc-pattern-hero">
        <div>
          <span>WATCH THE CLAIM TIGHTEN</span>
          <h1>Isaiah does not merely repeat “one.” He closes the door on “another.”</h1>
        </div>
        <div className="jc-pattern-anchor">
          <small>Start with the confession</small>
          <strong>ONE LORD</strong>
          <em>Deuteronomy 6:4</em>
        </div>
      </div>

      <div className="jc-pattern-field">
        {verses.map((verse, index) => (
          <article key={verse.reference} className="jc-pattern-verse">
            <div className="jc-pattern-number">0{index + 1}</div>
            <div>
              <span>{verse.reference}</span>
              <blockquote>
                “{revealed ? highlightClaim(verse.text) : verse.text}”
              </blockquote>
            </div>
          </article>
        ))}

        {!revealed && (
          <button
            type="button"
            className="jc-pattern-trigger"
            onClick={() => setRevealed(true)}
          >
            <span>Bring the claims together</span>
            <i>→</i>
          </button>
        )}
      </div>

      {revealed && (
        <div className="jc-pattern-reveal">
          <div className="jc-pattern-chain" aria-label="Biblical pattern">
            <strong>ONE LORD</strong>
            <i>→</i>
            <strong>NONE ELSE</strong>
            <i>→</i>
            <strong>NO GOD BESIDE ME</strong>
          </div>

          <p className="jc-pattern-explanation">
            Isaiah takes the confession of one LORD and makes the boundary explicit: there is no other God existing beside Him.
          </p>

          <div className="jc-pattern-response">
            <div>
              <span>Now say the pattern in your own words</span>
              <p>{move.prompt}</p>
            </div>

            <textarea
              value={value}
              onChange={(event) => onChange(event.target.value)}
              placeholder="One or two sentences is enough..."
              rows={4}
            />

            <div className="jc-pattern-response-foot">
              <small>This is discovery, not a grade.</small>
              <button
                type="button"
                className="jc-primary"
                onClick={onContinue}
                disabled={!ready}
              >
                {move.ctaLabel || "Continue"} <span>→</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}

function PredictionReveal({ move, encounterData, onContinue }) {
  const interaction = move.interaction || {};
  const [selectedId, setSelectedId] = useState("");
  const [revealed, setRevealed] = useState(false);
  const selected = interaction.options?.find((item) => item.id === selectedId);
  const firstVerse = move.scripture?.[0];
  const revealVerse = move.scripture?.[1] || move.scripture?.[0];

  return (
    <section className="jc-interaction-scene jc-prediction">
      <EncounterThread encounterData={encounterData} />

      {firstVerse && (
        <div className="jc-prediction-memory">
          <span>What you already have</span>
          <blockquote>“{firstVerse.text}”</blockquote>
          <small>{firstVerse.reference}</small>
        </div>
      )}

      {!revealed ? (
        <>
          <div className="jc-prediction-intro">
            <span>Predict before the text opens</span>
            <h1>{interaction.prompt}</h1>
            <p>No grade here. Commit to what you expect the story to do.</p>
          </div>

          <div className="jc-prediction-options">
            {(interaction.options || []).map((option) => (
              <button
                type="button"
                key={option.id}
                className={selectedId === option.id ? "is-selected" : ""}
                onClick={() => setSelectedId(option.id)}
              >
                <strong>{option.label}</strong>
                <i aria-hidden="true">{selectedId === option.id ? "✓" : "→"}</i>
              </button>
            ))}
          </div>

          {selected && (
            <div className="jc-prediction-response">
              <p>{selected.response}</p>
              <button
                type="button"
                className="jc-primary"
                onClick={() => setRevealed(true)}
              >
                {interaction.revealLabel || "Reveal the text"} <span>→</span>
              </button>
            </div>
          )}
        </>
      ) : (
        <div className="jc-prediction-reveal">
          <div className="jc-reveal-label">THE TEXT OPENS</div>

          {revealVerse && (
            <div className="jc-reveal-scripture">
              <span>{revealVerse.reference}</span>
              <blockquote>“{revealVerse.text}”</blockquote>
            </div>
          )}

          <div className="jc-reveal-teaching">
            {(move.teaching || []).map((paragraph, index) => (
              <p key={index}>{paragraph}</p>
            ))}
          </div>

          {move.focusNote && (
            <div className="jc-reveal-focus">
              <span>Why that matters</span>
              <p>{move.focusNote}</p>
            </div>
          )}

          <button type="button" className="jc-primary" onClick={onContinue}>
            {move.ctaLabel || "Continue"} <span>→</span>
          </button>
        </div>
      )}
    </section>
  );
}

function EvidenceChain({ move, encounterData, onContinue }) {
  const interaction = move.interaction || {};
  const pieces = interaction.pieces || [];
  const [chain, setChain] = useState([]);
  const [checked, setChecked] = useState(false);

  const complete = chain.length === pieces.length;
  const correct =
    complete &&
    chain.every((id, index) => id === interaction.sequence?.[index]);

  function addPiece(id) {
    if (chain.includes(id) || checked) return;
    setChain((current) => [...current, id]);
  }

  function reset() {
    setChain([]);
    setChecked(false);
  }

  return (
    <section className="jc-interaction-scene jc-evidence-builder">
      <EncounterThread encounterData={encounterData} />

      <div className="jc-builder-intro">
        <span>Build it, don’t just read it</span>
        <h1>{interaction.prompt}</h1>
        <p>Tap the passages in the order the biblical testimony developed.</p>
      </div>

      <div className="jc-builder-stage">
        <div className="jc-builder-pool">
          {pieces.map((piece) => {
            const used = chain.includes(piece.id);
            return (
              <button
                type="button"
                key={piece.id}
                disabled={used || checked}
                className={used ? "is-used" : ""}
                onClick={() => addPiece(piece.id)}
              >
                <small>{piece.label}</small>
                <strong>{piece.short}</strong>
                <span>{piece.text}</span>
              </button>
            );
          })}
        </div>

        <div className="jc-builder-chain" aria-label="Your evidence chain">
          {[0, 1, 2].map((index) => {
            const piece = pieces.find((item) => item.id === chain[index]);
            return (
              <div key={index} className={piece ? "is-filled" : ""}>
                <i>{index + 1}</i>
                {piece ? (
                  <span>
                    <small>{piece.label}</small>
                    <strong>{piece.short}</strong>
                  </span>
                ) : (
                  <em>Choose the next piece</em>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {!checked && (
        <div className="jc-builder-actions">
          <button
            type="button"
            className="jc-encounter-ghost"
            onClick={reset}
            disabled={!chain.length}
          >
            Start over
          </button>
          <button
            type="button"
            className="jc-primary"
            onClick={() => setChecked(true)}
            disabled={!complete}
          >
            Test my chain <span>→</span>
          </button>
        </div>
      )}

      {checked && !correct && (
        <div className="jc-builder-result is-retry">
          <strong>Not quite.</strong>
          <p>The pieces are right; the sequence needs another look. Start with what Scripture establishes first.</p>
          <button type="button" className="jc-secondary-action" onClick={reset}>
            Rebuild the chain
          </button>
        </div>
      )}

      {checked && correct && (
        <div className="jc-builder-result is-success">
          <strong>Now you can see the structure.</strong>
          <p>{interaction.success}</p>

          <div className="jc-builder-final">
            {pieces.map((piece, index) => (
              <div key={piece.id}>
                <i>{index + 1}</i>
                <span>
                  <small>{piece.label}</small>
                  <strong>{piece.text}</strong>
                </span>
              </div>
            ))}
          </div>

          <button type="button" className="jc-primary" onClick={onContinue}>
            {move.ctaLabel || "Continue"} <span>→</span>
          </button>
        </div>
      )}
    </section>
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
    if (!currentMove || !learningState) return;
    const draft = learningState.experience?.drafts?.[currentMove.id] || {};
    setSelectedChoiceId(draft.selectedChoiceId || "");
    setResponseText(draft.responseText || "");
  }, [currentMove?.id]);

  useEffect(() => {
    if (currentMove?.type !== "complete" || learningState?.milestones?.complete) {
      return;
    }
    setLearningState((state) => markLearningMilestones(state, ["complete"]));
  }, [currentMove?.type, learningState?.milestones?.complete]);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" });
  }, [currentMove?.id]);

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
    let next = advanceUnscoredMove(learningState, currentMove);
    if (content.sourceStandard && currentMove.id === "scripture") next = markLearningMilestones(next, ["scripture"]);
    if (content.sourceStandard && currentMove.id === "sources") next = markLearningMilestones(next, ["evidence"]);
    setLearningState(next);
    clearInteraction();
  }

  function handleEncounterComplete(encounterData) {
    if (!learningState || !currentMove) return;
    const next = advanceEncounterMove(learningState, currentMove, encounterData);
    setLearningState(next);
    clearInteraction();
  }

  const handleShemaEpisodeProgress = useCallback((progressPatch = {}) => {
    setLearningState((state) => {
      if (!state) return state;

      let next = updateLearningExperience(state, {
        sceneIndex: progressPatch.sceneIndex,
        sceneId: progressPatch.sceneId,
        selections: progressPatch.selections || {},
        viewedSourceIds: progressPatch.viewedSourceIds || [],
      });

      next = markLearningMilestones(next, progressPatch.milestoneIds || []);
      return next;
    });
  }, []);

  function persistCurrentDraft(patch = {}) {
    if (!currentMove) return;
    setLearningState((state) =>
      updateLearningExperience(state, {
        drafts: {
          [currentMove.id]: {
            ...(state.experience?.drafts?.[currentMove.id] || {}),
            ...patch,
          },
        },
      })
    );
  }

  function handleSelectChoice(choiceId) {
    setSelectedChoiceId(choiceId);
    persistCurrentDraft({ selectedChoiceId: choiceId });
  }

  function handleResponseTextChange(text) {
    setResponseText(text);
    persistCurrentDraft({ responseText: text });
  }

  function handleShemaEpisodeComplete(encounterData) {
    setLearningState((state) => {
      if (!state) return state;

      const wasReviewing = state.experience?.reviewMode === true;
      let next = updateLearningExperience(state, {
        ...(encounterData.episodeExperience || {}),
        episodeComplete: true,
        reviewMode: false,
      });
      next = markLearningMilestones(next, ["started", "scripture", "evidence"]);

      return {
        ...next,
        currentMoveId: wasReviewing ? "complete" : "pressure_test",
        completedMoveIds: [
          ...new Set([
            ...(state.completedMoveIds || []),
            "arrival",
            "hear_the_shema",
            "oneness_first",
            "isaiah_exclusion",
            "mark12_bridge",
            "synthesis",
          ]),
        ],
        encounterData: {
          ...(state.encounterData || {}),
          ...encounterData,
          entryMode: "episode",
          completedAt: Date.now(),
        },
        lastUpdatedAt: Date.now(),
      };
    });
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

  function handleReviewShemaEpisode() {
    setLearningState((state) => ({
      ...updateLearningExperience(state, {
        sceneIndex: 1,
        sceneId: "confession",
        episodeComplete: false,
        reviewMode: true,
      }),
      currentMoveId: "complete",
      lastUpdatedAt: Date.now(),
    }));
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

  if (content.sourceStandard) {
    return <CurriculumLesson key={currentMove.id} content={content} move={currentMove} state={learningState} percent={progress} responseText={responseText} onResponseText={handleResponseTextChange} selectedChoiceId={selectedChoiceId} onSelectChoice={handleSelectChoice} ready={ready} teacherDecision={teacherDecision} isThinking={isThinking} errorMessage={errorMessage} onSubmit={handleSubmit} onContinue={handleContinue} onTeacherContinue={handleTeacherContinue} onNavigate={onNavigate} />;
  }

  const shemaEpisodeMove =
    content.standardId === "OG.1.1.18" && presetId === "direct"
      ? getInstructionalMove(content, "arrival")
      : null;

  const needsShemaEpisode =
    Boolean(shemaEpisodeMove) &&
    (
      learningState.experience?.reviewMode === true ||
      (
        learningState.experience?.episodeComplete !== true &&
        learningState.encounterData?.entryMode !== "episode"
      )
    );

  if (needsShemaEpisode) {
    return (
      <ShemaClassroom
        move={shemaEpisodeMove}
        initialExperience={learningState.experience}
        onProgress={handleShemaEpisodeProgress}
        onComplete={handleShemaEpisodeComplete}
        onOpenBible={(item) => {
          setBibleReaderIntent(item.reference, {
            translation: "kjv",
            returnRoute: ROUTES.CLASSROOM_LESSON,
            source: "classroom",
          });
          onNavigate(ROUTES.BIBLE_SUPPORT);
        }}
        onExit={() => onNavigate(ROUTES.CLASSROOM_STUDY)}
      />
    );
  }

  if (currentMove.type === "encounter") {
    return (
      <EncounterExperience
        move={currentMove}
        onComplete={handleEncounterComplete}
        onExit={() => onNavigate(ROUTES.CLASSROOM_STUDY)}
      />
    );
  }

  if (currentMove.handoff && learningState.encounterData) {
    return (
      <EncounterHandoff
        move={currentMove}
        encounterData={learningState.encounterData}
        onContinue={handleContinue}
        onExit={() => onNavigate(ROUTES.CLASSROOM_STUDY)}
      />
    );
  }

  const isUnscored = UNSCORED_TYPES.has(currentMove.type);

  const useShemaContinuation =
    content.standardId === "OG.1.1.18" &&
    presetId === "direct" &&
    learningState.encounterData?.entryMode === "episode" &&
    !["arrival", "hear_the_shema", "oneness_first", "isaiah_exclusion", "mark12_bridge", "synthesis"].includes(currentMove.id);

  if (useShemaContinuation) {
    return (
      <ShemaContinuation
        move={currentMove}
        encounterData={learningState.encounterData}
        selectedChoiceId={selectedChoiceId}
        onSelectChoice={handleSelectChoice}
        responseText={responseText}
        onResponseText={handleResponseTextChange}
        draft={learningState.experience?.drafts?.[currentMove.id] || {}}
        onDraftChange={persistCurrentDraft}
        teacherDecision={teacherDecision}
        isThinking={isThinking}
        errorMessage={errorMessage}
        ready={ready}
        onSubmit={handleSubmit}
        onContinue={handleContinue}
        onTeacherContinue={handleTeacherContinue}
        onExit={() => onNavigate(ROUTES.CLASSROOM_STUDY)}
        onHome={() => onNavigate(ROUTES.HOME)}
        onReview={handleReviewShemaEpisode}
      />
    );
  }

  return (
    <div className={"jc-page stage-" + currentMove.stageId}>
      <div className="jc-atmosphere" aria-hidden="true">
        <span className="jc-ambient jc-ambient-warm" />
        <span className="jc-ambient jc-ambient-cool" />
      </div>

      <header className="jc-header jc-classroom-bar">
        <button
          type="button"
          className="jc-classroom-back"
          onClick={() => onNavigate(ROUTES.HOME)}
          aria-label="Leave Classroom"
        >
          <span>←</span>
          <strong>Classroom</strong>
        </button>

        <div className="jc-classroom-progress" aria-label={progress + " percent complete"}>
          <small>{content.studyTitle}</small>
          <div><i style={{ width: progress + "%" }} /></div>
        </div>

        <button
          type="button"
          className="jc-classroom-more"
          onClick={() => setShowResetPrompt(true)}
          disabled={!canReset}
          aria-label="Classroom options"
        >
          •••
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
        {currentMove.id === "isaiah_exclusion" ? (
          <IsaiahPatternReveal
            move={currentMove}
            encounterData={learningState.encounterData}
            value={reflectionText}
            onChange={setReflectionText}
            onContinue={handleContinue}
          />
        ) : currentMove.interaction?.type === "prediction_reveal" ? (
          <PredictionReveal
            move={currentMove}
            encounterData={learningState.encounterData}
            onContinue={handleContinue}
          />
        ) : currentMove.interaction?.type === "evidence_chain" ? (
          <EvidenceChain
            move={currentMove}
            encounterData={learningState.encounterData}
            onContinue={handleContinue}
          />
        ) : (
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
        )}
      </main>
    </div>
  );
}

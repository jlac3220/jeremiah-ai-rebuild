import { useEffect, useMemo, useState } from "react";
import "./ShemaClassroom.css";

function DeepDiveSheet({ item, onClose, onOpenBible }) {
  if (!item) return null;

  return (
    <div className="sc-sheet-backdrop" role="presentation" onClick={onClose}>
      <aside
        className="sc-sheet"
        role="dialog"
        aria-modal="true"
        aria-label={item.title || item.reference || "Classroom detail"}
        onClick={(event) => event.stopPropagation()}
      >
        <div className="sc-sheet-handle" aria-hidden="true" />
        <button type="button" className="sc-sheet-close" onClick={onClose} aria-label="Close">×</button>

        {item.kind === "scripture" ? (
          <>
            <span className="sc-sheet-label">Scripture</span>
            <h2>{item.reference}</h2>
            <blockquote>“{item.text}”</blockquote>
            {item.note && <p>{item.note}</p>}
            {onOpenBible && (
              <button
                type="button"
                className="sc-sheet-bible"
                onClick={() => onOpenBible(item)}
              >
                Read full chapter <span>→</span>
              </button>
            )}
          </>
        ) : (
          <>
            <span className="sc-sheet-label">{item.provider || "Source"}</span>
            <h2>{item.title}</h2>
            {item.imageUrl && <img className="sc-sheet-image" src={item.imageUrl} alt={item.title} />}
            {item.summary && <p>{item.summary}</p>}
            {!item.summary && item.hook && <p>{item.hook}</p>}
            {item.purpose && (
              <div className="sc-sheet-note">
                <strong>Why it matters here</strong>
                <p>{item.purpose}</p>
              </div>
            )}
            {item.attribution && <small>{item.attribution}</small>}
          </>
        )}
      </aside>
    </div>
  );
}

function VerseRef({ verse, onOpen }) {
  if (!verse) return null;
  return (
    <button
      type="button"
      className="sc-verse-ref"
      onClick={() => onOpen({ ...verse, kind: "scripture" })}
    >
      {verse.reference} <span>↗</span>
    </button>
  );
}

function videoUrl(source) {
  if (!source?.embedUrl) return "";
  try {
    const url = new URL(source.embedUrl);
    url.searchParams.set("rel", "0");
    url.searchParams.set("playsinline", "1");
    if (typeof window !== "undefined") {
      url.searchParams.set("origin", window.location.origin);
      url.searchParams.set("widget_referrer", window.location.origin);
    }
    return url.toString();
  } catch {
    return source.embedUrl;
  }
}

export default function ShemaClassroom({
  move,
  initialExperience,
  onProgress,
  onComplete,
  onOpenBible,
  onExit,
}) {
  const encounter = move.encounter || {};
  const sources = encounter.curatedSources || [];
  const video = sources.find((source) => source.id === "bibleproject-shema-listen");
  const artifact = sources.find((source) => source.id === "nash-papyrus");
  const expandedReading = encounter.expandedReading || [];
  const savedSelections = initialExperience?.selections || {};
  const savedSceneIndex = Number.isInteger(initialExperience?.sceneIndex)
    ? initialExperience.sceneIndex
    : 0;

  const [scene, setScene] = useState(Math.max(0, Math.min(savedSceneIndex, 5)));
  const [primary, setPrimary] = useState(savedSelections.primary || "");
  const [bridge, setBridge] = useState(savedSelections.bridge || "");
  const [prediction, setPrediction] = useState(savedSelections.prediction || "");
  const [detail, setDetail] = useState(null);

  const primaryVerse = encounter.primaryVerse;
  const bridgeVerse = encounter.bridgeVerse;
  const primaryOptions = encounter.primaryPhraseOptions || [];
  const bridgeOptions = encounter.bridgePhraseOptions || [];

  const scenes = useMemo(() => ["hear", "confession", "compare", "witness", "tension", "thread"], []);
  const sceneName = scenes[scene] || "hear";
  const progress = ((scene + 1) / scenes.length) * 100;

  useEffect(() => {
    const milestoneIds = ["started"];
    if (scene >= 1 || primary) milestoneIds.push("scripture");
    if (scene >= 2 || bridge) milestoneIds.push("evidence");

    onProgress?.({
      sceneIndex: scene,
      sceneId: sceneName,
      selections: {
        primary,
        bridge,
        prediction,
      },
      milestoneIds,
    });
  }, [scene, sceneName, primary, bridge, prediction, onProgress]);

  function openDetail(item) {
    setDetail(item);
    if (item?.id) {
      onProgress?.({
        sceneIndex: scene,
        sceneId: sceneName,
        selections: { primary, bridge, prediction },
        viewedSourceIds: [item.id],
        milestoneIds: ["started"],
      });
    }
  }

  function next() {
    setScene((value) => Math.min(value + 1, scenes.length - 1));
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function finish() {
    onComplete({
      entryMode: "episode",
      primaryPhrases: primary ? [primary] : [],
      bridgePhrases: bridge ? [bridge] : [],
      viewedSourceIds: artifact ? [artifact.id] : [],
      sourceShelfOpened: false,
      prediction,
      episodeExperience: {
        sceneIndex: scene,
        sceneId: sceneName,
        selections: { primary, bridge, prediction },
        viewedSourceIds: artifact ? [artifact.id] : [],
        episodeComplete: true,
      },
    });
  }

  return (
    <div className="sc-page">
      <header className="sc-topbar">
        <button type="button" className="sc-back" onClick={onExit} aria-label="Leave Classroom">←</button>
        <div className="sc-progress"><i style={{ width: progress + "%" }} /></div>
        <button type="button" className="sc-more" aria-label="More options">•••</button>
      </header>

      <main className={"sc-shell scene-" + sceneName}>
        {sceneName === "hear" && (
          <section className="sc-scene sc-hear">
            <div className="sc-word">HEAR.</div>
            <p>Israel's confession begins with a command.</p>

            {video && (
              <div className="sc-video">
                <iframe
                  src={videoUrl(video)}
                  title={video.title}
                  referrerPolicy="strict-origin-when-cross-origin"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                />
              </div>
            )}

            <button type="button" className="sc-action" onClick={next}>
              Read the confession <span>→</span>
            </button>
          </section>
        )}

        {sceneName === "confession" && (
          <section className="sc-scene sc-confession">
            <VerseRef verse={primaryVerse} onOpen={openDetail} />
            <blockquote>“{primaryVerse?.text}”</blockquote>
            <p className="sc-prompt">Which phrase carries the confession?</p>

            <div className="sc-choices">
              {primaryOptions.map((option) => (
                <button
                  type="button"
                  key={option.id}
                  className={primary === option.text ? "is-selected" : ""}
                  onClick={() => setPrimary(option.text)}
                >
                  {option.text}
                </button>
              ))}
            </div>

            <button type="button" className="sc-action" onClick={next} disabled={!primary}>
              Carry it forward <span>→</span>
            </button>
          </section>
        )}

        {sceneName === "compare" && (
          <section className="sc-scene sc-compare">
            <p className="sc-threadline"><span>{primary}</span></p>
            <h1>Now place Isaiah beside it.</h1>

            <div className="sc-verses">
              <div>
                <VerseRef verse={primaryVerse} onOpen={openDetail} />
                <p>{primaryVerse?.text}</p>
              </div>
              <div>
                <VerseRef verse={bridgeVerse} onOpen={openDetail} />
                <p>{bridgeVerse?.text}</p>
              </div>
            </div>

            <p className="sc-prompt">What phrase makes the boundary unmistakable?</p>

            <div className="sc-choices">
              {bridgeOptions.map((option) => (
                <button
                  type="button"
                  key={option.id}
                  className={bridge === option.text ? "is-selected" : ""}
                  onClick={() => setBridge(option.text)}
                >
                  {option.text}
                </button>
              ))}
            </div>

            <button type="button" className="sc-action" onClick={next} disabled={!bridge}>
              See the witness <span>→</span>
            </button>
          </section>
        )}

        {sceneName === "witness" && artifact && (
          <section className="sc-scene sc-witness">
            <button type="button" className="sc-artifact" onClick={() => openDetail(artifact)}>
              <img src={artifact.imageUrl} alt={artifact.title} />
              <span>Tap to inspect</span>
            </button>
            <div className="sc-witness-copy">
              <span>Ancient witness</span>
              <h1>{artifact.title}</h1>
              <p>{artifact.hook}</p>
              <small>{artifact.attribution}</small>
              <button type="button" className="sc-action" onClick={next}>
                Continue <span>→</span>
              </button>
            </div>
          </section>
        )}

        {sceneName === "tension" && (
          <section className="sc-scene sc-tension">
            <p className="sc-threadline"><span>{primary}</span><i>→</i><span>{bridge}</span></p>
            <h1>Centuries later, Jesus is asked for the first commandment.</h1>
            <p>What do you think He does with Israel's confession?</p>

            <div className="sc-prediction">
              <button
                type="button"
                className={prediction === "new" ? "is-selected" : ""}
                onClick={() => setPrediction("new")}
              >
                He starts with something new
              </button>
              <button
                type="button"
                className={prediction === "shema" ? "is-selected" : ""}
                onClick={() => setPrediction("shema")}
              >
                He repeats the Shema
              </button>
            </div>

            {prediction && (
              <div className="sc-reveal">
                <button
                  type="button"
                  className="sc-reveal-ref"
                  onClick={() => openDetail({
                    kind: "scripture",
                    reference: "Mark 12:29",
                    text: "The first of all the commandments is, Hear, O Israel; The Lord our God is one Lord.",
                    note: "Jesus repeats the Shema as the first commandment."
                  })}
                >
                  Mark 12:29 <span>↗</span>
                </button>
                <blockquote>“The first of all the commandments is, Hear, O Israel; The Lord our God is one Lord.”</blockquote>
              </div>
            )}

            <button type="button" className="sc-action" onClick={next} disabled={!prediction}>
              Put the pieces together <span>→</span>
            </button>
          </section>
        )}

        {sceneName === "thread" && (
          <section className="sc-scene sc-thread">
            <span className="sc-kicker">The biblical thread</span>
            <div className="sc-chain">
              <strong>{primary || "one LORD"}</strong>
              <i>→</i>
              <strong>{bridge || "none else"}</strong>
              <i>→</i>
              <strong>Jesus repeats it</strong>
            </div>

            <div className="sc-teacher">
              <span>J</span>
              <div>
                <strong>Jeremiah</strong>
                <p>The confession begins with one LORD, the prophets explicitly rule out another God beside Him, and Jesus carries that same confession forward.</p>
              </div>
            </div>

            {expandedReading.length > 0 && (
              <div className="sc-related-reading">
                <span>Optional · go deeper</span>
                {expandedReading.map((verse) => (
                  <button
                    type="button"
                    key={verse.id || verse.reference}
                    onClick={() => openDetail({ ...verse, kind: "scripture" })}
                  >
                    <strong>{verse.reference}</strong>
                    <small>{verse.label || "Read related Scripture"}</small>
                    <i>↗</i>
                  </button>
                ))}
              </div>
            )}

            <button type="button" className="sc-action" onClick={finish}>
              Continue the lesson <span>→</span>
            </button>
          </section>
        )}
      </main>

      <DeepDiveSheet item={detail} onClose={() => setDetail(null)} onOpenBible={onOpenBible} />
    </div>
  );
}

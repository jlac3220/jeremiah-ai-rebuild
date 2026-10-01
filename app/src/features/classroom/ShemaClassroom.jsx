import { useMemo, useState } from "react";
import "./ShemaClassroom.css";

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

export default function ShemaClassroom({ move, onComplete, onExit }) {
  const encounter = move.encounter || {};
  const sources = encounter.curatedSources || [];
  const video = sources.find((source) => source.id === "bibleproject-shema-listen");
  const artifact = sources.find((source) => source.id === "nash-papyrus");

  const [scene, setScene] = useState(0);
  const [primary, setPrimary] = useState("");
  const [bridge, setBridge] = useState("");
  const [prediction, setPrediction] = useState("");

  const primaryVerse = encounter.primaryVerse;
  const bridgeVerse = encounter.bridgeVerse;
  const primaryOptions = encounter.primaryPhraseOptions || [];
  const bridgeOptions = encounter.bridgePhraseOptions || [];

  const scenes = useMemo(() => ["hear", "confession", "compare", "witness", "tension", "thread"], []);
  const sceneName = scenes[scene] || "hear";
  const progress = ((scene + 1) / scenes.length) * 100;

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
            <span className="sc-reference">{primaryVerse?.reference}</span>
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
                <small>{primaryVerse?.reference}</small>
                <p>{primaryVerse?.text}</p>
              </div>
              <div>
                <small>{bridgeVerse?.reference}</small>
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
            <div className="sc-artifact">
              <img src={artifact.imageUrl} alt={artifact.title} />
            </div>
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
                <span>Mark 12:29</span>
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

            <button type="button" className="sc-action" onClick={finish}>
              Continue the lesson <span>→</span>
            </button>
          </section>
        )}
      </main>
    </div>
  );
}

import { useState } from "react";
import "./ShemaMediaActivities.css";

export function ShemaListeningActivity({ activity }) {
  const [selected, setSelected] = useState(0);
  if (!activity?.steps?.length) return null;
  const current = activity.steps[selected] || activity.steps[0];
  return (
    <aside className="sc-enrichment sc-listening" aria-label="Explore the meaning of Shema">
      <div className="sc-enrichment-heading">
        <span className="sc-enrichment-eyebrow">Explore the word · optional</span>
        <h2>{activity.title}</h2>
        <p>{activity.introduction}</p>
      </div>
      <div className="sc-listening-steps" role="group" aria-label="Three parts of listening">
        {activity.steps.map((step, index) => (
          <button
            key={step.id}
            type="button"
            aria-pressed={selected === index}
            className={selected === index ? "is-active" : ""}
            onClick={() => setSelected(index)}
          >
            <small>{String(index + 1).padStart(2, "0")}</small>
            <strong>{step.label}</strong>
          </button>
        ))}
      </div>
      <div className="sc-enrichment-explanation" aria-live="polite" aria-atomic="true">
        <strong>{current.label}</strong>
        <p>{current.explanation}</p>
      </div>
      <p className="sc-enrichment-credit">{activity.sourceNote}</p>
    </aside>
  );
}

export function LordWordAnnotation({ verseText, activity }) {
  const [selectedIndex, setSelectedIndex] = useState(-1);
  if (!verseText) return null;
  const segments = verseText.split(/(LORD)/g);
  let wordNumber = 0;
  return (
    <div className="sc-word-activity" aria-label="Read and explore Deuteronomy 6:4">
      <blockquote className="sc-annotated-verse">
        <span aria-hidden="true">“</span>
        {segments.map((segment, index) => {
          if (segment !== "LORD") return <span key={index}>{segment}</span>;
          const occurrence = wordNumber++;
          return (
            <button
              type="button"
              key={index}
              className="sc-lord-word"
              aria-label={"Explain LORD, occurrence " + (occurrence + 1)}
              aria-pressed={selectedIndex === occurrence}
              onClick={() => setSelectedIndex(occurrence === selectedIndex ? -1 : occurrence)}
            >
              {segment}
            </button>
          );
        })}
        <span aria-hidden="true">”</span>
      </blockquote>
      {activity && (
        <>
          <p className="sc-word-hint">{activity.invitation}</p>
          {selectedIndex !== -1 && (
            <div className="sc-word-note" aria-live="polite">
              <span className="sc-enrichment-eyebrow">Word insight · optional</span>
              <strong>{activity.title}</strong>
              <p>{activity.explanation}</p>
              <p>{activity.returnToVerse}</p>
              <small>{activity.sourceNote}</small>
            </div>
          )}
        </>
      )}
    </div>
  );
}

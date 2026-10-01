import { useEffect, useRef } from "react";
import ScripturePassage from "./ScripturePassage";
import PosterViewer from "./PosterViewer";

export default function DeepDiveSheet({ item, onClose, onOpenBible }) {
  const panel = useRef(null);
  useEffect(() => {
    if (!item) return;
    const previous = document.activeElement;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    panel.current?.querySelector("button")?.focus();
    function keydown(event) {
      if (event.key === "Escape") { event.preventDefault(); onClose(); }
      if (event.key !== "Tab") return;
      const targets = Array.from(panel.current?.querySelectorAll('button, a[href], input, select, textarea, [tabindex="0"]') || []).filter((node) => !node.disabled);
      const first = targets[0]; const last = targets.at(-1);
      if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last?.focus(); }
      else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first?.focus(); }
    }
    document.addEventListener("keydown", keydown);
    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", keydown);
      previous?.focus();
    };
  }, [item, onClose]);
  if (!item) return null;

  return (
    <div className="sc-sheet-backdrop" role="presentation" onClick={onClose}>
      <aside
        ref={panel}
        className={item.kind === "poster" ? "sc-sheet sc-sheet-poster" : "sc-sheet"}
        role="dialog"
        aria-modal="true"
        aria-label={item.title || item.reference || "Classroom detail"}
        onClick={(event) => event.stopPropagation()}
      >
        <div className="sc-sheet-handle" aria-hidden="true" />
        <button type="button" className="sc-sheet-close" onClick={onClose} aria-label="Close">×</button>

        {item.kind === "scripture" ? (
          <ScripturePassage key={item.reference} item={item} onOpenBible={onOpenBible} />
        ) : item.kind === "poster" ? (
          <PosterViewer key={item.imageUrl} item={item} />
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


import { useEffect, useState } from 'react';
import { findBibleBook, loadBibleChapter } from '../../core/bible/bibleCatalog';
import { parseBibleReference } from '../../core/bible/bibleReaderIntent';

export default function ScripturePassage({ item, onOpenBible }) {
  const [chapter, setChapter] = useState(null);
  const [error, setError] = useState('');
  const [context, setContext] = useState(false);
  const [retry, setRetry] = useState(0);
  const parsed = parseBibleReference(item.reference);
  useEffect(() => {
    let active = true;
    const reference = parseBibleReference(item.reference);
    const request = reference
      ? loadBibleChapter('kjv', findBibleBook(reference.book), reference.chapter)
      : Promise.reject(new Error('Invalid passage reference'));
    request.then((value) => {
      if (active) setChapter(value);
    }).catch(() => {
      if (active) setError('The passage could not load. Try again when your connection is ready.');
    });
    return () => { active = false; };
  }, [item.reference, retry]);
  const verses = chapter?.verses || [];
  const verseNumber = parsed?.verse;
  const endVerse = parsed?.endVerse || verseNumber;
  const selected = verseNumber ? verses.filter((v) => v.verse >= verseNumber && v.verse <= endVerse) : verses;
  const visible = context && verseNumber
    ? verses.filter((v) => v.verse >= verseNumber - 2 && v.verse <= endVerse + 2)
    : selected;
  return <>
    <span className="sc-sheet-label">Scripture · KJV</span>
    <h2>{item.reference}</h2>
    <div className="sc-passage" aria-live="polite" aria-busy={!chapter && !error}>
      {!chapter && !error && <p className="sc-passage-status">Opening the passage…</p>}
      {error && <div className="sc-passage-status"><p>{error}</p><button type="button" onClick={() => { setError(''); setChapter(null); setRetry((v) => v + 1); }}>Try again</button></div>}
      {chapter && visible.length === 0 && <p>This verse is not available in the loaded chapter.</p>}
      {visible.map((verse) => <p key={verse.verse} className={verse.verse >= verseNumber && verse.verse <= endVerse ? 'sc-passage-focus' : 'sc-passage-context'}><sup>{verse.verse}</sup>{verse.text}</p>)}
    </div>
    {chapter && verseNumber && <button type="button" className="sc-context-toggle" aria-expanded={context} onClick={() => setContext((v) => !v)}>{context ? 'Focus on this passage' : 'Read surrounding verses'}</button>}
    {item.note && <div className="sc-sheet-note"><strong>In this lesson</strong><p>{item.note}</p></div>}
    {onOpenBible && <button type="button" className="sc-sheet-bible" onClick={() => onOpenBible(item)}>Read full chapter <span>→</span></button>}
    <small className="sc-passage-source">King James Version · eBible.org</small>
  </>;
}

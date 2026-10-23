import { useCallback, useEffect, useRef, useState } from 'react';

// Browser-native narration keeps Scripture reading available without network calls,
// credentials, or an external audio service. Narration is always opt-in.
function getAmericanVoices(synth) {
 return synth.getVoices().filter(voice => /^en[-_]US$/i.test(voice.lang));
}
function chooseVoice(synth, preferredName) {
 const american = getAmericanVoices(synth);
 if (preferredName && preferredName !== 'auto') {
  const selected = american.find(voice => voice.name === preferredName);
  if (selected) return selected;
 }
 // Prefer a resonant, American English male narrator if installed.
 // Browser/OS voices differ, so a particular sound cannot be guaranteed.
 const score = voice => {
  const name = voice.name;
  return (/(?:^|\b)(guy|david|andrew|christopher|mark|eric|aaron|josh|fred|alex)(?:\b|$)/i.test(name) ? 30 : 0)
   + (/\bmale\b/i.test(name) ? 20 : 0)
   + (/natural|neural|premium|enhanced/i.test(name) ? 8 : 0)
   + (voice.localService ? 1 : 0);
 };
 return american.slice().sort((a,b) => score(b)-score(a))[0] || null;
}

export default function useLessonNarration({ text, key: sceneKey }) {
 const [enabled, setEnabled] = useState(false);
 const [supported, setSupported] = useState(() =>
  typeof window !== 'undefined' && 'speechSynthesis' in window && 'SpeechSynthesisUtterance' in window
 );
 const [speaking, setSpeaking] = useState(false);
 const [voiceName, setVoiceName] = useState('auto');
 const [voiceOptions, setVoiceOptions] = useState([]);
 useEffect(() => {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;
  const synth = window.speechSynthesis;
  const syncVoices = () => setVoiceOptions(getAmericanVoices(synth).map(voice=>({name:voice.name,label:voice.name})));
  syncVoices();
  synth.addEventListener?.('voiceschanged',syncVoices);
  return () => synth.removeEventListener?.('voiceschanged',syncVoices);
 }, []);
 const activeRef = useRef(null);
 const lastAutoSceneRef = useRef(null);

 const stop = useCallback(() => {
  activeRef.current = null;
  if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
   window.speechSynthesis.cancel();
  }
  setSpeaking(false);
 }, []);

 const speak = useCallback((words) => {
  if (!words || typeof window === 'undefined' || !('speechSynthesis' in window) || !('SpeechSynthesisUtterance' in window)) {
   setSupported(false);
   return false;
  }
  const synth = window.speechSynthesis;
  activeRef.current = null;
  synth.cancel();
  const utterance = new window.SpeechSynthesisUtterance(words);
  const voice = chooseVoice(synth, voiceName);
  if (voice) utterance.voice = voice;
  // Force en-US synthesis when no explicit US voice is installed.
  // Never deliberately substitute an Australian or British voice.
  utterance.lang = 'en-US';
  utterance.rate = 0.88;
  utterance.pitch = 0.85;
  utterance.volume = 1;
  activeRef.current = utterance;
  utterance.onstart = () => {
   if (activeRef.current === utterance) setSpeaking(true);
  };
  utterance.onend = () => {
   if (activeRef.current === utterance) {
    activeRef.current = null;
    setSpeaking(false);
   }
  };
  utterance.onerror = () => {
   if (activeRef.current === utterance) {
    activeRef.current = null;
    setSpeaking(false);
   }
  };
  try {
   synth.speak(utterance);
   return true;
  } catch {
   activeRef.current = null;
   setSpeaking(false);
   return false;
  }
 }, [voiceName]);

 const toggle = useCallback(() => {
  if (enabled) {
   stop();
   setEnabled(false);
   lastAutoSceneRef.current = null;
  } else {
   if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
    setSupported(false);
    return;
   }
   setEnabled(true);
   if (text) {
    // Start directly from the user's click: browsers may block non-gesture speech.
    lastAutoSceneRef.current = sceneKey;
    speak(text);
   }
  }
 }, [enabled, sceneKey, speak, stop, text]);

 useEffect(() => {
  if (!enabled || !text) {
   stop();
   return;
  }
  if (lastAutoSceneRef.current !== sceneKey) {
   lastAutoSceneRef.current = sceneKey;
   speak(text);
  }
 }, [enabled, text, sceneKey, speak, stop]);

 useEffect(() => {
  const pauseWhenHidden = () => {
   if (document.hidden) stop();
  };
  if (typeof document !== 'undefined') document.addEventListener('visibilitychange', pauseWhenHidden);
  return () => {
   if (typeof document !== 'undefined') document.removeEventListener('visibilitychange', pauseWhenHidden);
   if (typeof window !== 'undefined' && 'speechSynthesis' in window) window.speechSynthesis.cancel();
   activeRef.current = null;
  };
 }, [stop]);

 return { enabled, supported, speaking, toggle, speak, stop, voiceName, voiceOptions, chooseVoice: setVoiceName };
}

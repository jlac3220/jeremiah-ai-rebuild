import { useCallback, useEffect, useRef, useState } from 'react';

// Browser-native narration keeps Scripture reading available without network calls,
// credentials, or an external audio service. Narration is always opt-in.
function chooseVoice(synth) {
 const voices = synth.getVoices().filter(voice => /^en(-|_)/i.test(voice.lang));
 return voices.find(voice => /natural|neural/i.test(voice.name))
  || voices.find(voice => /Microsoft (Aria|Guy|Jenny|Ryan|Sonia)|Google US English|Samantha/i.test(voice.name))
  || voices.find(voice => /^en-US$/i.test(voice.lang))
  || voices[0] || null;
}

export default function useLessonNarration({ text, key: sceneKey }) {
 const [enabled, setEnabled] = useState(false);
 const [supported, setSupported] = useState(() =>
  typeof window !== 'undefined' && 'speechSynthesis' in window && 'SpeechSynthesisUtterance' in window
 );
 const [speaking, setSpeaking] = useState(false);
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
  const voice = chooseVoice(synth);
  if (voice) utterance.voice = voice;
  utterance.lang = voice?.lang || 'en-US';
  utterance.rate = 0.87;
  utterance.pitch = 0.94;
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
 }, []);

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

 return { enabled, supported, speaking, toggle, speak, stop };
}

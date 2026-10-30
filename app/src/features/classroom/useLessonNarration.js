import { useCallback, useEffect, useRef, useState } from 'react';

// A fixed, server-produced MP3. No OS or device speech voices.
const urlFor = words => '/api/jeremiah/narration?text=' + encodeURIComponent(words);

export default function useLessonNarration({ text, key: sceneKey }) {
 const [enabled, setEnabled] = useState(false);
 const [supported, setSupported] = useState(() => typeof window !== 'undefined' && typeof window.Audio === 'function');
 const [speaking, setSpeaking] = useState(false);
 const [error, setError] = useState('');
 const audioRef = useRef(null);
 const lastSceneRef = useRef(null);

 const stop = useCallback(() => {
  const audio = audioRef.current;
  audioRef.current = null;
  if (audio) {
   audio.onplaying = null;
   audio.onended = null;
   audio.onerror = null;
   audio.pause();
   audio.removeAttribute('src');
  }
  setSpeaking(false);
 }, []);

 const speak = useCallback((words) => {
  if (!words || typeof window === 'undefined' || typeof window.Audio !== 'function') {
   setSupported(false);
   return false;
  }
  stop();
  setError('');
  const audio = new window.Audio(urlFor(words));
  audio.preload = 'auto';
  audioRef.current = audio;
  audio.onplaying = () => { if (audioRef.current === audio) setSpeaking(true); };
  audio.onended = () => {
   if (audioRef.current === audio) {
    audioRef.current = null;
    setSpeaking(false);
   }
  };
  audio.onerror = () => {
   if (audioRef.current === audio) {
    audioRef.current = null;
    setSpeaking(false);
    setError('Jeremiah narration is unavailable. Check the server voice service.');
   }
  };
  // A direct user tap can start playback on iPhone; autoplay on scene
  // transitions may be blocked until the user taps Replay.
  audio.play()?.catch(e => {
   if (audioRef.current !== audio) return;
   setSpeaking(false);
   if (e?.name === 'NotAllowedError') setError('Tap Replay to hear this moment on your device.');
   else if (e?.name !== 'AbortError') setError('Jeremiah narration could not play. Try Replay.');
  });
  return true;
 }, [stop]);

 const toggle = useCallback(() => {
  if (enabled) {
   stop();
   setEnabled(false);
   setError('');
   lastSceneRef.current = null;
  } else {
   if (typeof window === 'undefined' || typeof window.Audio !== 'function') {
    setSupported(false);
    return;
   }
   setEnabled(true);
   if (text) {
    lastSceneRef.current = sceneKey;
    speak(text);
   }
  }
 }, [enabled, sceneKey, speak, stop, text]);

 useEffect(() => {
  if (!enabled || !text) {
   stop();
   return;
  }
  if (lastSceneRef.current !== sceneKey) {
   lastSceneRef.current = sceneKey;
   speak(text);
  }
 }, [enabled, text, sceneKey, speak, stop]);

 useEffect(() => {
  const pauseWhenHidden = () => { if (document.hidden) stop(); };
  if (typeof document !== 'undefined') document.addEventListener('visibilitychange', pauseWhenHidden);
  return () => {
   if (typeof document !== 'undefined') document.removeEventListener('visibilitychange', pauseWhenHidden);
   const audio = audioRef.current;
   audioRef.current = null;
   if (audio) {
    audio.onplaying = null;
    audio.onended = null;
    audio.onerror = null;
    audio.pause();
    audio.removeAttribute('src');
   }
  };
 }, [stop]);

 return { enabled, supported, speaking, error, toggle, speak, stop };
}

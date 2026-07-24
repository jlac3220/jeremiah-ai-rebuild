// src/AskPage.jsx - Jeremiah — Ask Jeremiah (chat only)
import React, { useState, useRef, useEffect } from "react";
import { supabase } from "./supabaseClient";
import { theme } from "./theme";

import ChatInput from "./components/ask/ChatInput";
import MessageBubble from "./components/ask/MessageBubble";
import ShimmerLoader from "./components/ask/ShimmerLoader";
import QuickStartTips from "./components/ask/QuickStartTips";
import { sanitizeForClaude, generateTitle } from "./utils/askUtils";

const { colors, gradients } = theme || {};

// SECURITY: Never hardcode a real API key here — it ships straight into the
// browser bundle and anyone can read it from dev tools/network tab. Long-term,
// these calls should go through a backend/serverless proxy that holds the key
// server-side instead of calling api.anthropic.com directly from the client.
const ANTHROPIC_API_KEY = process.env.REACT_APP_ANTHROPIC_API_KEY || "";
const USE_ANTHROPIC = !!ANTHROPIC_API_KEY;

// Current Claude model (Sonnet 5).
const CLAUDE_MODEL = "claude-sonnet-5";

// Sonnet 5 uses adaptive thinking by default, so the API can return a
// "thinking" content block before the "text" block. Never assume content[0]
// is the text — find the actual text block wherever it lands.
function extractText(data) {
  const blocks = data?.content || [];
  const textBlock = blocks.find((b) => b.type === "text");
  return textBlock ? textBlock.text : "";
}

// ============ CLAUDE API (open chat only) ============
async function askClaude(question, conversationHistory, profileRole) {
  if (!ANTHROPIC_API_KEY) return null;
  const role = (profileRole || "Adult").toLowerCase();

  const ageGuard = role === "child"
    ? `\n\nUSER AGE: This is a CHILD. You are their Sunday school teacher and you love them dearly.\n\nRULES FOR CHILDREN — NO EXCEPTIONS:\n- Only discuss Bible stories, Jesus, prayer, being kind, heaven, and simple faith topics.\n- If ANYTHING dark, scary, violent, inappropriate, or confusing comes up — respond with exactly this every time: "That's something to talk to your parent or pastor about. Want to hear something cool from the Bible instead?"\n- Do not say why you won't answer. Just redirect warmly every time.`
    : role === "teen"
    ? `\n\nUSER AGE: This is a TEEN. Keep responses grounded and real. If anything dark, harmful, or dangerous comes up — speak one word of truth from Scripture, then immediately point them to a parent, pastor, or 988. Say it once, clearly, warmly. Then stop.`
    : "";

  const openChatPrompt = `You are Jeremiah — a warm, knowledgeable Apostolic Pentecostal Bible teacher. You love the Word and you love people.

In this mode you are just talking — no lesson plan, no curriculum, no levels. Just a real conversation about the Bible, faith, doctrine, and life.

Your voice: direct, warm, real. You speak plainly. You don't lecture. You engage. You ask follow-up questions when something is interesting. You share your perspective with confidence but without arrogance.

You can discuss any topic related to the Bible, Christian faith, Apostolic doctrine, church history, prayer, practical Christian living, or theology. If someone asks something off-topic or harmful, redirect warmly.

You are still Jeremiah. Not an AI, not Claude.

Respond in plain conversational text. No JSON, no visual cards, no special formatting — just talk. Keep responses tight: 2-4 sentences unless the question genuinely needs more. Ask one follow-up question if the conversation warrants it.` + ageGuard;

  const messages = [];
  for (const msg of conversationHistory) {
    messages.push({ role: msg.role, content: msg.role === "user" ? sanitizeForClaude(msg.content) : msg.content });
  }
  messages.push({ role: "user", content: sanitizeForClaude(question) });

  try {
    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: { "Content-Type": "application/json", "x-api-key": ANTHROPIC_API_KEY, "anthropic-version": "2023-06-01", "anthropic-dangerous-direct-browser-access": "true" },
      body: JSON.stringify({ model: CLAUDE_MODEL, max_tokens: 800, system: openChatPrompt, messages }),
    });
    if (!response.ok) throw new Error("API error " + response.status);
    const data = await response.json();
    return { talk: extractText(data).trim(), visual: null };
  } catch (err) {
    console.error("Claude open chat error:", err);
    return null;
  }
}

// ============ GREETING SUMMARY ============
async function generateGreetingSummary(recentMessages) {
  if (!ANTHROPIC_API_KEY) return null;
  const recentText = recentMessages.filter((m) => m.role === "user").slice(0, 6).map((m) => m.content).join("\n");
  if (!recentText.trim()) return null;
  try {
    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: { "Content-Type": "application/json", "x-api-key": ANTHROPIC_API_KEY, "anthropic-version": "2023-06-01", "anthropic-dangerous-direct-browser-access": "true" },
      body: JSON.stringify({ model: CLAUDE_MODEL, max_tokens: 150, messages: [{ role: "user", content: `A student has been chatting about Apostolic Pentecostal doctrine. Recent questions:\n\n${recentText}\n\nReturn ONLY JSON: {"summary":"One warm sentence max 12 words starting with 'You were' or 'Last time you'"}` }] }),
    });
    if (!response.ok) return null;
    const data = await response.json();
    return JSON.parse(extractText(data).trim());
  } catch { return null; }
}

// ============ SUPABASE HELPERS ============
async function createConversation(profileId, title) {
  const { data, error } = await supabase.from("conversations").insert({ profile_id: profileId, title }).select().single();
  if (error) { console.error("Error creating conversation:", error); return null; }
  return data;
}
async function saveMessage(conversationId, role, content) {
  await supabase.from("conversation_messages").insert({ conversation_id: conversationId, role, content });
}
async function loadRecentConversations(profileId, limit = 20) {
  const { data, error } = await supabase.from("conversations").select("*").eq("profile_id", profileId).order("updated_at", { ascending: false }).limit(limit);
  if (error) return [];
  return data || [];
}
async function loadConversationMessages(conversationId) {
  const { data, error } = await supabase.from("conversation_messages").select("*").eq("conversation_id", conversationId).order("created_at", { ascending: true });
  if (error) return [];
  return data || [];
}
async function updateConversationTimestamp(conversationId) {
  await supabase.from("conversations").update({ updated_at: new Date().toISOString() }).eq("id", conversationId);
}

// ============ MAIN COMPONENT ============
export default function AskPage({ onBack, backLabel, onShowProfile, onShowAccount, profileImageUrl, profile }) {
  const isGuest = !profile || profile.isGuest;

  const [screen, setScreen] = useState("home");
  const [loadingHistory, setLoadingHistory] = useState(true);
  const [lastConversation, setLastConversation] = useState(null);
  const [greetingSummary, setGreetingSummary] = useState(null);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [conversationId, setConversationId] = useState(null);
  const [blocked, setBlocked] = useState(false);

  const messagesEndRef = useRef(null);
  useEffect(() => { messagesEndRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages]);

  useEffect(() => {
    async function bootstrap() {
      try {
        if (!isGuest && profile?.id) {
          const convos = await loadRecentConversations(profile.id, 20);
          if (convos.length > 0) {
            setLastConversation(convos[0]);
            const recentMsgs = await loadConversationMessages(convos[0].id);
            const summary = await generateGreetingSummary(recentMsgs);
            if (summary?.summary) setGreetingSummary(summary.summary);
          }
        }
      } catch (err) {
        console.error("Error bootstrapping AskPage:", err);
      } finally {
        setLoadingHistory(false);
      }
    }
    bootstrap();
  }, [isGuest, profile]);

  const badPhrases = ["kill yourself","dick","pussy","fuck","shit","bitch","cock","cunt","porn","molest","cum","jizz","whore","slut"];
  function messageIsPureVulgarity(msg) {
    const lower = msg.toLowerCase().trim();
    const hasContext = ["?","what","why","how","who","bible","jesus","god","scripture","verse","bapti","spirit","holy","prayer","church","sin","repent"].some((w) => lower.includes(w));
    return badPhrases.some((p) => lower.includes(p)) && !hasContext;
  }
  function countBadMessages() { return messages.filter((m) => m.role === "user").filter((m) => messageIsPureVulgarity(m.content)).length; }

  function formatMessage(text) {
    if (!text) return "";
    return text.split("\n").map((line) => {
      line = line.replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>");
      line = line.replace(/\*(.+?)\*/g, "<em>$1</em>");
      return line;
    }).join("<br/>");
  }

  async function handleSend(directQuestion) {
    const question = typeof directQuestion === "string" ? directQuestion.trim() : input.trim();
    if (!question || loading) return;

    const userMsg = { id: Date.now().toString(), role: "user", content: question, visual: null };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setLoading(true);

    try {
      const historyForClaude = messages.map((m) => ({ role: m.role, content: m.content }));
      const suicidePhrases = ["kill myself","killing myself","end my life","take my life","suicide","want to die","going to die"];

      if (suicidePhrases.some((p) => question.toLowerCase().includes(p))) {
        setMessages((prev) => [...prev, { id: (Date.now() + 1).toString(), role: "assistant", content: "Please call 911 or 988 right now. Real people are there to help.", visual: null }]);
        setBlocked(true); setLoading(false); return;
      }
      if (countBadMessages() >= 2) {
        setMessages((prev) => [...prev, { id: (Date.now() + 1).toString(), role: "assistant", content: "I'm here for Bible study. This conversation is over.", visual: null }]);
        setBlocked(true); setLoading(false); return;
      }
      if (messageIsPureVulgarity(question)) {
        setMessages((prev) => [...prev, { id: (Date.now() + 1).toString(), role: "assistant", content: "I'm here for Bible study. Got a question about the Word?", visual: null }]);
        setLoading(false); return;
      }

      let answer = null;
      if (USE_ANTHROPIC) answer = await askClaude(question, historyForClaude, profile?.role);
      if (!answer) answer = { talk: "I'm having trouble connecting. Try again in a moment.", visual: null };

      const answerText = typeof answer === "string" ? answer : (answer.talk || "");

      if (answerText && answerText.length > 10 && !isGuest && profile?.id) {
        let activeConversationId = conversationId;
        if (!activeConversationId) {
          const convo = await createConversation(profile.id, generateTitle(question));
          if (convo) { activeConversationId = convo.id; setConversationId(convo.id); }
        }
        if (activeConversationId) {
          await saveMessage(activeConversationId, "user", question);
          await saveMessage(activeConversationId, "assistant", answerText);
          await updateConversationTimestamp(activeConversationId);
        }
      }

      setMessages((prev) => [...prev, { id: (Date.now() + 1).toString(), role: "assistant", content: answerText, visual: null }]);
    } catch (err) {
      console.error("Error:", err);
      setMessages((prev) => [...prev, { id: (Date.now() + 1).toString(), role: "assistant", content: "Sorry, I hit an error. Please try again.", visual: null }]);
    } finally {
      setLoading(false);
    }
  }

  // ============ HOME SCREEN ============
  function HomeScreen() {
    const firstName = (profile?.name || "Friend").split(" ")[0];

    function handleQuickStart(tip) {
      setMessages([]); setScreen("chat");
      setTimeout(() => handleSend(tip), 100);
    }

    return (
      <div className="home-screen" role="main" aria-label="Jeremiah home">
        {/* ── HERO BANNER ── */}
        <header className="hs-hero" aria-label="Welcome">
          <div className="hs-hero-glow" aria-hidden="true" />
          <div className="hs-hero-inner">
            <div className="hs-hero-avatar" aria-hidden="true">
              <img src="/ignite-logo-flame.png" alt="" />
            </div>
            <div className="hs-hero-text">
              <div className="hs-hero-eyebrow">Your Bible study teacher</div>
              <h1 className="hs-hero-name">Hey {firstName}</h1>
              {greetingSummary?.summary && (
                <div className="hs-hero-summary">{greetingSummary.summary}</div>
              )}
            </div>
          </div>
        </header>

        {/* ── ASK JEREMIAH DOOR ── */}
        <div className="hs-doors-wrap" role="navigation" aria-label="Start studying">
          <button
            className="hs-door-chat"
            onClick={() => { setMessages([]); setScreen("chat"); }}
          >
            <div className="hs-door-chat-inner">
              <div className="hs-door-chat-top">
                <div className="hs-door-icon-wrap red"><span aria-hidden="true">💬</span></div>
                <div className="hs-door-chat-arrow" aria-hidden="true">→</div>
              </div>
              <div className="hs-door-chat-title">Ask Jeremiah</div>
              <div className="hs-door-chat-sub">
                {lastConversation && !loadingHistory ? "Continue your last conversation" : "Ask anything about the Bible, doctrine, or faith"}
              </div>
            </div>
          </button>
        </div>

        {/* ── QUICK-START TIPS ── */}
        <QuickStartTips onSelect={handleQuickStart} />

        <div className="hs-bottom-space" />
      </div>
    );
  }

  // ============ RENDER ============
  if (screen === "home") {
    return (
      <div className="ask-page">
        <HomeScreen />
        <style>{styles}</style>
      </div>
    );
  }

  // Chat screen
  return (
    <div className="ask-page chat-mode">
      <div className="chat-bar" role="banner">
        <button className="chat-bar-back" onClick={() => setScreen("home")} aria-label="Back to home">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden="true"><path d="M19 12H5M5 12L12 19M5 12L12 5"/></svg>
        </button>
        <div className="chat-bar-id" aria-label="Chatting with Jeremiah">
          <div className="chat-bar-flame" aria-hidden="true"><img src="/ignite-logo-flame.png" alt="" /></div>
          <div>
            <div className="chat-bar-name">Jeremiah</div>
            <div className="chat-bar-status">
              <span className="chat-bar-dot" aria-hidden="true"/>
              <span>Open Chat</span>
            </div>
          </div>
        </div>
        <div style={{width:36}} aria-hidden="true"/>
      </div>

      <div className="msgs" role="log" aria-live="polite" aria-label="Conversation with Jeremiah" aria-atomic="false">
        {messages.length === 0 && !loading && (
          <div className="msgs-empty" aria-live="off">
            <div className="msgs-empty-flame" aria-hidden="true"><img src="/ignite-logo-flame.png" alt="" /></div>
            <p className="msgs-empty-verse">"His word was in mine heart as a burning fire"</p>
            <p className="msgs-empty-ref">Jeremiah 20:9</p>
          </div>
        )}

        {messages.map((msg) => (
          <MessageBubble key={msg.id} message={msg} formatFn={formatMessage} />
        ))}

        {loading && <ShimmerLoader variant="dots" />}
        <div ref={messagesEndRef} />
      </div>

      {blocked ? (
        <div className="blocked-notice" role="alert">This conversation has ended.</div>
      ) : (
        <ChatInput
          value={input}
          onChange={setInput}
          onSend={handleSend}
          disabled={loading}
          placeholder="Ask Jeremiah anything…"
        />
      )}
      <style>{styles}</style>
    </div>
  );
}

const styles = `
  * { box-sizing: border-box; }

  /* ─── ACCESSIBILITY ─── */
  .sr-only { position: absolute; width: 1px; height: 1px; padding: 0; margin: -1px; overflow: hidden; clip: rect(0,0,0,0); white-space: nowrap; border: 0; }
  :focus-visible { outline: 3px solid #003DA5; outline-offset: 2px; border-radius: 4px; }

  /* ─── BASE ─── */
  .ask-page { display: flex; flex-direction: column; min-height: 100%; background: #f0f2f8; font-family: inherit; overflow-y: auto; -webkit-overflow-scrolling: touch; }
  .ask-page.chat-mode { height: 100%; overflow: hidden; background: #f0f2f8; }

  /* ─── HOME ─── */
  .home-screen { display: flex; flex-direction: column; min-height: 100%; background: #f0f2f8; }

  /* ─── HERO BANNER ─── */
  .hs-hero { position: relative; overflow: hidden; background: linear-gradient(145deg, #0e1f5e 0%, #003DA5 55%, #1a3fcc 100%); padding: 1.6rem 1.4rem 1.4rem; }
  .hs-hero-glow { position: absolute; width: 300px; height: 300px; border-radius: 50%; background: radial-gradient(circle, rgba(255,180,0,0.18) 0%, transparent 70%); top: -80px; right: -60px; pointer-events: none; }
  .hs-hero-inner { position: relative; z-index: 1; display: flex; align-items: center; gap: 1rem; }
  .hs-hero-avatar { width: 52px; height: 52px; border-radius: 50%; background: rgba(255,255,255,0.15); border: 2px solid rgba(255,255,255,0.35); display: flex; align-items: center; justify-content: center; flex-shrink: 0; box-shadow: 0 4px 16px rgba(0,0,0,0.25); }
  .hs-hero-avatar img { width: 32px; height: 32px; object-fit: contain; }
  .hs-hero-eyebrow { font-size: 0.65rem; font-weight: 800; color: rgba(255,255,255,0.65); text-transform: uppercase; letter-spacing: 0.12em; margin-bottom: 0.15rem; }
  .hs-hero-name { font-size: 1.7rem; font-weight: 900; color: white; letter-spacing: -0.03em; line-height: 1.05; margin: 0; }
  .hs-hero-summary { margin-top: 0.35rem; font-size: 0.84rem; color: rgba(255,255,255,0.75); line-height: 1.5; font-style: italic; }

  /* DOORS WRAP */
  .hs-doors-wrap { padding: 0.9rem 1.25rem 0; display: flex; flex-direction: column; gap: 0.85rem; }

  /* CHAT DOOR */
  .hs-door-chat { background: white; border-radius: 24px; border: 2px solid #fee2e2; cursor: pointer; font-family: inherit; text-align: left; padding: 0; box-shadow: 0 6px 20px rgba(15,23,42,0.08); transition: all 0.15s; }
  .hs-door-chat:active { transform: scale(0.98); }
  .hs-door-chat:hover { border-color: #fca5a5; box-shadow: 0 10px 28px rgba(220,38,38,0.12); transform: translateY(-2px); }
  .hs-door-chat-inner { padding: 1.4rem 1.4rem 1.3rem; }
  .hs-door-chat-top { display: flex; align-items: center; justify-content: space-between; margin-bottom: 0.85rem; }
  .hs-door-chat-arrow { font-size: 1.4rem; color: #d1d5db; font-weight: 300; }
  .hs-door-chat-title { font-size: 1.5rem; font-weight: 900; color: #111827; letter-spacing: -0.02em; margin-bottom: 0.3rem; }
  .hs-door-chat-sub { font-size: 0.88rem; color: #6b7280; line-height: 1.5; }

  /* ICON WRAPS */
  .hs-door-icon-wrap { width: 48px; height: 48px; border-radius: 16px; display: flex; align-items: center; justify-content: center; font-size: 1.4rem; flex-shrink: 0; }
  .hs-door-icon-wrap.red { background: #fef2f2; }

  .hs-bottom-space { height: 2rem; }

  /* ─── CHAT BAR ─── */
  .chat-bar { display: flex; align-items: center; gap: 0.75rem; padding: 0.75rem 1.25rem; background: linear-gradient(135deg, #1a3fcc, #003DA5); flex-shrink: 0; box-shadow: 0 4px 16px rgba(26,63,204,0.3); }
  .chat-bar-back { width: 36px; height: 36px; border-radius: 10px; border: 1.5px solid rgba(255,255,255,0.22); background: rgba(255,255,255,0.1); display: flex; align-items: center; justify-content: center; cursor: pointer; color: white; flex-shrink: 0; transition: background 0.15s; }
  .chat-bar-back:active { background: rgba(255,255,255,0.2); }
  .chat-bar-id { flex: 1; display: flex; align-items: center; gap: 0.55rem; justify-content: center; }
  .chat-bar-flame { width: 30px; height: 30px; border-radius: 50%; background: white; display: flex; align-items: center; justify-content: center; box-shadow: 0 2px 8px rgba(0,0,0,0.15); }
  .chat-bar-flame img { width: 19px; height: 19px; object-fit: contain; }
  .chat-bar-name { font-size: 1rem; font-weight: 900; color: white; letter-spacing: -0.01em; }
  .chat-bar-status { display: flex; align-items: center; gap: 4px; }
  .chat-bar-dot { width: 6px; height: 6px; border-radius: 50%; background: #4ade80; box-shadow: 0 0 6px rgba(74,222,128,0.9); flex-shrink: 0; }
  .chat-bar-status span:last-child { font-size: 0.68rem; color: rgba(255,255,255,0.7); font-weight: 700; }

  /* ─── MESSAGES ─── */
  .msgs { flex: 1; overflow-y: auto; -webkit-overflow-scrolling: touch; overscroll-behavior: contain; padding: 1.25rem 1.25rem 1rem; display: flex; flex-direction: column; gap: 1.1rem; min-height: 0; background: #f0f2f8; }
  .msgs-empty { flex: 1; display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 2rem 1rem; text-align: center; }
  .msgs-empty-flame { width: 68px; height: 68px; border-radius: 50%; background: white; border: 1px solid #e0e4f0; display: flex; align-items: center; justify-content: center; margin-bottom: 1rem; box-shadow: 0 8px 24px rgba(15,23,42,0.1); }
  .msgs-empty-flame img { width: 42px; height: 42px; object-fit: contain; }
  .msgs-empty-verse { font-size: 1rem; font-style: italic; color: #6b7280; line-height: 1.65; margin: 0; max-width: 260px; }
  .msgs-empty-ref { font-size: 0.7rem; font-weight: 800; color: #003DA5; margin: 0.4rem 0 0; }

  /* ─── BUBBLES ─── */
  .msg { display: flex; gap: 0.6rem; align-items: flex-end; max-width: 88%; }
  .msg.user { align-self: flex-end; flex-direction: row-reverse; }
  .msg.assistant { align-self: flex-start; }
  .msg-body { display: flex; flex-direction: column; gap: 8px; max-width: 100%; }
  .msg-av { width: 32px; height: 32px; border-radius: 50%; background: white; border: 1px solid #e0e4f0; display: flex; align-items: center; justify-content: center; flex-shrink: 0; box-shadow: 0 2px 8px rgba(15,23,42,0.08); }
  .msg-av img { width: 20px; height: 20px; object-fit: contain; }
  .msg-bubble { padding: 1rem 1.15rem; border-radius: 20px; font-size: 1rem; line-height: 1.75; word-break: break-word; }
  .msg.assistant .msg-bubble { background: white; color: #111827; border: 1px solid #e0e4f0; border-bottom-left-radius: 6px; box-shadow: 0 4px 14px rgba(15,23,42,0.07); font-size: 1.02rem; line-height: 1.8; }
  .msg.user .msg-bubble { background: linear-gradient(135deg, #1a3fcc, #003DA5); color: white; border-bottom-right-radius: 6px; box-shadow: 0 6px 18px rgba(26,63,204,0.3); }
  .msg.assistant .msg-bubble strong { color: #003DA5; font-weight: 800; }
  .msg.user .msg-bubble strong { color: #bfdbfe; }
  .msg-bubble em { font-style: italic; opacity: 0.8; }
  .typing-bubble { display: flex; align-items: center; gap: 5px; padding: 0.9rem 1rem !important; }
  .typing-bubble span { width: 8px; height: 8px; border-radius: 50%; background: #003DA5; opacity: 0.35; animation: jounce 1.4s ease-in-out infinite; display: block; }
  .typing-bubble span:nth-child(2) { animation-delay: 0.2s; }
  .typing-bubble span:nth-child(3) { animation-delay: 0.4s; }

  /* ─── CHAT INPUT (ChatInput component) ─── */
  .ci-wrap { flex-shrink: 0; padding: 0.65rem 1.25rem 0.55rem; background: white; border-top: 1px solid #e0e4f0; box-shadow: 0 -4px 20px rgba(15,23,42,0.07); }
  .ci-row { display: flex; gap: 0.5rem; align-items: flex-end; max-width: 640px; margin: 0 auto; }
  .ci-textarea { flex: 1; padding: 0.85rem 1.15rem; border-radius: 22px; border: 1.5px solid #e0e4f0; background: #f8faff; font-size: 1rem; font-family: inherit; resize: none; outline: none; min-height: 48px; max-height: 140px; color: #111827; transition: border-color 0.18s, box-shadow 0.18s, background 0.18s; line-height: 1.55; }
  .ci-textarea:focus { border-color: #003DA5; background: white; box-shadow: 0 0 0 3px rgba(0,61,165,0.12); }
  .ci-textarea::placeholder { color: #9ca3af; }
  .ci-textarea:disabled { opacity: 0.5; cursor: not-allowed; }
  .ci-send { width: 48px; height: 48px; border-radius: 50%; border: none; background: #e5e7eb; color: #9ca3af; cursor: not-allowed; display: flex; align-items: center; justify-content: center; flex-shrink: 0; transition: all 0.18s; }
  .ci-send--active { cursor: pointer; color: white; box-shadow: 0 6px 20px rgba(26,63,204,0.35); }
  .ci-send--active:hover { transform: scale(1.07); box-shadow: 0 8px 24px rgba(26,63,204,0.45); }
  .ci-send--active:active { transform: scale(0.92); box-shadow: none; }
  .ci-hint { text-align: center; font-size: 0.64rem; color: #c4c9d6; margin-top: 0.3rem; font-weight: 500; }
  .ci-hint kbd { font-family: inherit; font-weight: 700; color: #b0b7c3; }

  /* ─── QUICK-START TIPS (QuickStartTips component) ─── */
  .qst-section { padding: 1.1rem 1.25rem 0; }
  .qst-label { font-size: 0.63rem; font-weight: 900; color: #9ca3af; text-transform: uppercase; letter-spacing: 0.12em; margin-bottom: 0.65rem; }
  .qst-grid { display: flex; flex-wrap: wrap; gap: 0.5rem; list-style: none; margin: 0; padding: 0; }
  .qst-li { display: contents; }
  .qst-pill { display: inline-flex; align-items: center; gap: 0.4rem; padding: 0.45rem 0.85rem; border-radius: 999px; border: 1.5px solid #e0e4f0; background: white; color: #374151; font-size: 0.8rem; font-weight: 600; font-family: inherit; cursor: pointer; transition: all 0.14s; white-space: nowrap; box-shadow: 0 1px 4px rgba(15,23,42,0.05); }
  .qst-pill:hover { border-color: #93c5fd; background: #eff6ff; color: #1d4ed8; transform: translateY(-1px); box-shadow: 0 4px 12px rgba(29,78,216,0.1); }
  .qst-pill:active { transform: scale(0.97) translateY(0); }
  .qst-pill-icon { font-size: 0.6rem; color: #FFB400; flex-shrink: 0; }

  .blocked-notice { flex-shrink: 0; padding: 1rem; text-align: center; font-size: 0.85rem; font-weight: 600; color: #6b7280; background: white; border-top: 1px solid #e0e4f0; }

  @keyframes jounce {
    0%, 60%, 100% { transform: translateY(0); opacity: 0.35; }
    30% { transform: translateY(-5px); opacity: 1; }
  }

  /* ─── MESSAGE ENTRANCE ANIMATION ─── */
  @keyframes msgSlideIn {
    from { opacity: 0; transform: translateY(12px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  .msg--animate { opacity: 0; }
  .msg--animate.msg--visible { animation: msgSlideIn 0.28s cubic-bezier(0.22,1,0.36,1) forwards; }

  /* ─── SHIMMER ─── */
  @keyframes shimmerMove {
    0%   { background-position: -400px 0; }
    100% { background-position: 400px 0; }
  }
  .shimmer-wrap { padding: 1rem 1.25rem; display: flex; flex-direction: column; gap: 0.55rem; }
  .shimmer-bar { height: 14px; border-radius: 8px; background: linear-gradient(90deg, #e0e4f0 25%, #f0f2f8 50%, #e0e4f0 75%); background-size: 800px 100%; animation: shimmerMove 1.5s infinite linear; }
  .shimmer-bar--wide  { width: 90%; }
  .shimmer-bar--med   { width: 72%; }
  .shimmer-bar--short { width: 55%; }

  @media (max-width: 640px) {
    .hs-hero-name { font-size: 1.45rem; }
    .hs-door-chat-title { font-size: 1.3rem; }
    .msg { max-width: 94%; }
    .msg-bubble { font-size: 0.97rem; padding: 0.85rem 1rem; }
    .qst-pill { font-size: 0.75rem; padding: 0.4rem 0.75rem; }
    .ci-hint { display: none; }
  }
`;

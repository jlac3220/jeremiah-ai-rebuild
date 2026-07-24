import { useEffect, useRef, useState } from "react";
import { askJeremiah } from "../../core/ask/askJeremiah";
import { getActiveLearnerAgeBand } from "../../core/classroom/classroomSessionData";
import ChatMessage from "./components/ChatMessage";
import ChatInput from "./components/ChatInput";
import ThinkingIndicator from "./components/ThinkingIndicator";
import { colors } from "../../shared/theme";

const WELCOME_MESSAGE = {
  role: "assistant",
  content:
    "I'm Jeremiah. Ask me anything about the standards you're studying — I'll answer from the real doctrine and point you to the standard code so you can go study it directly.",
};

export default function AskJeremiahPage() {
  const [messages, setMessages] = useState([WELCOME_MESSAGE]);
  const [isThinking, setIsThinking] = useState(false);
  const ageBand = getActiveLearnerAgeBand();
  const scrollRef = useRef(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, isThinking]);

  async function handleSend(question) {
    const nextMessages = [...messages, { role: "user", content: question }];
    setMessages(nextMessages);
    setIsThinking(true);

    const history = nextMessages
      .filter((msg) => msg !== WELCOME_MESSAGE)
      .map((msg) => ({ role: msg.role, content: msg.content }));

    const result = await askJeremiah(question, history, ageBand);
    setIsThinking(false);
    setMessages((current) => [...current, { role: "assistant", content: result.answer }]);
  }

  return (
    <div style={pageStyle}>
      <div style={contentStyle}>
        <section style={heroStyle}>
          <p style={eyebrowStyle}>ASK JEREMIAH</p>
          <h1 style={titleStyle}>A doctrinal genius, not a search bar</h1>
          <p style={subtitleStyle}>
            Every answer is grounded in the real standards — Jeremiah cites what he's teaching
            from, and says plainly when something's outside current doctrine.
          </p>
        </section>

        <div style={chatFrameStyle}>
          <div ref={scrollRef} style={messagesScrollStyle}>
            {messages.map((message, index) => (
              <ChatMessage key={index} role={message.role} content={message.content} />
            ))}
            {isThinking ? <ThinkingIndicator /> : null}
          </div>

          <div style={inputWrapStyle}>
            <ChatInput onSend={handleSend} disabled={isThinking} />
          </div>
        </div>
      </div>
    </div>
  );
}

const pageStyle = { minHeight: "100%", background: colors.pageGradient };

const contentStyle = {
  width: "100%",
  maxWidth: "760px",
  margin: "0 auto",
  padding: "32px 20px 120px",
  boxSizing: "border-box",
  display: "flex",
  flexDirection: "column",
  minHeight: "calc(100vh - 88px)",
};

const heroStyle = { marginBottom: "20px" };

const eyebrowStyle = {
  margin: 0,
  fontSize: "0.82rem",
  fontWeight: 800,
  letterSpacing: "0.08em",
  textTransform: "uppercase",
  color: colors.textMuted,
};

const titleStyle = {
  margin: "8px 0 0",
  fontSize: "clamp(1.8rem, 4vw, 2.6rem)",
  lineHeight: 1.08,
  fontWeight: 900,
  color: colors.text,
};

const subtitleStyle = { margin: "12px 0 0", fontSize: "1rem", lineHeight: 1.6, color: colors.textMuted };

const chatFrameStyle = {
  flex: 1,
  display: "flex",
  flexDirection: "column",
  background: colors.cardBg,
  border: `1px solid ${colors.cardBorder}`,
  boxShadow: colors.cardShadow,
  borderRadius: "26px",
  overflow: "hidden",
};

const messagesScrollStyle = {
  flex: 1,
  overflowY: "auto",
  padding: "22px",
  minHeight: "320px",
  maxHeight: "520px",
};

const inputWrapStyle = {
  borderTop: `1px solid ${colors.cardBorder}`,
  padding: "16px 22px",
  background: "#f8fafc",
};

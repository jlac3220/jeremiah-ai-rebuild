import { useEffect, useRef, useState } from "react";
import { askJeremiah } from "../../../core/ask/askJeremiah";
import ChatMessage from "../../ask/components/ChatMessage";
import ChatInput from "../../ask/components/ChatInput";
import ThinkingIndicator from "../../ask/components/ThinkingIndicator";
import { colors, fonts } from "../../../shared/theme";

/**
 * Questions belong inside the lesson, not a separate destination — this is
 * the same askJeremiah() engine the standalone Ask page uses, just embedded
 * right where the learner already is, mid-instruction.
 */
export default function InlineAskPanel({ standard, ageBand }) {
  const [messages, setMessages] = useState([]);
  const [isThinking, setIsThinking] = useState(false);
  const scrollRef = useRef(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, isThinking]);

  async function handleSend(question) {
    const nextMessages = [...messages, { role: "user", content: question }];
    setMessages(nextMessages);
    setIsThinking(true);

    const history = nextMessages.map((msg) => ({ role: msg.role, content: msg.content }));
    const result = await askJeremiah(question, history, ageBand);
    setIsThinking(false);
    setMessages((current) => [...current, { role: "assistant", content: result.answer }]);
  }

  return (
    <div style={panelStyle}>
      <p style={hintStyle}>Ask about {standard.title} — or anything else, right where you are.</p>
      {messages.length > 0 ? (
        <div ref={scrollRef} style={scrollStyle}>
          {messages.map((message, index) => (
            <ChatMessage key={index} role={message.role} content={message.content} />
          ))}
          {isThinking ? <ThinkingIndicator /> : null}
        </div>
      ) : null}
      <ChatInput onSend={handleSend} disabled={isThinking} />
    </div>
  );
}

const panelStyle = {
  marginTop: "16px",
  borderRadius: "16px",
  padding: "16px",
  background: "#ffffff",
  border: `1px solid ${colors.checkpointBorder}`,
};

const hintStyle = {
  margin: "0 0 12px",
  fontSize: "0.86rem",
  color: colors.textFaint,
  fontFamily: fonts.mono,
};

const scrollStyle = {
  maxHeight: "260px",
  overflowY: "auto",
  marginBottom: "12px",
};

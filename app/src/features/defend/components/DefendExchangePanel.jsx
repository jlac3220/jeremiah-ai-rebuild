import { useEffect, useRef, useState } from "react";
import { scheduleNextReview } from "../../../core/standards/standardsProgress";
import { recordEngagement } from "../../../core/streak/streak";
import { defendTheFaithExchange } from "../../../core/defend/defendTheFaith";
import ChatMessage from "../../ask/components/ChatMessage";
import ChatInput from "../../ask/components/ChatInput";
import ThinkingIndicator from "../../ask/components/ThinkingIndicator";
import Pill from "../../../shared/ui/Pill";
import { colors } from "../../../shared/theme";

const VERDICT_TONE = { held: "mastered", wavered: "review", conceded: "weak" };
const VERDICT_LABEL = { held: "Held the line", wavered: "Wavered", conceded: "Conceded ground" };

/**
 * The Defend the Faith chat exchange itself, shared by two callers: the
 * standalone spaced-review page (reached later, once a mastered standard
 * comes due) and the Pressure phase inside a fresh Classroom session (same
 * exchange, right after first mastering the standard, no page navigation).
 * scheduleNextReview and recordEngagement fire here regardless of which
 * context renders it, so both callers get real spaced-repetition scheduling
 * without duplicating that logic.
 */
export default function DefendExchangePanel({ standard, ageBand, onRoundComplete }) {
  const [messages, setMessages] = useState([]);
  const [verdicts, setVerdicts] = useState([]);
  const [isThinking, setIsThinking] = useState(false);
  const [roundComplete, setRoundComplete] = useState(false);
  const scrollRef = useRef(null);
  const startedRef = useRef(false);

  useEffect(() => {
    if (!standard || startedRef.current) return;
    startedRef.current = true;
    setIsThinking(true);
    defendTheFaithExchange(standard, [], null, ageBand).then((result) => {
      setIsThinking(false);
      setMessages([{ role: "assistant", content: result.reply }]);
      if (result.roundComplete) finish(result);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [standard]);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, isThinking]);

  function finish(result) {
    setRoundComplete(true);
    const success = result.verdict === "held";
    scheduleNextReview(standard.code, success);
    if (!result.unavailable) recordEngagement();
    onRoundComplete?.({ success, unavailable: result.unavailable });
  }

  async function handleReply(text) {
    const nextMessages = [...messages, { role: "user", content: text }];
    setMessages(nextMessages);
    setIsThinking(true);

    const result = await defendTheFaithExchange(standard, messages, text, ageBand);
    setIsThinking(false);
    setMessages((current) => [...current, { role: "assistant", content: result.reply }]);
    if (result.verdict) setVerdicts((current) => [...current, result.verdict]);
    if (result.roundComplete) finish(result);
  }

  return (
    <div style={chatFrameStyle}>
      <div ref={scrollRef} style={messagesScrollStyle}>
        {messages.map((message, index) => (
          <div key={index}>
            <ChatMessage role={message.role} content={message.content} />
            {message.role === "user" && verdicts[Math.floor(index / 2)] ? (
              <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: "12px" }}>
                <Pill tone={VERDICT_TONE[verdicts[Math.floor(index / 2)]] || "neutral"}>
                  {VERDICT_LABEL[verdicts[Math.floor(index / 2)]]}
                </Pill>
              </div>
            ) : null}
          </div>
        ))}
        {isThinking ? <ThinkingIndicator /> : null}
      </div>

      {!roundComplete ? (
        <div style={inputWrapStyle}>
          <ChatInput onSend={handleReply} disabled={isThinking} />
        </div>
      ) : null}
    </div>
  );
}

const chatFrameStyle = {
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
  minHeight: "260px",
  maxHeight: "480px",
};

const inputWrapStyle = {
  borderTop: `1px solid ${colors.cardBorder}`,
  padding: "16px 22px",
  background: "#f8fafc",
};

import { useEffect, useRef, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { getStandardByCode } from "../../core/standards/standardsRegistry";
import { scheduleNextReview } from "../../core/standards/standardsProgress";
import { getActiveLearnerAgeBand } from "../../core/classroom/classroomSessionData";
import { recordEngagement } from "../../core/streak/streak";
import { defendTheFaithExchange } from "../../core/defend/defendTheFaith";
import ChatMessage from "../ask/components/ChatMessage";
import ChatInput from "../ask/components/ChatInput";
import ThinkingIndicator from "../ask/components/ThinkingIndicator";
import Card from "../../shared/ui/Card";
import Pill from "../../shared/ui/Pill";
import PrimaryButton from "../../shared/ui/PrimaryButton";
import SecondaryButton from "../../shared/ui/SecondaryButton";
import { colors } from "../../shared/theme";
import { ROUTES, classroomPath } from "../../app/routes";

const VERDICT_TONE = { held: "mastered", wavered: "review", conceded: "weak" };
const VERDICT_LABEL = { held: "Held the line", wavered: "Wavered", conceded: "Conceded ground" };

export default function DefendTheFaithPage() {
  const { standardCode } = useParams();
  const standard = getStandardByCode(standardCode);
  const ageBand = getActiveLearnerAgeBand();

  const [messages, setMessages] = useState([]);
  const [verdicts, setVerdicts] = useState([]);
  const [isThinking, setIsThinking] = useState(false);
  const [roundComplete, setRoundComplete] = useState(false);
  const [finalOutcome, setFinalOutcome] = useState(null);
  const scrollRef = useRef(null);
  const startedRef = useRef(false);

  useEffect(() => {
    if (!standard || startedRef.current) return;
    startedRef.current = true;
    setIsThinking(true);
    defendTheFaithExchange(standard, [], null, ageBand).then((result) => {
      setIsThinking(false);
      setMessages([{ role: "assistant", content: result.reply }]);
      if (result.roundComplete) {
        setRoundComplete(true);
      }
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [standard]);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, isThinking]);

  if (!standard) {
    return (
      <div style={pageStyle}>
        <div style={contentStyle}>
          <Card>
            <p>Standard not found.</p>
            <Link to={ROUTES.MAP}>
              <SecondaryButton>Back to Map</SecondaryButton>
            </Link>
          </Card>
        </div>
      </div>
    );
  }

  async function handleReply(text) {
    const nextMessages = [...messages, { role: "user", content: text }];
    setMessages(nextMessages);
    setIsThinking(true);

    const result = await defendTheFaithExchange(standard, messages, text, ageBand);
    setIsThinking(false);
    setMessages((current) => [...current, { role: "assistant", content: result.reply }]);
    if (result.verdict) setVerdicts((current) => [...current, result.verdict]);

    if (result.roundComplete) {
      setRoundComplete(true);
      const success = result.verdict === "held";
      scheduleNextReview(standard.code, success);
      if (!result.unavailable) recordEngagement();
      setFinalOutcome(success ? "success" : "retry");
    }
  }

  return (
    <div style={pageStyle}>
      <div style={contentStyle}>
        <section style={heroStyle}>
          <p style={eyebrowStyle}>DEFEND THE FAITH — SPACED REVIEW</p>
          <h1 style={titleStyle}>{standard.title}</h1>
          <p style={subtitleStyle}>
            Jeremiah is now arguing the opposing side to test whether you can still hold this
            standard. Answer with real scriptural reasoning, not just agreement.
          </p>
        </section>

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
          ) : (
            <div style={inputWrapStyle}>
              <Card variant={finalOutcome === "success" ? "light" : "subtle"} style={{ textAlign: "center" }}>
                <h3 style={{ margin: 0, fontSize: "1.2rem", fontWeight: 900, color: colors.text }}>
                  {finalOutcome === "success" ? "You held the line." : "This one needs more work."}
                </h3>
                <p style={{ margin: "10px 0 0", color: colors.textMuted }}>
                  {finalOutcome === "success"
                    ? "Review scheduled further out — you've shown you can still defend this."
                    : "Review scheduled sooner. Revisit the standard in Classroom before trying again."}
                </p>
                <div style={{ marginTop: "16px", display: "flex", gap: "12px", justifyContent: "center" }}>
                  <Link to={ROUTES.MAP}>
                    <PrimaryButton>Back to Map</PrimaryButton>
                  </Link>
                  <Link to={classroomPath(standard.code)}>
                    <SecondaryButton>Revisit in Classroom</SecondaryButton>
                  </Link>
                </div>
              </Card>
            </div>
          )}
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
  color: colors.reviewText,
};

const titleStyle = {
  margin: "8px 0 0",
  fontSize: "clamp(1.8rem, 4vw, 2.4rem)",
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

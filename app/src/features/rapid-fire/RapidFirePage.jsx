import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { buildRapidFireRound } from "../../core/rapidFire/rapidFireEngine";
import { getStandardProgress } from "../../core/standards/standardsProgress";
import { recordEngagement } from "../../core/streak/streak";
import { ROUTES, classroomPath } from "../../app/routes";
import Card from "../../shared/ui/Card";
import PrimaryButton from "../../shared/ui/PrimaryButton";
import SecondaryButton from "../../shared/ui/SecondaryButton";
import { BoltIcon, FlameMark } from "../../shared/ui/icons";
import { colors, fonts, gradients, getSubjectAccent } from "../../shared/theme";
import { stageTransition } from "../../shared/motion";

const ROUND_SIZE = 10;
const ADVANCE_DELAY_MS = 1100;

function resultTier(score, total) {
  const percent = score / total;
  if (percent >= 0.9) return { label: "On fire.", note: "That's real recall — the words are in you, not just around you." };
  if (percent >= 0.7) return { label: "Strong recall.", note: "Most of it is sticking. A little more review and this is locked in." };
  if (percent >= 0.4) return { label: "Getting there.", note: "Half the battle is knowing which half needs another pass — now you know." };
  return { label: "Worth another round.", note: "This is exactly what Rapid Fire is for — no pressure, just reps." };
}

export default function RapidFirePage() {
  const [phase, setPhase] = useState("start"); // start | playing | results
  const [round, setRound] = useState([]);
  const [questionIndex, setQuestionIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [selected, setSelected] = useState(null);
  // Missed questions loop straight back into the Doctrine Map/Classroom on
  // the results screen — this is meant to feel like the same learning
  // journey continuing, not a disconnected trivia game with a dead-end score.
  const [missed, setMissed] = useState([]);

  const currentQuestion = round[questionIndex];
  const accent = currentQuestion ? getSubjectAccent(currentQuestion.subjectCode) : getSubjectAccent();

  function handleStart() {
    const progress = getStandardProgress();
    const nextRound = buildRapidFireRound(progress, ROUND_SIZE);
    if (nextRound.length === 0) return;
    setRound(nextRound);
    setQuestionIndex(0);
    setScore(0);
    setSelected(null);
    setMissed([]);
    setPhase("playing");
  }

  function handleChoose(choice) {
    if (selected) return;
    const isCorrect = choice === currentQuestion.correctReference;
    setSelected(choice);
    if (isCorrect) {
      setScore((current) => current + 1);
    } else {
      setMissed((current) => [
        ...current,
        { standardCode: currentQuestion.standardCode, standardTitle: currentQuestion.standardTitle },
      ]);
    }

    setTimeout(() => {
      if (questionIndex + 1 >= round.length) {
        recordEngagement();
        setPhase("results");
      } else {
        setQuestionIndex((current) => current + 1);
        setSelected(null);
      }
    }, ADVANCE_DELAY_MS);
  }

  const tier = useMemo(() => resultTier(score, round.length || ROUND_SIZE), [score, round.length]);
  const missedUnique = useMemo(() => {
    const seen = new Map();
    missed.forEach((m) => seen.set(m.standardCode, m));
    return Array.from(seen.values());
  }, [missed]);

  return (
    <div style={pageStyle}>
      <div style={contentStyle}>
        <section style={heroStyle}>
          <p style={eyebrowStyle}>JEREMIAH AI · QUICK DRILL</p>
          <h1 style={titleStyle}>
            Let's <em style={titleEmStyle}>drill</em> this.
          </h1>
          <p style={subtitleStyle}>
            I'll show you a verse — you tell me where it's from. Same classroom, same
            standards, just a faster pace. No grading pressure, just reps.
          </p>
        </section>

        <AnimatePresence mode="wait">
          {phase === "start" ? (
            <motion.div key="start" {...stageTransition}>
              <Card style={{ textAlign: "center" }}>
                <div style={boltWrapStyle}>
                  <BoltIcon size={34} />
                </div>
                <h2 style={startTitleStyle}>{ROUND_SIZE} verses. How many can you place?</h2>
                <p style={startTextStyle}>
                  Pulled from what you've actually studied so far — the more you master on
                  the Map, the more I'll draw from.
                </p>
                <div style={{ marginTop: "22px" }}>
                  <PrimaryButton
                    onClick={handleStart}
                    style={{ background: gradients.flame, color: "#ffffff", boxShadow: "0 10px 28px rgba(249,115,22,0.35)", border: "none" }}
                  >
                    Quiz Me
                  </PrimaryButton>
                </div>
              </Card>
            </motion.div>
          ) : phase === "playing" ? (
            <motion.div key={`q-${questionIndex}`} {...stageTransition}>
              <div style={progressRowStyle}>
                <p style={progressTextStyle}>
                  Question {questionIndex + 1} of {round.length}
                </p>
                <p style={scoreTextStyle}>Score {score}</p>
              </div>

              <Card
                style={{
                  marginBottom: "20px",
                  background: `radial-gradient(ellipse 70% 60% at 8% 0%, ${accent.soft} 0%, transparent 60%), #fffdfa`,
                }}
              >
                <p style={verseQuestionLabelStyle}>Which reference is this verse from?</p>
                <p style={verseQuestionTextStyle}>&ldquo;{currentQuestion.text}&rdquo;</p>
              </Card>

              <div style={choiceGridStyle}>
                {currentQuestion.choices.map((choice) => {
                  const isSelected = selected === choice;
                  const isCorrectChoice = choice === currentQuestion.correctReference;
                  const showState = selected !== null;
                  return (
                    <motion.button
                      key={choice}
                      type="button"
                      onClick={() => handleChoose(choice)}
                      disabled={selected !== null}
                      whileHover={selected === null ? { scale: 1.02 } : undefined}
                      whileTap={selected === null ? { scale: 0.98 } : undefined}
                      style={{
                        ...choiceButtonStyle,
                        ...(showState && isCorrectChoice ? choiceCorrectStyle : null),
                        ...(showState && isSelected && !isCorrectChoice ? choiceWrongStyle : null),
                        ...(showState && !isSelected && !isCorrectChoice ? { opacity: 0.55 } : null),
                      }}
                    >
                      {choice}
                    </motion.button>
                  );
                })}
              </div>
            </motion.div>
          ) : (
            <motion.div key="results" {...stageTransition}>
              <Card style={{ textAlign: "center" }}>
                <motion.div
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  style={{
                    width: "72px",
                    height: "72px",
                    margin: "0 auto",
                    borderRadius: "999px",
                    background: gradients.flame,
                    boxShadow: "0 10px 28px rgba(249,115,22,0.35)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <FlameMark size={34} />
                </motion.div>
                <p style={resultsLabelStyle}>Jeremiah AI Verdict</p>
                <h2 style={resultsScoreStyle}>
                  {score} / {round.length}
                </h2>
                <p style={resultsTierStyle}>{tier.label}</p>
                <p style={resultsNoteStyle}>{tier.note}</p>
                <div style={{ marginTop: "22px", display: "flex", gap: "12px", justifyContent: "center", flexWrap: "wrap" }}>
                  <PrimaryButton
                    onClick={handleStart}
                    style={{ background: gradients.flame, color: "#ffffff", boxShadow: "0 10px 28px rgba(249,115,22,0.35)", border: "none" }}
                  >
                    Quiz Me Again
                  </PrimaryButton>
                  <Link to={ROUTES.HOME}>
                    <SecondaryButton>Back to Home</SecondaryButton>
                  </Link>
                </div>
              </Card>

              {missedUnique.length > 0 ? (
                <Card style={{ marginTop: "20px" }}>
                  <p style={missedLabelStyle}>Jeremiah Recommends Revisiting</p>
                  <div style={missedListStyle}>
                    {missedUnique.map((item) => (
                      <Link key={item.standardCode} to={classroomPath(item.standardCode)} style={missedLinkStyle}>
                        <div style={missedRowStyle}>
                          <div>
                            <p style={missedTitleStyle}>{item.standardTitle}</p>
                            <p style={missedCodeStyle}>{item.standardCode}</p>
                          </div>
                          <span style={missedArrowStyle}>Study →</span>
                        </div>
                      </Link>
                    ))}
                  </div>
                </Card>
              ) : null}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

const pageStyle = { minHeight: "100%", background: colors.pageGradient };

const contentStyle = {
  width: "100%",
  maxWidth: "680px",
  margin: "0 auto",
  padding: "32px 20px 120px",
  boxSizing: "border-box",
};

const heroStyle = { marginBottom: "24px" };

const eyebrowStyle = {
  margin: 0,
  fontFamily: fonts.mono,
  fontSize: "0.76rem",
  fontWeight: 500,
  letterSpacing: "0.16em",
  textTransform: "uppercase",
  color: colors.textMuted,
};

const titleStyle = {
  margin: "12px 0 0",
  fontFamily: fonts.display,
  fontStyle: "italic",
  fontVariationSettings: '"opsz" 70, "wght" 420, "SOFT" 12, "WONK" 1',
  fontSize: "clamp(2rem, 5vw, 2.8rem)",
  lineHeight: 1.1,
  color: colors.text,
};

const titleEmStyle = {
  fontStyle: "italic",
  background: gradients.flame,
  WebkitBackgroundClip: "text",
  backgroundClip: "text",
  color: "transparent",
};

const subtitleStyle = { margin: "12px 0 0", fontSize: "1rem", lineHeight: 1.6, color: colors.textMuted };

const boltWrapStyle = {
  width: "64px",
  height: "64px",
  margin: "0 auto",
  borderRadius: "999px",
  background: "radial-gradient(circle, rgba(255,138,0,0.16) 0%, transparent 70%)",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
};

const startTitleStyle = { margin: "16px 0 0", fontSize: "1.35rem", fontWeight: 900, color: colors.text };
const startTextStyle = { margin: "12px 0 0", lineHeight: 1.7, color: colors.textMuted };

const progressRowStyle = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  marginBottom: "12px",
};

const progressTextStyle = {
  margin: 0,
  fontFamily: fonts.mono,
  fontSize: "0.8rem",
  letterSpacing: "0.04em",
  color: colors.textFaint,
};

const scoreTextStyle = {
  margin: 0,
  fontFamily: fonts.mono,
  fontSize: "0.8rem",
  fontWeight: 700,
  color: colors.text,
};

const verseQuestionLabelStyle = {
  margin: 0,
  fontFamily: fonts.mono,
  fontSize: "0.72rem",
  fontWeight: 500,
  letterSpacing: "0.1em",
  textTransform: "uppercase",
  color: colors.textFaint,
};

const verseQuestionTextStyle = {
  margin: "14px 0 0",
  fontFamily: fonts.display,
  fontStyle: "italic",
  fontVariationSettings: '"opsz" 40, "wght" 440',
  fontSize: "1.25rem",
  lineHeight: 1.6,
  color: "#1e1420",
};

const choiceGridStyle = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
  gap: "12px",
};

const choiceButtonStyle = {
  padding: "16px",
  borderRadius: "16px",
  border: `1px solid ${colors.cardBorder}`,
  background: "#ffffff",
  color: colors.text,
  fontSize: "0.98rem",
  fontWeight: 700,
  cursor: "pointer",
  textAlign: "left",
};

const choiceCorrectStyle = {
  background: colors.strongBg,
  border: `1px solid ${colors.strongBorder}`,
  color: "#166534",
};

const choiceWrongStyle = {
  background: colors.weakBg,
  border: `1px solid ${colors.weakBorder}`,
  color: "#991b1b",
};

const resultsLabelStyle = {
  margin: "16px 0 0",
  fontFamily: fonts.mono,
  fontSize: "0.7rem",
  fontWeight: 500,
  letterSpacing: "0.1em",
  textTransform: "uppercase",
  color: colors.textFaint,
};

const resultsScoreStyle = {
  margin: "6px 0 0",
  fontFamily: fonts.display,
  fontStyle: "italic",
  fontVariationSettings: '"opsz" 80, "wght" 480',
  fontSize: "2.6rem",
  color: colors.text,
};

const resultsTierStyle = { margin: "8px 0 0", fontSize: "1.1rem", fontWeight: 800, color: colors.text };
const resultsNoteStyle = { margin: "10px 0 0", lineHeight: 1.7, color: colors.textMuted, maxWidth: "440px", marginLeft: "auto", marginRight: "auto" };

const missedLabelStyle = {
  margin: "0 0 14px",
  fontFamily: fonts.mono,
  fontSize: "0.72rem",
  fontWeight: 500,
  letterSpacing: "0.1em",
  textTransform: "uppercase",
  color: colors.textFaint,
};

const missedListStyle = { display: "grid", gap: "10px" };
const missedLinkStyle = { textDecoration: "none" };

const missedRowStyle = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  gap: "16px",
  padding: "14px",
  borderRadius: "14px",
  background: "#f8fafc",
  border: `1px solid ${colors.cardBorder}`,
};

const missedTitleStyle = { margin: 0, fontSize: "0.96rem", fontWeight: 800, color: colors.text };
const missedCodeStyle = { margin: "4px 0 0", fontFamily: fonts.mono, fontSize: "0.76rem", color: colors.textFaint };
const missedArrowStyle = { fontSize: "0.86rem", fontWeight: 800, color: colors.infoText, whiteSpace: "nowrap" };

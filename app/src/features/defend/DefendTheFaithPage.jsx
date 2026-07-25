import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { getStandardByCode } from "../../core/standards/standardsRegistry";
import { getActiveLearnerAgeBand } from "../../core/classroom/classroomSessionData";
import DefendExchangePanel from "./components/DefendExchangePanel";
import Card from "../../shared/ui/Card";
import PrimaryButton from "../../shared/ui/PrimaryButton";
import SecondaryButton from "../../shared/ui/SecondaryButton";
import { colors, fonts } from "../../shared/theme";
import { ROUTES, classroomPath } from "../../app/routes";

export default function DefendTheFaithPage() {
  const { standardCode } = useParams();
  const standard = getStandardByCode(standardCode);
  const ageBand = getActiveLearnerAgeBand();

  const [outcome, setOutcome] = useState(null); // { success, unavailable } | null

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

        <div style={panelWrapStyle}>
          <DefendExchangePanel standard={standard} ageBand={ageBand} onRoundComplete={setOutcome} />
        </div>

        {outcome ? (
          <Card
            variant={outcome.success ? "light" : "subtle"}
            style={{ textAlign: "center", marginTop: "16px" }}
          >
            <h3 style={{ margin: 0, fontSize: "1.2rem", fontWeight: 900, color: colors.text }}>
              {outcome.unavailable
                ? "Couldn't reach Jeremiah just now."
                : outcome.success
                  ? "You held the line."
                  : "This one needs more work."}
            </h3>
            <p style={{ margin: "10px 0 0", color: colors.textMuted }}>
              {outcome.unavailable
                ? "Connection issue — review is rescheduled soon so you can try again."
                : outcome.success
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
        ) : null}
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
  fontFamily: fonts.mono,
  fontSize: "0.76rem",
  fontWeight: 500,
  letterSpacing: "0.16em",
  textTransform: "uppercase",
  color: colors.reviewText,
};

const titleStyle = {
  margin: "12px 0 0",
  fontFamily: fonts.display,
  fontStyle: "italic",
  fontVariationSettings: '"opsz" 60, "wght" 420, "SOFT" 12, "WONK" 1',
  fontSize: "clamp(1.8rem, 4vw, 2.4rem)",
  lineHeight: 1.12,
  color: colors.text,
};

const subtitleStyle = { margin: "12px 0 0", fontSize: "1rem", lineHeight: 1.6, color: colors.textMuted };

const panelWrapStyle = { flex: 1, display: "flex", flexDirection: "column" };

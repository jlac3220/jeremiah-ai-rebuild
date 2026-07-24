// src/FireLevelMeter.js — Arrow snaps to current level
import React from "react";

const FIRE_LEVELS = [
  { level: 1, name: "Spark", minPoints: 0, color: "#FFD000" },
  { level: 2, name: "Ember", minPoints: 100, color: "#FF8A00" },
  { level: 3, name: "Fiery", minPoints: 250, color: "#FF4D00" },
  { level: 4, name: "Burning", minPoints: 500, color: "#E12A00" },
  { level: 5, name: "Ablaze", minPoints: 850, color: "#D1001F" },
  { level: 6, name: "Torched", minPoints: 1300, color: "#A8001B" },
  { level: 7, name: "Scorching", minPoints: 1900, color: "#7A0016" },
  { level: 8, name: "Wildfire", minPoints: 2700, color: "#5B1A00" },
  { level: 9, name: "Firestorm", minPoints: 3700, color: "#6D28D9" },
  { level: 10, name: "Inferno", minPoints: 5000, color: "#3B0A7A" },
];

function getCurrentLevel(points) {
  let current = FIRE_LEVELS[0];
  for (const lvl of FIRE_LEVELS) {
    if (points >= lvl.minPoints) current = lvl;
    else break;
  }
  return current;
}

export default function FireLevelMeter({ points, heatScore }) {
  const rawPoints = points ?? heatScore ?? 0;
  const safePoints = Number.isFinite(rawPoints) ? rawPoints : 0;
  const currentLevel = getCurrentLevel(safePoints);

  // Arrow snaps to CENTER of current level's position
  // Level 1 (Spark) = 5%, Level 2 (Ember) = 15%, etc.
  // Formula: ((level - 1) * 10) + 5 = center of that level's band
  const levelIndex = currentLevel.level - 1; // 0-9
  const percent = levelIndex * 10 + 5; // Centers arrow in level band

  console.log(
    "FireLevelMeter - points:",
    safePoints,
    "level:",
    currentLevel.name,
    "arrow at:",
    percent + "%"
  );

  return (
    <div style={container}>
      <div style={body}>
        {/* Meter */}
        <div style={meterWrap}>
          <div style={meter}>
            <div style={gradient} />
          </div>

          <div style={{ ...arrowWrap, bottom: `${percent}%` }}>
            <div style={arrow}>◀</div>
          </div>
        </div>

        {/* Legend with gradient bars */}
        <div style={legend}>
          {[...FIRE_LEVELS].reverse().map((lvl) => {
            const isCurrentLevel = currentLevel.level === lvl.level;
            return (
              <div key={lvl.level} style={legendItem}>
                {/* Mini gradient bar */}
                <div
                  style={{
                    ...miniBar,
                    background: `linear-gradient(90deg, ${lvl.color}, ${lvl.color}AA)`,
                    opacity: safePoints >= lvl.minPoints ? 1 : 0.4,
                  }}
                />

                {/* Text */}
                <span
                  style={{
                    ...legendText,
                    color: isCurrentLevel ? lvl.color : "#111827",
                    fontWeight: isCurrentLevel ? 900 : 700,
                  }}
                >
                  {lvl.name}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

/* ===================== STYLES ===================== */

const container = {
  width: "100%",
};

const header = {
  display: "flex",
  justifyContent: "space-between",
  marginBottom: "10px",
};

const levelNameStyle = {
  fontSize: "1.15rem",
  fontWeight: 900,
  letterSpacing: "-0.03em",
  color: "#111827",
};

const pointsText = {
  fontSize: "0.9rem",
  fontWeight: 800,
  color: "#111827",
};

const body = {
  display: "flex",
  alignItems: "stretch",
  gap: "26px",
};

const meterWrap = {
  position: "relative",
  display: "flex",
};

const meter = {
  width: "12px",
  height: "220px",
  borderRadius: "999px",
  overflow: "hidden",
  boxShadow:
    "0 10px 22px rgba(0,0,0,0.28), inset 0 1px 0 rgba(255,255,255,0.18)",
};

const gradient = {
  width: "100%",
  height: "100%",
  background:
    "linear-gradient(180deg, \
    #3B0A7A 0%, \
    #6D28D9 6%, \
    #5B1A00 14%, \
    #7A0016 24%, \
    #A8001B 38%, \
    #D1001F 52%, \
    #E12A00 66%, \
    #FF4D00 78%, \
    #FF8A00 90%, \
    #FFD000 100%)",
};

const arrowWrap = {
  position: "absolute",
  left: "18px",
  transform: "translateY(50%)",
  transition: "bottom 0.35s cubic-bezier(.22,1,.36,1)",
};

const arrow = {
  fontSize: "14px",
  fontWeight: 900,
  color: "#111827",
  textShadow: "0 2px 10px rgba(0,0,0,0.4)",
};

const legend = {
  display: "flex",
  flexDirection: "column",
  justifyContent: "space-between",
  height: "220px",
};

const legendItem = {
  display: "flex",
  alignItems: "center",
  gap: "10px",
};

const miniBar = {
  width: "28px",
  height: "8px",
  borderRadius: "6px",
  boxShadow: "inset 0 1px 2px rgba(0,0,0,0.25)",
};

const legendText = {
  fontSize: "0.9rem",
  fontWeight: 900,
  color: "#111827",
  letterSpacing: "-0.02em",
  whiteSpace: "nowrap",
};

// src/ScoringInfoDropdown.js — Full modal popup with fire theme
import React, { useState } from "react";
import ReactDOM from "react-dom";

const FIRE_LEVELS = [
  { name: "Spark",     min: 0,     color: "#FFD000", emoji: "✨" },
  { name: "Ember",     min: 100,   color: "#FF8A00", emoji: "🔥" },
  { name: "Fiery",     min: 250,   color: "#FF4D00", emoji: "🔥" },
  { name: "Burning",   min: 500,   color: "#E12A00", emoji: "🔥" },
  { name: "Ablaze",    min: 850,   color: "#D1001F", emoji: "🔥" },
  { name: "Torched",   min: 1300,  color: "#A8001B", emoji: "💀" },
  { name: "Scorching", min: 1900,  color: "#7A0016", emoji: "💀" },
  { name: "Wildfire",  min: 2700,  color: "#5B1A00", emoji: "🌋" },
  { name: "Firestorm", min: 3700,  color: "#6D28D9", emoji: "⚡" },
  { name: "Inferno",   min: 5000,  color: "#3B0A7A", emoji: "👑" },
];

const EARN_RULES = [
  { pts: "+5",  label: "Complete a lesson",           icon: "📖" },
  { pts: "+5",  label: "Complete a study (bonus)",     icon: "🏆" },
  { pts: "+5",  label: "Perfect score — Rapid Fire",   icon: "⚡" },
  { pts: "+5",  label: "Share Ignite with someone",    icon: "📤" },
  { pts: "+1",  label: "Each day active",              icon: "📅" },
  { pts: "+5",  label: "Every 7-day streak",           icon: "🔥" },
  { pts: "+5",  label: "Every 10 total days",          icon: "✅" },
];

const LOSE_RULES = [
  { pts: "-1",  label: "Each day inactive",            icon: "😴" },
  { pts: "-5",  label: "Break a 7+ day streak",        icon: "💔" },
  { pts: "-5",  label: "Abandon a study (30 days)",    icon: "📉" },
  { pts: "↩️",  label: "No activity for 6 months",     icon: "⏳", reset: true },
];

export default function ScoringInfoDropdown() {
  const [isOpen, setIsOpen] = useState(false);
  const [tab, setTab] = useState("rules"); // "rules" | "levels"

  return (
    <>
      <button onClick={() => setIsOpen(true)} style={triggerBtn}>
        How it works ›
      </button>

      {isOpen && ReactDOM.createPortal(
        <div style={overlay} onClick={() => setIsOpen(false)}>
          <div style={modal} onClick={(e) => e.stopPropagation()}>
            <style>{`
              @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
              @keyframes scaleIn { from { transform: scale(0.88); opacity: 0; } to { transform: scale(1); opacity: 1; } }
            `}</style>

            {/* Header */}
            <div style={header}>
              <div style={headerInner}>
                <img src="/ignite-logo-flame.png" alt="" style={flame} />
                <div>
                  <div style={headerTitle}>Fire Score</div>
                  <div style={headerSub}>How points work</div>
                </div>
              </div>
              <button onClick={() => setIsOpen(false)} style={closeBtn}>✕</button>
            </div>

            {/* Tabs */}
            <div style={tabs}>
              <button
                style={{ ...tab_btn, ...(tab === "rules" ? tab_active : {}) }}
                onClick={() => setTab("rules")}
              >
                📋 Rules
              </button>
              <button
                style={{ ...tab_btn, ...(tab === "levels" ? tab_active : {}) }}
                onClick={() => setTab("levels")}
              >
                🏆 Levels
              </button>
            </div>

            {/* Content */}
            <div style={body}>
              {tab === "rules" && (
                <>
                  {/* Earn */}
                  <div style={sectionLabel}>
                    <span style={greenDot} />
                    EARN POINTS
                  </div>
                  <div style={rulesList}>
                    {EARN_RULES.map((r, i) => (
                      <div key={i} style={ruleRow}>
                        <span style={ruleIcon}>{r.icon}</span>
                        <span style={ruleText}>{r.label}</span>
                        <span style={{ ...rulePts, color: "#16a34a" }}>{r.pts}</span>
                      </div>
                    ))}
                  </div>

                  {/* Lose */}
                  <div style={{ ...sectionLabel, marginTop: "1.25rem" }}>
                    <span style={redDot} />
                    LOSE POINTS
                  </div>
                  <div style={rulesList}>
                    {LOSE_RULES.map((r, i) => (
                      <div key={i} style={{ ...ruleRow, ...(r.reset ? resetRow : {}) }}>
                        <span style={ruleIcon}>{r.icon}</span>
                        <span style={ruleText}>
                          {r.label}
                          {r.reset && <span style={resetBadge}>RESET</span>}
                        </span>
                        <span style={{ ...rulePts, color: r.reset ? "#6b7280" : "#dc2626" }}>
                          {r.pts}
                        </span>
                      </div>
                    ))}
                  </div>
                </>
              )}

              {tab === "levels" && (
                <div style={levelsGrid}>
                  {[...FIRE_LEVELS].reverse().map((lvl) => (
                    <div key={lvl.name} style={levelRow}>
                      <div style={{ ...levelDot, background: lvl.color }} />
                      <span style={levelEmoji}>{lvl.emoji}</span>
                      <span style={levelName}>{lvl.name}</span>
                      <span style={levelMin}>{lvl.min.toLocaleString()}+</span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Footer */}
            <div style={footer}>
              Points never expire while you're active. Stay in the Word. 🔥
            </div>

          </div>
        </div>,
        document.body
      )}
    </>
  );
}

/* ===== STYLES ===== */

const triggerBtn = {
  background: "none",
  border: "none",
  padding: 0,
  fontSize: "0.75rem",
  fontWeight: 600,
  color: "#f97316",
  cursor: "pointer",
  marginBottom: "0.75rem",
  display: "inline-block",
};

const overlay = {
  position: "fixed",
  inset: 0,
  background: "rgba(2, 6, 23, 0.65)",
  backdropFilter: "blur(8px)",
  WebkitBackdropFilter: "blur(8px)",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  zIndex: 99999,
  padding: "1rem",
};

const modal = {
  width: "100%",
  maxWidth: "420px",
  maxHeight: "85vh",
  background: "#ffffff",
  borderRadius: "26px",
  boxShadow: "0 32px 80px rgba(0,0,0,0.35)",
  display: "flex",
  flexDirection: "column",
  overflow: "hidden",
};

const header = {
  padding: "1.1rem 1.25rem",
  background: "linear-gradient(135deg, #0b1f6b 0%, #1d4ed8 60%, #1e40af 100%)",
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  color: "#fff",
  flexShrink: 0,
};

const headerInner = {
  display: "flex",
  alignItems: "center",
  gap: "0.75rem",
};

const flame = {
  width: 32,
  height: 32,
  objectFit: "contain",
  filter: "drop-shadow(0 0 8px rgba(255,180,0,0.6))",
};

const headerTitle = {
  fontSize: "1.15rem",
  fontWeight: 900,
  letterSpacing: "-0.02em",
};

const headerSub = {
  fontSize: "0.72rem",
  opacity: 0.75,
  fontWeight: 600,
  letterSpacing: "0.04em",
  textTransform: "uppercase",
};

const closeBtn = {
  width: 34,
  height: 34,
  borderRadius: "50%",
  border: "none",
  background: "rgba(255,255,255,0.15)",
  color: "#fff",
  fontSize: "0.95rem",
  cursor: "pointer",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  flexShrink: 0,
};

const tabs = {
  display: "flex",
  gap: "0.5rem",
  padding: "0.75rem 1.1rem 0",
  flexShrink: 0,
  background: "#fff",
};

const tab_btn = {
  flex: 1,
  padding: "0.55rem 0.75rem",
  borderRadius: "12px",
  border: "1.5px solid #e5e7eb",
  background: "#f9fafb",
  fontSize: "0.82rem",
  fontWeight: 700,
  color: "#6b7280",
  cursor: "pointer",
  transition: "all 0.15s ease",
};

const tab_active = {
  background: "linear-gradient(135deg, #fff7ed, #ffedd5)",
  borderColor: "#fb923c",
  color: "#ea580c",
};

const body = {
  flex: 1,
  overflowY: "auto",
  padding: "1rem 1.1rem",
  WebkitOverflowScrolling: "touch",
};

const sectionLabel = {
  display: "flex",
  alignItems: "center",
  gap: "0.5rem",
  fontSize: "0.68rem",
  fontWeight: 800,
  letterSpacing: "0.1em",
  color: "#374151",
  textTransform: "uppercase",
  marginBottom: "0.5rem",
};

const greenDot = {
  width: 8,
  height: 8,
  borderRadius: "50%",
  background: "#16a34a",
  display: "inline-block",
  flexShrink: 0,
};

const redDot = {
  width: 8,
  height: 8,
  borderRadius: "50%",
  background: "#dc2626",
  display: "inline-block",
  flexShrink: 0,
};

const rulesList = {
  display: "flex",
  flexDirection: "column",
  gap: "0.35rem",
};

const ruleRow = {
  display: "flex",
  alignItems: "center",
  gap: "0.65rem",
  padding: "0.55rem 0.75rem",
  borderRadius: "12px",
  background: "#f9fafb",
  border: "1px solid #f3f4f6",
};

const resetRow = {
  background: "#fafafa",
  border: "1px dashed #d1d5db",
  opacity: 0.8,
};

const ruleIcon = {
  fontSize: "1rem",
  flexShrink: 0,
  width: 24,
  textAlign: "center",
};

const ruleText = {
  flex: 1,
  fontSize: "0.82rem",
  fontWeight: 600,
  color: "#1f2937",
  display: "flex",
  alignItems: "center",
  gap: "0.4rem",
};

const rulePts = {
  fontSize: "0.88rem",
  fontWeight: 900,
  flexShrink: 0,
  minWidth: 28,
  textAlign: "right",
};

const resetBadge = {
  fontSize: "0.6rem",
  fontWeight: 800,
  letterSpacing: "0.08em",
  background: "#fee2e2",
  color: "#991b1b",
  padding: "0.1rem 0.4rem",
  borderRadius: "999px",
};

const levelsGrid = {
  display: "flex",
  flexDirection: "column",
  gap: "0.4rem",
};

const levelRow = {
  display: "flex",
  alignItems: "center",
  gap: "0.7rem",
  padding: "0.6rem 0.75rem",
  borderRadius: "12px",
  background: "#f9fafb",
  border: "1px solid #f3f4f6",
};

const levelDot = {
  width: 12,
  height: 12,
  borderRadius: "50%",
  flexShrink: 0,
  boxShadow: "0 2px 6px rgba(0,0,0,0.2)",
};

const levelEmoji = {
  fontSize: "0.95rem",
  flexShrink: 0,
  width: 20,
  textAlign: "center",
};

const levelName = {
  flex: 1,
  fontSize: "0.88rem",
  fontWeight: 800,
  color: "#1f2937",
};

const levelMin = {
  fontSize: "0.82rem",
  fontWeight: 700,
  color: "#6b7280",
};

const footer = {
  padding: "0.85rem 1.25rem",
  borderTop: "1px solid #f3f4f6",
  fontSize: "0.75rem",
  fontWeight: 600,
  color: "#6b7280",
  textAlign: "center",
  background: "#fafafa",
  flexShrink: 0,
};

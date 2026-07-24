// src/ShareModal.js — Premium IMAGE-ONLY share card + QR (working Share button)
// Install:
//   npm i html-to-image qrcode

import React, { useEffect, useMemo, useRef, useState } from "react";
import { toPng } from "html-to-image";
import QRCode from "qrcode";
import { supabase } from "./supabaseClient";
import FireLevelMeter from "./FireLevelMeter";
import { theme as THEME } from "./theme";

const theme = THEME || {};
const colors = theme.colors || {};
const gradients = theme.gradients || {};

export default function ShareModal({
  profileId,
  profileName,
  heatScore,
  fireLevelLabel,
  streakCount = 0,
  onClose,
  onShareSuccess,
}) {
  const [checking, setChecking] = useState(true);
  const [alreadySharedToday, setAlreadySharedToday] = useState(false);
  const [loading, setLoading] = useState(false);
  const [qrDataUrl, setQrDataUrl] = useState(null);

  const cardRef = useRef(null);
  const APP_LINK = useMemo(() => window.location.origin, []);

  const IGNITE_BLUE = colors?.primary || "#1D4ED8";
  const INK = "#0b1220";

  const displayName = (profileName || "You").trim() || "You";
  const headline = `${displayName} is on fire!`;

  const FIRE_LEVEL_COLORS = {
    Spark: "#FACC15",
    Ember: "#FB923C",
    Fiery: "#F97316",
    Burning: "#EA580C",
    Ablaze: "#DC2626",
    Torched: "#B91C1C",
    Scorching: "#991B1B",
    Wildfire: "#7C2D12",
    Firestorm: "#7C3AED",
    Inferno: "#4C1D95",
  };
  const levelColor = FIRE_LEVEL_COLORS[fireLevelLabel] || "#FACC15";

  const igniteGradient =
    gradients?.ignite ||
    gradients?.primary ||
    "linear-gradient(135deg,#FFB400 0%,#FF6A00 50%,#E02121 100%)";

  const blueGradient = `linear-gradient(135deg, ${IGNITE_BLUE} 0%, #1e40af 100%)`;

  // Check if already shared today (for points gating only — not for count)
  useEffect(() => {
    let alive = true;

    async function checkToday() {
      try {
        if (!profileId) return;

        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const { data } = await supabase
          .from("share_attempts")
          .select("id")
          .eq("profile_id", profileId)
          .gte("created_at", today.toISOString())
          .limit(1);

        if (!alive) return;
        if (data?.length) setAlreadySharedToday(true);
      } catch {
      } finally {
        if (alive) setChecking(false);
      }
    }

    if (!profileId) setChecking(false);
    else checkToday();

    return () => { alive = false; };
  }, [profileId]);

  // QR
  useEffect(() => {
    let cancelled = false;
    async function makeQr() {
      try {
        const url = await QRCode.toDataURL(APP_LINK, {
          width: 240,
          margin: 1,
          errorCorrectionLevel: "M",
          color: { dark: INK, light: "#ffffff" },
        });
        if (!cancelled) setQrDataUrl(url);
      } catch {
        if (!cancelled) setQrDataUrl(null);
      }
    }
    makeQr();
    return () => { cancelled = true; };
  }, [APP_LINK]);

  async function recordShare() {
    if (!profileId) return;

    // Always insert a row so total share count is accurate
    await supabase.from("share_attempts").insert({
      profile_id: profileId,
      share_type: "social",
    });

    // Only award points once per day
    if (!alreadySharedToday) {
      await supabase.rpc("increment_heat_score", {
        profile_id_input: profileId,
        points: 5,
      });
      setAlreadySharedToday(true);
    }
  }

  async function dataUrlToFile(dataUrl) {
    const res = await fetch(dataUrl);
    const blob = await res.blob();
    return new File([blob], `ignite-accomplishments-${Date.now()}.png`, {
      type: "image/png",
    });
  }

  async function handleShareImageOnly() {
    if (loading) return;
    setLoading(true);

    try {
      await new Promise((r) => requestAnimationFrame(r));

      const dataUrl = await toPng(cardRef.current, {
        cacheBust: true,
        pixelRatio: 2,
      });

      const file = await dataUrlToFile(dataUrl);

      if (!navigator.share) {
        alert("Sharing is not supported on this device/browser.");
        return;
      }

      if (navigator.canShare && !navigator.canShare({ files: [file] })) {
        alert(
          "This device cannot share images here. Try Safari or Add to Home Screen."
        );
        return;
      }

      await navigator.share({ files: [file] });

      // Record after successful share
      await recordShare();

      onShareSuccess?.(!alreadySharedToday);
      onClose?.();
    } catch (e) {
      if (e?.name !== "AbortError") {
        alert(
          "Share failed. Try Safari or Add to Home Screen for best iPhone behavior."
        );
      }
    } finally {
      setLoading(false);
    }
  }

  if (checking) {
    return (
      <div style={styles.overlay}>
        <div style={styles.modal} onClick={(e) => e.stopPropagation()}>
          <div style={styles.loadingSpinner} />
        </div>
      </div>
    );
  }

  const points = Number.isFinite(Number(heatScore)) ? Number(heatScore) : 0;

  return (
    <div style={styles.overlay} onClick={onClose}>
      <div style={styles.modal} onClick={(e) => e.stopPropagation()}>
        <button style={styles.closeBtn} onClick={onClose}>
          ✕
        </button>

        {/* CARD THAT GETS CAPTURED */}
        <div ref={cardRef} style={styles.shareCard}>
          {/* Header */}
          <div style={styles.header}>
            <img
              src="/ignite-logo-flame.png"
              alt=""
              style={styles.logo}
              crossOrigin="anonymous"
            />
            <div style={styles.headline}>{headline}</div>
          </div>

          {/* Content */}
          <div style={styles.content}>
            {/* LEFT */}
            <div style={styles.leftCard}>
              <div style={styles.points}>{points.toLocaleString()}</div>
              <div style={styles.pointsLabel}>POINTS</div>

              <div style={{ ...styles.levelPill, background: levelColor }}>
                {fireLevelLabel || "Spark"}
              </div>

              <div style={styles.streak}>{streakCount} day streak</div>
            </div>

            {/* RIGHT */}
            <div style={styles.rightCard}>
              <div style={styles.meterBox}>
                <FireLevelMeter heatScore={points} />
              </div>
            </div>
          </div>

          {/* Footer */}
          <div style={{ ...styles.footer, background: blueGradient }}>
            <div>
              <div style={styles.footerTitle}>SCAN TO GET JEREMIAH.APP</div>
              <div style={styles.footerLink}>{APP_LINK}</div>
            </div>
            <div style={styles.qrWrap}>
              {qrDataUrl ? (
                <img src={qrDataUrl} alt="QR" style={styles.qr} />
              ) : (
                <div style={styles.qrFallback}>QR</div>
              )}
            </div>
          </div>

          <div style={{ height: 6, background: igniteGradient }} />
        </div>

        {/* Share button */}
        <button
          onClick={handleShareImageOnly}
          style={{ ...styles.shareBtn, background: igniteGradient }}
          disabled={loading}
        >
          {loading ? "Preparing…" : "Share"}
        </button>
      </div>
    </div>
  );
}

/* ================= STYLES ================= */

const styles = {
  overlay: {
    position: "fixed",
    inset: 0,
    background: "rgba(0,0,0,0.6)",
    backdropFilter: "blur(10px)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    padding: 16,
    zIndex: 1000,
  },
  modal: {
    position: "relative",
    width: "100%",
    maxWidth: 420,
    background: "rgba(255,255,255,0.92)",
    borderRadius: 26,
    padding: 14,
    border: "1px solid rgba(17,24,39,0.10)",
    boxShadow: "0 30px 90px rgba(0,0,0,0.35)",
  },
  closeBtn: {
    position: "absolute",
    top: 10,
    right: 10,
    width: 36,
    height: 36,
    borderRadius: 999,
    border: "1px solid rgba(17,24,39,0.10)",
    background: "rgba(255,255,255,0.85)",
    color: "#6b7280",
    cursor: "pointer",
    fontSize: "1.05rem",
    display: "grid",
    placeItems: "center",
  },
  loadingSpinner: {
    width: 44,
    height: 44,
    margin: "40px auto",
    border: "3px solid #e5e7eb",
    borderTopColor: "#f97316",
    borderRadius: "50%",
    animation: "spin 0.8s linear infinite",
  },
  shareCard: {
    borderRadius: 22,
    overflow: "hidden",
    boxShadow: "0 20px 50px rgba(0,0,0,0.25)",
    border: "1px solid rgba(17,24,39,0.10)",
    background: "#fff",
  },
  header: {
    padding: 16,
    textAlign: "center",
    background:
      "radial-gradient(circle at top, rgba(240,249,255,0.92) 0%, #ffffff 65%)",
  },
  logo: { width: 28, marginBottom: 6 },
  headline: {
    fontSize: "1.25rem",
    fontWeight: 950,
    color: "#0b1220",
    letterSpacing: "-0.01em",
    textTransform: "capitalize",
  },
  content: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: 12,
    padding: 14,
  },
  leftCard: {
    borderRadius: 18,
    padding: 14,
    background: "#ffffff",
    boxShadow: "0 10px 24px rgba(0,0,0,0.08)",
    border: "1px solid rgba(17,24,39,0.08)",
    textAlign: "center",
    minHeight: 220,
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
  },
  points: { fontSize: "2.25rem", fontWeight: 950, color: "#0b1220" },
  pointsLabel: {
    marginTop: 4,
    fontSize: "0.7rem",
    letterSpacing: "0.2em",
    fontWeight: 850,
    color: "#64748b",
  },
  levelPill: {
    margin: "12px auto 0",
    padding: "10px 16px",
    borderRadius: 999,
    color: "#fff",
    fontWeight: 950,
    textTransform: "uppercase",
    fontSize: "0.78rem",
    letterSpacing: "0.06em",
  },
  streak: {
    marginTop: 10,
    fontSize: "0.85rem",
    fontWeight: 850,
    color: "#111827",
    opacity: 0.9,
  },
  rightCard: {
    borderRadius: 18,
    padding: 8,
    background: "#ffffff",
    boxShadow: "0 10px 24px rgba(0,0,0,0.08)",
    border: "1px solid rgba(17,24,39,0.08)",
    minHeight: 220,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    overflow: "visible",
  },
  meterBox: {
    width: "100%",
    height: 240,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    overflow: "visible",
  },
  footer: {
    padding: 14,
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    color: "#fff",
    gap: 12,
  },
  footerTitle: {
    fontSize: "0.75rem",
    letterSpacing: "0.15em",
    fontWeight: 900,
    textTransform: "uppercase",
  },
  footerLink: { marginTop: 6, fontSize: "0.75rem", opacity: 0.95 },
  qrWrap: {
    background: "#fff",
    padding: 6,
    borderRadius: 14,
    boxShadow: "0 10px 24px rgba(0,0,0,0.18)",
    overflow: "hidden",
  },
  qr: { width: 92, height: 92, display: "block" },
  qrFallback: { width: 92, height: 92, display: "grid", placeItems: "center" },
  shareBtn: {
    width: "100%",
    marginTop: 12,
    padding: 14,
    borderRadius: 999,
    border: "none",
    color: "#fff",
    fontWeight: 950,
    textTransform: "uppercase",
    cursor: "pointer",
    boxShadow: "0 10px 24px rgba(249,115,22,0.30)",
  },
};

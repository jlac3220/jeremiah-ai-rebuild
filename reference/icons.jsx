// src/StartupPage.jsx
import React, { useEffect, useState } from "react";
import { theme } from "./theme";

const { colors } = theme;

export default function StartupPage({ onDone }) {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [visible, setVisible] = useState(false);
  const [fadeOut, setFadeOut] = useState(false);

  useEffect(() => {
    const img = new Image();
    img.onload = () => setImageLoaded(true);
    img.src = "/combo-logo-cropped.png";
  }, []);

  useEffect(() => {
    if (!imageLoaded) return;

    const show = setTimeout(() => setVisible(true), 50);
    const hide = setTimeout(() => setFadeOut(true), 6000);
    const done = setTimeout(() => onDone?.(), 6600);

    return () => {
      clearTimeout(show);
      clearTimeout(hide);
      clearTimeout(done);
    };
  }, [imageLoaded, onDone]);

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        background:
          "linear-gradient(180deg, #f8fafc 0%, #f1f5f9 50%, #e9eef4 100%)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        opacity: fadeOut ? 0 : 1,
        transition: "opacity 0.5s ease",
      }}
    >
      {/* Logo — moved upward */}
      {imageLoaded && (
        <img
          src="/combo-logo-cropped.png"
          alt="Ignite"
          style={{
            width: "92vw",
            maxHeight: "50vh",
            height: "auto",
            objectFit: "contain",
            opacity: visible ? 1 : 0,
            transform: visible
              ? "translateY(-1.4rem) scale(1)"
              : "translateY(-1.4rem) scale(0.92)",
            transition:
              "opacity 1.8s cubic-bezier(0.25, 0.1, 0.25, 1), transform 2.2s cubic-bezier(0.25, 0.1, 0.25, 1)",
          }}
        />
      )}

      {/* Tagline — STACK ON MOBILE, NO DOT */}
      <div
        className="startup-tagline"
        style={{
          position: "absolute",
          bottom: "2.2rem",
          left: 0,
          right: 0,
          textAlign: "center",
          fontSize: "0.975rem",
          lineHeight: "1.45rem",
          letterSpacing: "0.16em",
          textTransform: "uppercase",
          fontWeight: 600,
          color: colors.black.deep,
          opacity: visible ? 1 : 0,
          transform: visible ? "translateY(0)" : "translateY(8px)",
          transition: "opacity 1s ease 1.6s, transform 1s ease 1.6s",
          padding: "0 1.5rem",
          pointerEvents: "none",
        }}
      >
        <span className="startup-line">Apostles&apos; Doctrine</span>
        <span className="dot">•</span>
        <span className="startup-line">Pentecostal Experience</span>
      </div>

      <style>{`
        /* desktop/tablet stays inline */
        .startup-tagline{
          display: inline;
        }

        /* ✅ mobile: force stack + remove dot */
        @media (max-width: 480px){
          .startup-tagline{
            display: flex !important;
            flex-direction: column;
            align-items: center;
            gap: 0.25rem;
          }
          .startup-tagline .dot{
            display: none !important;
          }
          .startup-tagline .startup-line{
            display: block;
          }
        }
      `}</style>
    </div>
  );
}

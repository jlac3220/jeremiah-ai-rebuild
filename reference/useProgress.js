// src/BottomNav.js — Bottom navigation (Jeremiah emphasized)
import React from "react";
import { theme } from "./theme";

const { colors } = theme || {};

// ✅ IMPORTANT: id MUST match the view key App.js expects.
const NAV_ITEMS = [
  { id: "home", label: "Home", iconSrc: "/nav-icons/home.png" },

  // 🔥 Jeremiah → Ask page (PRIMARY, moved to 2nd position)
  { id: "ask", label: "Jeremiah", isFlame: true },

  {
    id: "rapidFire",
    label: "Rapid",
    iconSrc: "/nav-icons/rapid.png",
    isRapid: true,
  },

  { id: "studies", label: "Studies", iconSrc: "/nav-icons/studies.png" },

  { id: "bible", label: "Bible", iconSrc: "/nav-icons/bible.png" },
];

export default function BottomNav({ currentView, onNavigate }) {
  return (
    <nav className="bottom-nav" aria-label="Main navigation">
      <div className="bottom-nav-rail">
        {NAV_ITEMS.map((item) => {
          const isActive = currentView === item.id;

          return (
            <button
              key={item.id}
              type="button"
              className={`nav-item ${isActive ? "active" : ""} ${
                item.isFlame ? "nav-item-flame" : ""
              }`}
              onClick={() => onNavigate(item.id)}
              aria-current={isActive ? "page" : undefined}
              aria-label={item.label}
            >
              <div className="nav-icon">
                {item.isFlame ? (
                  <img
                    src="/ignite-logo-flame.png"
                    alt=""
                    className="nav-flame-icon"
                    draggable="false"
                  />
                ) : (
                  <img
                    src={item.iconSrc}
                    alt=""
                    className={`nav-img ${item.isRapid ? "nav-img-rapid" : ""}`}
                    draggable="false"
                  />
                )}
              </div>

              <span className="nav-label" aria-hidden="true">{item.label}</span>
              {isActive && <span className="nav-active-dot" aria-hidden="true" />}
            </button>
          );
        })}
      </div>

      <style>{`
        :root{
          --appMax: 960px;
        }

        /* ===== Wrapper ===== */
        .bottom-nav {
          position: fixed;
          left: 0;
          right: 0;
          bottom: 0;
          z-index: 100;

          display: flex;
          justify-content: center;

          background: transparent;
          padding-bottom: env(safe-area-inset-bottom, 0);
        }

        /* ===== Rail ===== */
        .bottom-nav-rail{
          width: 100%;
          max-width: var(--appMax);
          margin: 0 auto;

          height: 4.75rem;

          display: flex;
          justify-content: space-around;
          align-items: center;

          padding: 0 0.75rem;
          box-sizing: border-box;

          background: #ffffff;
          border-top: 1px solid rgba(209,213,219,0.4);
        }

        /* ===== Items ===== */
        .nav-item {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 0.35rem;

          padding: 0.5rem 0.75rem;
          background: transparent;
          border: none;
          cursor: pointer;
          position: relative;

          border-radius: 14px;
          transition: background 0.15s ease, transform 0.15s ease;
          min-width: 64px;
        }

        .nav-item:active {
          background: ${colors?.black?.pale || "#f5f5f5"};
          transform: scale(0.97);
        }

        .nav-item:focus-visible {
          outline: 2px solid #1D4ED8;
          outline-offset: 2px;
        }

        .nav-item.active .nav-label {
          color: ${colors?.text?.primary || "#111827"};
        }

        /* ===== Active dot indicator ===== */
        .nav-active-dot {
          position: absolute;
          bottom: 0.15rem;
          left: 50%;
          transform: translateX(-50%);
          width: 4px;
          height: 4px;
          border-radius: 999px;
          background: #1D4ED8;
        }

        .nav-item-flame .nav-active-dot {
          background: #F97316;
        }

        /* ===== Icons ===== */
        .nav-icon {
          display: flex;
          align-items: center;
          justify-content: center;
          line-height: 1;
        }

        .nav-img{
          width: 26px;
          height: 26px;
          object-fit: contain;
          transform: translateZ(0);
        }

        .nav-img-rapid{
          width: 30px;
          height: 30px;
          transform: translateY(-1px);
        }

        /* 🔥 Jeremiah emphasis */
        .nav-item-flame{
          transform: translateY(-2px);
        }

        .nav-flame-icon{
          width: 40px;
          height: 40px;
          object-fit: contain;
          filter: drop-shadow(0 6px 12px rgba(0,0,0,0.28));
        }

        /* ===== Labels ===== */
        .nav-label {
          font-size: 0.7rem;
          font-weight: 700;
          color: #6b7280;
          letter-spacing: 0.01em;
        }

        /* ===== Small screens ===== */
        @media (max-width: 380px) {
          .nav-item {
            padding: 0.4rem 0.5rem;
            min-width: 56px;
          }

          .nav-label {
            font-size: 0.65rem;
          }

          .nav-img{
            width: 24px;
            height: 24px;
          }

          .nav-img-rapid{
            width: 28px;
            height: 28px;
          }

          .nav-flame-icon{
            width: 34px;
            height: 34px;
          }
        }

        @media (max-width: 980px){
          .bottom-nav-rail{
            max-width: 100%;
          }
        }
      `}</style>
    </nav>
  );
}

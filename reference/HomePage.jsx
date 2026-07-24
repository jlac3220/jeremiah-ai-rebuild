// src/PageHeader.js
import React from "react";
import { theme } from "./theme";
import { BI } from "./icons";

const { colors } = theme || {};

export default function PageHeader({
  title,
  greeting,
  onBack,
  backLabel,
  onProfile,
  profileImageUrl,
  unreadCount,
}) {
  const showBack = typeof onBack === "function";
  const hasGreeting = Boolean(greeting);

  const ICON_GRAY = "#6B6B6B";

  const avatarCircleStyle = {
    width: 34,
    height: 34,
    borderRadius: "999px",
    border: `1px solid ${ICON_GRAY}`,
    background: "#F3F4F6",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  };

  let badgeUnread = 0;
  if (typeof unreadCount === "number") {
    badgeUnread = unreadCount;
  } else {
    try {
      if (typeof window !== "undefined" && window.localStorage) {
        const raw = window.localStorage.getItem("ignite_unread_count");
        const parsed = raw != null ? parseInt(raw, 10) : 0;
        if (!Number.isNaN(parsed)) {
          badgeUnread = parsed;
        }
      }
    } catch {
      badgeUnread = 0;
    }
  }

  return (
    <header
      style={{
        position: "sticky",
        top: 0,
        zIndex: 100,
        paddingTop: "env(safe-area-inset-top)",
        background: "transparent",
      }}
    >
      <div
        style={{
          maxWidth: 960,
          margin: "0 auto",
          padding: "0.7rem 1rem 0.4rem",
          boxSizing: "border-box",
          background: "rgba(255,255,255,0.92)",
          backdropFilter: "blur(12px)",
          WebkitBackdropFilter: "blur(12px)",
          borderBottom: "1px solid rgba(209,213,219,0.4)",
          borderBottomLeftRadius: 24,
          borderBottomRightRadius: 24,
        }}
      >
        {/* TOP ROW: back + title + profile */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            marginBottom: "0.25rem",
            gap: "0.75rem",
          }}
        >
          {/* LEFT: back arrow or spacer */}
          <div
            style={{
              flex: 1,
              minWidth: 0,
              display: "flex",
              alignItems: "center",
            }}
          >
            {showBack ? (
              <button
                onClick={onBack}
                className="ph-btn"
                style={{
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  padding: "4px",
                  display: "inline-flex",
                  alignItems: "center",
                  borderRadius: 8,
                }}
                aria-label={backLabel ? `Back to ${backLabel}` : "Go back"}
              >
                <BI
                  name="chevron-left"
                  size={22}
                  style={{ color: ICON_GRAY }}
                />
              </button>
            ) : (
              <div style={{ width: 20 }} />
            )}
          </div>

          {/* CENTER: title */}
          <div
            style={{
              flexShrink: 0,
              textAlign: "center",
              padding: "0 6px",
            }}
          >
            <h1
              style={{
                margin: 0,
                fontSize: "1.65rem",
                fontWeight: 800,
                color: colors?.text?.primary ?? "#111827",
                letterSpacing: "-0.02em",
              }}
            >
              {title}
            </h1>
          </div>

          {/* RIGHT: profile avatar */}
          <div
            style={{
              flex: 1,
              minWidth: 0,
              display: "flex",
              alignItems: "center",
              justifyContent: "flex-end",
            }}
          >
            <button
              onClick={onProfile}
              className="ph-btn"
              style={{
                background: "none",
                border: "none",
                cursor: "pointer",
                padding: "4px",
                lineHeight: 1,
                borderRadius: 999,
              }}
              aria-label="View profile"
            >
              <div style={{ position: "relative", display: "inline-flex" }}>
                <div style={avatarCircleStyle}>
                  {profileImageUrl ? (
                    <img
                      src={profileImageUrl}
                      alt="Profile"
                      style={{
                        width: "100%",
                        height: "100%",
                        borderRadius: "999px",
                        objectFit: "cover",
                      }}
                    />
                  ) : (
                    <BI name="person" size={18} style={{ color: ICON_GRAY }} />
                  )}
                </div>

                {badgeUnread > 0 && (
                  <span
                    aria-label={`${badgeUnread} unread notification${badgeUnread > 1 ? "s" : ""}`}
                    style={{
                      position: "absolute",
                      top: -3,
                      right: -3,
                      minWidth: 16,
                      height: 16,
                      padding: "0 4px",
                      borderRadius: 999,
                      background: colors?.flame?.red || "#E02121",
                      color: "#ffffff",
                      fontSize: 10,
                      fontWeight: 700,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      boxShadow: "0 0 0 1px #ffffff",
                    }}
                  >
                    {badgeUnread > 9 ? "9+" : badgeUnread}
                  </span>
                )}
              </div>
            </button>
          </div>
        </div>

        {/* GREETING SLOT */}
        <div
          style={{
            textAlign: "center",
            fontSize: "1.02rem",
            fontWeight: 600,
            color: hasGreeting ? "rgba(17,24,39,0.82)" : "transparent",
            height: "1.25rem",
            lineHeight: "1.25rem",
            pointerEvents: "none",
            visibility: hasGreeting ? "visible" : "hidden",
          }}
        >
          {hasGreeting ? greeting : "\u00A0"}
        </div>
      </div>

      <style>{`
        .ph-btn:focus-visible {
          outline: 2px solid #1D4ED8;
          outline-offset: 2px;
        }
      `}</style>
    </header>
  );
}

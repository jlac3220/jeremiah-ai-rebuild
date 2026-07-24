// src/HomePage.js — Daily Verse pulls from rapid_fire_quizzes (3D section icons + bigger Jeremiah flame)
import React, { useEffect, useMemo, useState } from "react";
import { theme } from "./theme";
import PageHeader from "./PageHeader";
import { supabase } from "./supabaseClient";

const { gradients } = theme;

const SCRIPTURES_FALLBACK = [
  {
    text: "For God so loved the world, that he gave his only begotten Son, that whosoever believeth in him should not perish, but have everlasting life.",
    ref: "John 3:16",
  },
];

const DAILY_MEMORY_CACHE_KEY = "ignite_daily_memory_verse_v6_utc";

function dayKeyUTC() {
  const d = new Date();
  return `${d.getUTCFullYear()}-${String(d.getUTCMonth() + 1).padStart(
    2,
    "0"
  )}-${String(d.getUTCDate()).padStart(2, "0")}`;
}

function hashToIndex(key, length) {
  let hash = 0;
  for (let i = 0; i < key.length; i++) {
    hash = key.charCodeAt(i) + ((hash << 5) - hash);
    hash |= 0;
  }
  return Math.abs(hash) % length;
}

function pickFallbackVerse() {
  return SCRIPTURES_FALLBACK[0];
}

export default function HomePage({
  onStartNewBirth,
  onShowProfile,
  onShowAccount,
  onShare,
  onConnect,
  notifications = [],
  profileImageUrl,
  onStartRapidFire,
  onOpenJeremiah,
}) {
  const [scripture, setScripture] = useState({ text: "", ref: "" });
  const [loading, setLoading] = useState(true);
  const [banner, setBanner] = useState(null);

  const unreadCount = useMemo(
    () => notifications.filter((n) => !n.isRead).length,
    [notifications]
  );

  // Load announcement banner (only priority="banner")
  useEffect(() => {
    let alive = true;

    async function loadBanner() {
      try {
        const now = new Date().toISOString();
        const { data } = await supabase
          .from("app_notifications")
          .select("*")
          .eq("is_active", true)
          .eq("priority", "banner")
          .or(`expires_at.is.null,expires_at.gt.${now}`)
          .order("created_at", { ascending: false })
          .limit(1);

        if (alive && data?.length) {
          setBanner(data[0]);
        }
      } catch (err) {
        console.error("Error loading banner:", err);
      }
    }

    loadBanner();
    return () => {
      alive = false;
    };
  }, []);

  useEffect(() => {
    let alive = true;
    const today = dayKeyUTC();

    async function loadVerse() {
      setLoading(true);

      try {
        const cached = JSON.parse(
          localStorage.getItem(DAILY_MEMORY_CACHE_KEY) || "{}"
        );
        if (cached.day === today && cached.text) {
          if (alive) {
            setScripture({ text: cached.text, ref: cached.ref });
            setLoading(false);
          }
          return;
        }
      } catch {}

      try {
        const { data } = await supabase
          .from("rapid_fire_quizzes")
          .select("verse_ref, verse_text")
          .order("display_order", { ascending: true });

        const usable = (data || []).filter((v) => v.verse_text);

        if (usable.length) {
          const picked = usable[hashToIndex(today, usable.length)];
          const normalized = {
            text: picked.verse_text,
            ref: picked.verse_ref,
          };

          localStorage.setItem(
            DAILY_MEMORY_CACHE_KEY,
            JSON.stringify({ day: today, ...normalized })
          );

          if (alive) setScripture(normalized);
        } else {
          const fallback = pickFallbackVerse();
          if (alive) setScripture(fallback);
        }
      } catch {
        if (alive) setScripture(pickFallbackVerse());
      } finally {
        if (alive) setLoading(false);
      }
    }

    loadVerse();
    return () => {
      alive = false;
    };
  }, []);

  const goJeremiah = () => {
    if (typeof onOpenJeremiah === "function") onOpenJeremiah();
  };

  return (
    <div className="home-page">
      {/* GLOBAL ANNOUNCEMENT BANNER */}
      {banner && (
        <div className="global-banner" role="status" aria-live="polite">
          <div className="global-banner-content">
            {banner.icon && <span className="banner-icon" aria-hidden="true">{banner.icon}</span>}
            <span className="banner-text">
              <strong>{banner.title}</strong>
              {banner.body && <> — {banner.body}</>}
            </span>
          </div>
        </div>
      )}

      <PageHeader
        title="Home"
        onProfile={onShowProfile}
        onAccount={onShowAccount}
        onShare={onShare}
        onConnect={onConnect}
        unreadCount={unreadCount}
        profileImageUrl={profileImageUrl}
      />

      <main id="home-main">
        {/* INTRO */}
        <section className="intro" aria-label="App introduction">
          <div className="intro-surface">
            <div className="intro-bg" aria-hidden="true" />
            <div className="intro-rail">
              <div className="intro-logo">
                <img src="/ignite-logo.png" alt="Ignite" />
              </div>

              <div className="intro-kicker" aria-label="Apostles' Doctrine · Pentecostal Experience">
                <span>Apostles&apos; Doctrine</span>
                <span className="dot" aria-hidden="true">•</span>
                <span>Pentecostal Experience</span>
              </div>
            </div>
          </div>
        </section>

        <div className="intro-rule-wrap" aria-hidden="true">
          <div className="intro-rule" />
        </div>

        {/* ✅ JEREMIAH MOVED TO TOP */}
        <section className="feature jeremiah" onClick={goJeremiah} aria-label="Jeremiah AI assistant">
        <div className="section-surface jeremiah-surface">
          <div className="feature-rail center">
            <h2 className="feature-title feature-title-row">
              <img
                src="/ignite-logo-flame.png"
                alt=""
                className="feature-flame feature-flame-big"
                draggable="false"
              />
              <span>Jeremiah</span>
            </h2>

            <p className="feature-copy">
              Ask questions naturally. Jeremiah responds using the teaching,
              passages, and structure already built into this app — keeping your
              questions grounded and consistent.
            </p>

            <button
              className="feature-btn"
              onClick={(e) => {
                e.stopPropagation();
                goJeremiah();
              }}
            >
              Ask Jeremiah
            </button>
          </div>
        </div>
      </section>

      {/* RAPID FIRE */}
      <section className="feature rapid" aria-label="Rapid Fire quiz">
        <div className="section-surface">
          <div className="feature-rail center">
            <h2 className="feature-title feature-title-row">
              <img
                src="/nav-icons/rapid.png"
                alt=""
                className="feature-emoji"
                draggable="false"
              />
              <span>Rapid Fire</span>
            </h2>

            <p className="feature-copy">
              Sharpen Scripture recall. One verse at a time.
            </p>

            {!loading && (
              <>
                <div className="rapid-ref">{scripture.ref}</div>
                <p className="rapid-verse">"{scripture.text}"</p>

                {onStartRapidFire && (
                  <button className="feature-btn" onClick={onStartRapidFire}>
                    Start Rapid Fire
                  </button>
                )}
              </>
            )}
          </div>
        </div>
      </section>

      {/* STUDIES */}
      <section className="feature studies" aria-label="Bible studies">
        <div className="section-surface studies-surface">
          <div className="feature-rail center">
            <h2 className="feature-title feature-title-row">
              <img
                src="/nav-icons/studies.png"
                alt=""
                className="feature-emoji"
                draggable="false"
              />
              <span className="studies-title-text">Studies</span>
            </h2>

            <p className="feature-copy">
              Explore the whole Bible with clear, Pentecostal teaching—grounded
              in the Apostles&apos; Doctrine—connecting Scripture to Scripture
              from foundational truth to everyday living until the message is
              plain.
            </p>
            <button className="feature-btn" onClick={onStartNewBirth}>
              Enter Studies
            </button>
          </div>
        </div>
      </section>
      </main>

      <style>{`
        :root{ --appMax: 960px; }

        .home-page{
          min-height: 100vh;
          background:#fff;
          padding-bottom: calc(6.5rem + env(safe-area-inset-bottom, 0px));
        }

        /* GLOBAL ANNOUNCEMENT BANNER */
        .global-banner{
          background: linear-gradient(135deg, #FF6A00 0%, #E02121 100%);
          color: #fff;
          padding: 0.75rem 1rem;
          text-align: center;
          position: sticky;
          top: 0;
          z-index: 1000;
          box-shadow: 0 2px 8px rgba(0,0,0,0.15);
        }

        .global-banner-content{
          max-width: var(--appMax);
          margin: 0 auto;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
          flex-wrap: wrap;
        }

        .banner-icon{
          font-size: 1.1rem;
        }

        .banner-text{
          font-size: 0.9rem;
          line-height: 1.4;
        }

        .banner-text strong{
          font-weight: 800;
        }

        @media (max-width: 480px){
          .global-banner{
            padding: 0.6rem 0.75rem;
          }
          .banner-text{
            font-size: 0.82rem;
          }
        }

        .intro-surface{
          max-width:var(--appMax);
          margin:0 auto;
          position:relative;
          overflow:hidden;
          border-bottom-left-radius:24px;
          border-bottom-right-radius:24px;
        }

        .intro-bg{
          position:absolute;
          inset:0;
          background:
            radial-gradient(1200px 360px at 50% -120px, rgba(255,122,0,.16), transparent 70%),
            linear-gradient(180deg,#fff 0%,#f8fafc 60%,#eef2f7 100%);
        }

        .intro-rail{
          position:relative;
          z-index:1;
          max-width:760px;
          margin:0 auto;
          padding:2.8rem 1rem 2.2rem;
          text-align:center;
        }

        /* ✅ BIGGER LOGO */
        .intro-logo img{
          width:min(96vw,720px);
          max-height:50vh;
          object-fit:contain;
        }

        .intro-kicker{
          display:flex;
          justify-content:center;
          align-items:center;
          gap:.6rem;
          font-size:.76rem;
          font-weight:900;
          letter-spacing:.14em;
          text-transform:uppercase;
          color:#475569;
          margin-bottom:.75rem;
        }

        .section-surface{
          max-width:var(--appMax);
          margin:0 auto;
          padding:3rem 0;
        }

        .studies-surface{
          background:linear-gradient(135deg,#1e3a8a,#1e40af);
          border-radius:24px;
        }

        .jeremiah-surface{
          background:linear-gradient(135deg,#f8fafc,#eef2f7);
          border-radius:24px;
        }

        .feature-rail{
          max-width:960px;
          margin:0 auto;
          padding:0 1.25rem;
          text-align:center;
          display:flex;
          flex-direction:column;
          align-items:center;
        }

        .studies .feature-rail,
        .studies .feature-rail *{ color:#fff; }

        .feature-title{
          font-size:1.85rem;
          font-weight:950;
          margin-bottom:.75rem;
        }

        .feature-title-row{
          display:inline-flex;
          align-items:center;
          gap:12px;
        }

        .feature-emoji{
          width:44px;
          height:44px;
          object-fit:contain;
          filter: drop-shadow(0 10px 18px rgba(0,0,0,0.22));
          transform: translateY(1px);
          user-select:none;
          -webkit-user-drag:none;
        }

        .feature-flame{
          width:42px;
          height:42px;
          object-fit:contain;
          user-select:none;
          -webkit-user-drag:none;
        }

        .feature-flame-big{
          width:58px;
          height:58px;
          filter: drop-shadow(0 12px 22px rgba(0,0,0,0.28));
          transform: translateY(2px);
        }

        .feature-copy{
          font-size:1.02rem;
          line-height:1.65;
          max-width:720px;
          margin-bottom:1.35rem;
        }

        .feature-btn{
          border-radius:999px;
          padding:.85rem 1.9rem;
          border:none;
          background:${gradients?.flame};
          color:#fff;
          font-weight:900;
          cursor:pointer;
          transition: opacity 0.15s ease, transform 0.15s ease;
        }

        .feature-btn:active{
          opacity:0.85;
          transform:scale(0.97);
        }

        .feature-btn:focus-visible{
          outline: 2px solid #fff;
          outline-offset: 2px;
          box-shadow: 0 0 0 4px rgba(29,78,216,0.4);
        }

        /* intro divider */
        .intro-rule-wrap{
          max-width: var(--appMax);
          margin: 0 auto;
          padding: 0 1.5rem;
        }

        .intro-rule{
          height: 1px;
          background: linear-gradient(90deg, transparent, rgba(148,163,184,0.35), transparent);
          margin: 0.5rem 0 0.5rem;
        }

        .rapid-ref{
          font-size:.9rem;
          font-weight:900;
          letter-spacing:.14em;
          margin-bottom:.6rem;
          color:#1e40af;
        }

        .rapid-verse{
          font-size:1.12rem;
          font-style:italic;
          line-height:1.7;
          margin-bottom:1.35rem;
        }

        @media (max-width:480px){
          .intro-kicker{
            flex-direction:column;
            gap:.25rem;
          }
          .intro-kicker .dot{ display:none; }

          .feature-emoji{ width:38px; height:38px; }
          .feature-flame{ width:38px; height:38px; }
          .feature-flame-big{ width:50px; height:50px; }
        }

        @media (max-width:980px){
          .intro-surface,
          .studies-surface,
          .jeremiah-surface{ border-radius:0; }
        }

        .studies-title-text{
          margin-left: 12px;
        }
        
        @media (max-width:480px){
          .studies-title-text{
            margin-left: 10px;
          }
        }
      `}</style>
    </div>
  );
}

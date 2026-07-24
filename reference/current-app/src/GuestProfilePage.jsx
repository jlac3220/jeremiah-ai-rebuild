// src/GuestProfilePage.js - Simplified profile page for guest users
import React from "react";
import PageHeader from "./PageHeader";

export default function GuestProfilePage({
  onBack,
  backLabel,
  accomplishments,
  onCreateAccount,
}) {
  const {
    dailyStreak = 0,
    devotionsCompleted = 0,
    studiesCompleted = 0,
    fireLevelLabel = "Spark",
  } = accomplishments || {};

  return (
    <div className="guest-profile-page">
      <PageHeader title="Profile" onBack={onBack} backLabel={backLabel} />

      <main className="guest-profile-content">
        {/* Guest avatar */}
        <section className="avatar-section">
          <div className="avatar-circle">
            <svg
              width="48"
              height="48"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
            >
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
              <circle cx="12" cy="7" r="4" />
            </svg>
          </div>
          <h2 className="guest-name">Guest</h2>
          <p className="guest-label">Progress saved locally only</p>
        </section>

        {/* Local stats */}
        <section className="stats-section">
          <div className="section-title">YOUR PROGRESS</div>
          <div className="stats-card">
            <div className="stats-grid">
              <div className="stat-item">
                <div className="stat-value">{dailyStreak || "—"}</div>
                <div className="stat-label">Daily Streak</div>
              </div>
              <div className="stat-item">
                <div className="stat-value">{studiesCompleted || "—"}</div>
                <div className="stat-label">Studies</div>
              </div>
              <div className="stat-item">
                <div className="stat-value">{devotionsCompleted || "—"}</div>
                <div className="stat-label">Devotions</div>
              </div>
              <div className="stat-item">
                <div className="stat-value fire-level">{fireLevelLabel}</div>
                <div className="stat-label">Fire Level</div>
              </div>
            </div>
          </div>
        </section>

        {/* Sign up CTA */}
        <section className="cta-section">
          <div className="cta-card">
            <img src="/ignite-logo-flame.png" alt="" className="cta-icon" />
            <h3 className="cta-title">Save Your Progress</h3>
            <p className="cta-description">
              Create a free account to sync your progress across devices, add
              family members, and never lose your streak.
            </p>
            <button className="cta-button" onClick={onCreateAccount}>
              Create Free Account
            </button>
          </div>
        </section>

        {/* Info note */}
        <p className="info-note">
          As a guest, your progress is saved on this device only. If you clear
          your browser data or switch devices, your progress will be lost.
        </p>
      </main>

      <style>{`
        .guest-profile-page {
          min-height: 100vh;
          background: radial-gradient(circle at top, #f9fafb 0%, #eef1f5 40%, #e5e7eb 100%);
        }

        .guest-profile-content {
          max-width: 480px;
          margin: 0 auto;
          padding: 0 1rem 4rem;
        }

        /* Avatar section */
        .avatar-section {
          display: flex;
          flex-direction: column;
          align-items: center;
          padding: 1.5rem 0 1rem;
        }

        .avatar-circle {
          width: 100px;
          height: 100px;
          border-radius: 50%;
          background: #f3f4f6;
          border: 4px solid #ffffff;
          box-shadow: 0 4px 16px rgba(0, 0, 0, 0.08);
          display: flex;
          align-items: center;
          justify-content: center;
          color: #9ca3af;
        }

        .guest-name {
          margin: 0.75rem 0 0.25rem;
          font-size: 1.4rem;
          font-weight: 700;
          color: #1f2937;
        }

        .guest-label {
          margin: 0;
          font-size: 0.85rem;
          color: #9ca3af;
          font-style: italic;
        }

        /* Section title */
        .section-title {
          font-size: 0.7rem;
          font-weight: 700;
          letter-spacing: 0.08em;
          color: #6b7280;
          margin: 1.5rem 0 0.6rem;
          text-transform: uppercase;
        }

        /* Stats section */
        .stats-card {
          background: #ffffff;
          border-radius: 18px;
          padding: 1.25rem;
          border: 1px solid #e5e7eb;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.04);
        }

        .stats-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 1rem;
        }

        .stat-item {
          text-align: center;
          padding: 0.75rem;
          background: #f9fafb;
          border-radius: 12px;
          border: 1px solid #f3f4f6;
        }

        .stat-value {
          font-size: 1.25rem;
          font-weight: 800;
          color: #1f2937;
        }

        .stat-value.fire-level {
          font-size: 0.9rem;
          color: #f97316;
        }

        .stat-label {
          font-size: 0.7rem;
          color: #6b7280;
          margin-top: 0.2rem;
        }

        /* CTA section */
        .cta-section {
          margin-top: 1.5rem;
        }

        .cta-card {
          background: linear-gradient(135deg, #fffbeb 0%, #fef3c7 100%);
          border-radius: 18px;
          padding: 1.5rem;
          border: 1px solid #fde68a;
          text-align: center;
        }

        .cta-icon {
          width: 40px;
          height: 40px;
          margin-bottom: 0.75rem;
        }

        .cta-title {
          margin: 0 0 0.5rem;
          font-size: 1.1rem;
          font-weight: 700;
          color: #92400e;
        }

        .cta-description {
          margin: 0 0 1rem;
          font-size: 0.85rem;
          color: #a16207;
          line-height: 1.5;
        }

        .cta-button {
          width: 100%;
          padding: 0.85rem 1rem;
          border-radius: 999px;
          border: none;
          font-size: 0.95rem;
          font-weight: 700;
          background: linear-gradient(135deg, #FFB400 0%, #FF6A00 50%, #E02121 100%);
          color: #ffffff;
          cursor: pointer;
          box-shadow: 0 4px 14px rgba(255, 106, 0, 0.3);
          transition: all 0.15s ease;
        }

        .cta-button:hover {
          box-shadow: 0 6px 20px rgba(255, 106, 0, 0.4);
          transform: translateY(-1px);
        }

        /* Info note */
        .info-note {
          margin: 1.5rem 0 0;
          font-size: 0.8rem;
          color: #9ca3af;
          text-align: center;
          line-height: 1.5;
        }

        @media (max-width: 480px) {
          .guest-profile-content {
            padding: 0 0.75rem 3.5rem;
          }

          .avatar-circle {
            width: 88px;
            height: 88px;
          }

          .avatar-circle svg {
            width: 40px;
            height: 40px;
          }
        }
      `}</style>
    </div>
  );
}

// src/GuestPromptModal.js - Prompts guests to create an account
import React from "react";

export default function GuestPromptModal({
  onCreateAccount,
  onLogin,
  onContinueAsGuest,
  onClose,
}) {
  return (
    <div className="modal-overlay" role="dialog" aria-modal="true" aria-labelledby="guest-modal-title" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        {/* Flame icon */}
        <div className="modal-icon">
          <img src="/ignite-logo-flame.png" alt="" />
        </div>

        <h2 id="guest-modal-title" className="modal-title">Save Your Progress</h2>

        <p className="modal-description">Create an account to:</p>

        <ul className="benefits-list">
          <li>
            <span className="benefit-icon">✓</span>
            Save your study progress
          </li>
          <li>
            <span className="benefit-icon">✓</span>
            Add family members
          </li>
          <li>
            <span className="benefit-icon">✓</span>
            Sync across devices
          </li>
          <li>
            <span className="benefit-icon">✓</span>
            Upload a profile photo
          </li>
        </ul>

        <div className="modal-actions">
          <button className="btn-primary" onClick={onCreateAccount}>
            Create Account
          </button>

          <button className="btn-secondary" onClick={onLogin}>
            Log In
          </button>

          <button className="btn-ghost" onClick={onContinueAsGuest}>
            Continue as Guest
          </button>
        </div>
      </div>

      <style>{`
        .modal-overlay {
          position: fixed;
          inset: 0;
          background: rgba(0, 0, 0, 0.4);
          backdrop-filter: blur(4px);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1000;
          padding: 1rem;
          animation: fadeIn 0.2s ease;
        }

        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        .modal-content {
          background: #ffffff;
          border-radius: 24px;
          padding: 2rem;
          width: 100%;
          max-width: 340px;
          box-shadow: 0 24px 48px rgba(0, 0, 0, 0.15);
          animation: slideUp 0.25s ease;
          text-align: center;
        }

        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .modal-icon {
          width: 56px;
          height: 56px;
          margin: 0 auto 1rem;
        }

        .modal-icon img {
          width: 100%;
          height: 100%;
          object-fit: contain;
        }

        .modal-title {
          margin: 0 0 0.5rem;
          font-size: 1.4rem;
          font-weight: 700;
          color: #1f2937;
        }

        .modal-description {
          margin: 0 0 1rem;
          font-size: 0.95rem;
          color: #6b7280;
        }

        .benefits-list {
          list-style: none;
          margin: 0 0 1.5rem;
          padding: 0;
          text-align: left;
        }

        .benefits-list li {
          display: flex;
          align-items: center;
          gap: 0.6rem;
          padding: 0.5rem 0;
          font-size: 0.9rem;
          color: #374151;
        }

        .benefit-icon {
          width: 20px;
          height: 20px;
          border-radius: 50%;
          background: linear-gradient(135deg, #FFB400 0%, #FF6A00 50%, #E02121 100%);
          color: #ffffff;
          font-size: 0.7rem;
          font-weight: 700;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }

        .modal-actions {
          display: flex;
          flex-direction: column;
          gap: 0.6rem;
        }

        .btn-primary {
          width: 100%;
          padding: 0.9rem 1rem;
          border-radius: 999px;
          border: none;
          font-size: 0.95rem;
          font-weight: 700;
          background: linear-gradient(135deg, #FFB400 0%, #FF6A00 50%, #E02121 100%);
          color: #ffffff;
          cursor: pointer;
          box-shadow: 0 4px 14px rgba(255, 106, 0, 0.25);
          transition: all 0.15s ease;
        }

        .btn-primary:hover {
          box-shadow: 0 6px 20px rgba(255, 106, 0, 0.35);
          transform: translateY(-1px);
        }

        .btn-secondary {
          width: 100%;
          padding: 0.85rem 1rem;
          border-radius: 999px;
          border: 1px solid #d1d5db;
          background: #ffffff;
          font-size: 0.95rem;
          font-weight: 600;
          color: #374151;
          cursor: pointer;
          transition: all 0.15s ease;
        }

        .btn-secondary:hover {
          background: #f9fafb;
          border-color: #9ca3af;
        }

        .btn-ghost {
          width: 100%;
          padding: 0.7rem 1rem;
          border-radius: 999px;
          border: none;
          background: transparent;
          font-size: 0.9rem;
          font-weight: 500;
          color: #9ca3af;
          cursor: pointer;
          transition: color 0.15s ease;
        }

        .btn-ghost:hover {
          color: #6b7280;
        }

        @media (max-width: 480px) {
          .modal-content {
            padding: 1.75rem 1.5rem;
          }

          .modal-title {
            font-size: 1.25rem;
          }
        }
      `}</style>
    </div>
  );
}

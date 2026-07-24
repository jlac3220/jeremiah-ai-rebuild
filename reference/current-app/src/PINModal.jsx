// src/PINModal.js - PIN setup and entry for primary profile protection
import React, { useState } from "react";

export default function PINModal({
  mode = "enter", // "setup" or "enter"
  onSuccess,
  onCancel,
  profileName = "Admin",
}) {
  const [pin, setPin] = useState("");
  const [confirmPin, setConfirmPin] = useState("");
  const [step, setStep] = useState(mode === "setup" ? "create" : "enter");
  const [error, setError] = useState("");
  const [shake, setShake] = useState(false);

  const isSetupMode = mode === "setup";
  const PIN_LENGTH = 4;

  function handleDigit(digit) {
    setError("");
    setShake(false);

    if (step === "create" && pin.length < PIN_LENGTH) {
      const newPin = pin + digit;
      setPin(newPin);
      if (newPin.length === PIN_LENGTH) {
        // Move to confirm step
        setTimeout(() => {
          setStep("confirm");
        }, 200);
      }
    } else if (step === "confirm" && confirmPin.length < PIN_LENGTH) {
      const newConfirm = confirmPin + digit;
      setConfirmPin(newConfirm);
      if (newConfirm.length === PIN_LENGTH) {
        // Check if they match
        setTimeout(() => {
          if (newConfirm === pin) {
            onSuccess(pin);
          } else {
            setError("PINs don't match");
            setShake(true);
            setTimeout(() => {
              setPin("");
              setConfirmPin("");
              setStep("create");
            }, 1000);
          }
        }, 200);
      }
    } else if (step === "enter" && pin.length < PIN_LENGTH) {
      const newPin = pin + digit;
      setPin(newPin);
      if (newPin.length === PIN_LENGTH) {
        // Check PIN
        setTimeout(() => {
          onSuccess(newPin);
        }, 200);
      }
    }
  }

  function handleBackspace() {
    setError("");
    setShake(false);

    if (step === "create" || step === "enter") {
      setPin(pin.slice(0, -1));
    } else if (step === "confirm") {
      if (confirmPin.length > 0) {
        setConfirmPin(confirmPin.slice(0, -1));
      } else {
        setStep("create");
        setPin(pin.slice(0, -1));
      }
    }
  }

  const currentPin = step === "confirm" ? confirmPin : pin;

  return (
    <div className="pin-overlay" onClick={onCancel}>
      <div className="pin-modal" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="pin-header">
          {isSetupMode && step === "create" && (
            <>
              <h2>Set Up Profile PIN</h2>
              <p>Create a 4-digit PIN for {profileName}</p>
            </>
          )}
          {isSetupMode && step === "confirm" && (
            <>
              <h2>Confirm Your PIN</h2>
              <p>Enter your PIN again</p>
            </>
          )}
          {!isSetupMode && (
            <>
              <h2>Enter PIN</h2>
              <p>{profileName}'s Profile</p>
            </>
          )}
        </div>

        {/* PIN Dots */}
        <div className={`pin-dots ${shake ? "shake" : ""}`}>
          {[...Array(PIN_LENGTH)].map((_, i) => (
            <div
              key={i}
              className={`pin-dot ${i < currentPin.length ? "filled" : ""}`}
            />
          ))}
        </div>

        {/* Error */}
        {error && <div className="pin-error">{error}</div>}

        {/* Number Pad */}
        <div className="pin-pad">
          {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
            <button
              key={num}
              className="pin-btn"
              onClick={() => handleDigit(num.toString())}
            >
              {num}
            </button>
          ))}
          <button className="pin-btn empty" disabled />
          <button className="pin-btn" onClick={() => handleDigit("0")}>
            0
          </button>
          <button className="pin-btn delete" onClick={handleBackspace}>
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M21 4H8l-7 8 7 8h13a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2z" />
              <line x1="18" y1="9" x2="12" y2="15" />
              <line x1="12" y1="9" x2="18" y2="15" />
            </svg>
          </button>
        </div>

        {/* Cancel */}
        <button className="pin-cancel" onClick={onCancel}>
          Cancel
        </button>
      </div>

      <style>{`
        .pin-overlay {
          position: fixed;
          inset: 0;
          background: rgba(0, 0, 0, 0.75);
          backdrop-filter: blur(8px);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1000;
          animation: fadeIn 0.2s ease;
        }

        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        .pin-modal {
          background: #ffffff;
          border-radius: 24px;
          padding: 2rem;
          width: 90%;
          max-width: 360px;
          box-shadow: 0 24px 48px rgba(0, 0, 0, 0.2);
          animation: slideUp 0.3s ease;
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

        .pin-header {
          text-align: center;
          margin-bottom: 2rem;
        }

        .pin-header h2 {
          margin: 0 0 0.5rem;
          font-size: 1.4rem;
          font-weight: 700;
          color: #1f2937;
        }

        .pin-header p {
          margin: 0;
          font-size: 0.9rem;
          color: #6b7280;
        }

        .pin-dots {
          display: flex;
          justify-content: center;
          gap: 1rem;
          margin-bottom: 2rem;
          transition: transform 0.1s ease;
        }

        .pin-dots.shake {
          animation: shake 0.5s ease;
        }

        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          20%, 60% { transform: translateX(-10px); }
          40%, 80% { transform: translateX(10px); }
        }

        .pin-dot {
          width: 16px;
          height: 16px;
          border-radius: 50%;
          border: 2px solid #d1d5db;
          background: transparent;
          transition: all 0.2s ease;
        }

        .pin-dot.filled {
          background: linear-gradient(135deg, #FFB400 0%, #FF6A00 50%, #E02121 100%);
          border-color: transparent;
          transform: scale(1.1);
        }

        .pin-error {
          text-align: center;
          color: #dc2626;
          font-size: 0.85rem;
          font-weight: 600;
          margin: -1rem 0 1rem;
          min-height: 20px;
        }

        .pin-pad {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 0.75rem;
          margin-bottom: 1.5rem;
        }

        .pin-btn {
          height: 64px;
          border-radius: 16px;
          border: none;
          background: #f3f4f6;
          color: #1f2937;
          font-size: 1.5rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.15s ease;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .pin-btn:active:not(:disabled) {
          transform: scale(0.95);
          background: #e5e7eb;
        }

        .pin-btn.empty {
          background: transparent;
          cursor: default;
        }

        .pin-btn.delete {
          background: #fee2e2;
          color: #dc2626;
        }

        .pin-btn.delete:active {
          background: #fecaca;
        }

        .pin-cancel {
          width: 100%;
          padding: 0.85rem;
          border-radius: 999px;
          border: 1px solid #d1d5db;
          background: #ffffff;
          color: #6b7280;
          font-size: 0.9rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.15s ease;
        }

        .pin-cancel:hover {
          background: #f9fafb;
          border-color: #9ca3af;
        }

        @media (max-width: 400px) {
          .pin-modal {
            padding: 1.5rem;
          }

          .pin-btn {
            height: 56px;
            font-size: 1.3rem;
          }
        }
      `}</style>
    </div>
  );
}

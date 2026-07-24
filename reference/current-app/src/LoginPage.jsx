// src/LoginPage.js - With Supabase Authentication
import React, { useState } from "react";
import { supabase } from "./supabaseClient";
import { theme } from "./theme";

const { colors, gradients } = theme;

export default function LoginPage({ onLogin, onSkip }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [stayLoggedIn, setStayLoggedIn] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [mode, setMode] = useState("login"); // "login" or "signup"

  async function handleSubmit(e) {
    e.preventDefault();
    setError(null);

    // Validate password confirmation for signup
    if (mode === "signup" && password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);

    try {
      if (mode === "signup") {
        // Sign up new user
        const { data, error: signUpError } = await supabase.auth.signUp({
          email,
          password,
        });

        if (signUpError) throw signUpError;

        if (data.user) {
          // Check if email confirmation is required
          if (data.user.identities?.length === 0) {
            setError("This email is already registered. Try logging in.");
          } else if (data.session) {
            // Auto-confirmed, log them in
            if (onLogin) onLogin(data.user);
          } else {
            // Email confirmation required
            setError("Check your email to confirm your account, then log in.");
            setMode("login");
          }
        }
      } else {
        // Log in existing user
        // If stayLoggedIn is false, we'll clear the session on browser close
        const { data, error: signInError } =
          await supabase.auth.signInWithPassword({
            email,
            password,
          });

        if (signInError) throw signInError;

        if (data.user) {
          // Store preference for session persistence
          if (!stayLoggedIn) {
            // Mark session as temporary - will be cleared on tab close
            sessionStorage.setItem("ignite_temp_session", "true");
          } else {
            sessionStorage.removeItem("ignite_temp_session");
          }
          if (onLogin) onLogin(data.user);
        }
      }
    } catch (err) {
      console.error("Auth error:", err);
      setError(err.message || "Authentication failed. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  function handleSkip() {
    if (onSkip) onSkip();
  }

  function toggleMode() {
    setMode(mode === "login" ? "signup" : "login");
    setError(null);
    setConfirmPassword("");
  }

  return (
    <main className="login-page">
      <div className="login-container">
        {/* BRAND HEADER */}
        <div className="login-header">
          <img
            src="/ignite-logo.png"
            alt="Ignite"
            className="login-logo"
          />

          <h1 className="login-title">
            {mode === "login" ? "Welcome Back" : "Create Account"}
          </h1>

          <p className="login-subtitle">
            {mode === "login"
              ? "Sign in to continue your Bible study journey."
              : "Start your Bible study journey today."}
          </p>
        </div>

        {/* ERROR MESSAGE */}
        {error && (
          <div className="login-error" role="alert" aria-live="assertive">
            {error}
          </div>
        )}

        {/* FORM */}
        <form onSubmit={handleSubmit} className="login-form" noValidate>
          <label htmlFor="login-email" className="login-label">Email</label>
          <input
            id="login-email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            className="login-input"
            required
            disabled={loading}
            autoComplete="email"
          />

          <label htmlFor="login-password" className="login-label">Password</label>
          <input
            id="login-password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder=""
            className="login-input"
            required
            minLength={6}
            disabled={loading}
            autoComplete={mode === "login" ? "current-password" : "new-password"}
          />

          {mode === "signup" && (
            <>
              <label htmlFor="login-confirm-password" className="login-label">Confirm Password</label>
              <input
                id="login-confirm-password"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder=""
                className="login-input"
                required
                minLength={6}
                disabled={loading}
                autoComplete="new-password"
              />
            </>
          )}

          {mode === "login" && (
            <label className="stay-logged-in">
              <input
                type="checkbox"
                checked={stayLoggedIn}
                onChange={(e) => setStayLoggedIn(e.target.checked)}
                disabled={loading}
              />
              <span>Stay logged in on this device</span>
            </label>
          )}

          <button
            type="submit"
            className="login-btn-primary"
            disabled={loading}
          >
            {loading
              ? "Please wait..."
              : mode === "login"
              ? "Log In"
              : "Create Account"}
          </button>
        </form>

        {/* Secondary options */}
        <div className="login-secondary">
          <button
            onClick={toggleMode}
            className="login-btn-secondary"
            disabled={loading}
          >
            {mode === "login"
              ? "Create new account"
              : "Already have an account? Log in"}
          </button>

          <button
            onClick={handleSkip}
            className="login-btn-skip"
            disabled={loading}
          >
            Skip for now
          </button>
        </div>
      </div>

      <style>{`
        .login-page {
          width: 100%;
          min-height: 100vh;
          overflow: auto;
          background: linear-gradient(180deg, #f8fafc 0%, #f1f5f9 50%, #e9eef4 100%);
          display: flex;
          justify-content: center;
          align-items: center;
          padding: 2rem 1rem;
          box-sizing: border-box;
          font-family: -apple-system, BlinkMacSystemFont, "SF Pro Text", system-ui, sans-serif;
        }

        .login-container {
          width: 100%;
          max-width: 420px;
          background: ${colors.white};
          border-radius: 24px;
          padding: 2.5rem 2rem;
          box-shadow: 0 12px 40px rgba(0, 0, 0, 0.1);
          border: 1px solid ${colors.black.light};
        }

        .login-header {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 0.5rem;
          margin-bottom: 2rem;
          text-align: center;
        }

        .login-logo {
          width: 180px;
          height: auto;
          object-fit: contain;
          display: block;
          margin-bottom: 0.5rem;
        }

        .login-title {
          margin: 0;
          font-size: 1.75rem;
          font-weight: 800;
          color: ${colors.blue.dark};
          letter-spacing: -0.01em;
        }

        .login-subtitle {
          margin: 0;
          font-size: 0.95rem;
          color: ${colors.black.DEFAULT};
          max-width: 280px;
        }

        .login-error {
          background: #fef2f2;
          border: 1px solid #fecaca;
          color: #991b1b;
          padding: 0.75rem 1rem;
          border-radius: 12px;
          font-size: 0.9rem;
          margin-bottom: 1rem;
          text-align: center;
        }

        .login-form {
          margin-bottom: 1rem;
        }

        .login-label {
          display: block;
          margin-bottom: 0.35rem;
          font-size: 0.85rem;
          font-weight: 600;
          color: ${colors.black.dark};
          text-align: left;
        }

        .login-input {
          width: 100%;
          padding: 0.85rem 1rem;
          border-radius: 12px;
          border: 1px solid ${colors.black.light};
          background: ${colors.black.pale};
          margin-bottom: 1rem;
          font-size: 1rem;
          outline: none;
          box-sizing: border-box;
          transition: border-color 0.2s ease, box-shadow 0.2s ease;
        }

        .login-input:focus {
          border-color: ${colors.blue.deep};
          box-shadow: 0 0 0 3px rgba(29, 78, 216, 0.1);
        }

        .login-input:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        .stay-logged-in {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          margin-bottom: 1.25rem;
          cursor: pointer;
          font-size: 0.9rem;
          color: ${colors.black.dark};
        }

        .stay-logged-in input[type="checkbox"] {
          width: 18px;
          height: 18px;
          accent-color: ${colors.blue.deep};
          cursor: pointer;
        }

        .stay-logged-in span {
          user-select: none;
        }

        .login-btn-primary {
          width: 100%;
          padding: 0.95rem 1rem;
          border-radius: 999px;
          border: none;
          font-size: 1rem;
          font-weight: 700;
          background: ${gradients.flame};
          color: ${colors.white};
          cursor: pointer;
          box-shadow: 0 4px 14px rgba(0, 0, 0, 0.2);
          margin-bottom: 1rem;
          transition: transform 0.15s ease, box-shadow 0.15s ease, opacity 0.15s ease;
        }

        .login-btn-primary:active:not(:disabled) {
          transform: scale(0.97);
        }

        .login-btn-primary:disabled {
          opacity: 0.7;
          cursor: not-allowed;
        }

        .login-secondary {
          display: flex;
          flex-direction: column;
          gap: 0.6rem;
        }

        .login-btn-secondary {
          width: 100%;
          padding: 0.85rem 1rem;
          border-radius: 999px;
          border: 1px solid ${colors.black.light};
          background: ${colors.white};
          font-size: 0.95rem;
          font-weight: 600;
          color: ${colors.black.dark};
          cursor: pointer;
          transition: background 0.15s ease, transform 0.15s ease;
        }

        .login-btn-secondary:active:not(:disabled) {
          background: ${colors.black.pale};
          transform: scale(0.97);
        }

        .login-btn-secondary:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        .login-btn-skip {
          padding: 0.6rem 1rem;
          background: transparent;
          border: none;
          font-size: 0.9rem;
          color: ${colors.black.DEFAULT};
          cursor: pointer;
        }

        .login-btn-skip:active:not(:disabled) {
          opacity: 0.7;
        }

        .login-btn-skip:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        /* Focus-visible accessibility */
        .login-btn-primary:focus-visible,
        .login-btn-secondary:focus-visible,
        .login-btn-skip:focus-visible {
          outline: 2px solid #1D4ED8;
          outline-offset: 2px;
        }

        .login-input:focus-visible {
          outline: none;
        }

        /* Tablet and up */
        @media (min-width: 768px) {
          .login-container {
            max-width: 460px;
            padding: 3rem 2.5rem;
          }

          .login-logo {
            width: 200px;
          }

          .login-title {
            font-size: 2rem;
          }

          .login-subtitle {
            font-size: 1rem;
          }

          .login-input {
            padding: 0.95rem 1.1rem;
            font-size: 1.05rem;
          }

          .login-btn-primary,
          .login-btn-secondary {
            padding: 1rem 1.2rem;
            font-size: 1.05rem;
          }
        }

        /* Desktop */
        @media (min-width: 1024px) {
          .login-container {
            max-width: 500px;
            padding: 3.5rem 3rem;
          }

          .login-logo {
            width: 220px;
          }

          .login-title {
            font-size: 2.2rem;
          }
        }

        /* Mobile */
        @media (max-width: 480px) {
          .login-page {
            padding: 1.5rem 1rem;
            align-items: flex-start;
            padding-top: 3rem;
          }

          .login-container {
            padding: 2rem 1.5rem;
            border-radius: 20px;
          }

          .login-logo {
            width: 160px;
          }

          .login-title {
            font-size: 1.5rem;
          }

          .login-subtitle {
            font-size: 0.9rem;
          }
        }
      `}</style>
    </main>
  );
}

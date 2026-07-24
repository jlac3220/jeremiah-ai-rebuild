/**
 * Shared form helpers for AccountPage subcomponents.
 * Provides Label, Input, and selectStyle used across account management forms.
 */

import React from "react";

/** A small descriptive label above form inputs. */
export function Label({ children, htmlFor }) {
  return (
    <label
      htmlFor={htmlFor}
      style={{
        display: "block",
        fontSize: "0.8rem",
        fontWeight: 600,
        marginBottom: "0.25rem",
        color: "#374151",
        marginTop: "0.6rem",
      }}
    >
      {children}
    </label>
  );
}

/** Styled text input matching the account page design. */
export function Input({ style, id, ...props }) {
  return (
    <input
      id={id}
      {...props}
      style={{
        width: "100%",
        padding: "0.6rem 0.8rem",
        borderRadius: "var(--radius-lg, 0.7rem)",
        border: "1px solid var(--color-border, #d1d5db)",
        background: "var(--color-white, #ffffff)",
        fontSize: "0.9rem",
        outline: "none",
        boxSizing: "border-box",
        transition: "border-color 0.15s ease, box-shadow 0.15s ease",
        ...style,
      }}
      onFocus={(e) => {
        e.currentTarget.style.borderColor = "var(--color-blue-deep, #1D4ED8)";
        e.currentTarget.style.boxShadow = "0 0 0 3px rgba(29,78,216,0.12)";
        props.onFocus?.(e);
      }}
      onBlur={(e) => {
        e.currentTarget.style.borderColor = "var(--color-border, #d1d5db)";
        e.currentTarget.style.boxShadow = "none";
        props.onBlur?.(e);
      }}
    />
  );
}

/** Shared style for birthday/month/day/year select elements. */
export const selectStyle = {
  flex: 1,
  padding: "0.55rem 0.5rem",
  borderRadius: "var(--radius-lg, 0.7rem)",
  border: "1px solid var(--color-border, #d1d5db)",
  background: "var(--color-white, #ffffff)",
  fontSize: "0.85rem",
  outline: "none",
  cursor: "pointer",
};

/** Wrapper card style shared by all AccountPage sections. */
export const cardStyle = {
  padding: "1.2rem 1.3rem",
  borderRadius: "var(--radius-card, 1.4rem)",
  background: "var(--color-white, #ffffff)",
  border: "1px solid var(--color-border, #e5e7eb)",
  boxShadow: "var(--shadow-md, 0 12px 30px rgba(15,23,42,0.06))",
  marginBottom: "1.4rem",
};

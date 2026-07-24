/**
 * SubscriptionBillingCard – Displays the current plan and billing email.
 * Full billing management is planned for a future release.
 */

import React from "react";
import { Label, Input, cardStyle } from "./accountFormHelpers";

/**
 * @param {{
 *   planName: string,
 *   billingEmail: string,
 *   renewalNote: string,
 *   setBillingEmail: Function,
 *   setRenewalNote: Function,
 * }} props
 */
export default function SubscriptionBillingCard({
  planName,
  billingEmail,
  renewalNote,
  setBillingEmail,
  setRenewalNote,
}) {
  return (
    <section style={cardStyle}>
      <h2
        style={{
          margin: 0,
          marginBottom: "0.75rem",
          fontSize: "1.05rem",
          color: "#111827",
          fontWeight: 700,
        }}
      >
        Subscription &amp; billing
      </h2>

      <p
        style={{
          marginTop: 0,
          marginBottom: "1rem",
          color: "#6b7280",
          fontSize: "0.85rem",
        }}
      >
        Keep your billing email and plan details up to date. Deeper
        subscription controls will live here later.
      </p>

      <Label>Current plan</Label>
      <Input
        value={planName}
        disabled
        style={{ background: "#f9fafb", color: "#6b7280" }}
      />

      <Label>Billing email</Label>
      <Input
        type="email"
        value={billingEmail}
        onChange={(e) => setBillingEmail(e.target.value)}
        placeholder="billing@example.com"
      />

      <Label>Renewal / notes</Label>
      <textarea
        value={renewalNote}
        onChange={(e) => setRenewalNote(e.target.value)}
        rows={2}
        disabled
        style={{
          width: "100%",
          padding: "0.6rem 0.8rem",
          borderRadius: "0.7rem",
          border: "1px solid #d1d5db",
          background: "#f9fafb",
          fontSize: "0.9rem",
          outline: "none",
          resize: "vertical",
          fontFamily: "inherit",
          color: "#6b7280",
          boxSizing: "border-box",
        }}
      />

      <button
        type="button"
        disabled
        style={{
          marginTop: "1rem",
          padding: "0.7rem 1.3rem",
          borderRadius: "999px",
          border: "1px solid #e5e7eb",
          fontSize: "0.88rem",
          fontWeight: 600,
          background: "#f9fafb",
          color: "#9ca3af",
          cursor: "not-allowed",
        }}
      >
        Manage billing (coming soon)
      </button>
    </section>
  );
}

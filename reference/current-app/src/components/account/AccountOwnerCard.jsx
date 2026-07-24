/**
 * AccountOwnerCard – Displays and allows editing of the account owner's
 * name, email, and family name.
 */

import React from "react";
import { Label, Input, cardStyle } from "./accountFormHelpers";

/**
 * @param {{
 *   firstName: string,
 *   lastName: string,
 *   email: string,
 *   familyName: string,
 *   saving: boolean,
 *   setFirstName: Function,
 *   setLastName: Function,
 *   setEmail: Function,
 *   setFamilyName: Function,
 *   onSave: Function,
 * }} props
 */
export default function AccountOwnerCard({
  firstName,
  lastName,
  email,
  familyName,
  saving,
  setFirstName,
  setLastName,
  setEmail,
  setFamilyName,
  onSave,
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
        Account owner
      </h2>

      <p
        style={{
          marginTop: 0,
          marginBottom: "0.9rem",
          color: "#6b7280",
          fontSize: "0.85rem",
        }}
      >
        This is the admin contact for billing, subscription, and profile
        management.
      </p>

      {/* Two-column layout for first/last name */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))",
          gap: "0.75rem 1rem",
        }}
      >
        <div>
          <Label>First name</Label>
          <Input
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            placeholder="First name"
          />
        </div>

        <div>
          <Label>Last name</Label>
          <Input
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            placeholder="Last name"
          />
        </div>
      </div>

      <Label>Email (sign-in / contact)</Label>
      <Input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="you@example.com"
      />

      <Label>Family name</Label>
      <Input
        value={familyName}
        onChange={(e) => setFamilyName(e.target.value)}
        placeholder="The Smith Family"
      />

      <button
        type="button"
        onClick={onSave}
        disabled={saving}
        style={{
          marginTop: "1rem",
          padding: "0.75rem 1.4rem",
          borderRadius: "999px",
          border: "none",
          fontSize: "0.92rem",
          fontWeight: 700,
          background: saving
            ? "#d1d5db"
            : "linear-gradient(135deg, #FFB400 0%, #FF6A00 40%, #E02121 100%)",
          color: "#ffffff",
          cursor: saving ? "not-allowed" : "pointer",
          boxShadow: saving ? "none" : "0 14px 30px rgba(0,0,0,0.18)",
          transition: "all 0.15s ease",
        }}
      >
        {saving ? "Saving..." : "Save account owner"}
      </button>
    </section>
  );
}

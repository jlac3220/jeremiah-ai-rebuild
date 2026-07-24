/**
 * MessagingSection – Allows the account owner to send notifications to one or
 * more profiles on the account.
 */

import React from "react";
import { Label, Input, cardStyle } from "./accountFormHelpers";

/**
 * @param {{
 *   profiles: object[],
 *   messageTitle: string,
 *   messageBody: string,
 *   selectedProfiles: string[],
 *   sendingMessage: boolean,
 *   setMessageTitle: Function,
 *   setMessageBody: Function,
 *   onToggleProfile: (profileId: string) => void,
 *   onSelectAll: Function,
 *   onDeselectAll: Function,
 *   onSend: (e: React.FormEvent) => void,
 * }} props
 */
export default function MessagingSection({
  profiles,
  messageTitle,
  messageBody,
  selectedProfiles,
  sendingMessage,
  setMessageTitle,
  setMessageBody,
  onToggleProfile,
  onSelectAll,
  onDeselectAll,
  onSend,
}) {
  const canSend =
    !sendingMessage &&
    messageTitle.trim() &&
    messageBody.trim() &&
    selectedProfiles.length > 0;

  return (
    <section style={cardStyle}>
      <h2
        style={{
          marginTop: 0,
          marginBottom: "0.5rem",
          fontSize: "1.05rem",
          color: "#111827",
          fontWeight: 700,
        }}
      >
        Send Message to Profiles
      </h2>

      <p
        style={{
          marginTop: 0,
          marginBottom: "1rem",
          color: "#6b7280",
          fontSize: "0.85rem",
        }}
      >
        Send notifications that will appear on profile pages. Great for
        encouragement, reminders, or family announcements.
      </p>

      <form onSubmit={onSend}>
        {/* Profile Selection */}
        <div style={{ marginBottom: "1rem" }}>
          <Label>Send to</Label>
          <div style={{ display: "flex", gap: "0.5rem", marginBottom: "0.5rem" }}>
            <button
              type="button"
              onClick={onSelectAll}
              style={{
                padding: "0.4rem 0.8rem",
                borderRadius: "999px",
                border: "1px solid #d1d5db",
                background: "#f9fafb",
                fontSize: "0.8rem",
                fontWeight: 600,
                color: "#374151",
                cursor: "pointer",
              }}
            >
              Select All
            </button>
            <button
              type="button"
              onClick={onDeselectAll}
              style={{
                padding: "0.4rem 0.8rem",
                borderRadius: "999px",
                border: "1px solid #d1d5db",
                background: "#ffffff",
                fontSize: "0.8rem",
                fontWeight: 600,
                color: "#6b7280",
                cursor: "pointer",
              }}
            >
              Clear
            </button>
          </div>

          <div style={{ display: "flex", flexWrap: "wrap", gap: "0.6rem" }}>
            {profiles.map((profile) => {
              const isSelected = selectedProfiles.includes(profile.id);
              return (
                <button
                  key={profile.id}
                  type="button"
                  onClick={() => onToggleProfile(profile.id)}
                  style={{
                    padding: "0.5rem 1rem",
                    borderRadius: "999px",
                    border: "2px solid",
                    borderColor: isSelected ? "#f97316" : "#d1d5db",
                    background: isSelected ? "#fff7ed" : "#ffffff",
                    fontSize: "0.85rem",
                    fontWeight: 600,
                    color: isSelected ? "#ea580c" : "#6b7280",
                    cursor: "pointer",
                    transition: "all 0.15s ease",
                  }}
                >
                  {profile.name}
                </button>
              );
            })}
          </div>

          {profiles.length === 0 && (
            <p style={{ fontSize: "0.85rem", color: "#9ca3af", marginTop: "0.5rem" }}>
              No profiles yet. Add profiles above to send messages.
            </p>
          )}
        </div>

        <Label>Message Title</Label>
        <Input
          value={messageTitle}
          onChange={(e) => setMessageTitle(e.target.value)}
          placeholder="e.g., Great job this week!"
          disabled={sendingMessage}
          maxLength={50}
        />

        <Label>Message</Label>
        <textarea
          value={messageBody}
          onChange={(e) => setMessageBody(e.target.value)}
          placeholder="Write your message here..."
          disabled={sendingMessage}
          rows={4}
          maxLength={300}
          style={{
            width: "100%",
            padding: "0.6rem 0.8rem",
            borderRadius: "0.7rem",
            border: "1px solid #d1d5db",
            background: "#ffffff",
            fontSize: "0.9rem",
            outline: "none",
            resize: "vertical",
            fontFamily: "inherit",
            color: "#111827",
            boxSizing: "border-box",
          }}
        />
        <p style={{ fontSize: "0.75rem", color: "#9ca3af", margin: "0.25rem 0 1rem" }}>
          {messageBody.length}/300 characters
        </p>

        <button
          type="submit"
          disabled={!canSend}
          style={{
            padding: "0.7rem 1.5rem",
            borderRadius: "999px",
            border: "none",
            fontSize: "0.9rem",
            fontWeight: 600,
            background: canSend
              ? "linear-gradient(135deg, #FFB400 0%, #FF6A00 40%, #E02121 100%)"
              : "#d1d5db",
            color: "#ffffff",
            cursor: canSend ? "pointer" : "not-allowed",
            boxShadow: canSend ? "0 10px 22px rgba(0,0,0,0.16)" : "none",
            transition: "all 0.15s ease",
          }}
        >
          {sendingMessage
            ? "Sending..."
            : `Send to ${selectedProfiles.length} profile${
                selectedProfiles.length === 1 ? "" : "s"
              }`}
        </button>
      </form>
    </section>
  );
}

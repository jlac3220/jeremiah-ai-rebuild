/**
 * ProfileRow – An individual profile card within the account's profile list.
 * Displays the profile's avatar/initials, name, age, and allows editing the
 * birthday inline. Also provides a Remove button.
 */

import React, { useState } from "react";
import { selectStyle } from "./accountFormHelpers";

/**
 * @param {{
 *   profile: object,
 *   getAge: (dateStr: string|null) => number|null,
 *   onRemove: Function,
 *   onUpdate: (profileId: string, updates: object) => Promise<void>,
 * }} props
 */
export default function ProfileRow({ profile, getAge, onRemove, onUpdate }) {
  const [isEditing, setIsEditing] = useState(false);

  // Parse existing birthday into parts for the selects
  const existingDate = profile.date_of_birth
    ? new Date(profile.date_of_birth)
    : null;
  const [editMonth, setEditMonth] = useState(
    existingDate ? String(existingDate.getMonth() + 1).padStart(2, "0") : ""
  );
  const [editDay, setEditDay] = useState(
    existingDate ? String(existingDate.getDate()).padStart(2, "0") : ""
  );
  const [editYear, setEditYear] = useState(
    existingDate ? String(existingDate.getFullYear()) : ""
  );
  const [saving, setSaving] = useState(false);

  const hasImage = !!profile.profile_image_url;
  const age = getAge(profile.date_of_birth);

  const getInitials = () => {
    if (!profile.name?.trim()) return "P";
    const parts = profile.name.trim().split(" ");
    if (parts.length === 1) return parts[0][0].toUpperCase();
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const dateOfBirth =
        editYear && editMonth && editDay
          ? `${editYear}-${editMonth}-${editDay}`
          : null;
      await onUpdate(profile.id, { date_of_birth: dateOfBirth });
      setIsEditing(false);
    } catch (err) {
      console.error("Error updating profile:", err);
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    const d = profile.date_of_birth ? new Date(profile.date_of_birth) : null;
    setEditMonth(d ? String(d.getMonth() + 1).padStart(2, "0") : "");
    setEditDay(d ? String(d.getDate()).padStart(2, "0") : "");
    setEditYear(d ? String(d.getFullYear()) : "");
  };

  return (
    <div
      style={{
        padding: "0.9rem 1rem",
        borderRadius: "1rem",
        background: "#f9fafb",
        border: "1px solid #e5e7eb",
        display: "flex",
        flexDirection: "column",
        gap: "0.75rem",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: "0.9rem" }}>
        {/* Profile picture or initials */}
        <div
          style={{
            width: 44,
            height: 44,
            borderRadius: "999px",
            background: hasImage
              ? "transparent"
              : "linear-gradient(135deg, #e0e7ff 0%, #c7d2fe 100%)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            fontSize: "0.9rem",
            fontWeight: 600,
            color: "#4b5563",
            textTransform: "uppercase",
            overflow: "hidden",
            flexShrink: 0,
            border: hasImage ? "2px solid #e5e7eb" : "none",
          }}
        >
          {hasImage ? (
            <img
              src={profile.profile_image_url}
              alt={profile.name}
              style={{ width: "100%", height: "100%", objectFit: "cover" }}
            />
          ) : (
            getInitials()
          )}
        </div>

        <div style={{ flex: 1, minWidth: 0 }}>
          <div
            style={{
              fontWeight: 600,
              fontSize: "0.92rem",
              color: "#1f2937",
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
            }}
          >
            {profile.name}
          </div>
          <div style={{ fontSize: "0.8rem", color: "#6b7280" }}>
            {age !== null ? `${age} years old` : "No birthday set"}
            {hasImage && (
              <span
                style={{
                  marginLeft: "0.5rem",
                  color: "#10b981",
                  fontSize: "0.75rem",
                }}
              >
                • Photo set
              </span>
            )}
          </div>
        </div>

        <button
          type="button"
          onClick={onRemove}
          style={{
            padding: "0.3rem 0.7rem",
            borderRadius: "999px",
            background: "#fef2f2",
            border: "1px solid #fecaca",
            color: "#b91c1c",
            fontSize: "0.75rem",
            cursor: "pointer",
            flexShrink: 0,
          }}
        >
          Remove
        </button>
      </div>

      {/* Edit birthday section */}
      {isEditing ? (
        <div
          style={{
            display: "flex",
            gap: "0.4rem",
            alignItems: "center",
            flexWrap: "wrap",
          }}
        >
          <select
            value={editMonth}
            onChange={(e) => setEditMonth(e.target.value)}
            style={{ ...selectStyle, flex: "1", minWidth: "70px" }}
          >
            <option value="">Month</option>
            <option value="01">Jan</option>
            <option value="02">Feb</option>
            <option value="03">Mar</option>
            <option value="04">Apr</option>
            <option value="05">May</option>
            <option value="06">Jun</option>
            <option value="07">Jul</option>
            <option value="08">Aug</option>
            <option value="09">Sep</option>
            <option value="10">Oct</option>
            <option value="11">Nov</option>
            <option value="12">Dec</option>
          </select>
          <select
            value={editDay}
            onChange={(e) => setEditDay(e.target.value)}
            style={{ ...selectStyle, width: "60px", flex: "none" }}
          >
            <option value="">Day</option>
            {[...Array(31)].map((_, i) => (
              <option key={i + 1} value={String(i + 1).padStart(2, "0")}>
                {i + 1}
              </option>
            ))}
          </select>
          <select
            value={editYear}
            onChange={(e) => setEditYear(e.target.value)}
            style={{ ...selectStyle, width: "70px", flex: "none" }}
          >
            <option value="">Year</option>
            {[...Array(100)].map((_, i) => {
              const year = new Date().getFullYear() - i;
              return (
                <option key={year} value={year}>
                  {year}
                </option>
              );
            })}
          </select>
          <button
            type="button"
            onClick={handleSave}
            disabled={saving}
            style={{
              padding: "0.5rem 0.75rem",
              borderRadius: "999px",
              border: "none",
              background: "#10b981",
              color: "#ffffff",
              fontSize: "0.75rem",
              fontWeight: 600,
              cursor: saving ? "not-allowed" : "pointer",
            }}
          >
            {saving ? "..." : "Save"}
          </button>
          <button
            type="button"
            onClick={handleCancel}
            style={{
              padding: "0.5rem 0.6rem",
              borderRadius: "999px",
              border: "1px solid #d1d5db",
              background: "#ffffff",
              color: "#6b7280",
              fontSize: "0.75rem",
              fontWeight: 600,
              cursor: "pointer",
            }}
          >
            ✕
          </button>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => setIsEditing(true)}
          style={{
            padding: "0.4rem 0.75rem",
            borderRadius: "999px",
            border: "1px solid #d1d5db",
            background: "#ffffff",
            color: "#6b7280",
            fontSize: "0.75rem",
            fontWeight: 600,
            cursor: "pointer",
            alignSelf: "flex-start",
          }}
        >
          {age !== null ? "Edit birthday" : "Add birthday"}
        </button>
      )}
    </div>
  );
}

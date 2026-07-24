/**
 * ProfilesManagementSection – Lists all profiles on the account and provides
 * a form to add new ones.
 */

import React from "react";
import { Label, Input, selectStyle, cardStyle } from "./accountFormHelpers";
import ProfileRow from "./ProfileRow";

/**
 * @param {{
 *   profiles: object[],
 *   newProfileName: string,
 *   newBirthMonth: string,
 *   newBirthDay: string,
 *   newBirthYear: string,
 *   addingProfile: boolean,
 *   getAge: Function,
 *   setNewProfileName: Function,
 *   setNewBirthMonth: Function,
 *   setNewBirthDay: Function,
 *   setNewBirthYear: Function,
 *   onAddProfile: (e: React.FormEvent) => void,
 *   onRemoveProfile: (profileId: string) => void,
 *   onUpdateProfile: (profileId: string, updates: object) => Promise<void>,
 * }} props
 */
export default function ProfilesManagementSection({
  profiles,
  newProfileName,
  newBirthMonth,
  newBirthDay,
  newBirthYear,
  addingProfile,
  getAge,
  setNewProfileName,
  setNewBirthMonth,
  setNewBirthDay,
  setNewBirthYear,
  onAddProfile,
  onRemoveProfile,
  onUpdateProfile,
}) {
  return (
    <section style={{ ...cardStyle, marginBottom: 0 }}>
      <h2
        style={{
          marginTop: 0,
          marginBottom: "0.5rem",
          fontSize: "1.05rem",
          color: "#111827",
          fontWeight: 700,
        }}
      >
        Profiles on this account
      </h2>

      <p
        style={{
          marginTop: 0,
          marginBottom: "1rem",
          color: "#6b7280",
          fontSize: "0.85rem",
        }}
      >
        Create profiles for each person using Ignite. Each profile has its own
        progress, profile page, and photo.
      </p>

      {/* Add profile form */}
      <form
        onSubmit={onAddProfile}
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: "0.6rem",
          alignItems: "flex-end",
          marginBottom: "1.2rem",
        }}
      >
        <div style={{ flex: "1 1 160px" }}>
          <Label>Profile name</Label>
          <Input
            value={newProfileName}
            onChange={(e) => setNewProfileName(e.target.value)}
            placeholder="New profile"
            disabled={addingProfile}
          />
        </div>

        <div style={{ flex: "1 1 280px" }}>
          <Label>
            Birthday{" "}
            <span style={{ fontWeight: 400, color: "#9ca3af" }}>(optional)</span>
          </Label>
          <div style={{ display: "flex", gap: "0.4rem" }}>
            <select
              value={newBirthMonth}
              onChange={(e) => setNewBirthMonth(e.target.value)}
              disabled={addingProfile}
              style={selectStyle}
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
              value={newBirthDay}
              onChange={(e) => setNewBirthDay(e.target.value)}
              disabled={addingProfile}
              style={{ ...selectStyle, width: "70px", flex: "none" }}
            >
              <option value="">Day</option>
              {[...Array(31)].map((_, i) => (
                <option key={i + 1} value={String(i + 1).padStart(2, "0")}>
                  {i + 1}
                </option>
              ))}
            </select>
            <select
              value={newBirthYear}
              onChange={(e) => setNewBirthYear(e.target.value)}
              disabled={addingProfile}
              style={{ ...selectStyle, width: "80px", flex: "none" }}
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
          </div>
        </div>

        <button
          type="submit"
          disabled={addingProfile || !newProfileName.trim()}
          style={{
            padding: "0.6rem 1.3rem",
            borderRadius: "999px",
            border: "none",
            fontSize: "0.9rem",
            fontWeight: 600,
            background:
              addingProfile || !newProfileName.trim()
                ? "#d1d5db"
                : "linear-gradient(135deg, #FFB400 0%, #FF6A00 40%, #E02121 100%)",
            color: "#ffffff",
            cursor: addingProfile || !newProfileName.trim() ? "not-allowed" : "pointer",
            boxShadow:
              addingProfile || !newProfileName.trim()
                ? "none"
                : "0 10px 22px rgba(0,0,0,0.16)",
            whiteSpace: "nowrap",
            transition: "all 0.15s ease",
          }}
        >
          {addingProfile ? "Adding..." : "Add profile"}
        </button>
      </form>

      {/* Profile list */}
      {profiles.length === 0 ? (
        <p style={{ color: "#6b7280", fontSize: "0.85rem" }}>
          No profiles yet. Add family members to get started.
        </p>
      ) : (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
            gap: "0.9rem",
          }}
        >
          {profiles.map((p) => (
            <ProfileRow
              key={p.id}
              profile={p}
              getAge={getAge}
              onRemove={() => onRemoveProfile(p.id)}
              onUpdate={onUpdateProfile}
            />
          ))}
        </div>
      )}
    </section>
  );
}

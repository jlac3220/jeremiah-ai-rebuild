// src/ProfileSelectPage.js - Netflix-style Profile Picker with Birthday
import React, { useState, useEffect } from "react";
import { supabase } from "./supabaseClient";

export default function ProfileSelectPage({
  user,
  profiles: initialProfiles,
  onSelectProfile,
  onBackToLogin,
}) {
  const [profiles, setProfiles] = useState(initialProfiles || []);
  const [loading, setLoading] = useState(!initialProfiles?.length);
  const [hoveredId, setHoveredId] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newName, setNewName] = useState("");
  const [newBirthMonth, setNewBirthMonth] = useState("");
  const [newBirthDay, setNewBirthDay] = useState("");
  const [newBirthYear, setNewBirthYear] = useState("");
  const [adding, setAdding] = useState(false);
  const [accountId, setAccountId] = useState(null);

  useEffect(() => {
    if (user?.id && !initialProfiles?.length) {
      loadProfiles();
    }
  }, [user]);

  // Calculate age from birthday
  const getAge = (birthDate) => {
    if (!birthDate) return null;
    const today = new Date();
    const birth = new Date(birthDate);
    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();
    if (
      monthDiff < 0 ||
      (monthDiff === 0 && today.getDate() < birth.getDate())
    ) {
      age--;
    }
    return age;
  };

  async function loadProfiles() {
    setLoading(true);
    try {
      // Get or create account
      let { data: account, error: accountError } = await supabase
        .from("accounts")
        .select("id")
        .eq("user_id", user.id)
        .single();

      if (accountError && accountError.code === "PGRST116") {
        const { data: newAccount, error: createError } = await supabase
          .from("accounts")
          .insert({ user_id: user.id, email: user.email })
          .select("id")
          .single();

        if (createError) throw createError;
        account = newAccount;
      } else if (accountError) {
        throw accountError;
      }

      setAccountId(account.id);

      // Load profiles
      const { data: profilesData, error: profilesError } = await supabase
        .from("profiles")
        .select("*")
        .eq("account_id", account.id)
        .order("created_at", { ascending: true });

      if (profilesError) throw profilesError;
      setProfiles(profilesData || []);
    } catch (err) {
      console.error("Error loading profiles:", err);
    } finally {
      setLoading(false);
    }
  }

  async function handleAddProfile(e) {
    e.preventDefault();
    if (!newName.trim()) return;

    setAdding(true);
    try {
      let accId = accountId;

      // Get account id if not cached
      if (!accId && user?.id) {
        const { data: account } = await supabase
          .from("accounts")
          .select("id")
          .eq("user_id", user.id)
          .single();
        accId = account?.id;
        setAccountId(accId);
      }

      if (!accId) {
        throw new Error("No account found");
      }

      // Combine birthday parts if all are filled
      let dateOfBirth = null;
      if (newBirthYear && newBirthMonth && newBirthDay) {
        dateOfBirth = `${newBirthYear}-${newBirthMonth}-${newBirthDay}`;
      }

      const { data: newProfile, error } = await supabase
        .from("profiles")
        .insert({
          account_id: accId,
          user_id: user.id,
          name: newName.trim(),
          date_of_birth: dateOfBirth,
        })
        .select()
        .single();

      if (error) throw error;

      setProfiles((prev) => [...prev, newProfile]);
      setNewName("");
      setNewBirthMonth("");
      setNewBirthDay("");
      setNewBirthYear("");
      setShowAddForm(false);
    } catch (err) {
      console.error("Error adding profile:", err);
      alert("Failed to add profile. Please try again.");
    } finally {
      setAdding(false);
    }
  }

  function handleSelectGuest() {
    onSelectProfile({
      id: "guest",
      name: "Guest",
      isGuest: true,
    });
  }

  const getInitials = (name) => {
    if (!name?.trim()) return "?";
    const parts = name.trim().split(" ");
    if (parts.length === 1) return parts[0][0].toUpperCase();
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  };

  // Gradient colors for avatars without photos
  const AVATAR_COLORS = [
    "linear-gradient(135deg, #FF6B6B 0%, #FF8E53 100%)",
    "linear-gradient(135deg, #4ECDC4 0%, #44A08D 100%)",
    "linear-gradient(135deg, #667EEA 0%, #764BA2 100%)",
    "linear-gradient(135deg, #F093FB 0%, #F5576C 100%)",
    "linear-gradient(135deg, #4FACFE 0%, #00F2FE 100%)",
    "linear-gradient(135deg, #43E97B 0%, #38F9D7 100%)",
    "linear-gradient(135deg, #FA709A 0%, #FEE140 100%)",
    "linear-gradient(135deg, #FFB347 0%, #FF6A00 100%)",
  ];

  if (loading) {
    return (
      <div className="select-page">
        <style>{styles}</style>
      </div>
    );
  }

  return (
    <div className="select-page">
      {/* Main content */}
      <div className="content">
        <h1 className="title">Who's studying today?</h1>

        <div className="profiles-grid">
          {/* Existing profiles */}
          {profiles.map((profile, index) => {
            const age = getAge(profile.date_of_birth);
            return (
              <button
                key={profile.id}
                className={`profile-card ${
                  hoveredId === profile.id ? "hovered" : ""
                }`}
                onClick={() => onSelectProfile(profile)}
                onMouseEnter={() => setHoveredId(profile.id)}
                onMouseLeave={() => setHoveredId(null)}
                style={{ animationDelay: `${index * 0.06}s` }}
              >
                <div className="avatar-wrapper">
                  {profile.profile_image_url ? (
                    <img
                      src={profile.profile_image_url}
                      alt={profile.name}
                      className="avatar-image"
                    />
                  ) : (
                    <div
                      className="avatar-placeholder"
                      style={{
                        background: AVATAR_COLORS[index % AVATAR_COLORS.length],
                      }}
                    >
                      <span className="avatar-initials">
                        {getInitials(profile.name)}
                      </span>
                    </div>
                  )}
                </div>
                <span className="profile-name">{profile.name}</span>
                <span className="profile-age">
                  {age !== null ? `${age} years old` : ""}
                </span>
              </button>
            );
          })}

          {/* Add Profile Card */}
          {!showAddForm && profiles.length < 6 && (
            <button
              className={`profile-card add-card ${
                hoveredId === "add" ? "hovered" : ""
              }`}
              onClick={() => setShowAddForm(true)}
              onMouseEnter={() => setHoveredId("add")}
              onMouseLeave={() => setHoveredId(null)}
              style={{ animationDelay: `${profiles.length * 0.06}s` }}
            >
              <div className="avatar-wrapper">
                <div className="avatar-add">
                  <svg
                    width="32"
                    height="32"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <line x1="12" y1="5" x2="12" y2="19" />
                    <line x1="5" y1="12" x2="19" y2="12" />
                  </svg>
                </div>
              </div>
              <span className="profile-name">Add Profile</span>
            </button>
          )}
        </div>

        {/* Add Profile Form Modal */}
        {showAddForm && (
          <div
            className="add-form-overlay"
            role="dialog"
            aria-modal="true"
            aria-labelledby="add-profile-title"
            onClick={() => setShowAddForm(false)}
          >
            <form
              className="add-form"
              onClick={(e) => e.stopPropagation()}
              onSubmit={handleAddProfile}
            >
              <h2 id="add-profile-title">Add Profile</h2>

              <div className="form-field">
                <label htmlFor="profile-name-input">Name</label>
                <input
                  id="profile-name-input"
                  type="text"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  placeholder="Enter name"
                  autoFocus
                  disabled={adding}
                />
              </div>

              <div className="form-field">
                <label htmlFor="birth-month-select">
                  Birthday <span className="optional-label">(optional)</span>
                </label>
                <div className="birthday-selects">
                  <select
                    id="birth-month-select"
                    value={newBirthMonth}
                    onChange={(e) => setNewBirthMonth(e.target.value)}
                    disabled={adding}
                    className="birth-select"
                    aria-label="Birth month"
                  >
                    <option value="">Month</option>
                    <option value="01">January</option>
                    <option value="02">February</option>
                    <option value="03">March</option>
                    <option value="04">April</option>
                    <option value="05">May</option>
                    <option value="06">June</option>
                    <option value="07">July</option>
                    <option value="08">August</option>
                    <option value="09">September</option>
                    <option value="10">October</option>
                    <option value="11">November</option>
                    <option value="12">December</option>
                  </select>
                  <select
                    value={newBirthDay}
                    onChange={(e) => setNewBirthDay(e.target.value)}
                    disabled={adding}
                    className="birth-select birth-select-small"
                    aria-label="Birth day"
                  >
                    <option value="">Day</option>
                    {[...Array(31)].map((_, i) => (
                      <option
                        key={i + 1}
                        value={String(i + 1).padStart(2, "0")}
                      >
                        {i + 1}
                      </option>
                    ))}
                  </select>
                  <select
                    value={newBirthYear}
                    onChange={(e) => setNewBirthYear(e.target.value)}
                    disabled={adding}
                    className="birth-select birth-select-small"
                    aria-label="Birth year"
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

              <div className="form-actions">
                <button
                  type="button"
                  className="btn-cancel"
                  onClick={() => {
                    setShowAddForm(false);
                    setNewName("");
                    setNewBirthMonth("");
                    setNewBirthDay("");
                    setNewBirthYear("");
                  }}
                  disabled={adding}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn-save"
                  disabled={adding || !newName.trim()}
                >
                  {adding ? "Adding..." : "Add Profile"}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Bottom section - Guest & Sign out */}
        <div className="bottom-section">
          <div className="divider-row">
            <div className="divider-line" />
            <span className="divider-text">or</span>
            <div className="divider-line" />
          </div>

          <button className="guest-btn" onClick={handleSelectGuest}>
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
              <circle cx="12" cy="7" r="4" />
            </svg>
            Continue as Guest
          </button>
          <p className="guest-note">Progress won't be saved to your account</p>

          {onBackToLogin && (
            <button className="signout-btn" onClick={onBackToLogin}>
              Sign out
            </button>
          )}
        </div>
      </div>

      <style>{styles}</style>
    </div>
  );
}

const styles = `
  .select-page {
    min-height: 100vh;
    background: radial-gradient(circle at top, #f9fafb 0%, #eef1f5 40%, #e5e7eb 100%);
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 1.5rem 1rem 2rem;
    font-family: -apple-system, BlinkMacSystemFont, "SF Pro Display", system-ui, sans-serif;
  }

  .content {
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 100%;
    max-width: 600px;
  }

  .title {
    font-size: 1.6rem;
    font-weight: 700;
    color: #1f2937;
    margin: 0.5rem 0 1.5rem;
    text-align: center;
  }

  .profiles-grid {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    gap: 1rem;
    width: 100%;
    margin-bottom: 1rem;
  }

  .profile-card {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0.5rem;
    padding: 0.75rem;
    background: transparent;
    border: none;
    cursor: pointer;
    transition: transform 0.2s ease;
    animation: fadeInUp 0.4s ease backwards;
    border-radius: 14px;
  }

  .profile-card:focus-visible {
    outline: 2px solid #1D4ED8;
    outline-offset: 2px;
  }

  @keyframes fadeInUp {
    from {
      opacity: 0;
      transform: translateY(16px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  .profile-card.hovered {
    transform: scale(1.05);
  }

  .avatar-wrapper {
    width: 90px;
    height: 90px;
    position: relative;
  }

  .avatar-image {
    width: 100%;
    height: 100%;
    border-radius: 50%;
    object-fit: cover;
    border: 4px solid #ffffff;
    box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
    transition: box-shadow 0.2s ease, border-color 0.2s ease;
  }

  .profile-card.hovered .avatar-image {
    border-color: #f97316;
    box-shadow: 0 6px 24px rgba(249, 115, 22, 0.25);
  }

  .avatar-placeholder {
    width: 100%;
    height: 100%;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    border: 4px solid #ffffff;
    box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
    transition: box-shadow 0.2s ease, border-color 0.2s ease;
  }

  .profile-card.hovered .avatar-placeholder {
    border-color: #f97316;
    box-shadow: 0 6px 24px rgba(249, 115, 22, 0.25);
  }

  .avatar-initials {
    font-size: 2rem;
    font-weight: 700;
    color: #ffffff;
    text-shadow: 0 2px 4px rgba(0, 0, 0, 0.15);
  }

  .avatar-add {
    width: 100%;
    height: 100%;
    border-radius: 50%;
    background: #ffffff;
    border: 3px dashed #d1d5db;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #9ca3af;
    transition: all 0.2s ease;
  }

  .profile-card.hovered .avatar-add {
    border-color: #f97316;
    color: #f97316;
    background: #fff7ed;
  }

  .profile-name {
    font-size: 0.95rem;
    font-weight: 600;
    color: #374151;
    transition: color 0.2s ease;
  }

  .profile-card.hovered .profile-name {
    color: #1f2937;
  }

  .profile-age {
    font-size: 0.75rem;
    color: #9ca3af;
    margin-top: -0.3rem;
    min-height: 1rem;
  }

  /* Add Form Modal */
  .add-form-overlay {
    position: fixed;
    inset: 0;
    background: rgba(0, 0, 0, 0.4);
    backdrop-filter: blur(4px);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 100;
    padding: 1rem;
    animation: fadeIn 0.2s ease;
  }

  @keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
  }

  .add-form {
    background: #ffffff;
    border-radius: 20px;
    padding: 1.75rem 2rem;
    width: 100%;
    max-width: 360px;
    box-shadow: 0 24px 48px rgba(0, 0, 0, 0.15);
    animation: slideUp 0.25s ease;
  }

  @keyframes slideUp {
    from {
      opacity: 0;
      transform: translateY(16px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  .add-form h2 {
    margin: 0 0 1.25rem;
    font-size: 1.25rem;
    font-weight: 700;
    color: #1f2937;
    text-align: center;
  }

  .form-field {
    margin-bottom: 1rem;
  }

  .form-field label {
    display: block;
    font-size: 0.8rem;
    font-weight: 600;
    color: #6b7280;
    margin-bottom: 0.4rem;
  }

  .form-field input {
    width: 100%;
    padding: 0.75rem 1rem;
    border-radius: 10px;
    border: 1px solid #d1d5db;
    background: #ffffff;
    color: #1f2937;
    font-size: 1rem;
    outline: none;
    box-sizing: border-box;
    transition: border-color 0.2s ease;
  }

  .form-field input:focus {
    border-color: #f97316;
  }

  .optional-label {
    font-weight: 400;
    color: #9ca3af;
  }

  .birthday-selects {
    display: flex;
    gap: 0.5rem;
  }

  .birth-select {
    flex: 1;
    padding: 0.75rem 0.5rem;
    border-radius: 10px;
    border: 1px solid #d1d5db;
    background: #ffffff;
    color: #1f2937;
    font-size: 0.9rem;
    outline: none;
    cursor: pointer;
    transition: border-color 0.2s ease;
    appearance: none;
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%239ca3af' stroke-width='2'%3E%3Cpath d='M6 9l6 6 6-6'/%3E%3C/svg%3E");
    background-repeat: no-repeat;
    background-position: right 0.5rem center;
    padding-right: 1.5rem;
  }

  .birth-select:focus {
    border-color: #f97316;
  }

  .birth-select-small {
    flex: 0.6;
  }

  .form-actions {
    display: flex;
    gap: 0.75rem;
    margin-top: 1.5rem;
  }

  .btn-cancel {
    flex: 1;
    padding: 0.8rem 1rem;
    border-radius: 999px;
    border: 1px solid #d1d5db;
    background: #ffffff;
    color: #6b7280;
    font-size: 0.9rem;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.15s ease;
  }

  .btn-cancel:hover {
    background: #f3f4f6;
    color: #374151;
  }

  .btn-save {
    flex: 1;
    padding: 0.8rem 1rem;
    border-radius: 999px;
    border: none;
    background: linear-gradient(135deg, #FFB400 0%, #FF6A00 50%, #E02121 100%);
    color: #ffffff;
    font-size: 0.9rem;
    font-weight: 700;
    cursor: pointer;
    box-shadow: 0 4px 14px rgba(255, 106, 0, 0.25);
    transition: all 0.15s ease;
  }

  .btn-save:hover:not(:disabled) {
    box-shadow: 0 6px 20px rgba(255, 106, 0, 0.35);
  }

  .btn-save:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  .btn-cancel:focus-visible,
  .btn-save:focus-visible,
  .guest-btn:focus-visible,
  .signout-btn:focus-visible {
    outline: 2px solid #1D4ED8;
    outline-offset: 2px;
  }

  .form-field input:focus-visible,
  .birth-select:focus-visible {
    border-color: #1D4ED8;
    box-shadow: 0 0 0 3px rgba(29,78,216,0.12);
    outline: none;
  }

  /* Bottom section */
  .bottom-section {
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 100%;
    max-width: 320px;
    margin-top: auto;
    padding-top: 1.5rem;
  }

  .divider-row {
    display: flex;
    align-items: center;
    width: 100%;
    gap: 1rem;
    margin-bottom: 1.25rem;
  }

  .divider-line {
    flex: 1;
    height: 1px;
    background: linear-gradient(90deg, transparent, #d1d5db, transparent);
  }

  .divider-text {
    font-size: 0.85rem;
    color: #9ca3af;
    font-weight: 500;
    text-transform: lowercase;
  }

  .guest-btn {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.65rem;
    width: 100%;
    padding: 0.9rem 1.5rem;
    border-radius: 999px;
    border: 2px solid #e5e7eb;
    background: #ffffff;
    color: #4b5563;
    font-size: 0.95rem;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.15s ease;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
  }

  .guest-btn:hover {
    background: #f9fafb;
    border-color: #d1d5db;
    color: #374151;
    transform: translateY(-1px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  }

  .guest-btn svg {
    color: #9ca3af;
  }

  .guest-btn:hover svg {
    color: #6b7280;
  }

  .guest-note {
    margin: 0.5rem 0 0;
    font-size: 0.8rem;
    color: #9ca3af;
    font-style: italic;
  }

  .signout-btn {
    margin-top: 1.25rem;
    padding: 0.7rem 2rem;
    background: #ffffff;
    border: 1px solid #d1d5db;
    border-radius: 999px;
    color: #6b7280;
    font-size: 0.9rem;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.15s ease;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
  }

  .signout-btn:hover {
    background: #f3f4f6;
    border-color: #9ca3af;
    color: #374151;
  }

  /* Responsive */
  @media (max-width: 480px) {
    .select-page {
      padding: 1.25rem 1rem 1.5rem;
    }

    .title {
      font-size: 1.35rem;
      margin: 0.5rem 0 1.25rem;
    }

    .profiles-grid {
      gap: 0.85rem;
    }

    .avatar-wrapper {
      width: 80px;
      height: 80px;
    }

    .avatar-initials {
      font-size: 1.6rem;
    }

    .profile-name {
      font-size: 0.85rem;
    }

    .add-form {
      padding: 1.5rem;
    }

    .bottom-section {
      padding-top: 1rem;
    }
  }
`;

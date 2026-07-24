// src/AccountPage.jsx - Account management with extracted subcomponents
import { useEffect, useState } from "react";
import { supabase } from "./supabaseClient";
import PageHeader from "./PageHeader";

// Subcomponents
import AccountOwnerCard from "./components/account/AccountOwnerCard";
import SubscriptionBillingCard from "./components/account/SubscriptionBillingCard";
import MessagingSection from "./components/account/MessagingSection";
import ProfilesManagementSection from "./components/account/ProfilesManagementSection";

export default function AccountPage({
  user,
  onClose,
  onShowProfile,
  onAccountUpdate,
  onSendNotification,
  profileImageUrl,
}) {
  // Loading / error states
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  // Account owner / admin fields
  const [accountId, setAccountId] = useState(null);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [familyName, setFamilyName] = useState("");

  // Optional billing / plan fields
  const [billingEmail, setBillingEmail] = useState("");
  const [planName, setPlanName] = useState("Ignite Free (beta)");
  const [renewalNote, setRenewalNote] = useState(
    "No renewal date yet – subscription features coming soon."
  );

  // Profiles managed under this account
  const [profiles, setProfiles] = useState([]);
  const [newProfileName, setNewProfileName] = useState("");
  const [newBirthMonth, setNewBirthMonth] = useState("");
  const [newBirthDay, setNewBirthDay] = useState("");
  const [newBirthYear, setNewBirthYear] = useState("");
  const [addingProfile, setAddingProfile] = useState(false);

  // Messaging state
  const [messageTitle, setMessageTitle] = useState("");
  const [messageBody, setMessageBody] = useState("");
  const [selectedProfiles, setSelectedProfiles] = useState([]);
  const [sendingMessage, setSendingMessage] = useState(false);

  // Load account and profiles on mount
  useEffect(() => {
    if (user?.id) {
      loadAccountData();
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

  async function loadAccountData() {
    setLoading(true);
    setError(null);

    try {
      // First, check if user has an account
      let { data: account, error: accountError } = await supabase
        .from("accounts")
        .select("*")
        .eq("user_id", user.id)
        .single();

      if (accountError && accountError.code === "PGRST116") {
        // No account exists, create one
        const { data: newAccount, error: createError } = await supabase
          .from("accounts")
          .insert({
            user_id: user.id,
            name: "",
            email: user.email,
            family_name: "",
            billing_email: user.email,
            plan_name: "Ignite Free (beta)",
            renewal_note:
              "No renewal date yet – subscription features coming soon.",
          })
          .select()
          .single();

        if (createError) throw createError;
        account = newAccount;
      } else if (accountError) {
        throw accountError;
      }

      // Populate form with account data
      setAccountId(account.id);
      const nameParts = (account.name || "").trim().split(/\s+/);
      setFirstName(nameParts[0] || "");
      setLastName(nameParts.slice(1).join(" ") || "");
      setEmail(account.email || user.email || "");
      setFamilyName(account.family_name || "");
      setBillingEmail(account.billing_email || account.email || "");
      setPlanName(account.plan_name || "Ignite Free (beta)");
      setRenewalNote(
        account.renewal_note ||
          "No renewal date yet – subscription features coming soon."
      );

      // Load profiles for this account
      const { data: profilesData, error: profilesError } = await supabase
        .from("profiles")
        .select("*")
        .eq("account_id", account.id)
        .order("created_at", { ascending: true });

      if (profilesError) throw profilesError;

      setProfiles(profilesData || []);
    } catch (err) {
      console.error("Error loading account:", err);
      setError("Failed to load account data. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  async function handleSaveAccount(e) {
    e.preventDefault();

    const fn = firstName.trim();
    const ln = lastName.trim();
    const em = email.trim();

    if (!fn || !em) {
      setError("Please enter at least a first name and email.");
      return;
    }

    setSaving(true);
    setError(null);

    try {
      const fullName = `${fn} ${ln}`.trim();

      const { error: updateError } = await supabase
        .from("accounts")
        .update({
          name: fullName,
          email: em,
          family_name: familyName.trim(),
          billing_email: billingEmail.trim() || em,
          plan_name: planName,
          renewal_note: renewalNote,
          updated_at: new Date().toISOString(),
        })
        .eq("id", accountId);

      if (updateError) throw updateError;

      // Notify parent
      if (onAccountUpdate) {
        onAccountUpdate(
          {
            id: accountId,
            name: fullName,
            email: em,
            familyName: familyName.trim(),
          },
          profiles
        );
      }
    } catch (err) {
      console.error("Error saving account:", err);
      setError("Failed to save account. Please try again.");
    } finally {
      setSaving(false);
    }
  }

  async function handleAddProfile(e) {
    e.preventDefault();
    if (!newProfileName.trim() || !accountId) return;

    setAddingProfile(true);
    setError(null);

    try {
      // Combine birthday parts if all are filled
      let dateOfBirth = null;
      if (newBirthYear && newBirthMonth && newBirthDay) {
        dateOfBirth = `${newBirthYear}-${newBirthMonth}-${newBirthDay}`;
      }

      const { data: newProfile, error: insertError } = await supabase
        .from("profiles")
        .insert({
          account_id: accountId,
          user_id: user.id,
          name: newProfileName.trim(),
          date_of_birth: dateOfBirth,
        })
        .select()
        .single();

      if (insertError) throw insertError;

      setProfiles((prev) => [...prev, newProfile]);
      setNewProfileName("");
      setNewBirthMonth("");
      setNewBirthDay("");
      setNewBirthYear("");

      if (onAccountUpdate) {
        onAccountUpdate(null, [...profiles, newProfile]);
      }
    } catch (err) {
      console.error("Error adding profile:", err);
      setError("Failed to add profile. Please try again.");
    } finally {
      setAddingProfile(false);
    }
  }

  async function handleRemoveProfile(profileId) {
    if (!confirm("Remove this profile? This cannot be undone.")) return;

    try {
      const { error: deleteError } = await supabase
        .from("profiles")
        .delete()
        .eq("id", profileId);

      if (deleteError) throw deleteError;

      const updatedProfiles = profiles.filter((p) => p.id !== profileId);
      setProfiles(updatedProfiles);

      if (onAccountUpdate) {
        onAccountUpdate(null, updatedProfiles);
      }
    } catch (err) {
      console.error("Error removing profile:", err);
      setError("Failed to remove profile. Please try again.");
    }
  }

  async function handleUpdateProfile(profileId, updates) {
    try {
      const { error: updateError } = await supabase
        .from("profiles")
        .update({
          ...updates,
          updated_at: new Date().toISOString(),
        })
        .eq("id", profileId);

      if (updateError) throw updateError;

      // Update local state
      setProfiles((prev) =>
        prev.map((p) => (p.id === profileId ? { ...p, ...updates } : p))
      );

      if (onAccountUpdate) {
        const updatedProfiles = profiles.map((p) =>
          p.id === profileId ? { ...p, ...updates } : p
        );
        onAccountUpdate(null, updatedProfiles);
      }
    } catch (err) {
      console.error("Error updating profile:", err);
      setError("Failed to update profile. Please try again.");
      throw err;
    }
  }

  // ===== MESSAGING FUNCTIONS =====
  async function handleSendMessage(e) {
    e.preventDefault();

    if (!messageTitle.trim() || !messageBody.trim()) {
      alert("Please enter both a title and message");
      return;
    }

    if (selectedProfiles.length === 0) {
      alert("Please select at least one profile to send to");
      return;
    }

    setSendingMessage(true);

    try {
      if (onSendNotification) {
        const notification = {
          id: Date.now().toString(),
          title: messageTitle.trim(),
          body: messageBody.trim(),
          createdAt: new Date().toISOString(),
          isRead: false,
        };

        // Send to each selected profile
        selectedProfiles.forEach((profileId) => {
          onSendNotification(profileId, notification);
        });

        // Clear form
        setMessageTitle("");
        setMessageBody("");
        setSelectedProfiles([]);

        alert(
          `Message sent to ${selectedProfiles.length} profile${
            selectedProfiles.length > 1 ? "s" : ""
          }!`
        );
      }
    } catch (err) {
      console.error("Error sending message:", err);
      alert("Failed to send message");
    } finally {
      setSendingMessage(false);
    }
  }

  function toggleProfileSelection(profileId) {
    setSelectedProfiles((prev) =>
      prev.includes(profileId)
        ? prev.filter((id) => id !== profileId)
        : [...prev, profileId]
    );
  }

  function selectAllProfiles() {
    setSelectedProfiles(profiles.map((p) => p.id));
  }

  function deselectAllProfiles() {
    setSelectedProfiles([]);
  }

  // ------- layout -------

  if (loading) {
    return (
      <div
        style={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#f5f5f7",
        }}
      >
        <div style={{ textAlign: "center" }}>
          <div
            style={{
              width: 40,
              height: 40,
              border: "3px solid #e5e7eb",
              borderTopColor: "#f97316",
              borderRadius: "50%",
              animation: "spin 0.8s linear infinite",
              margin: "0 auto 1rem",
            }}
          />
          <p style={{ color: "#6b7280" }}>Loading account...</p>
        </div>
        <style>{`
          @keyframes spin { to { transform: rotate(360deg); } }
        `}</style>
      </div>
    );
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#f5f5f7",
      }}
    >
      {/* Header outside the constrained container */}
      <PageHeader
        title="Account"
        onBack={onClose}
        onProfile={onShowProfile}
        profileImageUrl={profileImageUrl}
      />

      {/* Content container */}
      <div
        style={{
          maxWidth: "960px",
          margin: "0 auto",
          padding: "0 1rem 1.5rem",
        }}
      >
        <p
          style={{
            marginTop: "0.25rem",
            marginBottom: "1rem",
            color: "#6b7280",
            fontSize: "0.9rem",
          }}
        >
          Admin, billing, and profiles for this Ignite account.
        </p>

        {/* APP NOTIFICATION MANAGER BUTTON - ONLY FOR DEVELOPER */}
        {user?.id === "0ac7500b-34b8-4a65-ab4a-b430fb7dc170" && (
          <button
            onClick={() => (window.location.href = "/#notifications-admin")}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "0.5rem",
              padding: "0.75rem 1.25rem",
              borderRadius: "999px",
              border: "2px solid #f97316",
              background: "linear-gradient(135deg, #fff7ed 0%, #ffedd5 100%)",
              color: "#ea580c",
              fontSize: "0.9rem",
              fontWeight: 600,
              cursor: "pointer",
              marginBottom: "1.5rem",
              boxShadow: "0 4px 12px rgba(249, 115, 22, 0.15)",
              transition: "all 0.15s ease",
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.transform = "translateY(-2px)";
              e.currentTarget.style.boxShadow =
                "0 6px 16px rgba(249, 115, 22, 0.25)";
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.transform = "translateY(0)";
              e.currentTarget.style.boxShadow =
                "0 4px 12px rgba(249, 115, 22, 0.15)";
            }}
          >
            <span style={{ fontSize: "1.2rem" }}>📢</span>
            <span>Manage App Notifications</span>
          </button>
        )}

        {/* ERROR MESSAGE */}
        {error && (
          <div
            style={{
              background: "#fef2f2",
              border: "1px solid #fecaca",
              color: "#991b1b",
              padding: "0.75rem 1rem",
              borderRadius: "12px",
              fontSize: "0.9rem",
              marginBottom: "1rem",
            }}
          >
            {error}
          </div>
        )}

        {/* ACCOUNT OWNER / ADMIN CARD */}
        <AccountOwnerCard
          firstName={firstName}
          lastName={lastName}
          email={email}
          familyName={familyName}
          saving={saving}
          setFirstName={setFirstName}
          setLastName={setLastName}
          setEmail={setEmail}
          setFamilyName={setFamilyName}
          onSave={handleSaveAccount}
        />

        {/* SUBSCRIPTION / BILLING CARD */}
        <SubscriptionBillingCard
          planName={planName}
          billingEmail={billingEmail}
          renewalNote={renewalNote}
          setBillingEmail={setBillingEmail}
          setRenewalNote={setRenewalNote}
        />

        {/* MESSAGING SECTION */}
        <MessagingSection
          profiles={profiles}
          messageTitle={messageTitle}
          messageBody={messageBody}
          selectedProfiles={selectedProfiles}
          sendingMessage={sendingMessage}
          setMessageTitle={setMessageTitle}
          setMessageBody={setMessageBody}
          onToggleProfile={toggleProfileSelection}
          onSelectAll={selectAllProfiles}
          onDeselectAll={deselectAllProfiles}
          onSend={handleSendMessage}
        />

        {/* PROFILES MANAGEMENT */}
        <ProfilesManagementSection
          profiles={profiles}
          newProfileName={newProfileName}
          newBirthMonth={newBirthMonth}
          newBirthDay={newBirthDay}
          newBirthYear={newBirthYear}
          addingProfile={addingProfile}
          getAge={getAge}
          setNewProfileName={setNewProfileName}
          setNewBirthMonth={setNewBirthMonth}
          setNewBirthDay={setNewBirthDay}
          setNewBirthYear={setNewBirthYear}
          onAddProfile={handleAddProfile}
          onRemoveProfile={handleRemoveProfile}
          onUpdateProfile={handleUpdateProfile}
        />

        <p
          style={{
            marginTop: "1rem",
            fontSize: "0.8rem",
            color: "#6b7280",
          }}
        >
          Profile pictures are managed from each person's Profile page.
        </p>
      </div>
    </div>
  );
}

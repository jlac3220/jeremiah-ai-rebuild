// src/ProfilePage.js — Fixed notifications + delete persistence
import React, { useEffect, useState, useRef } from "react";
import { supabase } from "./supabaseClient";
import PageHeader from "./PageHeader";
import { theme } from "./theme";
import FireLevelMeter from "./FireLevelMeter";
import ScoringInfoDropdown from "./ScoringInfoDropdown";
import ShareModal from "./ShareModal";

const { colors, typography } = theme || {};
const { roles } = typography || {};

export default function ProfilePage({
  user,
  profile,
  onBack,
  backLabel,
  accomplishments,
  notifications = [],
  onUpdateNotifications,
  onShowAccount,
  onSwitchProfile,
  onProfileUpdate,
  onShareSuccess,
}) {
  const [profileImage, setProfileImage] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const fileInputRef = useRef(null);

  const name = profile?.name || "Profile";
  const birthday = profile?.birthday || profile?.date_of_birth;
  const profileId = profile?.id;

  const getAge = (birthDate) => {
    if (!birthDate) return null;
    const today = new Date();
    const birth = new Date(birthDate);
    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate()))
      age--;
    return age;
  };

  const age = getAge(birthday);

  const {
    dailyStreak = 0,
    totalDays = 0,
    studiesCompleted = 0,
    lessonsCompleted = 0,
    rapidFireCompleted = 0,
    sharesCompleted = 0,
    heatScore = 0,
    fireLevelLabel = "Spark",
  } = accomplishments || {};

  const FIRE_LEVEL_COLORS = {
    Spark: "#FACC15",
    Ember: "#FB923C",
    Fiery: "#F97316",
    Burning: "#EA580C",
    Ablaze: "#DC2626",
    Torched: "#B91C1C",
    Scorching: "#991B1B",
    Wildfire: "#7C2D12",
    Firestorm: "#7C3AED",
    Inferno: "#4C1D95",
  };
  const currentLevelColor = FIRE_LEVEL_COLORS[fireLevelLabel] || "#FACC15";

  useEffect(() => {
    if (profile?.profile_image_url) setProfileImage(profile.profile_image_url);
    else if (profile?.profileImage) setProfileImage(profile.profileImage);
    else setProfileImage(null);
  }, [profile]);

  function handleImageClick() {
    fileInputRef.current?.click();
  }

  async function handleImageChange(e) {
    const file = e.target.files?.[0];
    if (!file) return;

    const validTypes = ["image/jpeg", "image/png", "image/gif", "image/webp"];
    if (!validTypes.includes(file.type)) {
      alert("Please select a valid image file (JPEG, PNG, GIF, or WebP)");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      alert("Image must be less than 5MB");
      return;
    }

    setUploading(true);

    try {
      if (user?.id && profileId) {
        const fileExt = file.name.split(".").pop();
        const fileName = `${user.id}/${profileId}-${Date.now()}.${fileExt}`;

        const { error: uploadError } = await supabase.storage
          .from("profile-images")
          .upload(fileName, file, { cacheControl: "3600", upsert: true });

        if (uploadError) throw uploadError;

        const { data: urlData } = supabase.storage
          .from("profile-images")
          .getPublicUrl(fileName);

        const publicUrl = urlData.publicUrl;

        const { error: updateError } = await supabase
          .from("profiles")
          .update({ profile_image_url: publicUrl })
          .eq("id", profileId);

        if (updateError) throw updateError;

        setProfileImage(publicUrl);
        onProfileUpdate?.({ ...profile, profile_image_url: publicUrl });
      } else {
        const reader = new FileReader();
        reader.onloadend = () => {
          setProfileImage(reader.result);
          onProfileUpdate?.({ ...profile, profileImage: reader.result });
        };
        reader.readAsDataURL(file);
      }
    } catch (error) {
      console.error("Error uploading image:", error);
      alert("Failed to upload image. Please try again.");
    } finally {
      setUploading(false);
    }
  }

  async function handleRemoveImage() {
    if (!profileImage) return;
    setUploading(true);

    try {
      if (user?.id && profileId && profile?.profile_image_url) {
        const url = new URL(profile.profile_image_url);
        const pathParts = url.pathname.split("/profile-images/");
        if (pathParts[1]) {
          await supabase.storage.from("profile-images").remove([pathParts[1]]);
        }

        const { error: updateError } = await supabase
          .from("profiles")
          .update({ profile_image_url: null })
          .eq("id", profileId);

        if (updateError) throw updateError;
      }

      setProfileImage(null);
      onProfileUpdate?.({
        ...profile,
        profile_image_url: null,
        profileImage: null,
      });
    } catch (error) {
      console.error("Error removing image:", error);
      alert("Failed to remove image. Please try again.");
    } finally {
      setUploading(false);
    }
  }

  // Notifications logic
  const sortedNotifications = [...(notifications || [])].sort((a, b) => {
    const aDate = a.createdAt ? new Date(a.createdAt) : new Date(0);
    const bDate = b.createdAt ? new Date(b.createdAt) : new Date(0);
    return bDate - aDate;
  });

  const updateNotifications = (updatedList) => {
    if (typeof onUpdateNotifications === "function")
      onUpdateNotifications(updatedList);
  };

  const [appNotifReadState, setAppNotifReadState] = useState({});
  const [loadingReads, setLoadingReads] = useState(false);

  useEffect(() => {
    if (!profileId) return;

    async function loadReadState() {
      setLoadingReads(true);
      try {
        const { data, error } = await supabase
          .from("app_notification_reads")
          .select("notification_id, is_deleted")
          .eq("profile_id", profileId);

        if (error) throw error;

        const stateMap = {};
        (data || []).forEach((item) => {
          stateMap[`app-${item.notification_id}`] = true;
          if (item.is_deleted) {
            stateMap[`deleted-app-${item.notification_id}`] = true;
          }
        });
        setAppNotifReadState(stateMap);
      } catch (err) {
        console.error("Error loading read state:", err);
      } finally {
        setLoadingReads(false);
      }
    }

    loadReadState();
  }, [profileId]);

  async function markAppNotificationRead(notificationId) {
    if (!profileId) return;
    const actualId = notificationId.replace("app-", "");

    try {
      const { error } = await supabase
        .from("app_notification_reads")
        .upsert(
          {
            profile_id: profileId,
            notification_id: actualId,
            is_deleted: false,
          },
          { onConflict: "profile_id,notification_id" }
        );
      if (error) throw error;
      setAppNotifReadState((prev) => ({ ...prev, [notificationId]: true }));
    } catch (err) {
      console.error("Error marking notification read:", err);
    }
  }

  async function unmarkAppNotificationRead(notificationId) {
    if (!profileId) return;
    const actualId = notificationId.replace("app-", "");

    try {
      const { error } = await supabase
        .from("app_notification_reads")
        .delete()
        .eq("profile_id", profileId)
        .eq("notification_id", actualId);

      if (error) throw error;
      setAppNotifReadState((prev) => {
        const newState = { ...prev };
        delete newState[notificationId];
        return newState;
      });
    } catch (err) {
      console.error("Error unmarking notification:", err);
    }
  }

  const toggleNotificationRead = (id) => {
    if (id.toString().startsWith("app-")) {
      if (appNotifReadState[id]) unmarkAppNotificationRead(id);
      else markAppNotificationRead(id);
      return;
    }

    const personalOnly = (notifications || []).filter(
      (n) => !n.isAppNotification
    );
    const updated = personalOnly.map((n) =>
      n.id === id ? { ...n, isRead: !n.isRead } : n
    );
    updateNotifications(updated);
  };

  const notificationsWithReadState = sortedNotifications
    .filter((n) => {
      if (n.isAppNotification && appNotifReadState[`deleted-${n.id}`]) {
        return false;
      }
      return true;
    })
    .map((n) => {
      if (n.isAppNotification && appNotifReadState[n.id])
        return { ...n, isRead: true };
      return n;
    });

  const markAllAsRead = async () => {
    const appNotifs = notificationsWithReadState.filter(
      (n) => n.isAppNotification && !n.isRead
    );
    for (const notif of appNotifs) {
      await markAppNotificationRead(notif.id);
    }

    const personalOnly = (notifications || []).filter(
      (n) => !n.isAppNotification
    );
    const updated = personalOnly.map((n) => ({ ...n, isRead: true }));
    updateNotifications(updated);
  };

  const unreadCount = notificationsWithReadState.filter(
    (n) => !n.isRead
  ).length;

  const [showAllMessages, setShowAllMessages] = useState(false);
  const [selectedMessage, setSelectedMessage] = useState(null);

  const handleMessageClick = (note) => {
    if (!note.isRead) {
      if (note.id.toString().startsWith("app-"))
        markAppNotificationRead(note.id);
      else toggleNotificationRead(note.id);
    }
    setSelectedMessage(note);
  };

  const handleDeleteNotification = async (note) => {
    if (!note) return;

    if (note.isAppNotification) {
      if (profileId) {
        const actualId = note.id.replace("app-", "");
        try {
          const { error } = await supabase
            .from("app_notification_reads")
            .upsert(
              {
                profile_id: profileId,
                notification_id: actualId,
                is_deleted: true,
              },
              { onConflict: "profile_id,notification_id" }
            );
          if (error) throw error;
        } catch (err) {
          console.error("Error deleting notification:", err);
        }
      }

      setAppNotifReadState((prev) => ({
        ...prev,
        [`deleted-${note.id}`]: true,
      }));
      setSelectedMessage(null);
      return;
    }

    const personalOnly = (notifications || []).filter(
      (n) => !n.isAppNotification
    );
    const updated = personalOnly.filter((n) => n.id !== note.id);
    updateNotifications(updated);
    setSelectedMessage(null);
  };

  const getInitials = () => {
    if (!name.trim()) return "?";
    const parts = name.trim().split(" ");
    if (parts.length === 1) return parts[0][0].toUpperCase();
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  };

  return (
    <div style={styles.page}>
      <style>{`
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }

        @media (max-width: 430px) {
          .ignite-meter-row { gap: 0.55rem; }
          .ignite-meter-box { flex: 0 0 46% !important; padding: 0.65rem !important; min-height: 200px !important; }
          .ignite-verse-box { padding: 0.7rem 0.75rem !important; }
          .ignite-verse-quote { font-size: 0.85rem !important; line-height: 1.25 !important; }
          .ignite-verse-pill { font-size: 0.62rem !important; padding: 0.2rem 0.45rem !important; }
        }
      `}</style>

      <PageHeader
        title="Profile"
        onBack={onBack}
        backLabel={backLabel}
        profileImageUrl={profileImage}
        unreadCount={unreadCount}
      />

      <main style={styles.content}>
        {/* Profile picture section */}
        <section style={styles.pictureSection}>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/jpeg,image/png,image/gif,image/webp"
            onChange={handleImageChange}
            style={{ display: "none" }}
          />

          <button
            type="button"
            style={{
              ...styles.avatarButton,
              opacity: uploading ? 0.7 : 1,
              cursor: uploading ? "wait" : "pointer",
            }}
            onClick={handleImageClick}
            disabled={uploading}
          >
            {profileImage ? (
              <img
                src={profileImage}
                alt="Profile"
                style={styles.avatarImage}
              />
            ) : (
              <div style={styles.avatarPlaceholder}>
                <span style={styles.avatarInitials}>{getInitials()}</span>
              </div>
            )}
            <div style={styles.avatarEditBadge}>
              {uploading ? <span style={styles.spinner} /> : <span>✎</span>}
            </div>
          </button>

          <h2 style={styles.profileName}>{name || "Your Profile"}</h2>
          <p style={styles.profileRole}>{age ? `${age} years old` : ""}</p>

          <div style={styles.pictureActions}>
            <button
              type="button"
              style={styles.pictureBtn}
              onClick={handleImageClick}
              disabled={uploading}
            >
              {uploading
                ? "Uploading..."
                : profileImage
                ? "Change photo"
                : "Add photo"}
            </button>
            {profileImage && (
              <button
                type="button"
                style={{ ...styles.pictureBtn, color: "#ef4444" }}
                onClick={handleRemoveImage}
                disabled={uploading}
              >
                Remove
              </button>
            )}
          </div>

          {onShowAccount && (
            <button
              type="button"
              style={styles.accountSettingsBtn}
              onClick={onShowAccount}
            >
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <circle cx="12" cy="12" r="3" />
                <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" />
              </svg>
              Account Settings
            </button>
          )}

          {onSwitchProfile && (
            <button
              type="button"
              style={styles.switchProfileBtn}
              onClick={onSwitchProfile}
            >
              Switch Profile
            </button>
          )}
        </section>

        {/* ON FIRE header + Share button */}
        <div style={styles.sectionHeader}>
          <div style={styles.sectionTitleLarge}>
            <img
              src="/ignite-logo-flame.png"
              alt=""
              style={styles.sectionFlame}
            />
            ON FIRE?
          </div>

          <button
            type="button"
            style={styles.shareButtonHeader}
            onClick={() => setShowShareModal(true)}
          >
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8" />
              <polyline points="16 6 12 2 8 6" />
              <line x1="12" y1="2" x2="12" y2="15" />
            </svg>
            Share
          </button>
        </div>

        {/* ON FIRE card */}
        <section style={styles.card}>
          <ScoringInfoDropdown />

          {/* Points Display */}
          <div style={styles.pointsDisplay}>
            <div style={styles.pointsValue}>{heatScore.toLocaleString()}</div>
            <div style={styles.pointsLabel}>POINTS</div>
            <div
              style={{
                ...styles.fireLevelBadge,
                backgroundColor: currentLevelColor,
              }}
            >
              {fireLevelLabel}
            </div>
          </div>

          {/* Stats grid */}
          <div style={styles.statsGrid}>
            <div style={styles.statBox}>
              <div style={styles.statValue}>{dailyStreak || "—"}</div>
              <div style={styles.statLabel}>Streak</div>
            </div>
            <div style={styles.statBox}>
              <div style={styles.statValue}>{totalDays || "—"}</div>
              <div style={styles.statLabel}>Days</div>
            </div>
            <div style={styles.statBox}>
              <div style={styles.statValue}>{sharesCompleted || "—"}</div>
              <div style={styles.statLabel}>Shares</div>
            </div>
            <div style={styles.statBox}>
              <div style={styles.statValue}>{studiesCompleted || "—"}</div>
              <div style={styles.statLabel}>Studies</div>
            </div>
            <div style={styles.statBox}>
              <div style={styles.statValue}>{rapidFireCompleted || "—"}</div>
              <div style={styles.statLabel}>Rapid</div>
            </div>
            <div style={styles.statBox}>
              <div style={styles.statValue}>{lessonsCompleted || "—"}</div>
              <div style={styles.statLabel}>Lessons</div>
            </div>
          </div>

          {/* Meter + Verse side-by-side */}
          <div style={styles.meterRow} className="ignite-meter-row">
            <div style={styles.meterBox} className="ignite-meter-box">
              <FireLevelMeter heatScore={heatScore} />
            </div>

            <div style={styles.verseInlineBox} className="ignite-verse-box">
              <div
                style={styles.verseInlineQuote}
                className="ignite-verse-quote"
              >
                "His word was in mine heart as a burning fire shut up in my
                bones"
              </div>
              <div style={styles.verseInlineRef}>— Jeremiah 20:9</div>
            </div>
          </div>
        </section>

        {/* Messages Section */}
        <div style={styles.messagesSectionTitle}>
          MESSAGES
          {unreadCount > 0 && (
            <span style={styles.unreadBadge}>{unreadCount}</span>
          )}
        </div>

        <section style={styles.card}>
          <div style={styles.messagesHeader}>
            <p style={styles.messagesStatus}>
              {unreadCount > 0
                ? `You have ${unreadCount} unread message${
                    unreadCount === 1 ? "" : "s"
                  }.`
                : "You're all caught up."}
            </p>
            {unreadCount > 0 && (
              <button
                type="button"
                style={styles.markReadBtn}
                onClick={markAllAsRead}
              >
                Mark all as read
              </button>
            )}
          </div>

          {notificationsWithReadState.length === 0 ? (
            <p style={styles.emptyMessages}>
              No messages yet. When there's something new, it will appear here.
            </p>
          ) : (
            <>
              <div style={styles.messagesList}>
                {notificationsWithReadState.slice(0, 3).map((note) => (
                  <button
                    key={note.id}
                    type="button"
                    style={{
                      ...styles.messageItem,
                      background: note.isRead ? "#f9fafb" : "#ffffff",
                      borderColor: note.isRead ? "#e5e7eb" : "#3b82f6",
                    }}
                    onClick={() => handleMessageClick(note)}
                  >
                    <div
                      style={{
                        ...styles.messageDot,
                        background: note.isRead ? "transparent" : "#3b82f6",
                      }}
                    />
                    <div style={styles.messageContent}>
                      <div style={styles.messageTop}>
                        <span
                          style={{
                            ...styles.messageTitle,
                            fontWeight: note.isRead ? 500 : 600,
                          }}
                        >
                          {note.title || "Message"}
                        </span>
                        {note.createdAt && (
                          <span style={styles.messageDate}>
                            {new Date(note.createdAt).toLocaleDateString()}
                          </span>
                        )}
                      </div>
                      {note.body && (
                        <p style={styles.messageBody}>{note.body}</p>
                      )}
                    </div>
                  </button>
                ))}
              </div>

              {notificationsWithReadState.length > 3 && (
                <button
                  type="button"
                  style={styles.viewAllBtn}
                  onClick={() => setShowAllMessages(true)}
                >
                  View All {notificationsWithReadState.length} Messages
                </button>
              )}
            </>
          )}
        </section>
      </main>

      {/* View All Messages Modal */}
      {showAllMessages && (
        <div
          style={styles.modalOverlay}
          onClick={() => setShowAllMessages(false)}
        >
          <div style={styles.modalContent} onClick={(e) => e.stopPropagation()}>
            <div style={styles.modalHeader}>
              <h2 style={styles.modalHeaderTitle}>All Messages</h2>
              <button
                style={styles.modalClose}
                onClick={() => setShowAllMessages(false)}
              >
                ✕
              </button>
            </div>
            <div style={styles.modalBody}>
              {notificationsWithReadState.map((note) => (
                <button
                  key={note.id}
                  type="button"
                  style={{
                    ...styles.messageItem,
                    background: note.isRead ? "#f9fafb" : "#ffffff",
                    borderColor: note.isRead ? "#e5e7eb" : "#3b82f6",
                  }}
                  onClick={() => {
                    handleMessageClick(note);
                    setShowAllMessages(false);
                  }}
                >
                  <div
                    style={{
                      ...styles.messageDot,
                      background: note.isRead ? "transparent" : "#3b82f6",
                    }}
                  />
                  <div style={styles.messageContent}>
                    <div style={styles.messageTop}>
                      <span
                        style={{
                          ...styles.messageTitle,
                          fontWeight: note.isRead ? 500 : 600,
                        }}
                      >
                        {note.title || "Message"}
                      </span>
                      {note.createdAt && (
                        <span style={styles.messageDate}>
                          {new Date(note.createdAt).toLocaleDateString()}
                        </span>
                      )}
                    </div>
                    {note.body && <p style={styles.messageBody}>{note.body}</p>}
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Expanded Message Modal */}
      {selectedMessage && (
        <div
          style={styles.modalOverlay}
          onClick={() => setSelectedMessage(null)}
        >
          <div
            style={styles.expandedMessage}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              style={styles.expandedClose}
              onClick={() => setSelectedMessage(null)}
            >
              ✕
            </button>

            <div style={styles.expandedIcon}>
              {selectedMessage.isAppNotification
                ? selectedMessage.title?.match(
                    /^[\p{Emoji}\p{Extended_Pictographic}]+/u
                  )?.[0] || "📢"
                : "✉️"}
            </div>

            <h2 style={styles.expandedTitle}>
              {selectedMessage.isAppNotification
                ? selectedMessage.title?.replace(/^[^\w\s]+\s*/, "") ||
                  "Message"
                : selectedMessage.title || "Message"}
            </h2>

            {selectedMessage.createdAt && (
              <p style={styles.expandedDate}>
                {new Date(selectedMessage.createdAt).toLocaleDateString(
                  "en-US",
                  {
                    weekday: "long",
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  }
                )}
              </p>
            )}

            <div style={styles.expandedBody}>
              {selectedMessage.body || "No message content."}
            </div>

            <div style={styles.expandedActions}>
              <button
                style={styles.expandedCloseBtn}
                onClick={() => setSelectedMessage(null)}
              >
                Close
              </button>
              <button
                style={styles.expandedDeleteBtn}
                onClick={() => handleDeleteNotification(selectedMessage)}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Share Modal */}
      {showShareModal && (
        <ShareModal
          profileId={profileId}
          profileName={name}
          heatScore={heatScore}
          fireLevelLabel={fireLevelLabel}
          streakCount={dailyStreak}
          onClose={() => setShowShareModal(false)}
          onShareSuccess={(isNew) => {
            if (typeof onShareSuccess === "function") onShareSuccess();
          }}
        />
      )}
    </div>
  );
}

/* ===================== STYLES ===================== */

const styles = {
  page: {
    minHeight: "100vh",
    background:
      "radial-gradient(circle at top, #f9fafb 0%, #eef1f5 40%, #e5e7eb 100%)",
  },
  content: {
    maxWidth: "520px",
    margin: "0 auto",
    padding: "0 1rem 4.8rem",
  },

  sectionHeader: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    margin: "1.6rem 0 0.75rem",
  },
  sectionTitleLarge: {
    fontSize: "1.1rem",
    fontWeight: 900,
    letterSpacing: "0.03em",
    color: "#1f2937",
    textTransform: "uppercase",
    display: "flex",
    alignItems: "center",
    gap: "0.5rem",
  },
  sectionFlame: { width: "24px", height: "24px", objectFit: "contain" },

  shareButtonHeader: {
    display: "flex",
    alignItems: "center",
    gap: "0.35rem",
    padding: "0.5rem 0.9rem",
    borderRadius: "999px",
    border: "none",
    background:
      "linear-gradient(135deg, #FFB400 0%, #FF6A00 50%, #E02121 100%)",
    color: "#ffffff",
    fontSize: "0.75rem",
    fontWeight: 700,
    cursor: "pointer",
    boxShadow: "0 4px 12px rgba(249, 115, 22, 0.3)",
    textTransform: "uppercase",
    letterSpacing: "0.03em",
  },

  messagesSectionTitle: {
    fontSize: "1.1rem",
    fontWeight: 900,
    letterSpacing: "0.03em",
    color: "#1f2937",
    textTransform: "uppercase",
    display: "flex",
    alignItems: "center",
    gap: "0.5rem",
    marginTop: "2.5rem",
    marginBottom: "0.75rem",
  },

  unreadBadge: {
    background: "#ef4444",
    color: "white",
    fontSize: "0.7rem",
    fontWeight: 700,
    padding: "0.15rem 0.45rem",
    borderRadius: "999px",
    marginLeft: "0.25rem",
  },

  pictureSection: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    padding: "1.5rem 0 0.5rem",
  },
  avatarButton: {
    position: "relative",
    width: "110px",
    height: "110px",
    borderRadius: "50%",
    border: "4px solid white",
    background: "#ffffff",
    cursor: "pointer",
    overflow: "hidden",
    padding: 0,
    boxShadow: "0 8px 24px rgba(0, 0, 0, 0.12)",
  },
  avatarImage: { width: "100%", height: "100%", objectFit: "cover" },
  avatarPlaceholder: {
    width: "100%",
    height: "100%",
    background: "linear-gradient(135deg, #e0e7ff 0%, #c7d2fe 100%)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  avatarInitials: {
    fontSize: "2.2rem",
    fontWeight: 700,
    color: colors?.primary || "#6366f1",
  },
  avatarEditBadge: {
    position: "absolute",
    bottom: "4px",
    right: "4px",
    width: "30px",
    height: "30px",
    borderRadius: "50%",
    background: colors?.primary || "#6366f1",
    color: "white",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "0.9rem",
    boxShadow: "0 2px 6px rgba(0, 0, 0, 0.2)",
  },
  spinner: {
    width: "14px",
    height: "14px",
    border: "2px solid rgba(255, 255, 255, 0.3)",
    borderTopColor: "white",
    borderRadius: "50%",
    animation: "spin 0.8s linear infinite",
  },
  profileName: {
    margin: "0.75rem 0 0.1rem",
    fontSize: "1.4rem",
    fontWeight: 800,
    color: "#1f2937",
  },
  profileRole: { margin: 0, fontSize: "1rem", color: "#6b7280" },
  pictureActions: { display: "flex", gap: "0.75rem", marginTop: "0.6rem" },
  pictureBtn: {
    background: "none",
    border: "none",
    fontSize: "0.875rem",
    fontWeight: 600,
    color: colors?.primary || "#6366f1",
    cursor: "pointer",
    padding: "0.3rem 0.5rem",
  },
  accountSettingsBtn: {
    display: "flex",
    alignItems: "center",
    gap: "0.5rem",
    marginTop: "1rem",
    padding: "0.7rem 1.4rem",
    borderRadius: "999px",
    border: "none",
    background: "linear-gradient(135deg, #1e3a8a 0%, #1e40af 100%)",
    color: "#ffffff",
    fontSize: "0.9rem",
    fontWeight: 700,
    cursor: "pointer",
    boxShadow: "0 6px 16px rgba(30, 64, 175, 0.25)",
  },
  switchProfileBtn: {
    marginTop: "0.75rem",
    padding: "0.6rem 1.2rem",
    borderRadius: "999px",
    border: "1px solid #d1d5db",
    background: "#f9fafb",
    fontSize: "0.875rem",
    fontWeight: 600,
    color: "#374151",
    cursor: "pointer",
  },

  card: {
    background: "#ffffff",
    borderRadius: "18px",
    padding: "1rem",
    border: "1px solid #e5e7eb",
    boxShadow: "0 4px 12px rgba(0, 0, 0, 0.04)",
    overflow: "visible",
  },

  pointsDisplay: {
    textAlign: "center",
    padding: "1rem 0.75rem",
    marginBottom: "1rem",
    background: "#f8fafc",
    borderRadius: "14px",
    border: "1px solid #e5e7eb",
  },
  pointsValue: {
    fontSize: "2.5rem",
    fontWeight: 900,
    color: "#1f2937",
    lineHeight: 1,
    letterSpacing: "-0.02em",
  },
  pointsLabel: {
    fontSize: "0.7rem",
    fontWeight: 700,
    color: "#6b7280",
    letterSpacing: "0.1em",
    marginTop: "0.2rem",
    marginBottom: "0.6rem",
  },
  fireLevelBadge: {
    display: "inline-block",
    padding: "0.4rem 1.25rem",
    borderRadius: "999px",
    color: "#ffffff",
    fontSize: "0.85rem",
    fontWeight: 800,
    textTransform: "uppercase",
    letterSpacing: "0.05em",
    boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
  },

  statsGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(3, 1fr)",
    gap: "0.5rem",
  },
  statBox: {
    textAlign: "center",
    background: "#f8fafc",
    border: "1px solid #e5e7eb",
    borderRadius: "12px",
    padding: "0.6rem 0.4rem",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    minHeight: "60px",
  },
  statValue: {
    fontSize: "1.25rem",
    fontWeight: 900,
    color: "#1f2937",
    lineHeight: 1,
  },
  statLabel: {
    fontSize: "0.55rem",
    fontWeight: 600,
    color: "#6b7280",
    marginTop: "0.25rem",
    textTransform: "uppercase",
    letterSpacing: "0.02em",
  },

  meterRow: {
    marginTop: "1rem",
    display: "flex",
    gap: "0.75rem",
    alignItems: "stretch",
    flexWrap: "nowrap",
  },
  meterBox: {
    flex: "0 0 52%",
    minWidth: 0,
    borderRadius: "14px",
    border: "1px solid #e5e7eb",
    background: "#ffffff",
    boxShadow: "0 6px 16px rgba(0, 0, 0, 0.06)",
    padding: ".5rem",
    minHeight: "210px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    overflow: "visible",
  },
  verseInlineBox: {
    flex: "1 1 0",
    minWidth: 0,
    borderRadius: "14px",
    border: "1px solid #e5e7eb",
    background:
      "linear-gradient(180deg, #ffffff 0%, #f8fafc 70%, #ffffff 100%)",
    boxShadow: "0 6px 16px rgba(0, 0, 0, 0.06)",
    padding: "0.9rem 0.95rem",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    overflow: "hidden",
  },
  verseInlineQuote: {
    color: "#0f172a",
    fontWeight: 800,
    fontStyle: "italic",
    fontSize: "0.95rem",
    lineHeight: 1.35,
    marginBottom: "0.5rem",
  },
  verseInlineRef: {
    color: "#64748b",
    fontSize: "0.75rem",
    fontWeight: 800,
    letterSpacing: "0.02em",
  },

  messagesHeader: {
    display: "flex",
    alignItems: "baseline",
    justifyContent: "space-between",
    gap: "0.5rem",
    marginBottom: "0.5rem",
  },
  messagesStatus: { margin: 0, fontSize: "0.875rem", color: "#6b7280" },
  markReadBtn: {
    background: "none",
    border: "none",
    fontSize: "0.75rem",
    fontWeight: 600,
    color: "#3b82f6",
    cursor: "pointer",
    padding: 0,
  },
  emptyMessages: {
    margin: "0.5rem 0 0",
    fontSize: "0.875rem",
    color: "#9ca3af",
  },
  messagesList: { display: "flex", flexDirection: "column", gap: "0.5rem" },
  messageItem: {
    width: "100%",
    textAlign: "left",
    background: "#f9fafb",
    border: "1px solid #e5e7eb",
    borderRadius: "12px",
    padding: "0.65rem 0.85rem",
    cursor: "pointer",
    display: "flex",
    gap: "0.6rem",
    alignItems: "flex-start",
  },
  messageDot: {
    width: "8px",
    height: "8px",
    borderRadius: "50%",
    marginTop: "5px",
    flexShrink: 0,
  },
  messageContent: { flex: 1, minWidth: 0 },
  messageTop: {
    display: "flex",
    justifyContent: "space-between",
    gap: "0.5rem",
    marginBottom: "0.15rem",
  },
  messageTitle: { fontSize: "0.875rem", fontWeight: 600, color: "#1f2937" },
  messageDate: { fontSize: "0.7rem", color: "#9ca3af", whiteSpace: "nowrap" },
  messageBody: {
    margin: 0,
    fontSize: "0.8rem",
    color: "#6b7280",
    lineHeight: 1.4,
  },
  viewAllBtn: {
    width: "100%",
    marginTop: "0.75rem",
    padding: "0.6rem 1rem",
    borderRadius: "10px",
    border: "1px solid #d1d5db",
    background: "#f9fafb",
    fontSize: "0.875rem",
    fontWeight: 600,
    color: "#374151",
    cursor: "pointer",
  },

  modalOverlay: {
    position: "fixed",
    inset: 0,
    background: "rgba(0, 0, 0, 0.6)",
    backdropFilter: "blur(4px)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 1000,
    padding: "1rem",
  },
  modalContent: {
    background: "#ffffff",
    borderRadius: "1.25rem",
    width: "100%",
    maxWidth: "480px",
    maxHeight: "80vh",
    display: "flex",
    flexDirection: "column",
    boxShadow: "0 20px 50px rgba(0, 0, 0, 0.25)",
  },
  modalHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "1rem 1.25rem",
    borderBottom: "1px solid #e5e7eb",
  },
  modalHeaderTitle: {
    margin: 0,
    fontSize: "1.1rem",
    fontWeight: 700,
    color: "#111827",
  },
  modalClose: {
    background: "none",
    border: "none",
    fontSize: "1.25rem",
    color: "#6b7280",
    cursor: "pointer",
    padding: "0.25rem",
    lineHeight: 1,
  },
  modalBody: {
    padding: "1rem",
    overflowY: "auto",
    display: "flex",
    flexDirection: "column",
    gap: "0.5rem",
  },

  expandedMessage: {
    background: "#ffffff",
    borderRadius: "1.5rem",
    width: "95%",
    maxWidth: "500px",
    maxHeight: "90vh",
    overflowY: "auto",
    padding: "2.5rem 2rem",
    textAlign: "center",
    position: "relative",
    boxShadow: "0 25px 60px rgba(0, 0, 0, 0.3)",
  },
  expandedClose: {
    position: "absolute",
    top: "1rem",
    right: "1rem",
    background: "none",
    border: "none",
    fontSize: "1.25rem",
    color: "#6b7280",
    cursor: "pointer",
  },
  expandedIcon: { fontSize: "4rem", marginBottom: "1.25rem" },
  expandedTitle: {
    margin: "0 0 0.75rem",
    fontSize: "1.6rem",
    fontWeight: 700,
    color: "#111827",
    lineHeight: 1.3,
  },
  expandedDate: { margin: "0 0 1.5rem", fontSize: "0.9rem", color: "#9ca3af" },
  expandedBody: {
    fontSize: "1.15rem",
    lineHeight: 1.7,
    color: "#374151",
    textAlign: "left",
    padding: "1.25rem 1.5rem",
    background: "#f9fafb",
    borderRadius: "1rem",
    marginBottom: "2rem",
    minHeight: "80px",
  },
  expandedActions: { display: "flex", gap: "1rem", justifyContent: "center" },
  expandedCloseBtn: {
    padding: "0.85rem 2.5rem",
    borderRadius: "999px",
    border: "none",
    background: "linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)",
    color: "#ffffff",
    fontSize: "1rem",
    fontWeight: 600,
    cursor: "pointer",
    boxShadow: "0 8px 20px rgba(59, 130, 246, 0.25)",
  },
  expandedDeleteBtn: {
    padding: "0.85rem 2rem",
    borderRadius: "999px",
    border: "2px solid #e5e7eb",
    background: "#ffffff",
    color: "#6b7280",
    fontSize: "1rem",
    fontWeight: 600,
    cursor: "pointer",
  },
};

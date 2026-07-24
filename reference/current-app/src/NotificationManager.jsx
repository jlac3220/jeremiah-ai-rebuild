// src/NotificationManager.js - Admin interface to send app-wide notifications
import React, { useState, useEffect } from "react";
import { supabase } from "./supabaseClient";

export default function NotificationManager({ onClose }) {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);

  // Form state
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [priority, setPriority] = useState("normal");
  const [category, setCategory] = useState("general");
  const [icon, setIcon] = useState("🔥");
  const [expiresAt, setExpiresAt] = useState("");

  useEffect(() => {
    loadNotifications();
  }, []);

  async function loadNotifications() {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("app_notifications")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(20);

      if (error) throw error;
      setNotifications(data || []);
    } catch (err) {
      console.error("Error loading notifications:", err);
      alert("Failed to load notifications");
    } finally {
      setLoading(false);
    }
  }

  async function handleSubmit(e) {
    e.preventDefault();

    if (!title.trim() || !body.trim()) {
      alert("Please enter both title and message");
      return;
    }

    setSending(true);

    try {
      const notification = {
        title: title.trim(),
        body: body.trim(),
        priority,
        category,
        icon: icon || null,
        expires_at: expiresAt || null,
        is_active: true,
      };

      const { data, error } = await supabase
        .from("app_notifications")
        .insert([notification])
        .select()
        .single();

      if (error) throw error;

      // Add to local list
      setNotifications([data, ...notifications]);

      // Clear form
      setTitle("");
      setBody("");
      setPriority("normal");
      setCategory("general");
      setIcon("🔥");
      setExpiresAt("");

      alert("Notification sent to all users!");
    } catch (err) {
      console.error("Error creating notification:", err);
      alert("Failed to send notification: " + err.message);
    } finally {
      setSending(false);
    }
  }

  async function toggleActive(id, currentActive) {
    try {
      const { error } = await supabase
        .from("app_notifications")
        .update({ is_active: !currentActive })
        .eq("id", id);

      if (error) throw error;

      setNotifications(
        notifications.map((n) =>
          n.id === id ? { ...n, is_active: !currentActive } : n
        )
      );
    } catch (err) {
      console.error("Error toggling notification:", err);
      alert("Failed to update notification");
    }
  }

  async function deleteNotification(id) {
    if (!confirm("Delete this notification? This cannot be undone.")) return;

    try {
      const { error } = await supabase
        .from("app_notifications")
        .delete()
        .eq("id", id);

      if (error) throw error;

      setNotifications(notifications.filter((n) => n.id !== id));
    } catch (err) {
      console.error("Error deleting notification:", err);
      alert("Failed to delete notification");
    }
  }

  const iconOptions = ["🔥", "✨", "📢", "🎉", "⚠️", "📝", "💡", "🎯"];

  // Helper to get priority badge style
  function getPriorityStyle(p) {
    if (p === "banner") {
      return {
        background: "linear-gradient(135deg, #FF6A00 0%, #E02121 100%)",
        color: "#fff",
        fontWeight: 700,
      };
    }
    return {
      background: "#f3f4f6",
      color: "#6b7280",
    };
  }

  return (
    <div
      style={{
        height: "100vh",
        background: "#f9fafb",
        overflow: "auto",
        paddingBottom: "2rem",
      }}
    >
      {/* Header */}
      <div
        style={{
          background: "#ffffff",
          borderBottom: "1px solid #e5e7eb",
          padding: "1rem",
          position: "sticky",
          top: 0,
          zIndex: 100,
        }}
      >
        <div
          style={{
            maxWidth: "800px",
            margin: "0 auto",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <h1
            style={{
              margin: 0,
              fontSize: "1.3rem",
              fontWeight: 700,
              color: "#111827",
            }}
          >
            📢 App Notifications
          </h1>
          <button
            onClick={onClose}
            style={{
              padding: "0.5rem 1rem",
              borderRadius: "999px",
              border: "1px solid #d1d5db",
              background: "#ffffff",
              fontSize: "0.9rem",
              fontWeight: 600,
              color: "#6b7280",
              cursor: "pointer",
            }}
          >
            Close
          </button>
        </div>
      </div>

      <div
        style={{ maxWidth: "800px", margin: "2rem auto", padding: "0 1rem" }}
      >
        {/* Create Notification Form */}
        <div
          style={{
            background: "#ffffff",
            borderRadius: "1rem",
            padding: "1.5rem",
            border: "1px solid #e5e7eb",
            marginBottom: "2rem",
          }}
        >
          <h2
            style={{
              marginTop: 0,
              fontSize: "1.1rem",
              fontWeight: 700,
              color: "#111827",
            }}
          >
            Send New Notification
          </h2>
          <p
            style={{
              marginTop: "0.5rem",
              marginBottom: "1.5rem",
              fontSize: "0.85rem",
              color: "#6b7280",
            }}
          >
            This will be sent to ALL Ignite users. Use for announcements,
            updates, or important messages.
          </p>

          <form onSubmit={handleSubmit}>
            {/* Title */}
            <div style={{ marginBottom: "1rem" }}>
              <label
                style={{
                  display: "block",
                  marginBottom: "0.5rem",
                  fontSize: "0.9rem",
                  fontWeight: 600,
                  color: "#374151",
                }}
              >
                Title
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g., New Study Available!"
                maxLength={50}
                disabled={sending}
                style={{
                  width: "100%",
                  padding: "0.7rem",
                  borderRadius: "0.5rem",
                  border: "1px solid #d1d5db",
                  fontSize: "0.9rem",
                }}
              />
              <p
                style={{
                  fontSize: "0.75rem",
                  color: "#9ca3af",
                  margin: "0.25rem 0 0",
                }}
              >
                {title.length}/50 characters
              </p>
            </div>

            {/* Body */}
            <div style={{ marginBottom: "1rem" }}>
              <label
                style={{
                  display: "block",
                  marginBottom: "0.5rem",
                  fontSize: "0.9rem",
                  fontWeight: 600,
                  color: "#374151",
                }}
              >
                Message
              </label>
              <textarea
                value={body}
                onChange={(e) => setBody(e.target.value)}
                placeholder="Write your message here..."
                maxLength={300}
                disabled={sending}
                rows={4}
                style={{
                  width: "100%",
                  padding: "0.7rem",
                  borderRadius: "0.5rem",
                  border: "1px solid #d1d5db",
                  fontSize: "0.9rem",
                  fontFamily: "inherit",
                  resize: "vertical",
                }}
              />
              <p
                style={{
                  fontSize: "0.75rem",
                  color: "#9ca3af",
                  margin: "0.25rem 0 0",
                }}
              >
                {body.length}/300 characters
              </p>
            </div>

            {/* Icon, Priority, Category Row */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "100px 1fr 1fr",
                gap: "1rem",
                marginBottom: "1rem",
              }}
            >
              <div>
                <label
                  style={{
                    display: "block",
                    marginBottom: "0.5rem",
                    fontSize: "0.9rem",
                    fontWeight: 600,
                    color: "#374151",
                  }}
                >
                  Icon
                </label>
                <select
                  value={icon}
                  onChange={(e) => setIcon(e.target.value)}
                  disabled={sending}
                  style={{
                    width: "100%",
                    padding: "0.7rem",
                    borderRadius: "0.5rem",
                    border: "1px solid #d1d5db",
                    fontSize: "1.2rem",
                  }}
                >
                  {iconOptions.map((ico) => (
                    <option key={ico} value={ico}>
                      {ico}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label
                  style={{
                    display: "block",
                    marginBottom: "0.5rem",
                    fontSize: "0.9rem",
                    fontWeight: 600,
                    color: "#374151",
                  }}
                >
                  Priority
                </label>
                <select
                  value={priority}
                  onChange={(e) => setPriority(e.target.value)}
                  disabled={sending}
                  style={{
                    width: "100%",
                    padding: "0.7rem",
                    borderRadius: "0.5rem",
                    border: "1px solid #d1d5db",
                    fontSize: "0.9rem",
                  }}
                >
                  <option value="low">Low</option>
                  <option value="normal">Normal</option>
                  <option value="high">High</option>
                  <option value="urgent">Urgent</option>
                  <option value="banner">🔥 Banner (Homepage)</option>
                </select>
              </div>

              <div>
                <label
                  style={{
                    display: "block",
                    marginBottom: "0.5rem",
                    fontSize: "0.9rem",
                    fontWeight: 600,
                    color: "#374151",
                  }}
                >
                  Category
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  disabled={sending}
                  style={{
                    width: "100%",
                    padding: "0.7rem",
                    borderRadius: "0.5rem",
                    border: "1px solid #d1d5db",
                    fontSize: "0.9rem",
                  }}
                >
                  <option value="general">General</option>
                  <option value="update">Update</option>
                  <option value="feature">New Feature</option>
                  <option value="maintenance">Maintenance</option>
                </select>
              </div>
            </div>

            {/* Banner hint */}
            {priority === "banner" && (
              <div
                style={{
                  background:
                    "linear-gradient(135deg, #FFF7ED 0%, #FFEDD5 100%)",
                  border: "1px solid #FB923C",
                  borderRadius: "0.5rem",
                  padding: "0.75rem 1rem",
                  marginBottom: "1rem",
                  fontSize: "0.85rem",
                  color: "#9A3412",
                }}
              >
                <strong>🔥 Banner Mode:</strong> This will display as a sticky
                banner at the top of the homepage until it expires or you
                disable it.
              </div>
            )}

            {/* Expires At */}
            <div style={{ marginBottom: "1.5rem" }}>
              <label
                style={{
                  display: "block",
                  marginBottom: "0.5rem",
                  fontSize: "0.9rem",
                  fontWeight: 600,
                  color: "#374151",
                }}
              >
                Expires At{" "}
                {priority === "banner" && (
                  <span style={{ color: "#DC2626" }}>*</span>
                )}
              </label>
              <input
                type="datetime-local"
                value={expiresAt}
                onChange={(e) => setExpiresAt(e.target.value)}
                disabled={sending}
                style={{
                  width: "100%",
                  padding: "0.7rem",
                  borderRadius: "0.5rem",
                  border: "1px solid #d1d5db",
                  fontSize: "0.9rem",
                }}
              />
              <p
                style={{
                  fontSize: "0.75rem",
                  color: priority === "banner" ? "#DC2626" : "#9ca3af",
                  margin: "0.25rem 0 0",
                }}
              >
                {priority === "banner"
                  ? "Recommended for banners to auto-expire"
                  : "Leave blank for permanent notification"}
              </p>
            </div>

            {/* Send Button */}
            <button
              type="submit"
              disabled={sending || !title.trim() || !body.trim()}
              style={{
                padding: "0.7rem 1.5rem",
                borderRadius: "999px",
                border: "none",
                fontSize: "0.9rem",
                fontWeight: 600,
                background:
                  sending || !title.trim() || !body.trim()
                    ? "#d1d5db"
                    : "linear-gradient(135deg, #FFB400 0%, #FF6A00 40%, #E02121 100%)",
                color: "#ffffff",
                cursor:
                  sending || !title.trim() || !body.trim()
                    ? "not-allowed"
                    : "pointer",
                boxShadow:
                  sending || !title.trim() || !body.trim()
                    ? "none"
                    : "0 10px 22px rgba(0,0,0,0.16)",
              }}
            >
              {sending
                ? "Sending..."
                : priority === "banner"
                ? "🔥 Publish Banner"
                : "📢 Send to All Users"}
            </button>
          </form>
        </div>

        {/* Notification History */}
        <div
          style={{
            background: "#ffffff",
            borderRadius: "1rem",
            padding: "1.5rem",
            border: "1px solid #e5e7eb",
          }}
        >
          <h2
            style={{
              marginTop: 0,
              fontSize: "1.1rem",
              fontWeight: 700,
              color: "#111827",
            }}
          >
            Notification History
          </h2>

          {loading ? (
            <p style={{ color: "#6b7280" }}>Loading...</p>
          ) : notifications.length === 0 ? (
            <p style={{ color: "#6b7280" }}>No notifications yet.</p>
          ) : (
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "0.75rem",
              }}
            >
              {notifications.map((notif) => (
                <div
                  key={notif.id}
                  style={{
                    padding: "1rem",
                    borderRadius: "0.75rem",
                    border:
                      notif.priority === "banner"
                        ? "2px solid #FB923C"
                        : "1px solid #e5e7eb",
                    background: notif.is_active
                      ? notif.priority === "banner"
                        ? "linear-gradient(135deg, #FFFBEB 0%, #FEF3C7 100%)"
                        : "#ffffff"
                      : "#f9fafb",
                    opacity: notif.is_active ? 1 : 0.6,
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "start",
                      marginBottom: "0.5rem",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        gap: "0.5rem",
                        alignItems: "center",
                      }}
                    >
                      <span style={{ fontSize: "1.5rem" }}>{notif.icon}</span>
                      <div>
                        <h3
                          style={{
                            margin: 0,
                            fontSize: "0.95rem",
                            fontWeight: 600,
                            color: "#111827",
                          }}
                        >
                          {notif.title}
                        </h3>
                        <p
                          style={{
                            margin: "0.25rem 0 0",
                            fontSize: "0.8rem",
                            color: "#6b7280",
                          }}
                        >
                          {new Date(notif.created_at).toLocaleString()}
                          {notif.expires_at && (
                            <span
                              style={{ marginLeft: "0.5rem", color: "#9ca3af" }}
                            >
                              · Expires{" "}
                              {new Date(notif.expires_at).toLocaleString()}
                            </span>
                          )}
                        </p>
                      </div>
                    </div>
                    <div style={{ display: "flex", gap: "0.5rem" }}>
                      <button
                        onClick={() => toggleActive(notif.id, notif.is_active)}
                        style={{
                          padding: "0.4rem 0.8rem",
                          borderRadius: "0.5rem",
                          border: "1px solid #d1d5db",
                          background: "#ffffff",
                          fontSize: "0.8rem",
                          fontWeight: 600,
                          cursor: "pointer",
                          color: notif.is_active ? "#dc2626" : "#16a34a",
                        }}
                      >
                        {notif.is_active ? "Disable" : "Enable"}
                      </button>
                      <button
                        onClick={() => deleteNotification(notif.id)}
                        style={{
                          padding: "0.4rem 0.8rem",
                          borderRadius: "0.5rem",
                          border: "1px solid #dc2626",
                          background: "#fee2e2",
                          fontSize: "0.8rem",
                          fontWeight: 600,
                          cursor: "pointer",
                          color: "#dc2626",
                        }}
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                  <p
                    style={{ margin: 0, fontSize: "0.85rem", color: "#374151" }}
                  >
                    {notif.body}
                  </p>
                  <div
                    style={{
                      display: "flex",
                      gap: "0.5rem",
                      marginTop: "0.5rem",
                    }}
                  >
                    <span
                      style={{
                        padding: "0.25rem 0.5rem",
                        borderRadius: "0.25rem",
                        fontSize: "0.75rem",
                        fontWeight: 600,
                        ...getPriorityStyle(notif.priority),
                      }}
                    >
                      {notif.priority === "banner"
                        ? "🔥 BANNER"
                        : notif.priority}
                    </span>
                    <span
                      style={{
                        padding: "0.25rem 0.5rem",
                        borderRadius: "0.25rem",
                        background: "#f3f4f6",
                        fontSize: "0.75rem",
                        fontWeight: 600,
                        color: "#6b7280",
                      }}
                    >
                      {notif.category}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

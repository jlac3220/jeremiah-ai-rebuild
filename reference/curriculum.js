/**
 * useAppNotifications – Fetches and polls app-wide notifications from Supabase.
 * Polls every 5 minutes to surface new announcements without a page reload.
 */
import { useState, useEffect } from "react";
import { supabase } from "../supabaseClient";

const POLL_INTERVAL_MS = 5 * 60 * 1000;

/**
 * @returns {{ appNotifications: object[], fetchAppNotifications: Function }}
 */
export function useAppNotifications() {
  const [appNotifications, setAppNotifications] = useState([]);

  async function fetchAppNotifications() {
    try {
      const { data, error } = await supabase
        .from("app_notifications")
        .select("*")
        .eq("is_active", true)
        .or(`expires_at.is.null,expires_at.gt.${new Date().toISOString()}`)
        .order("created_at", { ascending: false })
        .limit(10);

      if (error) {
        console.error("Error fetching app notifications:", error);
        return;
      }
      setAppNotifications(data || []);
    } catch (err) {
      console.error("Error fetching app notifications:", err);
    }
  }

  useEffect(() => {
    fetchAppNotifications();
    const interval = setInterval(fetchAppNotifications, POLL_INTERVAL_MS);
    return () => clearInterval(interval);
  }, []);

  return { appNotifications, fetchAppNotifications };
}

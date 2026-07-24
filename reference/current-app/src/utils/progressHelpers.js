/**
 * Lesson Progress Helpers
 * Handles localStorage fallback and Supabase cloud progress sync,
 * as well as streak tracking logic.
 */

import { supabase } from "../supabaseClient";

export const STORAGE_KEY = "ignite_lesson_progress";

// ============ LOCAL STORAGE HELPERS (fallback for guests) ============

export function loadProgressFromStorage() {
  if (typeof window === "undefined") return {};
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return {};
    return JSON.parse(raw) || {};
  } catch {
    return {};
  }
}

export function saveProgressToStorage(progressObj) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(progressObj));
  } catch {}
}

// ============ SUPABASE PROGRESS HELPERS ============

function convertSupabaseToLocal(rows) {
  const result = {};
  for (const row of rows) {
    if (!result[row.study_id]) result[row.study_id] = {};
    result[row.study_id][row.lesson_id] = {
      started: row.started,
      readingDone: row.reading_done,
      scripturesDone: row.scriptures_done,
      quizPassed: row.quiz_passed,
      isComplete: row.is_complete,
    };
  }
  return result;
}

/**
 * Fetches lesson progress for a user/profile from Supabase.
 * @param {string} userId
 * @param {string|null} profileId
 * @returns {Promise<object|null>}
 */
export async function fetchProgressFromSupabase(userId, profileId) {
  let query = supabase
    .from("user_lesson_progress")
    .select("*")
    .eq("user_id", userId);

  if (profileId) {
    query = query.eq("profile_id", profileId);
  }

  const { data, error } = await query;
  if (error) {
    console.error("Error fetching progress:", error);
    return null;
  }
  return convertSupabaseToLocal(data || []);
}

/**
 * Upserts a single lesson's progress record to Supabase.
 * @param {string} userId
 * @param {string} profileId
 * @param {string} studyId
 * @param {string} lessonId
 * @param {object} progress
 * @returns {Promise<boolean>}
 */
export async function saveProgressToSupabase(userId, profileId, studyId, lessonId, progress) {
  if (!userId || !profileId) {
    console.error("Missing userId or profileId - cannot save to Supabase");
    return false;
  }

  const progressData = {
    user_id: userId,
    profile_id: profileId,
    study_id: studyId,
    lesson_id: lessonId,
    started: progress.started || false,
    reading_done: progress.readingDone || false,
    scriptures_done: progress.scripturesDone || false,
    quiz_passed: progress.quizPassed || false,
    is_complete: progress.isComplete || false,
    updated_at: new Date().toISOString(),
  };

  const { error } = await supabase
    .from("user_lesson_progress")
    .upsert(progressData, {
      onConflict: "user_id,profile_id,study_id,lesson_id",
      ignoreDuplicates: false,
    });

  if (error) {
    console.error("Error upserting progress:", error);
    return false;
  }
  return true;
}

/**
 * Deletes all progress records for a user/profile from Supabase.
 * @param {string} userId
 * @param {string|null} profileId
 * @returns {Promise<boolean>}
 */
export async function resetProgressInSupabase(userId, profileId) {
  let query = supabase
    .from("user_lesson_progress")
    .delete()
    .eq("user_id", userId);

  if (profileId) {
    query = query.eq("profile_id", profileId);
  }

  const { error } = await query;
  if (error) {
    console.error("Error resetting progress:", error);
    return false;
  }
  return true;
}

// ============ STREAK TRACKING ============

/**
 * Updates the streak for a profile after completing a lesson or rapid-fire quiz.
 * Returns the new streak value, or null on error.
 * @param {string} profileId
 * @returns {Promise<number|null>}
 */
export async function updateStreakOnCompletion(profileId) {
  if (!profileId) return null;

  const { data: profile, error: fetchError } = await supabase
    .from("profiles")
    .select("current_streak, longest_streak, last_activity_date")
    .eq("id", profileId)
    .single();

  if (fetchError) {
    console.error("Error fetching profile for streak:", fetchError);
    return null;
  }

  const today = new Date().toISOString().split("T")[0];
  const lastActivity = profile.last_activity_date;

  if (lastActivity === today) {
    return profile.current_streak;
  }

  let newStreak = 1;

  if (lastActivity) {
    const lastDate = new Date(lastActivity);
    const todayDate = new Date(today);
    const diffTime = todayDate - lastDate;
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 1) {
      newStreak = (profile.current_streak || 0) + 1;
    } else if (diffDays > 1) {
      newStreak = 1;
    }
  }

  const newLongest = Math.max(newStreak, profile.longest_streak || 0);

  const { error: updateError } = await supabase
    .from("profiles")
    .update({
      current_streak: newStreak,
      longest_streak: newLongest,
      last_activity_date: today,
    })
    .eq("id", profileId);

  if (updateError) {
    console.error("Error updating streak:", updateError);
    return null;
  }

  return newStreak;
}

// src/App.jsx — With Supabase Auth + Cloud Progress Sync + Profile Selection + Rapid Fire
import React, { useState, useEffect, useCallback } from "react";

// Pages
import HomePage from "./HomePage";
import StudiesPage from "./StudiesPage";
import LessonsPage from "./LessonsPage";
import LessonDetailPage from "./LessonDetailPage";
import LoginPage from "./LoginPage";
import AccountPage from "./AccountPage";
import ProfileSelectPage from "./ProfileSelectPage";
import StartupPage from "./StartupPage";
import BiblePage from "./BiblePage";
import ProfilePage from "./ProfilePage";
import AskPage from "./AskPage";
import GuestProfilePage from "./GuestProfilePage";
import RapidFireQuizPage from "./RapidFireQuizPage";

// Components
import BottomNav from "./BottomNav";
import GuestPromptModal from "./GuestPromptModal";
import PINModal from "./PINModal";
import NotificationManager from "./NotificationManager";

// Custom Hooks
import { useAuth } from "./hooks/useAuth";
import { useProfiles } from "./hooks/useProfiles";
import { useAppNotifications } from "./hooks/useAppNotifications";

// Utilities
import { supabase } from "./supabaseClient";
import { Z_INDEX } from "./zIndex";
import { hashPIN, verifyPIN } from "./utils/pinUtils";
import {
  loadProgressFromStorage,
  saveProgressToStorage,
  fetchProgressFromSupabase,
  saveProgressToSupabase,
  resetProgressInSupabase,
  updateStreakOnCompletion,
} from "./utils/progressHelpers";

export default function App() {
  // ===== AUTH STATE (via hook) =====
  const { user, authLoading, setUser } = useAuth();

  // ===== VIEW STATE =====
  const [currentView, setCurrentView] = useState("startup");
  const [startupComplete, setStartupComplete] = useState(false);

  // ===== STUDY/LESSON STATE =====
  const [selectedStudyId, setSelectedStudyId] = useState(null);
  const [selectedLesson, setSelectedLesson] = useState(null);

  // ===== LESSON PROGRESS =====
  const [lessonProgress, setLessonProgress] = useState({});

  // ===== DYNAMIC LESSON COUNTS =====
  const [lessonCounts, setLessonCounts] = useState({ OG: 0, NB: 0, PS: 0 });

  // ===== ACCOUNT / PROFILE STATE (via hook) =====
  const { account, profiles, setAccount, setProfiles } = useProfiles({ user, authLoading });
  const [activeProfile, setActiveProfile] = useState(null);
  const [currentStreak, setCurrentStreak] = useState(0);

  // ===== HEAT SCORE =====
  const [heatScore, setHeatScore] = useState(0);

  // ===== SHARES COMPLETED =====
  const [sharesCompleted, setSharesCompleted] = useState(0);

  // ===== RAPID FIRE STATS =====
  const [rapidFireStats, setRapidFireStats] = useState({
    totalCompleted: 0,
    perfectCount: 0,
  });

  // ===== PROFILE-LEVEL NOTIFICATIONS =====
  const [profileNotifications, setProfileNotifications] = useState(() => {
    try {
      const saved = localStorage.getItem("ignite_notifications");
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });
  const [showGuestPrompt, setShowGuestPrompt] = useState(false);

  // ===== APP-WIDE NOTIFICATIONS (via hook) =====
  const { appNotifications, fetchAppNotifications } = useAppNotifications();

  // ===== PIN PROTECTION STATE =====
  const [showPINModal, setShowPINModal] = useState(false);
  const [pinMode, setPinMode] = useState("enter");
  const [pinCallback, setPinCallback] = useState(null);
  const [pinProfileName, setPinProfileName] = useState("");

  // ===== NOTIFICATION MANAGER STATE =====
  const [showNotificationManager, setShowNotificationManager] = useState(false);

  useEffect(() => {
    try {
      localStorage.setItem("ignite_notifications", JSON.stringify(profileNotifications));
    } catch {}
  }, [profileNotifications]);

  // ============ PRELOAD ALL KEY IMAGES ============
  useEffect(() => {
    const imagesToPreload = [
      "/ignite-logo-flame.png",
      "/ignite-logo.png",
      "/nav-icons/home.png",
      "/nav-icons/rapid.png",
      "/nav-icons/studies.png",
      "/nav-icons/bible.png",
    ];
    imagesToPreload.forEach((src) => {
      const img = new Image();
      img.src = src;
    });
  }, []);

  // ============ LOAD SHARE STATS ============
  async function loadShareStats(profileId) {
    if (!profileId) return;
    try {
      const { count } = await supabase
        .from("share_attempts")
        .select("*", { count: "exact", head: true })
        .eq("profile_id", profileId);
      setSharesCompleted(count || 0);
    } catch (err) {
      console.error("Failed to load share stats:", err);
    }
  }

  // ============ LOAD RAPID FIRE STATS ============
  async function loadRapidFireStats(profileId) {
    if (!profileId) return;
    try {
      const { data, error } = await supabase
        .from("rapid_fire_progress")
        .select("is_perfect")
        .eq("profile_id", profileId);

      if (error) {
        console.error("Error loading rapid fire stats:", error);
        return;
      }

      const totalCompleted = data?.length || 0;
      const perfectCount = data?.filter((r) => r.is_perfect).length || 0;
      setRapidFireStats({ totalCompleted, perfectCount });
    } catch (err) {
      console.error("Failed to load rapid fire stats:", err);
    }
  }

  // ============ LOAD PROGRESS WHEN PROFILE CHANGES ============
  useEffect(() => {
    async function loadProgress() {
      if (user && !user.isGuest && activeProfile?.id) {
        const cloudProgress = await fetchProgressFromSupabase(user.id, activeProfile.id);
        if (cloudProgress) {
          setLessonProgress(cloudProgress);
          saveProgressToStorage(cloudProgress);
        } else {
          setLessonProgress({});
        }

        setCurrentStreak(activeProfile.current_streak || 0);
        setHeatScore(activeProfile.heat_score || 0);

        await loadRapidFireStats(activeProfile.id);
        await loadShareStats(activeProfile.id);
      } else if (user?.isGuest || activeProfile?.isGuest) {
        setLessonProgress(loadProgressFromStorage());
        try {
          const guestStreak = parseInt(localStorage.getItem("ignite_guest_streak") || "0", 10);
          setCurrentStreak(guestStreak);
        } catch {
          setCurrentStreak(0);
        }
        try {
          const guestRF = JSON.parse(localStorage.getItem("ignite_guest_rapid_fire") || "{}");
          setRapidFireStats({
            totalCompleted: guestRF.totalCompleted || 0,
            perfectCount: guestRF.perfectCount || 0,
          });
        } catch {
          setRapidFireStats({ totalCompleted: 0, perfectCount: 0 });
        }
      } else {
        setLessonProgress({});
        setCurrentStreak(0);
        setRapidFireStats({ totalCompleted: 0, perfectCount: 0 });
      }
    }

    if (!authLoading) {
      loadProgress();
    }
  }, [user, activeProfile, authLoading]);

  // ============ HANDLE RAPID FIRE COMPLETION ============
  const handleRapidFireComplete = useCallback(
    async ({ correct, total, isPerfect }) => {
      setRapidFireStats((prev) => ({
        totalCompleted: prev.totalCompleted + 1,
        perfectCount: prev.perfectCount + (isPerfect ? 1 : 0),
      }));

      if (user && !user.isGuest && activeProfile?.id) {
        const newStreak = await updateStreakOnCompletion(activeProfile.id);
        if (newStreak !== null) setCurrentStreak(newStreak);
        if (isPerfect) await awardPoints(5);
      } else if (user?.isGuest || activeProfile?.isGuest) {
        const today = new Date().toISOString().split("T")[0];
        const lastActivity = localStorage.getItem("ignite_guest_last_activity");
        let newStreak = 1;

        if (lastActivity !== today) {
          if (lastActivity) {
            const lastDate = new Date(lastActivity);
            const todayDate = new Date(today);
            const diffDays = Math.floor((todayDate - lastDate) / (1000 * 60 * 60 * 24));
            if (diffDays === 1) {
              newStreak = parseInt(localStorage.getItem("ignite_guest_streak") || "0", 10) + 1;
            }
          }
          localStorage.setItem("ignite_guest_streak", String(newStreak));
          localStorage.setItem("ignite_guest_last_activity", today);
          setCurrentStreak(newStreak);
        }

        const guestRF = {
          totalCompleted: rapidFireStats.totalCompleted + 1,
          perfectCount: rapidFireStats.perfectCount + (isPerfect ? 1 : 0),
        };
        localStorage.setItem("ignite_guest_rapid_fire", JSON.stringify(guestRF));
      }
    },
    [user, activeProfile, rapidFireStats]
  );

  // ============ LOAD PROFILES WHEN USER LOGS IN (handled by useProfiles hook) ============

  // ============ FETCH LESSON COUNTS ============
  useEffect(() => {
    async function fetchLessonCounts() {
      try {
        const { count: ogCount } = await supabase
          .from("Lessons_OG")
          .select("*", { count: "exact", head: true });
        const { count: nbCount } = await supabase
          .from("Lessons")
          .select("*", { count: "exact", head: true });
        const { count: psCount } = await supabase
          .from("Lessons_PS")
          .select("*", { count: "exact", head: true });

        setLessonCounts({ OG: ogCount || 0, NB: nbCount || 0, PS: psCount || 0 });
      } catch (err) {
        console.error("Error fetching lesson counts:", err);
      }
    }
    fetchLessonCounts();
  }, []);

  // ===== APP-WIDE NOTIFICATIONS (handled by useAppNotifications hook) =====

  useEffect(() => {
    if (!startupComplete) return;

    function checkHash() {
      if (
        window.location.hash === "#notifications-admin" &&
        user?.id === "0ac7500b-34b8-4a65-ab4a-b430fb7dc170"
      ) {
        setShowNotificationManager(true);
      } else if (window.location.hash === "#notifications-admin") {
        window.location.hash = "";
      }
    }

    checkHash();
    window.addEventListener("hashchange", checkHash);
    return () => window.removeEventListener("hashchange", checkHash);
  }, [startupComplete, user]);

  // Register service worker for PWA
  useEffect(() => {
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker.register("/sw.js").catch(() => {});
    }
  }, []);

  // ===== NAVIGATION =====
  function navigateTo(nextView) {
    setCurrentView(nextView);
  }

  function handleBack() {
    switch (currentView) {
      case "lessonDetail":
        setCurrentView("lessons");
        break;
      case "lessons":
        setCurrentView("studies");
        break;
      case "studies":
      case "ask":
      case "rapidFire":
      case "bible":
        setCurrentView("home");
        break;
      case "profile":
        setCurrentView("home");
        break;
      case "account":
        setCurrentView(activeProfile ? "home" : "profileSelect");
        break;
      default:
        setCurrentView("home");
        break;
    }
  }

  const BACK_LABELS = {
    lessonDetail: "Lessons",
    lessons: "Studies",
    studies: "Home",
    ask: "Home",
    rapidFire: "Home",
    bible: "Home",
    profile: "Home",
    account: "Home",
  };

  const backLabel = BACK_LABELS[currentView] || null;

  // ===== AUTH HANDLERS =====
  const handleStartupDone = () => {
    setStartupComplete(true);
    if (user) {
      setCurrentView("profileSelect");
    } else {
      setCurrentView("login");
    }
  };

  const handleLogin = async (loggedInUser) => {
    if (loggedInUser) {
      const cloudProgress = await fetchProgressFromSupabase(loggedInUser.id);
      if (cloudProgress) {
        setLessonProgress(cloudProgress);
        saveProgressToStorage(cloudProgress);
      }
    }
    navigateTo("profileSelect");
  };

  const handleSkipLogin = () => {
    const guestUser = { id: "guest", email: null, isGuest: true };
    const guestProfile = { id: "guest", name: "Guest", role: "Adult", isGuest: true };
    setUser(guestUser);
    setActiveProfile(guestProfile);
    navigateTo("home");
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setActiveProfile(null);
    setProfiles([]);
    setAccount(null);
    setLessonProgress({});
    setRapidFireStats({ totalCompleted: 0, perfectCount: 0 });
    setCurrentView("login");
  };

  const handleSelectProfile = async (profile) => {
    const isPrimary = profiles.length > 0 && profile.id === profiles[0].id;

    if (isPrimary && !profile.isGuest) {
      if (!profile.pin_hash) {
        setPinMode("setup");
        setPinProfileName(profile.name);
        setPinCallback(() => async (pin) => {
          const pinHash = await hashPIN(pin);
          const { error } = await supabase
            .from("profiles")
            .update({ pin_hash: pinHash })
            .eq("id", profile.id);

          if (!error) {
            const updatedProfile = { ...profile, pin_hash: pinHash };
            setProfiles((prev) => prev.map((p) => (p.id === profile.id ? updatedProfile : p)));
            setActiveProfile(updatedProfile);
            setShowPINModal(false);
            setCurrentView("home");
          } else {
            alert("Failed to save PIN. Please try again.");
            setShowPINModal(false);
          }
        });
        setShowPINModal(true);
      } else {
        setPinMode("enter");
        setPinProfileName(profile.name);
        setPinCallback(() => async (pin) => {
          const isValid = await verifyPIN(pin, profile.pin_hash);
          if (isValid) {
            setActiveProfile(profile);
            setShowPINModal(false);
            setCurrentView("home");
          } else {
            alert("Incorrect PIN");
          }
        });
        setShowPINModal(true);
      }
    } else {
      setActiveProfile(profile);
      setCurrentView("home");
    }
  };

  const handleSwitchProfile = () => {
    setActiveProfile(null);
    setCurrentView("profileSelect");
  };

  const handleGuestProfileTap = () => {
    setShowGuestPrompt(true);
  };

  const handleGuestCreateAccount = () => {
    setShowGuestPrompt(false);
    setUser(null);
    setActiveProfile(null);
    setCurrentView("login");
  };

  const handleGuestLogin = () => {
    setShowGuestPrompt(false);
    setUser(null);
    setActiveProfile(null);
    setCurrentView("login");
  };

  const handleGuestContinue = () => {
    setShowGuestPrompt(false);
    navigateTo("profile");
  };

  // ===== STUDY/LESSON NAVIGATION =====
  const handleSelectStudy = (studyId) => {
    setSelectedStudyId(studyId);
    navigateTo("lessons");
  };

  const handleSelectLesson = (lesson) => {
    setSelectedLesson(lesson);
    navigateTo("lessonDetail");
  };

  // ===== LESSON PROGRESS HANDLER =====
  const handleUpdateLessonProgress = useCallback(
    async (studyId, lessonId, patch) => {
      if (!studyId || !lessonId) return;

      const wasComplete = lessonProgress[studyId]?.[lessonId]?.isComplete;
      const isNowComplete = patch.isComplete;

      setLessonProgress((prev) => {
        const studyMap = prev[studyId] || {};
        const prevLesson = studyMap[lessonId] || {};
        const nextLesson = { ...prevLesson, ...patch };
        const next = { ...prev, [studyId]: { ...studyMap, [lessonId]: nextLesson } };
        saveProgressToStorage(next);
        return next;
      });

      if (user && !user.isGuest && activeProfile?.id) {
        const currentProgress = lessonProgress[studyId]?.[lessonId] || {};
        const merged = { ...currentProgress, ...patch };
        await saveProgressToSupabase(user.id, activeProfile.id, studyId, lessonId, merged);

        if (!wasComplete && isNowComplete) {
          const newStreak = await updateStreakOnCompletion(activeProfile.id);
          if (newStreak !== null) setCurrentStreak(newStreak);
          await awardPoints(5);

          const updatedMap = {
            ...(lessonProgress[studyId] || {}),
            [lessonId]: { ...(lessonProgress[studyId]?.[lessonId] || {}), ...patch },
          };
          const studyTotal = lessonCounts[studyId] || 0;
          const studyDone = Object.values(updatedMap).filter((lp) => lp?.isComplete).length;
          if (studyTotal > 0 && studyDone >= studyTotal) {
            await awardPoints(5);
          }
        }
      } else if (user?.isGuest || activeProfile?.isGuest) {
        if (!wasComplete && isNowComplete) {
          const today = new Date().toISOString().split("T")[0];
          const lastActivity = localStorage.getItem("ignite_guest_last_activity");
          let newStreak = 1;

          if (lastActivity !== today) {
            if (lastActivity) {
              const lastDate = new Date(lastActivity);
              const todayDate = new Date(today);
              const diffDays = Math.floor((todayDate - lastDate) / (1000 * 60 * 60 * 24));
              if (diffDays === 1) {
                newStreak = parseInt(localStorage.getItem("ignite_guest_streak") || "0", 10) + 1;
              }
            }
            localStorage.setItem("ignite_guest_streak", String(newStreak));
            localStorage.setItem("ignite_guest_last_activity", today);
            setCurrentStreak(newStreak);
          }
        }
      }
    },
    [user, activeProfile, lessonProgress]
  );

  // ===== AWARD HEAT SCORE POINTS =====
  const awardPoints = useCallback(async (points) => {
    if (!points || points <= 0) return;
    if (user && !user.isGuest && activeProfile?.id) {
      await supabase.rpc("increment_heat_score", {
        profile_id_input: activeProfile.id,
        points,
      });
      setHeatScore((prev) => prev + points);
    }
  }, [user, activeProfile]);

  // ===== RESET PROGRESS =====
  const handleResetProgress = async () => {
    if (user && !user.isGuest && activeProfile?.id) {
      await resetProgressInSupabase(user.id, activeProfile.id);

      await supabase
        .from("profiles")
        .update({ current_streak: 0, last_activity_date: null })
        .eq("id", activeProfile.id);

      await supabase
        .from("rapid_fire_progress")
        .delete()
        .eq("profile_id", activeProfile.id);

      await supabase.rpc("reset_heat_score", { profile_id_input: activeProfile.id });

      setCurrentStreak(0);
      setHeatScore(0);
      setSharesCompleted(0);
      setRapidFireStats({ totalCompleted: 0, perfectCount: 0 });
    } else if (user?.isGuest || activeProfile?.isGuest) {
      localStorage.removeItem("ignite_guest_streak");
      localStorage.removeItem("ignite_guest_last_activity");
      localStorage.removeItem("ignite_guest_rapid_fire");
      setCurrentStreak(0);
      setRapidFireStats({ totalCompleted: 0, perfectCount: 0 });
    }
    setLessonProgress({});
    saveProgressToStorage({});
  };

  // ===== PROFILE HANDLERS =====
  const handleSaveProfile = (updatedProfile) => {
    setProfiles((prev) => {
      const idx = prev.findIndex((p) => p.id === updatedProfile.id);
      if (idx === -1) return [...prev, updatedProfile];
      const copy = [...prev];
      copy[idx] = updatedProfile;
      return copy;
    });
    setActiveProfile(updatedProfile);
    navigateTo("home");
  };

  const handleDeleteProfile = (profileId) => {
    setProfiles((prev) => prev.filter((p) => p.id !== profileId));
    setProfileNotifications((prev) => {
      const copy = { ...prev };
      delete copy[profileId];
      return copy;
    });

    if (activeProfile?.id === profileId) {
      setActiveProfile(null);
      navigateTo("profileSelect");
    } else {
      navigateTo("home");
    }
  };

  const handleUpdateProfileNotifications = (profileId, updatedList) => {
    if (!profileId) return;
    setProfileNotifications((prev) => ({ ...prev, [profileId]: updatedList }));
  };

  const handleSendNotification = (profileId, notification) => {
    if (!profileId) return;
    setProfileNotifications((prev) => {
      const currentNotifications = prev[profileId] || [];
      return { ...prev, [profileId]: [notification, ...currentNotifications] };
    });
  };

  const handleAccountUpdate = (updatedAccount, updatedProfiles) => {
    if (updatedAccount) setAccount(updatedAccount);
    if (updatedProfiles) setProfiles(updatedProfiles);
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator
        .share({
          title: "Ignite",
          text: "Check out this Bible study app I'm using!",
          url: window.location.href,
        })
        .catch(() => {});
    } else {
      alert("Sharing is not supported on this device.");
    }
  };

  // ===== NOTIFICATIONS =====
  const currentProfileId = activeProfile?.id || null;
  const personalNotifications =
    currentProfileId && profileNotifications[currentProfileId]
      ? profileNotifications[currentProfileId]
      : [];

  const appNotifs = appNotifications.map((notif) => ({
    id: `app-${notif.id}`,
    title: `${notif.icon || "📢"} ${notif.title}`,
    body: notif.body,
    createdAt: notif.created_at,
    isRead: false,
    isAppNotification: true,
  }));

  const notificationsForActiveProfile = [...appNotifs, ...personalNotifications].sort(
    (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
  );

  // ===== APP BADGE =====
  useEffect(() => {
    if ("Notification" in window && Notification.permission === "default") {
      Notification.requestPermission();
    }
  }, []);

  useEffect(() => {
    if (!activeProfile) return;
    const unreadCount = notificationsForActiveProfile.filter((n) => !n.isRead).length;
    try {
      localStorage.setItem("ignite_unread_count", String(unreadCount));
    } catch {}
    if ("setAppBadge" in navigator) {
      if (unreadCount > 0) {
        navigator.setAppBadge(unreadCount).catch(() => {});
      } else {
        navigator.clearAppBadge().catch(() => {});
      }
    }
  }, [activeProfile, notificationsForActiveProfile]);

  // ===== PROGRESS CALCULATIONS =====
  const OG_TOTAL = lessonCounts.OG;
  const NB_TOTAL = lessonCounts.NB;
  const PS_TOTAL = lessonCounts.PS;

  const ogMap = lessonProgress.OG || {};
  const nbMap = lessonProgress.NB || {};
  const psMap = lessonProgress.PS || {};

  function lessonFraction(lp) {
    if (!lp) return 0;
    if (lp.isComplete) return 1;
    const steps = [lp.readingDone, lp.scripturesDone, lp.quizPassed];
    const done = steps.filter(Boolean).length;
    return (1 + done) / 4;
  }

  const ogPoints = Object.values(ogMap).reduce((sum, lp) => sum + lessonFraction(lp), 0);
  const nbPoints = Object.values(nbMap).reduce((sum, lp) => sum + lessonFraction(lp), 0);
  const psPoints = Object.values(psMap).reduce((sum, lp) => sum + lessonFraction(lp), 0);

  const ogCompleted = Object.values(ogMap).filter((lp) => lp?.isComplete).length;
  const nbCompleted = Object.values(nbMap).filter((lp) => lp?.isComplete).length;
  const psCompleted = Object.values(psMap).filter((lp) => lp?.isComplete).length;

  const totalTrackLessons = OG_TOTAL + NB_TOTAL;
  const completedTrackLessons = Math.min(ogCompleted, OG_TOTAL) + Math.min(nbCompleted, NB_TOTAL);

  const coreTrackPoints = Math.min(ogPoints, OG_TOTAL) + Math.min(nbPoints, NB_TOTAL);
  const coreTrackPercent =
    totalTrackLessons > 0 ? Math.round((coreTrackPoints / totalTrackLessons) * 100) : 0;

  const coreTrackCompleted =
    completedTrackLessons >= totalTrackLessons && totalTrackLessons > 0;

  const studyProgress = {
    OG: {
      completed: Math.min(ogCompleted, OG_TOTAL),
      total: OG_TOTAL,
      percent: OG_TOTAL ? Math.round((Math.min(ogPoints, OG_TOTAL) / OG_TOTAL) * 100) : 0,
    },
    NB: {
      completed: Math.min(nbCompleted, NB_TOTAL),
      total: NB_TOTAL,
      percent: NB_TOTAL ? Math.round((Math.min(nbPoints, NB_TOTAL) / NB_TOTAL) * 100) : 0,
    },
    PS: {
      completed: Math.min(psCompleted, PS_TOTAL),
      total: PS_TOTAL,
      percent: PS_TOTAL ? Math.round((Math.min(psPoints, PS_TOTAL) / PS_TOTAL) * 100) : 0,
    },
  };

  const studiesCompletedCount = [
    studyProgress.OG.total > 0 && studyProgress.OG.completed >= studyProgress.OG.total,
    studyProgress.NB.total > 0 && studyProgress.NB.completed >= studyProgress.NB.total,
    studyProgress.PS.total > 0 && studyProgress.PS.completed >= studyProgress.PS.total,
  ].filter(Boolean).length;

  const totalLessonsCompleted = ogCompleted + nbCompleted + psCompleted;

  const getFireLevelLabel = (pts) => {
    if (pts >= 5000) return "Inferno";
    if (pts >= 3700) return "Firestorm";
    if (pts >= 2700) return "Wildfire";
    if (pts >= 1900) return "Scorching";
    if (pts >= 1300) return "Torched";
    if (pts >= 850) return "Ablaze";
    if (pts >= 500) return "Burning";
    if (pts >= 250) return "Fiery";
    if (pts >= 100) return "Ember";
    return "Spark";
  };

  const accomplishments = {
    dailyStreak: currentStreak,
    devotionsCompleted: 0,
    studiesCompleted: studiesCompletedCount,
    lessonsCompleted: totalLessonsCompleted,
    rapidFireCompleted: rapidFireStats.totalCompleted,
    rapidFirePerfect: rapidFireStats.perfectCount,
    sharesCompleted: sharesCompleted,
    heatScore: heatScore,
    fireLevelLabel: getFireLevelLabel(heatScore),
  };

  const lessonProgressForSelectedLesson =
    selectedStudyId && selectedLesson
      ? lessonProgress[selectedStudyId]?.[selectedLesson.lesson_id]
      : undefined;

  // ===== LOADING STATE =====
  if (authLoading) {
    return (
      <div
        style={{
          position: "fixed",
          inset: 0,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#1f2937",
        }}
      >
        <div style={{ textAlign: "center" }}>
          <img
            src="/ignite-logo-flame.png"
            alt="Ignite Logo"
            style={{ width: 80, height: 80, animation: "pulse 1.5s ease-in-out infinite" }}
          />
          <div style={{ marginTop: 16, color: "#f97316", fontSize: 18, fontWeight: 600 }}>
            Loading...
          </div>
        </div>
        <style>{`
          @keyframes pulse {
            0%, 100% { opacity: 1; }
            50% { opacity: 0.5; }
          }
        `}</style>
      </div>
    );
  }

  // ===== RENDER PAGES =====
  const isPrimaryProfile = profiles.length > 0 && activeProfile?.id === profiles[0]?.id;

  let content = null;

  switch (currentView) {
    case "startup":
      content = (
        <div style={{ position: "fixed", inset: 0, zIndex: 10 }}>
          <StartupPage onDone={handleStartupDone} />
        </div>
      );
      break;

    case "login":
      content = <LoginPage onLogin={handleLogin} onSkip={handleSkipLogin} />;
      break;

    case "profileSelect":
      content = (
        <ProfileSelectPage
          user={user}
          profiles={profiles}
          onSelectProfile={handleSelectProfile}
          onBackToLogin={handleLogout}
        />
      );
      break;

    case "account":
      content = (
        <AccountPage
          user={user}
          onClose={() => navigateTo(activeProfile ? "home" : "profileSelect")}
          onShowProfile={() => navigateTo("profile")}
          onAccountUpdate={handleAccountUpdate}
          onSendNotification={handleSendNotification}
          profileImageUrl={activeProfile?.profile_image_url}
        />
      );
      break;

    case "profile":
      if (user?.isGuest || activeProfile?.isGuest) {
        content = (
          <GuestProfilePage
            onBack={handleBack}
            backLabel={backLabel}
            accomplishments={accomplishments}
            onCreateAccount={handleGuestCreateAccount}
          />
        );
      } else {
        content = (
          <div className="slide-in-profile">
            <ProfilePage
              user={user}
              profile={activeProfile}
              onSave={handleSaveProfile}
              onDelete={handleDeleteProfile}
              onBack={handleBack}
              backLabel={backLabel}
              accomplishments={accomplishments}
              notifications={notificationsForActiveProfile}
              onUpdateNotifications={(updatedList) =>
                handleUpdateProfileNotifications(currentProfileId, updatedList)
              }
              onShowAccount={isPrimaryProfile ? () => navigateTo("account") : null}
              onSwitchProfile={() => {
                setActiveProfile(null);
                navigateTo("profileSelect");
              }}
              onProfileUpdate={(updated) => {
                setActiveProfile(updated);
                setProfiles((prev) => prev.map((p) => (p.id === updated.id ? updated : p)));
              }}
              onShareSuccess={() => {
                setHeatScore((prev) => prev + 5);
                setSharesCompleted((prev) => prev + 1);
              }}
            />
          </div>
        );
      }
      break;

    case "studies":
      content = (
        <StudiesPage
          onSelectStudy={handleSelectStudy}
          onBack={handleBack}
          backLabel={backLabel}
          onShowProfile={() => navigateTo("profile")}
          onShowAccount={isPrimaryProfile ? () => navigateTo("account") : null}
          onShare={handleShare}
          coreTrackCompleted={coreTrackCompleted}
          coreTrackStats={{
            totalLessons: totalTrackLessons,
            completedLessons: completedTrackLessons,
            percent: coreTrackPercent,
          }}
          studyProgress={studyProgress}
          onResetProgress={handleResetProgress}
          profileImageUrl={activeProfile?.profile_image_url}
        />
      );
      break;

    case "lessons":
      content = (
        <LessonsPage
          studyId={selectedStudyId}
          onSelectLesson={handleSelectLesson}
          onBack={handleBack}
          backLabel={backLabel}
          lessonProgress={lessonProgress[selectedStudyId] || {}}
          onShowProfile={() => navigateTo("profile")}
          onShowAccount={isPrimaryProfile ? () => navigateTo("account") : null}
          profileImageUrl={activeProfile?.profile_image_url}
        />
      );
      break;

    case "lessonDetail":
      content = selectedLesson ? (
        <LessonDetailPage
          studyId={selectedStudyId}
          lesson={selectedLesson}
          onBack={handleBack}
          backLabel={backLabel}
          lessonProgress={lessonProgressForSelectedLesson}
          onUpdateLessonProgress={handleUpdateLessonProgress}
          onShowProfile={() => navigateTo("profile")}
          onShowAccount={isPrimaryProfile ? () => navigateTo("account") : null}
          profileImageUrl={activeProfile?.profile_image_url}
        />
      ) : null;
      break;

    case "bible":
      content = (
        <BiblePage
          onBack={handleBack}
          backLabel={backLabel}
          onShowProfile={() => navigateTo("profile")}
          onShowAccount={isPrimaryProfile ? () => navigateTo("account") : null}
          profileImageUrl={activeProfile?.profile_image_url}
        />
      );
      break;

    case "ask":
      content = (
        <AskPage
          onBack={handleBack}
          backLabel={backLabel}
          onShowProfile={() => navigateTo("profile")}
          onShowAccount={isPrimaryProfile ? () => navigateTo("account") : null}
          profileImageUrl={activeProfile?.profile_image_url}
          profile={activeProfile}
        />
      );
      break;

    case "rapidFire":
      content = (
        <RapidFireQuizPage
          onBack={handleBack}
          backLabel={backLabel}
          onShowProfile={() => navigateTo("profile")}
          onShowAccount={isPrimaryProfile ? () => navigateTo("account") : null}
          onShare={handleShare}
          profileImageUrl={activeProfile?.profile_image_url}
          profile={activeProfile}
          onComplete={handleRapidFireComplete}
        />
      );
      break;

    case "home":
    default:
      content = (
        <HomePage
          onStartNewBirth={() => navigateTo("studies")}
          onShowProfile={() => {
            if (user?.isGuest || activeProfile?.isGuest) {
              handleGuestProfileTap();
            } else {
              navigateTo("profile");
            }
          }}
          onShowAccount={
            isPrimaryProfile
              ? () => {
                  if (user?.isGuest || activeProfile?.isGuest) {
                    handleGuestProfileTap();
                  } else {
                    navigateTo("account");
                  }
                }
              : null
          }
          onSwitchProfile={handleSwitchProfile}
          onShare={handleShare}
          userName={activeProfile?.name || ""}
          accomplishments={accomplishments}
          notifications={notificationsForActiveProfile}
          user={user}
          profile={activeProfile}
          profileImageUrl={activeProfile?.profile_image_url}
          onStartRapidFire={() => navigateTo("rapidFire")}
          onOpenJeremiah={() => navigateTo("ask")}
        />
      );
      break;
  }

  const showBottomNav = !["startup", "login", "profileSelect"].includes(currentView);

  return (
    <>
      <a href="#main-content" className="skip-to-main">Skip to main content</a>
      <div
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          display: "flex",
          flexDirection: "column",
          background: "#ffffff",
        }}
      >
        {/* ── CONTENT AREA ──
            paddingBottom always matches the nav height so no page ever
            hides content behind the nav bar — including AskPage. */}
        <div
          id="main-content"
          style={{
            flex: 1,
            overflow: currentView === "ask" ? "hidden" : "auto",
  
            position: "relative",
            paddingBottom: showBottomNav
              ? "calc(76px + env(safe-area-inset-bottom))"
              : 0,
          }}
        >
          {content}
        </div>

        {/* ── BOTTOM NAV ── */}
        {showBottomNav && (
          <div
            style={{
              position: "fixed",
              bottom: 0,
              left: 0,
              right: 0,
              zIndex: Z_INDEX.bottomNav,
              paddingBottom: "env(safe-area-inset-bottom)",
              background: "#ffffff",
            }}
          >
            <BottomNav currentView={currentView} onNavigate={navigateTo} />
          </div>
        )}
      </div>

      {showGuestPrompt && (
        <GuestPromptModal
          onCreateAccount={handleGuestCreateAccount}
          onLogin={handleGuestLogin}
          onContinueAsGuest={handleGuestContinue}
          onClose={() => setShowGuestPrompt(false)}
        />
      )}

      {showPINModal && (
        <PINModal
          mode={pinMode}
          onSuccess={(pin) => {
            if (pinCallback) pinCallback(pin);
          }}
          onCancel={() => setShowPINModal(false)}
          profileName={pinProfileName}
        />
      )}

      {showNotificationManager && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            zIndex: Z_INDEX.notificationManager,
            background: "#f9fafb",
          }}
        >
          <NotificationManager
            onClose={() => {
              setShowNotificationManager(false);
              window.location.hash = "";
              fetchAppNotifications();
            }}
          />
        </div>
      )}
    </>
  );
}

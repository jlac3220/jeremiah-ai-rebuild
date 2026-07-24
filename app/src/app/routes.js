// Real URL paths now (react-router-dom), not sessionStorage-tracked strings.
export const ROUTES = {
  HOME: "/",
  MAP: "/map",
  CLASSROOM: "/classroom/:standardCode",
  ASK: "/ask",
  PROGRESS: "/progress",
  PROFILE: "/profile",
  BIBLE_SUPPORT: "/classroom/:standardCode/bible-support",
};

export function classroomPath(standardCode) {
  return `/classroom/${standardCode}`;
}

export function bibleSupportPath(standardCode) {
  return `/classroom/${standardCode}/bible-support`;
}

// The persistent bottom nav's tabs — Classroom is reached via the Map, not
// a standalone tab.
export const MAIN_NAV_ITEMS = [
  { path: ROUTES.HOME, label: "Home" },
  { path: ROUTES.MAP, label: "Map" },
  { path: ROUTES.ASK, label: "Ask" },
  { path: ROUTES.PROGRESS, label: "Progress" },
  { path: ROUTES.PROFILE, label: "Profile" },
];

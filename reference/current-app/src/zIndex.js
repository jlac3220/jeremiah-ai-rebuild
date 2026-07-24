// src/zIndex.js - Z-index layering system for the entire app
// Use these constants throughout the app for consistent layering
export const Z_INDEX = {
  // Base layer - default elements
  base: 0,
  // Dropdowns and small overlays
  dropdown: 100,
  // Sticky headers and floating elements
  sticky: 200,
  // Bottom navigation bar
  bottomNav: 1000,
  // Modal overlays (the dark background behind modals)
  overlay: 2000,
  // Modal content (the actual modal panel/dialog)
  modal: 2001,
  // Slide panels (like lesson details, bible reader)
  slidePanel: 2001,
  // Popovers and dropdowns that appear above modals
  popover: 3000,
  // Tooltips - highest priority UI element
  tooltip: 4000,
  // Notification manager (admin interface)
  notificationManager: 9999,
};
export default Z_INDEX;

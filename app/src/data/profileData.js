export const profileData = {
  learner: {
    initial: "J",
    name: "Jacob",
    levelLabel: "Adult endpoint path",
    trackTitle: "The One True God",
    // child | teen | adult | senior — shapes the mouthpiece's tone/vocabulary
    // in grade-response, never the doctrine itself. Real login/profile data
    // should set this once auth exists; this is the stand-in for now.
    ageBand: "adult",
  },
  snapshot: {
    mastered: 12,
    inProgress: 3,
    reviewNeeded: 1,
  },
  continueCard: {
    title: "Return to current classroom session",
    text:
      'Your active profile is currently working through the standard "God is One" and is in scripture review before the next guided checkpoint.',
    buttonLabel: "Continue Current Session",
  },
  adaptation: {
    title: "Adult endpoint path",
    text:
      "This profile is using the adulthood target for doctrinal precision, answer depth, and mastery expectations. Younger learner profiles will move toward the same truth with simplified wording, smaller explanation blocks, and lower response demands.",
  },
  actions: ["Switch Profile", "Account Settings", "Sign Out"],
};
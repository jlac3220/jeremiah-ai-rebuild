export const profileData = {
  learner: {
    initial: "J",
    name: "Jacob",
    // child | teen | adult | senior — default only; the real active value
    // is read from classroomSessionData.getActiveLearnerAgeBand(), which
    // checks localStorage first (set via the Profile page control).
    ageBand: "adult",
  },
};

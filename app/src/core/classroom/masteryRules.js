export const masteryRules = {
  "OG.1.18": {
    positiveConfessionPhrases: [
      "one god",
      "god is one",
      "only one god",
    ],
    exclusionPhrases: [
      "no other god",
      "there is no other god",
      "beside him there is no god",
      "rules out other gods",
      "not many gods",
    ],
    feedback: {
      empty:
        "Enter a response before Jeremiah AI can evaluate your understanding.",
      strong:
        "Strong response. You identified both the positive confession and the exclusion these verses require.",
      partial:
        "Good start. You identified the oneness claim, but you still need to state what these verses rule out.",
      weak:
        "This response is too weak. The verses require you to confess that God is one and that no other God exists beside Him.",
    },
  },
};
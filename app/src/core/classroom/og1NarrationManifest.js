// Shared authored narration contract for the OG.1 lesson player and server.
// Adding a scene here authorizes only that exact text; arbitrary user input
// must never become an unrestricted public text-to-speech endpoint.
export const OG1_SCENE_NARRATION = Object.freeze({
  opening: 'Hear, O Israel: The LORD our God is one LORD.',
  isaiahWitness: Object.freeze([
    'Before me there was no God formed, neither shall there be after me.',
    'Beside me there is no God.',
    'Neither shall there be after me.',
  ]),
  continuity: Object.freeze([
    'The LORD our God is one LORD.',
    'The Lord our God is one Lord.',
    'There is none other God but one.',
  ]),
  witnessCards: Object.freeze([
    'Hear, O Israel: The LORD our God is one LORD. Deuteronomy chapter six, verse four. Moses calls Israel to hear and respond to the one LORD.',
    'I am the first, and I am the last; and beside me there is no God. Isaiah chapter forty four, verse six. The LORD declares that no other God exists beside him.',
    'Hear, O Israel; The Lord our God is one Lord. Mark chapter twelve, verse twenty-nine. Jesus reaffirms the confession when asked about the first commandment.',
    'There is none other God but one. First Corinthians chapter eight, verse four. Paul carries the confession into his teaching about idols and the one God.',
  ]),
  identity: 'Jesus Christ stands at the center of this question. We will examine how the Scriptures speak about the one God and the incarnation.',
  comparison: 'Two explanations now come into view. Listen closely to what each actually teaches before considering their differences.',
  mission: 'The confession of one God is more than a statement to remember. It calls us to wholehearted devotion.',
  return: 'We return to the words of Moses. Hear, O Israel: the LORD our God is one LORD.',
});

// Every line used in the player is allowed by the server, by construction.
export const OG1_AUTHORED_NARRATION_TEXTS = Object.freeze([
  ...new Set(Object.values(OG1_SCENE_NARRATION).flat()),
]);

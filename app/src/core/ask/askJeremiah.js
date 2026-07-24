import { getAllStandards } from "../standards/standardsRegistry";
import { getEdgeFunctionUrl, SUPABASE_ANON_KEY } from "../config/supabaseConfig";

const ASK_ENDPOINT = getEdgeFunctionUrl("ask-jeremiah");

/**
 * Open Q&A through the mouthpiece — always grounded in the real standards
 * from the Brain (sent along with every request), never answered locally.
 * conversationHistory: [{ role: "user"|"assistant", content }]
 */
export async function askJeremiah(question, conversationHistory, ageBand = "adult") {
  const trimmed = (question || "").trim();
  if (!trimmed) {
    return { answer: "Ask Jeremiah something first.", unavailable: false };
  }

  try {
    const response = await fetch(ASK_ENDPOINT, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
        apikey: SUPABASE_ANON_KEY,
      },
      body: JSON.stringify({
        question: trimmed,
        conversationHistory,
        ageBand,
        standards: getAllStandards(),
      }),
    });

    if (!response.ok) {
      throw new Error(`Ask request failed with ${response.status}`);
    }

    const result = await response.json();
    if (!result?.answer) {
      throw new Error("Ask response was missing an answer");
    }

    return { answer: result.answer, unavailable: false };
  } catch {
    return {
      answer:
        "Jeremiah can't answer right now (connection issue). Check your connection and try again.",
      unavailable: true,
    };
  }
}

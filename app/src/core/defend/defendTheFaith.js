import { getEdgeFunctionUrl, SUPABASE_ANON_KEY } from "../config/supabaseConfig";

const DEFEND_ENDPOINT = getEdgeFunctionUrl("defend-the-faith");

/**
 * One exchange in a Defend the Faith round. Pass learnerReply=null to get
 * Jeremiah's opening objection. Never fabricates a verdict locally — an
 * unreachable function returns unavailable:true instead of faking a result.
 */
export async function defendTheFaithExchange(standard, conversationHistory, learnerReply, ageBand = "adult") {
  try {
    const response = await fetch(DEFEND_ENDPOINT, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
        apikey: SUPABASE_ANON_KEY,
      },
      body: JSON.stringify({ standard, conversationHistory, learnerReply, ageBand }),
    });

    if (!response.ok) {
      throw new Error(`Defend request failed with ${response.status}`);
    }

    const result = await response.json();
    if (typeof result?.reply !== "string") {
      throw new Error("Defend response was missing a reply");
    }

    return { ...result, unavailable: false };
  } catch {
    return {
      reply: "Jeremiah can't continue this round right now (connection issue). Try again shortly.",
      verdict: null,
      roundComplete: true,
      unavailable: true,
    };
  }
}

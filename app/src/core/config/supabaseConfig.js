// Same Supabase project the original app used. The anon/"publishable" key is
// safe to ship client-side by design (Supabase's publishable-key model) —
// it is not a secret. The actual grading secret (ANTHROPIC_API_KEY) lives
// only server-side, as a Supabase Edge Function secret — see
// app/supabase/functions/grade-response/index.ts.
export const SUPABASE_URL = "https://jogycozrhylfzpwcoeed.supabase.co";
export const SUPABASE_ANON_KEY = "sb_publishable_aGrwoKPUYvRetC4XF2mwMg_KGiGz3qe";

export function getEdgeFunctionUrl(functionName) {
  return `${SUPABASE_URL}/functions/v1/${functionName}`;
}

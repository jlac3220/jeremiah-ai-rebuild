import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://jogycozrhylfzpwcoeed.supabase.co"; 
const supabaseAnonKey = "sb_publishable_aGrwoKPUYvRetC4XF2mwMg_KGiGz3qe";

export const supabase = createClient(supabaseUrl, supabaseAnonKey);


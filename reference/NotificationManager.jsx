/**
 * useProfiles – Loads the Supabase account and profiles for the logged-in user.
 * Creates an account record if one does not yet exist.
 */
import { useState, useEffect } from "react";
import { supabase } from "../supabaseClient";

/**
 * @param {{ user: object|null, authLoading: boolean }} options
 * @returns {{ account: object|null, profiles: object[], setAccount: Function, setProfiles: Function }}
 */
export function useProfiles({ user, authLoading }) {
  const [account, setAccount] = useState(null);
  const [profiles, setProfiles] = useState([]);

  useEffect(() => {
    async function loadProfiles() {
      if (!user || user.isGuest) {
        setProfiles([]);
        return;
      }

      try {
        let { data: accountData, error: accountError } = await supabase
          .from("accounts")
          .select("*")
          .eq("user_id", user.id)
          .single();

        if (accountError && accountError.code === "PGRST116") {
          const { data: newAccount, error: createError } = await supabase
            .from("accounts")
            .insert({ user_id: user.id, email: user.email })
            .select()
            .single();

          if (createError) throw createError;
          accountData = newAccount;
        } else if (accountError) {
          throw accountError;
        }

        setAccount(accountData);

        const { data: profilesData, error: profilesError } = await supabase
          .from("profiles")
          .select("*")
          .eq("account_id", accountData.id)
          .order("created_at", { ascending: true });

        if (profilesError) throw profilesError;
        setProfiles(profilesData || []);
      } catch (err) {
        console.error("Error loading profiles:", err);
      }
    }

    if (!authLoading && user) {
      loadProfiles();
    }
  }, [user, authLoading]);

  return { account, profiles, setAccount, setProfiles };
}

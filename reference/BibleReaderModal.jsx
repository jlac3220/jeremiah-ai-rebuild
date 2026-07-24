/**
 * useAuth – Manages Supabase authentication state.
 * Subscribes to auth state changes on mount and exposes the current user
 * along with the initial loading flag.
 */
import { useState, useEffect } from "react";
import { supabase } from "../supabaseClient";

/**
 * @returns {{ user: object|null, authLoading: boolean, setUser: Function }}
 */
export function useAuth() {
  const [user, setUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      setAuthLoading(false);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  return { user, authLoading, setUser };
}

import { createClient } from "@supabase/supabase-js";

export const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
export const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

let supabaseInstance = null;

const supabaseClient = (supabaseAccessToken) => {
  if (!supabaseInstance) {
    supabaseInstance = createClient(supabaseUrl, supabaseKey, {
      global: {
        headers: supabaseAccessToken 
          ? { Authorization: `Bearer ${supabaseAccessToken}` }
          : {},
      },
      auth: {
        persistSession: false,
      },
    });
  }

  if (supabaseAccessToken) {
    supabaseInstance.auth.setSession({ access_token: supabaseAccessToken });
  }

  return supabaseInstance;
};

export default supabaseClient;
import { createClient } from "@supabase/supabase-js";

export const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

let cachedSupabase = null;
let cachedToken = null;  // Store the current access token

const supabaseClient = async (supabaseAccessToken) => {
  // If the token has changed or no cached client exists, create a new one
  if (!cachedSupabase || cachedToken !== supabaseAccessToken) {
    // Create a new Supabase client
    cachedSupabase = createClient(supabaseUrl, supabaseKey, {
      global: {
        headers: {
          Authorization: `Bearer ${supabaseAccessToken}`,
        },
      },
    });

    // Cache the new token
    cachedToken = supabaseAccessToken;
  }

  return cachedSupabase;
};

export default supabaseClient;

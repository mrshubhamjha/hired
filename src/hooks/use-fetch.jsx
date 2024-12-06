import { useSession } from "@clerk/clerk-react";
import { useState, useCallback } from "react";

const useFetch = (callback, options = {}) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { session } = useSession();

  const fn = useCallback(async (...args) => {
    if (!session) {
      console.error('No session available');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // Retrieve the Supabase token using Clerk session
      const supabaseAccessToken = await session.getToken({
        template: 'supabase',
      });

      // Execute the callback function with the token and any other arguments
      const response = await callback(supabaseAccessToken, options, ...args);
      setData(response);
    } catch (err) {
      setError(err);
      console.error('Fetch error:', err);
      // You might want to show a user-friendly error message here
    } finally {
      setLoading(false);
    }
  }, [session, callback, options]);

  return { fn, data, loading, error };
};

export default useFetch;

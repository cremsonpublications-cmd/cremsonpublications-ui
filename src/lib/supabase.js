import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Create Supabase client with custom redirect URLs for authentication
export const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    redirectTo: "https://www.cremsonpublications.com/auth/callback",
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
    flowType: "pkce",
    site: "https://www.cremsonpublications.com",
  },
});

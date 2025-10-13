import { createClient } from '@supabase/supabase-js'

// Supabase configuration - replace with your actual keys
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    redirectTo: 'https://www.gyanexpert.com/auth/callback',
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
    flowType: 'pkce',
    site: 'https://www.gyanexpert.com'
  }
})

export default supabase

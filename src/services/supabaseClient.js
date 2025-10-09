import { createClient } from '@supabase/supabase-js'

// Supabase configuration - replace with your actual keys
const supabaseUrl = 'https://onszmectsaddhcqhrpnt.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9uc3ptZWN0c2FkZGhjcWhycG50Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTkxNTE5MzcsImV4cCI6MjA3NDcyNzkzN30.8oON_0Z71U1tA_JUmMvvT-zF2-J-acrPtj0mEd4PnMU'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

export default supabase

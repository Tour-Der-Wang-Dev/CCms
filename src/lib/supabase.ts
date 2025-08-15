import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://ljtuzwiokiupxnqxlkxk.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxqdHV6d2lva2l1cHhucXhsa3hrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTUxMDYxMjQsImV4cCI6MjA3MDY4MjEyNH0.6ys_VDhZclexcpfETLDA84h2WYtLOe-YSSsMdnwXckY';

// Warn if using fallback values in production
if (import.meta.env.PROD && (!import.meta.env.VITE_SUPABASE_URL || !import.meta.env.VITE_SUPABASE_ANON_KEY)) {
  console.warn('⚠️ Using fallback Supabase credentials. Set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY environment variables for production.');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

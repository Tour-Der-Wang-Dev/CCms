import React from 'react';

// Temporary debug component to check environment variables
export function DebugEnv() {
  console.log('VITE_SUPABASE_URL:', import.meta.env.VITE_SUPABASE_URL);
  console.log('VITE_SUPABASE_ANON_KEY:', import.meta.env.VITE_SUPABASE_ANON_KEY ? 'SET' : 'NOT SET');
  
  return (
    <div style={{ position: 'fixed', top: 0, right: 0, background: 'red', color: 'white', padding: '10px', zIndex: 9999 }}>
      <div>URL: {import.meta.env.VITE_SUPABASE_URL ? 'SET' : 'NOT SET'}</div>
      <div>KEY: {import.meta.env.VITE_SUPABASE_ANON_KEY ? 'SET' : 'NOT SET'}</div>
    </div>
  );
}


import { createClient } from "@supabase/supabase-js";


const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_DEFAULT_KEY;

console.log('Frontend Supabase Config:');
console.log('URL:', supabaseUrl);
console.log('Key present:', !!supabaseKey);

if (!supabaseUrl || !supabaseKey) {
  console.error('ERROR: Variables de Supabase no configuradas');
  console.error('Variables disponibles:', {
    VITE_SUPABASE_URL: !!import.meta.env.VITE_SUPABASE_URL,
    VITE_SUPABASE_PUBLISHABLE_DEFAULT_KEY: !!import.meta.env.VITE_SUPABASE_PUBLISHABLE_DEFAULT_KEY,
    VITE_SUPABASE_ANON_KEY: !!import.meta.env.VITE_SUPABASE_ANON_KEY
  });
  throw new Error('Supabase configuration is missing');
}

export const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
    storage: window.localStorage
  }
});
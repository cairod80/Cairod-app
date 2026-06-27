// src/supabase.js
// ─────────────────────────────────────────────────────────────────────────────
// cairod — Supabase Client
// Replace the two values below with your actual project credentials
// Get them from: supabase.com → your project → Settings → API
// ─────────────────────────────────────────────────────────────────────────────

import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL  = process.env.REACT_APP_SUPABASE_URL  || 'YOUR_SUPABASE_URL';
const SUPABASE_KEY  = process.env.REACT_APP_SUPABASE_ANON_KEY || 'YOUR_SUPABASE_ANON_KEY';

export const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

export default supabase;

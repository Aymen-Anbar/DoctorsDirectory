import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { createClient } from "@supabase/supabase-js";

// Ensure these are correctly set in your .env.local file
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error("Missing Supabase environment variables");
}

// ✅ Client-side Supabase client (for React components)
export function createSupabaseClient() {
  return createClientComponentClient(); // ✅ No need for arguments
}

// ✅ Standalone Supabase client (for API calls)
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

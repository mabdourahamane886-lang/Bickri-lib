import { createBrowserClient } from "@supabase/ssr";
import { SUPABASE_PUBLISHABLE_KEY, SUPABASE_URL } from "@/lib/supabase/config";

export function createClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL || SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || SUPABASE_PUBLISHABLE_KEY;
  return createBrowserClient(url, key);
}

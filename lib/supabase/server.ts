import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

export function getSupabaseConfig() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  return { url, key, configured: Boolean(url && key) };
}

export async function createClient() {
  const { url, key } = getSupabaseConfig();
  if (!url || !key) throw new Error("Authentication service is not configured");

  const cookieStore = await cookies();

  return createServerClient(url, key, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet) {
        try {
          cookiesToSet.forEach(({ name, value, options }) => cookieStore.set(name, value, options));
        } catch {
          // Server Components cannot always mutate cookies. The proxy refreshes sessions.
        }
      },
    },
  });
}

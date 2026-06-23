import { createBrowserClient } from "@supabase/ssr";
import type { SupabaseClient } from "@supabase/supabase-js";
import { getBrowserAuthCookieOptions } from "@/lib/supabase/auth-cookies";

let browserClient: SupabaseClient | undefined;

/** Single browser Supabase client — avoids duplicate auth listeners. */
export function getBrowserSupabaseClient(): SupabaseClient {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !anonKey) {
    throw new Error("Missing Supabase environment variables.");
  }

  if (!browserClient) {
    browserClient = createBrowserClient(url, anonKey, {
      cookieOptions: getBrowserAuthCookieOptions(),
      auth: {
        // Middleware/proxy owns refresh + Set-Cookie propagation to avoid refresh-token rotation races.
        autoRefreshToken: false,
      },
    });
  }

  return browserClient;
}

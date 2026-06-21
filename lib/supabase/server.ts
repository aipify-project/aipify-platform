import { createServerClient } from "@supabase/ssr";
import { cookies, headers } from "next/headers";
import { mergeAuthCookieOptions } from "@/lib/supabase/auth-cookies";

export async function createClient() {
  const cookieStore = await cookies();
  const headerStore = await headers();
  const host = headerStore.get("host");

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !anonKey) {
    throw new Error("Missing Supabase environment variables.");
  }

  return createServerClient(url, anonKey, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet) {
        try {
          cookiesToSet.forEach(({ name, value, options }) => {
            cookieStore.set(name, value, mergeAuthCookieOptions(options, host));
          });
        } catch {
          // Called from a Server Component; proxy will refresh sessions.
        }
      },
    },
  });
}

import { createServerClient } from "@supabase/ssr";
import type { SupabaseClient } from "@supabase/supabase-js";
import { cookies, headers } from "next/headers";
import { NextResponse } from "next/server";
import { mergeAuthCookieOptions } from "@/lib/supabase/auth-cookies";

type RouteHandlerSupabase = {
  supabase: SupabaseClient;
  /** Apply auth cookies set during Supabase calls onto the final response. */
  applyCookies: (response: NextResponse) => NextResponse;
};

/** Route Handler Supabase client — persists auth cookies on the HTTP response. */
export async function createRouteHandlerSupabaseClient(): Promise<RouteHandlerSupabase> {
  const cookieStore = await cookies();
  const headerStore = await headers();
  const host = headerStore.get("host");

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !anonKey) {
    throw new Error("Missing Supabase environment variables.");
  }

  let cookieCarrier = NextResponse.next();

  const supabase = createServerClient(url, anonKey, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value, options }) => {
          cookieStore.set(name, value, mergeAuthCookieOptions(options, host));
        });
        cookieCarrier = NextResponse.next();
        cookiesToSet.forEach(({ name, value, options }) => {
          cookieCarrier.cookies.set(name, value, mergeAuthCookieOptions(options, host));
        });
      },
    },
  });

  return {
    supabase,
    applyCookies(response) {
      cookieCarrier.cookies.getAll().forEach((cookie) => {
        response.cookies.set(cookie);
      });
      return response;
    },
  };
}

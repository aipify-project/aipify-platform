import type { NextResponse } from "next/server";

/** Copy Supabase auth cookies from the session refresh carrier onto any response (including redirects). */
export function copySupabaseAuthCookies(
  source: NextResponse,
  target: NextResponse,
): NextResponse {
  source.cookies.getAll().forEach((cookie) => {
    target.cookies.set(cookie);
  });
  return target;
}

export function withSupabaseAuthCookies(
  sessionResponse: NextResponse,
  response: NextResponse,
): NextResponse {
  return copySupabaseAuthCookies(sessionResponse, response);
}

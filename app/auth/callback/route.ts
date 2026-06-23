import { NextResponse } from "next/server";
import {
  AUTH_REDIRECT_PATHS,
  getAuthAppOrigin,
} from "@/lib/auth/auth-redirect-urls";
import { sanitizeNextPath } from "@/lib/auth/safe-next-path";
import { createClient } from "@/lib/supabase/server";

export async function GET(request: Request) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get("code");
  const nextParam = requestUrl.searchParams.get("next");
  const type = requestUrl.searchParams.get("type");
  const origin = getAuthAppOrigin();

  const defaultNext =
    type === "recovery" ? AUTH_REDIRECT_PATHS.updatePassword : AUTH_REDIRECT_PATHS.login;
  const next = sanitizeNextPath(nextParam) ?? defaultNext;

  if (code) {
    const supabase = await createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);

    if (error) {
      const loginUrl = new URL(AUTH_REDIRECT_PATHS.login, origin);
      loginUrl.searchParams.set("error", "auth_callback");
      return NextResponse.redirect(loginUrl);
    }
  }

  return NextResponse.redirect(new URL(next, origin));
}

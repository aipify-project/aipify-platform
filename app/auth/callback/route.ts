import { NextResponse } from "next/server";
import {
  AUTH_REDIRECT_PATHS,
  readRequestHostFromHeaders,
  resolveAuthAppOrigin,
} from "@/lib/auth/auth-redirect-urls";
import {
  logAuthRecoveryEvent,
  mapAuthCallbackError,
  type AuthRecoveryErrorCode,
} from "@/lib/auth/auth-recovery-log";
import { sanitizeNextPath } from "@/lib/auth/safe-next-path";
import { createRouteHandlerSupabaseClient } from "@/lib/supabase/route-handler";
import { headers } from "next/headers";

function redirectWithRecoveryError(
  origin: string,
  errorCode: AuthRecoveryErrorCode,
  applyCookies: (response: NextResponse) => NextResponse,
): NextResponse {
  const url = new URL(AUTH_REDIRECT_PATHS.updatePassword, origin);
  url.searchParams.set("error", errorCode);
  return applyCookies(NextResponse.redirect(url));
}

export async function GET(request: Request) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get("code");
  const tokenHash = requestUrl.searchParams.get("token_hash");
  const nextParam = requestUrl.searchParams.get("next");
  const type = requestUrl.searchParams.get("type");
  const headerStore = await headers();
  const origin = resolveAuthAppOrigin({
    requestHost: readRequestHostFromHeaders(headerStore) ?? requestUrl.host,
  });

  const defaultNext =
    type === "recovery" ? AUTH_REDIRECT_PATHS.updatePassword : AUTH_REDIRECT_PATHS.login;
  const next = sanitizeNextPath(nextParam) ?? defaultNext;

  logAuthRecoveryEvent("callback_start", {
    pathname: "/auth/callback",
    hasCode: !!code,
    hasTokenHash: !!tokenHash,
    type: type ?? undefined,
    next,
  });

  const { supabase, applyCookies } = await createRouteHandlerSupabaseClient();

  if (tokenHash && type === "recovery") {
    const { error } = await supabase.auth.verifyOtp({
      token_hash: tokenHash,
      type: "recovery",
    });

    if (error) {
      const errorCode = mapAuthCallbackError(error.message);
      logAuthRecoveryEvent("callback_verify_otp_failed", {
        errorCode,
        recoveryEstablished: false,
      });
      return redirectWithRecoveryError(origin, errorCode, applyCookies);
    }

    logAuthRecoveryEvent("callback_verify_otp_ok", { recoveryEstablished: true });
    return applyCookies(NextResponse.redirect(new URL(next, origin)));
  }

  if (!code) {
    logAuthRecoveryEvent("callback_missing_code", {
      errorCode: "missing_code",
      recoveryEstablished: false,
    });
    if (type === "recovery") {
      return redirectWithRecoveryError(origin, "missing_code", applyCookies);
    }
    return applyCookies(NextResponse.redirect(new URL(next, origin)));
  }

  const { error } = await supabase.auth.exchangeCodeForSession(code);

  if (error) {
    const errorCode = mapAuthCallbackError(error.message);
    logAuthRecoveryEvent("callback_exchange_failed", {
      errorCode,
      recoveryEstablished: false,
    });

    if (type === "recovery" || next === AUTH_REDIRECT_PATHS.updatePassword) {
      return redirectWithRecoveryError(origin, errorCode, applyCookies);
    }

    const loginUrl = new URL(AUTH_REDIRECT_PATHS.login, origin);
    loginUrl.searchParams.set("error", "auth_callback");
    return applyCookies(NextResponse.redirect(loginUrl));
  }

  logAuthRecoveryEvent("callback_exchange_ok", { recoveryEstablished: true });
  return applyCookies(NextResponse.redirect(new URL(next, origin)));
}

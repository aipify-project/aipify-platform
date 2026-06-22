import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import {
  UNONIGHT_AIPIFY_API_VERSION,
  UNONIGHT_AIPIFY_PROVIDER,
  checkUnonightConnectionRateLimit,
  clientIpFromRequest,
  extractBearerToken,
  isUnonightAipifyTokenFormat,
} from "@/lib/unonight-platform";

function safeError(code: string, status: number, retryAfter?: number) {
  const headers: Record<string, string> = {};
  if (retryAfter) headers["Retry-After"] = String(retryAfter);
  return NextResponse.json({ error: code }, { status, headers });
}

/** Public read-only connection verification — Unonight platform side. */
export async function GET(request: Request) {
  const ip = clientIpFromRequest(request);

  try {
    const bearer = extractBearerToken(request.headers.get("authorization"));
    if (!bearer || !isUnonightAipifyTokenFormat(bearer)) {
      const limited = checkUnonightConnectionRateLimit(ip, "failure");
      if (!limited.allowed) {
        return safeError("rate_limited", 429, limited.retryAfterSeconds);
      }
      return safeError("invalid_token", 401);
    }

    const supabase = await createClient();
    const { data, error } = await supabase.rpc("verify_unonight_aipify_connection_token", {
      p_token: bearer,
      p_request_ip: ip,
    });

    if (error) {
      return safeError("server_error", 500);
    }

    const result = data as { ok?: boolean; code?: string } | null;
    if (!result?.ok) {
      const limited = checkUnonightConnectionRateLimit(ip, "failure");
      if (!limited.allowed) {
        return safeError("rate_limited", 429, limited.retryAfterSeconds);
      }
      const code = result?.code === "expired_or_revoked" ? "expired_or_revoked" : "invalid_token";
      return safeError(code, code === "expired_or_revoked" ? 403 : 401);
    }

    const limited = checkUnonightConnectionRateLimit(ip, "success");
    if (!limited.allowed) {
      return safeError("rate_limited", 429, limited.retryAfterSeconds);
    }

    const scopes = Array.isArray((result as { scopes?: unknown }).scopes)
      ? ((result as { scopes: string[] }).scopes ?? [])
      : [];

    return NextResponse.json({
      connected: true,
      provider: UNONIGHT_AIPIFY_PROVIDER,
      organization_id: String((result as { organization_id?: string }).organization_id ?? ""),
      organization_name: String((result as { organization_name?: string }).organization_name ?? "Unonight"),
      access_mode: "read_only",
      scopes,
      api_version: UNONIGHT_AIPIFY_API_VERSION,
    });
  } catch {
    return safeError("server_error", 500);
  }
}

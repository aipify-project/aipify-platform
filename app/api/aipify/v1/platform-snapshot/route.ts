import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import {
  UNONIGHT_AIPIFY_API_VERSION,
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

/** Public read-only platform snapshot — Unonight platform side. */
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
    const { data, error } = await supabase.rpc("verify_unonight_aipify_platform_snapshot_token", {
      p_token: bearer,
      p_request_ip: ip,
    });

    if (error) {
      return safeError("server_error", 500);
    }

    const result = data as Record<string, unknown> | null;
    if (!result || result.ok !== true) {
      const limited = checkUnonightConnectionRateLimit(ip, "failure");
      if (!limited.allowed) {
        return safeError("rate_limited", 429, limited.retryAfterSeconds);
      }
      const code = String(result?.code ?? "invalid_token");
      if (code === "missing_scope") return safeError("missing_scope", 403);
      if (code === "expired_or_revoked") return safeError("expired_or_revoked", 403);
      return safeError("invalid_token", 401);
    }

    const limited = checkUnonightConnectionRateLimit(ip, "success");
    if (!limited.allowed) {
      return safeError("rate_limited", 429, limited.retryAfterSeconds);
    }

    const organization = result.organization as Record<string, unknown> | undefined;
    const platform = result.platform as Record<string, unknown> | undefined;

    return NextResponse.json({
      status: String(result.status ?? "available"),
      api_version: String(result.api_version ?? UNONIGHT_AIPIFY_API_VERSION),
      organization: {
        id: String(organization?.id ?? ""),
        name: String(organization?.name ?? "Unonight"),
        base_url: String(organization?.base_url ?? "https://www.unonight.com"),
      },
      platform: {
        environment: String(platform?.environment ?? "production"),
        version: String(platform?.version ?? ""),
        supported_locales: Array.isArray(platform?.supported_locales)
          ? platform?.supported_locales
          : [],
        active_modules: Array.isArray(platform?.active_modules) ? platform?.active_modules : [],
      },
      checked_at: String(result.checked_at ?? new Date().toISOString()),
    });
  } catch {
    return safeError("server_error", 500);
  }
}

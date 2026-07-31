import { NextResponse } from "next/server";
import { createPublicAnonSupabaseClient } from "@/lib/supabase/public-anon";
import {
  extractInstallationToken,
  parseRuntimeManifestRpc,
  RUNTIME_NO_STORE_HEADERS,
} from "@/lib/customer-website-runtime";

export async function GET(request: Request) {
  const token = extractInstallationToken(request);
  if (!token) {
    return NextResponse.json(
      { ok: false, reason: "invalid_token" },
      { status: 401, headers: RUNTIME_NO_STORE_HEADERS },
    );
  }

  try {
    const supabase = createPublicAnonSupabaseClient();
    const { data, error } = await supabase.rpc("resolve_customer_website_runtime_manifest", {
      p_token: token,
    });
    if (error) {
      return NextResponse.json(
        { ok: false, reason: "resolve_failed" },
        { status: 400, headers: RUNTIME_NO_STORE_HEADERS },
      );
    }
    const parsed = parseRuntimeManifestRpc(data);
    const status = parsed.ok ? 200 : parsed.reason === "invalid_token" ? 401 : 404;
    return NextResponse.json(parsed, { status, headers: RUNTIME_NO_STORE_HEADERS });
  } catch {
    return NextResponse.json(
      { ok: false, reason: "unavailable" },
      { status: 503, headers: RUNTIME_NO_STORE_HEADERS },
    );
  }
}

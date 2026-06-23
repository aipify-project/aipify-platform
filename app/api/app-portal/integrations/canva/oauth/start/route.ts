import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { createClient } from "@/lib/supabase/server";
import {
  buildCanvaOAuthAuthorizeUrl,
  createCanvaOAuthCodeChallenge,
  createCanvaOAuthCodeVerifier,
  getCanvaOAuthEnv,
} from "@/lib/integration-intelligence/providers/canva/oauth";

const CANVA_OAUTH_COOKIE = "aipify_canva_oauth_verifier";

export async function GET() {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const env = getCanvaOAuthEnv();
    if (!env) {
      return NextResponse.json({ ok: false, error: "canva_oauth_not_configured" }, { status: 503 });
    }

    const codeVerifier = createCanvaOAuthCodeVerifier();
    const codeChallenge = createCanvaOAuthCodeChallenge(codeVerifier);
    const state = createCanvaOAuthCodeVerifier();

    const cookieStore = await cookies();
    cookieStore.set(CANVA_OAUTH_COOKIE, JSON.stringify({ code_verifier: codeVerifier, state }), {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 600,
      path: "/",
    });

    const authorizeUrl = buildCanvaOAuthAuthorizeUrl({
      client_id: env.client_id,
      redirect_uri: env.redirect_uri,
      state,
      code_challenge: codeChallenge,
    });

    return NextResponse.json({ ok: true, authorize_url: authorizeUrl });
  } catch {
    return NextResponse.json({ ok: false, error: "oauth_start_failed" }, { status: 500 });
  }
}

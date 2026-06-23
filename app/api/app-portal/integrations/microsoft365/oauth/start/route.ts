import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { createClient } from "@/lib/supabase/server";
import {
  buildMicrosoft365OAuthAuthorizeUrl,
  createMicrosoft365OAuthCodeChallenge,
  createMicrosoft365OAuthCodeVerifier,
  getMicrosoft365OAuthEnv,
} from "@/lib/integration-intelligence/providers/microsoft365";

const MICROSOFT365_OAUTH_COOKIE = "aipify_microsoft365_oauth_verifier";

export async function GET() {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const env = getMicrosoft365OAuthEnv();
    if (!env) {
      return NextResponse.json({ ok: false, error: "microsoft365_oauth_not_configured" }, { status: 503 });
    }

    const codeVerifier = createMicrosoft365OAuthCodeVerifier();
    const codeChallenge = createMicrosoft365OAuthCodeChallenge(codeVerifier);
    const state = createMicrosoft365OAuthCodeVerifier();

    const cookieStore = await cookies();
    cookieStore.set(
      MICROSOFT365_OAUTH_COOKIE,
      JSON.stringify({ code_verifier: codeVerifier, state }),
      {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 600,
        path: "/",
      },
    );

    const authorizeUrl = buildMicrosoft365OAuthAuthorizeUrl({
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

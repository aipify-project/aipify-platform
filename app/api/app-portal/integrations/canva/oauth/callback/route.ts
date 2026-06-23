import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { createClient } from "@/lib/supabase/server";
import { exchangeCanvaAuthorizationCode } from "@/lib/integration-intelligence/providers/canva/connect-client";
import {
  getCanvaOAuthEnv,
  serializeCanvaOAuthTokenPayload,
} from "@/lib/integration-intelligence/providers/canva/oauth";
import { encryptIntegrationCredential } from "@/lib/unonight/connection/crypto";
import { CANVA_HANDOFF_OAUTH_SCOPES } from "@/lib/integration-intelligence/providers/canva/connect-capabilities-audit";

const CANVA_OAUTH_COOKIE = "aipify_canva_oauth_verifier";

export async function GET(request: Request) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return NextResponse.redirect(new URL("/app/settings/integrations?canva=unauthorized", request.url));

    const env = getCanvaOAuthEnv();
    if (!env) {
      return NextResponse.redirect(new URL("/app/settings/integrations?canva=not_configured", request.url));
    }

    const { searchParams } = new URL(request.url);
    const code = searchParams.get("code")?.trim();
    const state = searchParams.get("state")?.trim();
    const oauthError = searchParams.get("error")?.trim();

    if (oauthError) {
      return NextResponse.redirect(
        new URL(`/app/settings/integrations?canva=denied&reason=${encodeURIComponent(oauthError)}`, request.url),
      );
    }

    if (!code || !state) {
      return NextResponse.redirect(new URL("/app/settings/integrations?canva=invalid_callback", request.url));
    }

    const cookieStore = await cookies();
    const rawCookie = cookieStore.get(CANVA_OAUTH_COOKIE)?.value;
    if (!rawCookie) {
      return NextResponse.redirect(new URL("/app/settings/integrations?canva=session_expired", request.url));
    }

    const parsed = JSON.parse(rawCookie) as { code_verifier?: string; state?: string };
    if (!parsed.code_verifier || parsed.state !== state) {
      return NextResponse.redirect(new URL("/app/settings/integrations?canva=state_mismatch", request.url));
    }

    const tokenBundle = await exchangeCanvaAuthorizationCode({
      code,
      code_verifier: parsed.code_verifier,
      client_id: env.client_id,
      client_secret: env.client_secret,
      redirect_uri: env.redirect_uri,
    });

    const encrypted = encryptIntegrationCredential(
      serializeCanvaOAuthTokenPayload({
        access_token: tokenBundle.access_token,
        refresh_token: tokenBundle.refresh_token,
        expires_at: tokenBundle.expires_in
          ? new Date(Date.now() + tokenBundle.expires_in * 1000).toISOString()
          : undefined,
      }),
    );

    const { data: storeRaw, error } = await supabase.rpc("store_companion_canva_oauth_connection", {
      p_encrypted_token: encrypted,
      p_approved_scopes: [...CANVA_HANDOFF_OAUTH_SCOPES],
    });

    cookieStore.delete(CANVA_OAUTH_COOKIE);

    if (error) {
      return NextResponse.redirect(new URL("/app/settings/integrations?canva=store_failed", request.url));
    }

    const storeResult = (storeRaw ?? {}) as { ok?: boolean };
    if (!storeResult.ok) {
      return NextResponse.redirect(new URL("/app/settings/integrations?canva=store_failed", request.url));
    }

    return NextResponse.redirect(new URL("/app/settings/integrations?canva=connected", request.url));
  } catch {
    return NextResponse.redirect(new URL("/app/settings/integrations?canva=callback_failed", request.url));
  }
}

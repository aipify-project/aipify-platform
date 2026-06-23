import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { createClient } from "@/lib/supabase/server";
import {
  exchangeMicrosoft365AuthorizationCode,
  fetchMicrosoft365AccountProfile,
  getMicrosoft365OAuthEnv,
  MICROSOFT365_OAUTH_SCOPES,
  serializeMicrosoft365OAuthTokenPayload,
} from "@/lib/integration-intelligence/providers/microsoft365";
import { encryptIntegrationCredential } from "@/lib/unonight/connection/crypto";

const MICROSOFT365_OAUTH_COOKIE = "aipify_microsoft365_oauth_verifier";

export async function GET(request: Request) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.redirect(
        new URL("/app/settings/integrations?microsoft365=unauthorized", request.url),
      );
    }

    const env = getMicrosoft365OAuthEnv();
    if (!env) {
      return NextResponse.redirect(
        new URL("/app/settings/integrations?microsoft365=not_configured", request.url),
      );
    }

    const { searchParams } = new URL(request.url);
    const code = searchParams.get("code")?.trim();
    const state = searchParams.get("state")?.trim();
    const oauthError = searchParams.get("error")?.trim();

    if (oauthError) {
      return NextResponse.redirect(
        new URL(
          `/app/settings/integrations?microsoft365=denied&reason=${encodeURIComponent(oauthError)}`,
          request.url,
        ),
      );
    }

    if (!code || !state) {
      return NextResponse.redirect(
        new URL("/app/settings/integrations?microsoft365=invalid_callback", request.url),
      );
    }

    const cookieStore = await cookies();
    const rawCookie = cookieStore.get(MICROSOFT365_OAUTH_COOKIE)?.value;
    if (!rawCookie) {
      return NextResponse.redirect(
        new URL("/app/settings/integrations?microsoft365=session_expired", request.url),
      );
    }

    const parsed = JSON.parse(rawCookie) as { code_verifier?: string; state?: string };
    if (!parsed.code_verifier || parsed.state !== state) {
      return NextResponse.redirect(
        new URL("/app/settings/integrations?microsoft365=state_mismatch", request.url),
      );
    }

    const tokenBundle = await exchangeMicrosoft365AuthorizationCode({
      code,
      code_verifier: parsed.code_verifier,
      client_id: env.client_id,
      client_secret: env.client_secret,
      redirect_uri: env.redirect_uri,
    });

    const profile = await fetchMicrosoft365AccountProfile(tokenBundle.access_token);
    const accountLabel = profile?.email ?? profile?.display_name ?? null;

    const encrypted = encryptIntegrationCredential(
      serializeMicrosoft365OAuthTokenPayload({
        access_token: tokenBundle.access_token,
        refresh_token: tokenBundle.refresh_token,
        expires_at: tokenBundle.expires_in
          ? new Date(Date.now() + tokenBundle.expires_in * 1000).toISOString()
          : undefined,
        scope: tokenBundle.scope,
      }),
    );

    const { data: storeRaw, error } = await supabase.rpc("store_companion_microsoft365_oauth_connection", {
      p_encrypted_token: encrypted,
      p_approved_scopes: [...MICROSOFT365_OAUTH_SCOPES],
      p_account_label: accountLabel,
    });

    cookieStore.delete(MICROSOFT365_OAUTH_COOKIE);

    if (error) {
      return NextResponse.redirect(
        new URL("/app/settings/integrations?microsoft365=store_failed", request.url),
      );
    }

    const storeResult = (storeRaw ?? {}) as { ok?: boolean };
    if (!storeResult.ok) {
      return NextResponse.redirect(
        new URL("/app/settings/integrations?microsoft365=store_failed", request.url),
      );
    }

    return NextResponse.redirect(
      new URL("/app/settings/integrations?microsoft365=connected", request.url),
    );
  } catch {
    return NextResponse.redirect(
      new URL("/app/settings/integrations?microsoft365=callback_failed", request.url),
    );
  }
}

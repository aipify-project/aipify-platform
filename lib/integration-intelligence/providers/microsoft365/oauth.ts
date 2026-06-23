import { createHash, randomBytes } from "node:crypto";
import {
  MICROSOFT365_OAUTH_AUTHORIZE_URL,
  MICROSOFT365_OAUTH_SCOPES,
} from "./connect-capabilities-audit";

export function createMicrosoft365OAuthCodeVerifier(): string {
  return randomBytes(32).toString("base64url");
}

export function createMicrosoft365OAuthCodeChallenge(codeVerifier: string): string {
  return createHash("sha256").update(codeVerifier).digest("base64url");
}

export function buildMicrosoft365OAuthAuthorizeUrl(input: {
  client_id: string;
  redirect_uri: string;
  state: string;
  code_challenge: string;
}): string {
  const params = new URLSearchParams({
    client_id: input.client_id,
    redirect_uri: input.redirect_uri,
    response_type: "code",
    scope: MICROSOFT365_OAUTH_SCOPES.join(" "),
    state: input.state,
    code_challenge: input.code_challenge,
    code_challenge_method: "S256",
    response_mode: "query",
  });
  return `${MICROSOFT365_OAUTH_AUTHORIZE_URL}?${params.toString()}`;
}

export function parseMicrosoft365OAuthTokenPayload(raw: string): {
  access_token: string;
  refresh_token?: string;
  expires_at?: string;
  scope?: string;
} | null {
  try {
    const parsed = JSON.parse(raw) as Record<string, unknown>;
    const accessToken = typeof parsed.access_token === "string" ? parsed.access_token : null;
    if (!accessToken) return null;
    const expiresIn = typeof parsed.expires_in === "number" ? parsed.expires_in : null;
    return {
      access_token: accessToken,
      refresh_token:
        typeof parsed.refresh_token === "string" ? parsed.refresh_token : undefined,
      expires_at: expiresIn
        ? new Date(Date.now() + expiresIn * 1000).toISOString()
        : typeof parsed.expires_at === "string"
          ? parsed.expires_at
          : undefined,
      scope: typeof parsed.scope === "string" ? parsed.scope : undefined,
    };
  } catch {
    return null;
  }
}

export function serializeMicrosoft365OAuthTokenPayload(input: {
  access_token: string;
  refresh_token?: string;
  expires_at?: string;
  scope?: string;
}): string {
  return JSON.stringify(input);
}

export function getMicrosoft365OAuthEnv(): {
  client_id: string;
  client_secret: string;
  redirect_uri: string;
} | null {
  const clientId = process.env.MICROSOFT365_OAUTH_CLIENT_ID?.trim();
  const clientSecret = process.env.MICROSOFT365_OAUTH_CLIENT_SECRET?.trim();
  const redirectUri = process.env.MICROSOFT365_OAUTH_REDIRECT_URI?.trim();
  if (!clientId || !clientSecret || !redirectUri) return null;
  return { client_id: clientId, client_secret: clientSecret, redirect_uri: redirectUri };
}

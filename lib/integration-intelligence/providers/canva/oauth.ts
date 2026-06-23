import { createHash, randomBytes } from "node:crypto";
import {
  CANVA_HANDOFF_OAUTH_SCOPES,
  CANVA_OAUTH_AUTHORIZE_URL,
} from "./connect-capabilities-audit";

export function createCanvaOAuthCodeVerifier(): string {
  return randomBytes(32).toString("base64url");
}

export function createCanvaOAuthCodeChallenge(codeVerifier: string): string {
  return createHash("sha256").update(codeVerifier).digest("base64url");
}

export function buildCanvaOAuthAuthorizeUrl(input: {
  client_id: string;
  redirect_uri: string;
  state: string;
  code_challenge: string;
}): string {
  const params = new URLSearchParams({
    client_id: input.client_id,
    redirect_uri: input.redirect_uri,
    response_type: "code",
    scope: CANVA_HANDOFF_OAUTH_SCOPES.join(" "),
    state: input.state,
    code_challenge: input.code_challenge,
    code_challenge_method: "S256",
  });
  return `${CANVA_OAUTH_AUTHORIZE_URL}?${params.toString()}`;
}

export function parseCanvaOAuthTokenPayload(raw: string): {
  access_token: string;
  refresh_token?: string;
  expires_at?: string;
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
    };
  } catch {
    return null;
  }
}

export function serializeCanvaOAuthTokenPayload(input: {
  access_token: string;
  refresh_token?: string;
  expires_at?: string;
}): string {
  return JSON.stringify(input);
}

export function getCanvaOAuthEnv(): {
  client_id: string;
  client_secret: string;
  redirect_uri: string;
} | null {
  const clientId = process.env.CANVA_CONNECT_CLIENT_ID?.trim();
  const clientSecret = process.env.CANVA_CONNECT_CLIENT_SECRET?.trim();
  const redirectUri = process.env.CANVA_CONNECT_REDIRECT_URI?.trim();
  if (!clientId || !clientSecret || !redirectUri) return null;
  return { client_id: clientId, client_secret: clientSecret, redirect_uri: redirectUri };
}

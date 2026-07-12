import "server-only";

import { createHmac, randomBytes, timingSafeEqual } from "node:crypto";

export const WEBSITE_KOMPIS_EMBED_SESSION_HEADER = "x-aipify-embed-session" as const;
export const WEBSITE_KOMPIS_EMBED_SESSION_TTL_SECONDS = 600;

export type WebsiteKompisEmbedSessionClaims = {
  v: 1;
  installId: string;
  domain: string;
  tenantId: string;
  iat: number;
  exp: number;
  jti: string;
};

export type WebsiteKompisEmbedSessionIssueResult =
  | { ok: true; token: string; expiresAt: number }
  | { ok: false; reason: "secret_missing" };

export type WebsiteKompisEmbedSessionVerifyResult =
  | { ok: true; claims: WebsiteKompisEmbedSessionClaims }
  | {
      ok: false;
      reason: "secret_missing" | "malformed" | "invalid_signature" | "expired" | "invalid_claims";
    };

function resolveEmbedSessionSecret(): string | null {
  const dedicated = process.env.WEBSITE_KOMPIS_EMBED_SESSION_SECRET?.trim();
  if (dedicated) return dedicated;
  const cron = process.env.CRON_SECRET?.trim();
  return cron || null;
}

function encodeSegment(value: unknown): string {
  return Buffer.from(JSON.stringify(value), "utf8").toString("base64url");
}

function decodeSegment<T>(segment: string): T | null {
  try {
    const json = Buffer.from(segment, "base64url").toString("utf8");
    return JSON.parse(json) as T;
  } catch {
    return null;
  }
}

function signSegment(segment: string, secret: string): string {
  return createHmac("sha256", secret).update(segment).digest("base64url");
}

function isValidClaims(value: unknown): value is WebsiteKompisEmbedSessionClaims {
  if (!value || typeof value !== "object") return false;
  const record = value as Record<string, unknown>;
  return (
    record.v === 1 &&
    typeof record.installId === "string" &&
    typeof record.domain === "string" &&
    typeof record.tenantId === "string" &&
    typeof record.iat === "number" &&
    typeof record.exp === "number" &&
    typeof record.jti === "string"
  );
}

export function issueWebsiteKompisEmbedSession(input: {
  installId: string;
  domain: string;
  tenantId: string;
  nowSeconds?: number;
}): WebsiteKompisEmbedSessionIssueResult {
  const secret = resolveEmbedSessionSecret();
  if (!secret) {
    return { ok: false, reason: "secret_missing" };
  }

  const nowSeconds = input.nowSeconds ?? Math.floor(Date.now() / 1000);
  const claims: WebsiteKompisEmbedSessionClaims = {
    v: 1,
    installId: input.installId.trim().toLowerCase(),
    domain: input.domain.trim().toLowerCase(),
    tenantId: input.tenantId.trim(),
    iat: nowSeconds,
    exp: nowSeconds + WEBSITE_KOMPIS_EMBED_SESSION_TTL_SECONDS,
    jti: randomBytes(12).toString("hex"),
  };

  const payloadSegment = encodeSegment(claims);
  const signature = signSegment(payloadSegment, secret);
  return {
    ok: true,
    token: `${payloadSegment}.${signature}`,
    expiresAt: claims.exp,
  };
}

export function verifyWebsiteKompisEmbedSession(
  token: string | null | undefined,
  nowSeconds?: number,
): WebsiteKompisEmbedSessionVerifyResult {
  const secret = resolveEmbedSessionSecret();
  if (!secret) {
    return { ok: false, reason: "secret_missing" };
  }

  const trimmed = token?.trim();
  if (!trimmed) {
    return { ok: false, reason: "malformed" };
  }

  const parts = trimmed.split(".");
  if (parts.length !== 2 || !parts[0] || !parts[1]) {
    return { ok: false, reason: "malformed" };
  }

  const expectedSignature = signSegment(parts[0], secret);
  const provided = Buffer.from(parts[1], "utf8");
  const expected = Buffer.from(expectedSignature, "utf8");
  if (provided.length !== expected.length || !timingSafeEqual(provided, expected)) {
    return { ok: false, reason: "invalid_signature" };
  }

  const claims = decodeSegment<WebsiteKompisEmbedSessionClaims>(parts[0]);
  if (!isValidClaims(claims)) {
    return { ok: false, reason: "invalid_claims" };
  }

  const now = nowSeconds ?? Math.floor(Date.now() / 1000);
  if (claims.exp <= now) {
    return { ok: false, reason: "expired" };
  }

  return { ok: true, claims };
}

export function embedSessionMatchesInstallContext(input: {
  claims: WebsiteKompisEmbedSessionClaims;
  installId: string;
  domain: string;
  tenantId: string;
}): boolean {
  return (
    input.claims.installId === input.installId.trim().toLowerCase() &&
    input.claims.domain === input.domain.trim().toLowerCase() &&
    input.claims.tenantId === input.tenantId.trim()
  );
}

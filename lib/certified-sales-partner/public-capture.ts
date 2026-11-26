/**
 * CSP public attribution capture helpers — pure + thin client wrappers.
 * Core RPC `csp_capture_public_attribution_click` is PREPARED_ONLY until Staging apply.
 */
import { createHash, randomBytes } from "node:crypto";
import { isBotLikeUserAgent, isCspLinkCode } from "./attribution-policy";

export const CSP_ATTRIBUTION_COOKIE = "aipify_csp_ref";
export const CSP_SESSION_COOKIE = "aipify_csp_session";
export const CSP_CAPTURE_RPC = "csp_capture_public_attribution_click" as const;
export const CSP_ATTRIBUTE_REGISTRATION_RPC = "csp_attribute_customer_registration" as const;

/** In-memory rate limit for public capture (per process). Fail-closed beyond threshold. */
const RATE_WINDOW_MS = 60_000;
const RATE_MAX_PER_KEY = 30;
const rateBuckets = new Map<string, { count: number; resetAt: number }>();

export function hashCspSessionKey(sessionKey: string): string {
  return createHash("sha256").update(`csp-session:${sessionKey}`).digest("hex").slice(0, 48);
}

export function newCspSessionKey(): string {
  return randomBytes(16).toString("hex");
}

export function allowCspCaptureRate(key: string, now = Date.now()): boolean {
  const bucket = rateBuckets.get(key);
  if (!bucket || now >= bucket.resetAt) {
    rateBuckets.set(key, { count: 1, resetAt: now + RATE_WINDOW_MS });
    return true;
  }
  if (bucket.count >= RATE_MAX_PER_KEY) return false;
  bucket.count += 1;
  return true;
}

export type CspPublicCaptureInput = {
  code: string;
  productKey: string;
  sessionKey: string;
  userAgent?: string | null;
  rateKey?: string;
};

export type CspPublicCaptureDecision =
  | { ok: false; error: "bot_like" | "invalid_link_code" | "product_key_required" | "rate_limited" }
  | {
      ok: true;
      payload: { code: string; productKey: string; sessionHash: string };
    };

export function decideCspPublicCapture(input: CspPublicCaptureInput): CspPublicCaptureDecision {
  if (isBotLikeUserAgent(input.userAgent)) return { ok: false, error: "bot_like" };
  if (!isCspLinkCode(input.code)) return { ok: false, error: "invalid_link_code" };
  const productKey = String(input.productKey ?? "").trim().toLowerCase().replace(/-/g, "_");
  if (!productKey) return { ok: false, error: "product_key_required" };
  const rateKey = input.rateKey ?? `${input.code}:${productKey}`;
  if (!allowCspCaptureRate(rateKey)) return { ok: false, error: "rate_limited" };
  const sessionKey = String(input.sessionKey ?? "").trim() || newCspSessionKey();
  return {
    ok: true,
    payload: {
      code: input.code,
      productKey,
      sessionHash: hashCspSessionKey(sessionKey),
    },
  };
}

export type CspAttributionCookie = {
  code: string;
  productKey: string;
  sessionKey: string;
  firstTouchAt: string;
  lastTouchAt: string;
};

export function serializeCspAttributionCookie(value: CspAttributionCookie): string {
  return Buffer.from(JSON.stringify(value), "utf8").toString("base64url");
}

export function parseCspAttributionCookie(raw: string | null | undefined): CspAttributionCookie | null {
  if (!raw) return null;
  try {
    const parsed = JSON.parse(Buffer.from(raw, "base64url").toString("utf8")) as Partial<CspAttributionCookie>;
    if (!isCspLinkCode(parsed.code ?? null)) return null;
    if (typeof parsed.productKey !== "string" || !parsed.productKey) return null;
    if (typeof parsed.sessionKey !== "string" || parsed.sessionKey.length < 8) return null;
    return {
      code: parsed.code!,
      productKey: parsed.productKey,
      sessionKey: parsed.sessionKey,
      firstTouchAt: typeof parsed.firstTouchAt === "string" ? parsed.firstTouchAt : new Date().toISOString(),
      lastTouchAt: typeof parsed.lastTouchAt === "string" ? parsed.lastTouchAt : new Date().toISOString(),
    };
  } catch {
    return null;
  }
}

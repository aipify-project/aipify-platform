import { createHash, randomBytes } from "node:crypto";

/** 32 bytes, 256 bits, base64url without padding. */
export const REPLY_TOKEN_BYTES = 32;
const OPAQUE_TOKEN = /^[A-Za-z0-9_-]{43}$/;
const SMTP_LOCAL_PART_LIMIT = 64;

/**
 * Opaque reply token. The address carries only this secret.
 * The database binds the hash to the send, the partner, the tenant, and the expiry.
 * A shorter signed bundle cannot hold those identifiers and a 256-bit authenticator
 * inside a 64-octet local part, so the token is not a truncated signature.
 */
export function createReplyToken(secret: string): string {
  if (secret.trim().length < 16) {
    throw new Error("token_secret_too_short");
  }
  return randomBytes(REPLY_TOKEN_BYTES).toString("base64url");
}

export function replyTokenLocalPart(token: string): string {
  return `reply+${token}`;
}

export function replyTokenFitsSmtp(token: string): boolean {
  return replyTokenLocalPart(token).length <= SMTP_LOCAL_PART_LIMIT && OPAQUE_TOKEN.test(token);
}

export function inspectReplyToken(
  secret: string,
  token: string,
): { ok: true } | { ok: false; error: "invalid" } {
  if (secret.trim().length < 16 || !OPAQUE_TOKEN.test(token)) return { ok: false, error: "invalid" };
  return { ok: true };
}

export function hashReplyToken(token: string): string {
  return createHash("sha256").update(token).digest("hex");
}

/** Pulls the opaque token from a Reply-To local part `reply+{token}@domain`. */
export function extractReplyToken(value: string): string | null {
  const match = value.match(/reply\+([A-Za-z0-9_-]{43})@/i);
  const token = match?.[1] ?? "";
  return OPAQUE_TOKEN.test(token) ? token : null;
}

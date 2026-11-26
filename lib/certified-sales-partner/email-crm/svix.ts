import { createHmac, timingSafeEqual } from "node:crypto";

const TOLERANCE_MS = 5 * 60 * 1000;

/**
 * Resend inbound webhooks are Svix signatures.
 * Signed content is `${svix-id}.${svix-timestamp}.${rawBody}`.
 * The secret is the `whsec_` value, base64-decoded after the prefix.
 */
export function verifyResendSvixSignature(input: {
  secret: string;
  body: string;
  id: string | null;
  timestamp: string | null;
  signature: string | null;
  now?: number;
}): boolean {
  const secret = input.secret.trim();
  if (!secret || !input.id || !input.timestamp || !input.signature) return false;
  const ts = Number(input.timestamp);
  if (!Number.isFinite(ts)) return false;
  const now = input.now ?? Date.now();
  if (Math.abs(now - ts * 1000) > TOLERANCE_MS) return false;
  const raw = secret.startsWith("whsec_") ? secret.slice("whsec_".length) : secret;
  let key: Buffer;
  try {
    key = Buffer.from(raw, "base64");
  } catch {
    return false;
  }
  if (key.length === 0) return false;
  const expected = createHmac("sha256", key).update(`${input.id}.${input.timestamp}.${input.body}`).digest("base64");
  const parts = input.signature.split(" ").filter(Boolean);
  for (const part of parts) {
    const value = part.startsWith("v1,") ? part.slice(3) : part;
    const a = Buffer.from(expected);
    const b = Buffer.from(value);
    if (a.length === b.length && timingSafeEqual(a, b)) return true;
  }
  return false;
}

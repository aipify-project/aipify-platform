import { createHash, createHmac, timingSafeEqual } from "node:crypto";

export type ReplyTokenPayload = {
  v: 1;
  sendId: string;
  partnerId: string;
  tenantId: string;
  productKey: string;
  recipient: string;
  exp: number;
};

const TOKEN_TTL_MS = 1000 * 60 * 60 * 24 * 120;

function b64url(value: Buffer | string): string {
  return Buffer.from(value).toString("base64url");
}

export function signReplyToken(secret: string, payload: ReplyTokenPayload): string {
  const body = b64url(JSON.stringify(payload));
  const sig = createHmac("sha256", secret).update(body).digest("base64url");
  return `${body}.${sig}`;
}

export function createReplyToken(
  input: Omit<ReplyTokenPayload, "v" | "exp">,
  secret: string,
  now = Date.now(),
): string {
  return signReplyToken(secret, { ...input, v: 1, exp: now + TOKEN_TTL_MS });
}

export function inspectReplyToken(
  secret: string,
  token: string,
  now = Date.now(),
):
  | { ok: true; payload: ReplyTokenPayload }
  | { ok: false; error: "invalid" }
  | { ok: false; error: "expired"; payload: ReplyTokenPayload } {
  if (!secret || secret.length < 16) return { ok: false, error: "invalid" };
  const parts = token.split(".");
  if (parts.length !== 2 || !parts[0] || !parts[1]) return { ok: false, error: "invalid" };
  const expected = createHmac("sha256", secret).update(parts[0]).digest("base64url");
  const given = Buffer.from(parts[1]);
  const expBuf = Buffer.from(expected);
  if (given.length !== expBuf.length || !timingSafeEqual(given, expBuf)) return { ok: false, error: "invalid" };
  try {
    const payload = JSON.parse(Buffer.from(parts[0], "base64url").toString("utf8")) as ReplyTokenPayload;
    if (payload.v !== 1 || !payload.sendId || !payload.partnerId || payload.tenantId !== "aipify_internal") {
      return { ok: false, error: "invalid" };
    }
    if (payload.exp < now) return { ok: false, error: "expired", payload };
    return { ok: true, payload };
  } catch {
    return { ok: false, error: "invalid" };
  }
}

export function hashReplyToken(token: string): string {
  return createHash("sha256").update(token).digest("hex");
}

/** Pulls the opaque token from a Reply-To local part `reply+{token}@domain`. */
export function extractReplyToken(value: string): string | null {
  const match = value.match(/reply\+([A-Za-z0-9_-]+\.[A-Za-z0-9_-]+)@/i);
  return match?.[1] ?? null;
}

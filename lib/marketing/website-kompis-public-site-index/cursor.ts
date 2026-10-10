import { createHash } from "node:crypto";

export const WEBSITE_KOMPIS_PUBLIC_SITE_INDEX_CURSOR_VERSION = 1 as const;
/** Continuation cursors expire; operator must rediscover after TTL. */
export const WEBSITE_KOMPIS_PUBLIC_SITE_INDEX_CURSOR_TTL_MS = 24 * 60 * 60 * 1000;

export type PublicSiteIndexCursorPayload = {
  v: typeof WEBSITE_KOMPIS_PUBLIC_SITE_INDEX_CURSOR_VERSION;
  tenantId: string;
  installId: string;
  verifiedHost: string;
  discoveryFingerprint: string;
  offset: number;
  batchSize: number;
  issuedAt: number;
  /** Integrity digest bound to trust + fingerprint + offset (anti-tamper). */
  dig: string;
};

export type CursorValidationResult =
  | { ok: true; cursor: PublicSiteIndexCursorPayload }
  | {
      ok: false;
      reason:
        | "invalid_cursor"
        | "cursor_expired"
        | "cursor_trust_mismatch"
        | "cursor_fingerprint_mismatch"
        | "cursor_offset_invalid"
        | "cursor_tampered";
    };

function digestCursor(parts: Omit<PublicSiteIndexCursorPayload, "dig">): string {
  // Structural integrity without a new secret: bind fields the server re-validates
  // against operator trust + rediscovery fingerprint. Not a substitute for TLS.
  const material = [
    String(parts.v),
    parts.tenantId,
    parts.installId,
    parts.verifiedHost,
    parts.discoveryFingerprint,
    String(parts.offset),
    String(parts.batchSize),
    String(parts.issuedAt),
    "aipify-public-site-index-cursor-v1",
  ].join("|");
  return createHash("sha256").update(material).digest("hex");
}

export function encodePublicSiteIndexCursor(
  input: Omit<PublicSiteIndexCursorPayload, "v" | "dig">,
): string {
  const payload: Omit<PublicSiteIndexCursorPayload, "dig"> = {
    v: WEBSITE_KOMPIS_PUBLIC_SITE_INDEX_CURSOR_VERSION,
    tenantId: input.tenantId,
    installId: input.installId,
    verifiedHost: input.verifiedHost.trim().toLowerCase(),
    discoveryFingerprint: input.discoveryFingerprint,
    offset: input.offset,
    batchSize: input.batchSize,
    issuedAt: input.issuedAt,
  };
  const full: PublicSiteIndexCursorPayload = {
    ...payload,
    dig: digestCursor(payload),
  };
  return Buffer.from(JSON.stringify(full), "utf8").toString("base64url");
}

export function decodePublicSiteIndexCursor(
  raw: string,
): PublicSiteIndexCursorPayload | null {
  try {
    const json = Buffer.from(raw, "base64url").toString("utf8");
    const parsed = JSON.parse(json) as Partial<PublicSiteIndexCursorPayload>;
    if (
      parsed.v !== WEBSITE_KOMPIS_PUBLIC_SITE_INDEX_CURSOR_VERSION ||
      typeof parsed.tenantId !== "string" ||
      typeof parsed.installId !== "string" ||
      typeof parsed.verifiedHost !== "string" ||
      typeof parsed.discoveryFingerprint !== "string" ||
      typeof parsed.offset !== "number" ||
      typeof parsed.batchSize !== "number" ||
      typeof parsed.issuedAt !== "number" ||
      typeof parsed.dig !== "string"
    ) {
      return null;
    }
    return parsed as PublicSiteIndexCursorPayload;
  } catch {
    return null;
  }
}

export function validatePublicSiteIndexCursor(input: {
  rawCursor: string;
  tenantId: string;
  installId: string;
  verifiedHost: string;
  discoveryFingerprint: string;
  discoveredCount: number;
  nowMs?: number;
}): CursorValidationResult {
  const cursor = decodePublicSiteIndexCursor(input.rawCursor);
  if (!cursor) return { ok: false, reason: "invalid_cursor" };

  const expectedDig = digestCursor({
    v: cursor.v,
    tenantId: cursor.tenantId,
    installId: cursor.installId,
    verifiedHost: cursor.verifiedHost,
    discoveryFingerprint: cursor.discoveryFingerprint,
    offset: cursor.offset,
    batchSize: cursor.batchSize,
    issuedAt: cursor.issuedAt,
  });
  if (expectedDig !== cursor.dig) {
    return { ok: false, reason: "cursor_tampered" };
  }

  const now = input.nowMs ?? Date.now();
  if (
    cursor.issuedAt > now + 60_000 ||
    now - cursor.issuedAt > WEBSITE_KOMPIS_PUBLIC_SITE_INDEX_CURSOR_TTL_MS
  ) {
    return { ok: false, reason: "cursor_expired" };
  }

  const host = input.verifiedHost.trim().toLowerCase();
  if (
    cursor.tenantId !== input.tenantId ||
    cursor.installId !== input.installId ||
    cursor.verifiedHost !== host
  ) {
    return { ok: false, reason: "cursor_trust_mismatch" };
  }

  if (cursor.discoveryFingerprint !== input.discoveryFingerprint) {
    return { ok: false, reason: "cursor_fingerprint_mismatch" };
  }

  if (
    !Number.isInteger(cursor.offset) ||
    cursor.offset < 0 ||
    cursor.offset > input.discoveredCount
  ) {
    return { ok: false, reason: "cursor_offset_invalid" };
  }

  return { ok: true, cursor };
}

/**
 * Partners portal profile photo — shared validation + path helpers.
 *
 * The image bytes live in private Storage (never in the auth token); auth
 * `user_metadata.avatar_url` only holds a short same-origin pointer so sessions stay small.
 */

export const PARTNERS_AVATAR_MAX_BYTES = 512 * 1024;
export const PARTNERS_AVATAR_API_PATH = "/api/partners/profile/avatar";
export const PARTNERS_AVATAR_STORAGE_PREFIX = "partner-avatars";

export const PARTNERS_AVATAR_ALLOWED_MIME = ["image/png", "image/jpeg", "image/webp"] as const;
export type PartnersAvatarMime = (typeof PARTNERS_AVATAR_ALLOWED_MIME)[number];

export type PartnersAvatarValidation =
  | { ok: true; mime: PartnersAvatarMime; byteSize: number }
  | { ok: false; code: "empty" | "too_large" | "unsupported_type" };

export function isPartnersAvatarMime(value: string): value is PartnersAvatarMime {
  return (PARTNERS_AVATAR_ALLOWED_MIME as readonly string[]).includes(value);
}

/** Detect the real image type from magic bytes — never trust the declared MIME alone. */
export function detectPartnersAvatarMime(bytes: Uint8Array): PartnersAvatarMime | null {
  if (
    bytes.length >= 8 &&
    bytes[0] === 0x89 &&
    bytes[1] === 0x50 &&
    bytes[2] === 0x4e &&
    bytes[3] === 0x47 &&
    bytes[4] === 0x0d &&
    bytes[5] === 0x0a &&
    bytes[6] === 0x1a &&
    bytes[7] === 0x0a
  ) {
    return "image/png";
  }
  if (bytes.length >= 3 && bytes[0] === 0xff && bytes[1] === 0xd8 && bytes[2] === 0xff) {
    return "image/jpeg";
  }
  if (
    bytes.length >= 12 &&
    bytes[0] === 0x52 &&
    bytes[1] === 0x49 &&
    bytes[2] === 0x46 &&
    bytes[3] === 0x46 &&
    bytes[8] === 0x57 &&
    bytes[9] === 0x45 &&
    bytes[10] === 0x42 &&
    bytes[11] === 0x50
  ) {
    return "image/webp";
  }
  return null;
}

export function validatePartnersAvatarBytes(
  bytes: Uint8Array,
  declaredMime: string,
): PartnersAvatarValidation {
  if (bytes.length === 0) return { ok: false, code: "empty" };
  if (bytes.length > PARTNERS_AVATAR_MAX_BYTES) return { ok: false, code: "too_large" };
  const detected = detectPartnersAvatarMime(bytes);
  if (!detected || !isPartnersAvatarMime(declaredMime) || detected !== declaredMime) {
    return { ok: false, code: "unsupported_type" };
  }
  return { ok: true, mime: detected, byteSize: bytes.length };
}

export function buildPartnersAvatarStoragePath(authUserId: string): string {
  return `${PARTNERS_AVATAR_STORAGE_PREFIX}/${authUserId}/avatar`;
}

/** Cache-busting same-origin pointer stored in `user_metadata.avatar_url`. */
export function buildPartnersAvatarPointer(version: number = Date.now()): string {
  return `${PARTNERS_AVATAR_API_PATH}?v=${version}`;
}

/** Only our own pointer is ever rendered — arbitrary metadata URLs are ignored. */
export function resolvePartnersAvatarPointer(value: unknown): string | null {
  if (typeof value !== "string") return null;
  return /^\/api\/partners\/profile\/avatar\?v=\d{1,16}$/.test(value) ? value : null;
}

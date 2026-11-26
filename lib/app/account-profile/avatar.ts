/**
 * Customer APP profile photo — validation + path helpers.
 * Bytes live in private Storage; auth `user_metadata.avatar_url` holds a same-origin pointer.
 */

export const CUSTOMER_AVATAR_MAX_BYTES = 512 * 1024;
export const CUSTOMER_AVATAR_API_PATH = "/api/app/account-profile/avatar";
export const CUSTOMER_AVATAR_STORAGE_PREFIX = "customer-avatars";

export const CUSTOMER_AVATAR_ALLOWED_MIME = ["image/png", "image/jpeg", "image/webp"] as const;
export type CustomerAvatarMime = (typeof CUSTOMER_AVATAR_ALLOWED_MIME)[number];

export type CustomerAvatarValidation =
  | { ok: true; mime: CustomerAvatarMime; byteSize: number }
  | { ok: false; code: "empty" | "too_large" | "unsupported_type" };

export function isCustomerAvatarMime(value: string): value is CustomerAvatarMime {
  return (CUSTOMER_AVATAR_ALLOWED_MIME as readonly string[]).includes(value);
}

/** Detect the real image type from magic bytes — never trust the declared MIME alone. */
export function detectCustomerAvatarMime(bytes: Uint8Array): CustomerAvatarMime | null {
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

export function validateCustomerAvatarBytes(
  bytes: Uint8Array,
  declaredMime: string,
): CustomerAvatarValidation {
  if (bytes.length === 0) return { ok: false, code: "empty" };
  if (bytes.length > CUSTOMER_AVATAR_MAX_BYTES) return { ok: false, code: "too_large" };
  const detected = detectCustomerAvatarMime(bytes);
  if (!detected || !isCustomerAvatarMime(declaredMime) || detected !== declaredMime) {
    return { ok: false, code: "unsupported_type" };
  }
  return { ok: true, mime: detected, byteSize: bytes.length };
}

export function buildCustomerAvatarStoragePath(authUserId: string): string {
  return `${CUSTOMER_AVATAR_STORAGE_PREFIX}/${authUserId}/avatar`;
}

export function buildCustomerAvatarPointer(version: number = Date.now()): string {
  return `${CUSTOMER_AVATAR_API_PATH}?v=${version}`;
}

/** Only our own pointer is ever rendered — arbitrary metadata URLs are ignored for APP avatars. */
export function resolveCustomerAvatarPointer(value: unknown): string | null {
  if (typeof value !== "string") return null;
  if (/^\/api\/app\/account-profile\/avatar\?v=\d{1,16}$/.test(value)) return value;
  // Legacy absolute https avatars still display until the user uploads a new one.
  if (/^https:\/\//i.test(value.trim())) return value.trim();
  return null;
}

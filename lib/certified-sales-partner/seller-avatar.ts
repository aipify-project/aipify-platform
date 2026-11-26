/**
 * Pure helpers for seller avatars. No React, no network.
 *
 * Avatars are read from auth `user_metadata` (`avatar_url` / `profile_image_url` / `picture`) — no SQL needed.
 * The seller portal stores a same-origin pointer (`/api/partners/profile/avatar?v=<n>`) that only serves the
 * signed-in seller's own photo, so Platform Admin maps it to the admin-scoped route
 * (`/api/platform/sellers/partners/<id>/avatar?v=<n>`) instead of rendering the pointer directly.
 */

const AVATAR_METADATA_KEYS = ["avatar_url", "profile_image_url", "picture"] as const;
const SELLER_PORTAL_POINTER_RE = /^\/api\/partners\/profile\/avatar\?v=(\d{1,16})$/;
const ADMIN_AVATAR_PATH_RE = /^\/api\/platform\/sellers\/partners\/[0-9a-f-]{36}\/avatar\?v=\d{1,16}$/i;

/** Admin-scoped avatar URL for a seller whose photo lives in private Storage. */
export function adminSellerAvatarPath(partnerId: string, version: string | number): string {
  return `/api/platform/sellers/partners/${partnerId}/avatar?v=${version}`;
}

/**
 * Value that is safe to render as an `<img src>` in Platform Admin:
 * the admin avatar route, or an absolute https URL. Everything else (including the seller-portal pointer
 * without a partner context, `javascript:`/`data:` URLs) is rejected.
 */
export function safeAvatarUrl(value: unknown, partnerId?: string): string | null {
  if (typeof value !== "string") return null;
  const trimmed = value.trim();
  if (!trimmed) return null;

  const pointer = SELLER_PORTAL_POINTER_RE.exec(trimmed);
  if (pointer) return partnerId ? adminSellerAvatarPath(partnerId, pointer[1]) : null;
  if (ADMIN_AVATAR_PATH_RE.test(trimmed)) return trimmed;

  try {
    const url = new URL(trimmed);
    return url.protocol === "https:" ? url.toString() : null;
  } catch {
    return null;
  }
}

/** First usable avatar URL from auth `user_metadata`; `null` when none is stored. */
export function extractAvatarUrlFromMetadata(metadata: unknown, partnerId?: string): string | null {
  if (!metadata || typeof metadata !== "object" || Array.isArray(metadata)) return null;
  const meta = metadata as Record<string, unknown>;
  for (const key of AVATAR_METADATA_KEYS) {
    const url = safeAvatarUrl(meta[key], partnerId);
    if (url) return url;
  }
  return null;
}

/** Up to two initials for the avatar fallback; never empty. */
export function sellerInitials(name: string | null | undefined, fallback = "?"): string {
  const parts = (name ?? "")
    .trim()
    .split(/\s+/)
    .filter(Boolean);
  if (parts.length === 0) return fallback;
  const first = Array.from(parts[0])[0] ?? "";
  const last = parts.length > 1 ? (Array.from(parts[parts.length - 1])[0] ?? "") : "";
  const initials = `${first}${last}`.toUpperCase();
  return initials || fallback;
}

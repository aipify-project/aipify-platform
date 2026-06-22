/** Unonight platform snapshot — read-only live platform metadata (separate from connection V1). */

import { UNONIGHT_CANONICAL_BASE_URL } from "@/lib/unonight/connection/base-url";

export const UNONIGHT_PLATFORM_SNAPSHOT_PATH = "/api/aipify/v1/platform-snapshot";

export const UNONIGHT_PLATFORM_METADATA_SCOPE = "platform.metadata.read";

export const UNONIGHT_PLATFORM_SNAPSHOT_TIMEOUT_MS = 12_000;

/** Public module keys seeded for Unonight platform snapshot reference — not invented at runtime. */
export const UNONIGHT_PUBLIC_MODULE_KEYS = [
  "chat",
  "marketplace",
  "wishlist",
  "gifts",
  "verification",
  "rewards",
] as const;

export const UNONIGHT_SNAPSHOT_ENVIRONMENTS = ["production", "staging", "maintenance"] as const;

export const UNONIGHT_SNAPSHOT_STATUSES = ["available", "degraded", "maintenance"] as const;

export const UNONIGHT_SNAPSHOT_DEFAULT_BASE_URL = UNONIGHT_CANONICAL_BASE_URL;

const SAFE_MODULE_KEY = /^[a-z][a-z0-9_]{0,48}$/;
const SAFE_LOCALE = /^[a-z]{2}(?:-[a-z]{2})?$/i;

export function isSafePublicModuleKey(value: string): boolean {
  const normalized = value.trim().toLowerCase();
  if (!normalized || !SAFE_MODULE_KEY.test(normalized)) return false;
  if (normalized.startsWith("_")) return false;
  if (/(internal|demo|planned|test)/.test(normalized)) return false;
  return true;
}

export function isSafeLocaleCode(value: string): boolean {
  const normalized = value.trim().toLowerCase();
  return Boolean(normalized) && SAFE_LOCALE.test(normalized);
}

export function buildUnonightPlatformSnapshotUrl(baseUrl: string): string {
  return `${baseUrl.replace(/\/+$/, "")}${UNONIGHT_PLATFORM_SNAPSHOT_PATH}`;
}

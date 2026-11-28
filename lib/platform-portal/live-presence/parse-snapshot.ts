import type { TrafficCount } from "@/lib/platform-portal/traffic-status";
import { PLATFORM_LIVE_PRESENCE_TTL_SECONDS } from "./constants";

export type PlatformLivePresenceSnapshot = {
  checkedAt: string;
  freshnessWindowSeconds: number;
  appCustomersOnline: TrafficCount;
  sellersOnline: TrafficCount;
  signedInUsers: TrafficCount;
  /** True when Core RPC returned a complete snapshot (including zeros). */
  measured: boolean;
};

function asRecord(value: unknown): Record<string, unknown> | null {
  return value && typeof value === "object" && !Array.isArray(value)
    ? (value as Record<string, unknown>)
    : null;
}

function readNonNegativeInt(value: unknown): number | null {
  if (typeof value !== "number" || !Number.isFinite(value) || value < 0) return null;
  return Math.trunc(value);
}

/**
 * Parse admin presence snapshot from Core.
 * Missing or partial fields → measured=false (caller keeps not_measured).
 * Explicit 0 is a valid measured value.
 */
export function parsePlatformLivePresenceSnapshot(
  raw: unknown,
): PlatformLivePresenceSnapshot | null {
  const row = asRecord(raw);
  if (!row) return null;

  const checkedAt =
    typeof row.checked_at === "string"
      ? row.checked_at.trim()
      : typeof row.checkedAt === "string"
        ? row.checkedAt.trim()
        : "";
  if (!checkedAt || Number.isNaN(Date.parse(checkedAt))) return null;

  const ttl =
    readNonNegativeInt(row.freshness_window_seconds) ??
    readNonNegativeInt(row.freshnessWindowSeconds) ??
    PLATFORM_LIVE_PRESENCE_TTL_SECONDS;

  const app = readNonNegativeInt(
    row.app_customers_online ?? row.appCustomersOnline,
  );
  const sellers = readNonNegativeInt(row.sellers_online ?? row.sellersOnline);
  const signedIn = readNonNegativeInt(row.signed_in_users ?? row.signedInUsers);
  if (app == null || sellers == null || signedIn == null) return null;

  // Integrity: signed-in distinct union cannot be smaller than any single role set.
  if (signedIn < app || signedIn < sellers) return null;

  return {
    checkedAt,
    freshnessWindowSeconds: ttl,
    appCustomersOnline: { state: "value", value: app },
    sellersOnline: { state: "value", value: sellers },
    signedInUsers: { state: "value", value: signedIn },
    measured: true,
  };
}

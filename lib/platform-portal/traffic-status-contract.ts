/**
 * Snapshot contract for the Platform Admin global live status bar.
 * Polling, freshness, and API parse rules live here — not in UI components.
 */

import type { PlatformTrafficStatus, TrafficCount } from "./traffic-status";

/** Visible-tab snapshot poll interval (documented for Agent 4 status bar). */
export const PLATFORM_TRAFFIC_STATUS_POLL_MS = 30_000;

/** Mark last-good snapshot stale after three missed poll windows. */
export const PLATFORM_TRAFFIC_STATUS_STALE_MS = PLATFORM_TRAFFIC_STATUS_POLL_MS * 3;

/** Client fetch timeout — fail closed to last-good or unavailable. */
export const PLATFORM_TRAFFIC_STATUS_FETCH_TIMEOUT_MS = 12_000;

export const PLATFORM_TRAFFIC_STATUS_API_PATH = "/api/platform-portal/traffic-status";

export type TrafficStatusFreshness = "fresh" | "stale" | "unavailable";

function asRecord(value: unknown): Record<string, unknown> | null {
  return value && typeof value === "object" && !Array.isArray(value)
    ? (value as Record<string, unknown>)
    : null;
}

export function parseTrafficCount(value: unknown): TrafficCount | null {
  const row = asRecord(value);
  if (!row) return null;
  if (row.state === "value") {
    if (typeof row.value !== "number" || !Number.isFinite(row.value) || row.value < 0) {
      return null;
    }
    return { state: "value", value: Math.trunc(row.value) };
  }
  if (row.state === "unavailable") {
    if (row.reason === "not_measured" || row.reason === "source_unavailable") {
      return { state: "unavailable", reason: row.reason };
    }
  }
  return null;
}

/**
 * Parse a server snapshot. Never maps null/missing fields to 0.
 * Incomplete payloads return null so the client keeps the last good snapshot.
 */
export function parsePlatformTrafficStatus(raw: unknown): PlatformTrafficStatus | null {
  const row = asRecord(raw);
  if (!row) return null;

  const checkedAt = typeof row.checkedAt === "string" ? row.checkedAt.trim() : "";
  const dayTimeZone = typeof row.dayTimeZone === "string" ? row.dayTimeZone.trim() : "";
  if (!checkedAt || Number.isNaN(Date.parse(checkedAt)) || !dayTimeZone) return null;
  if (row.operational !== "console_responding") return null;

  const newAppCustomersToday = parseTrafficCount(row.newAppCustomersToday);
  const newSellersToday = parseTrafficCount(row.newSellersToday);
  const appCustomersOnline = parseTrafficCount(row.appCustomersOnline);
  const sellersOnline = parseTrafficCount(row.sellersOnline);
  const signedInUsers = parseTrafficCount(row.signedInUsers);
  const visitorsToday = parseTrafficCount(row.visitorsToday);

  if (
    !newAppCustomersToday ||
    !newSellersToday ||
    !appCustomersOnline ||
    !sellersOnline ||
    !signedInUsers ||
    !visitorsToday
  ) {
    return null;
  }

  return {
    checkedAt,
    dayTimeZone,
    operational: "console_responding",
    newAppCustomersToday,
    newSellersToday,
    appCustomersOnline,
    sellersOnline,
    signedInUsers,
    visitorsToday,
  };
}

export function trafficStatusFreshness(
  lastSuccessAtMs: number | null,
  nowMs = Date.now(),
): TrafficStatusFreshness {
  if (lastSuccessAtMs == null) return "unavailable";
  if (nowMs - lastSuccessAtMs > PLATFORM_TRAFFIC_STATUS_STALE_MS) return "stale";
  return "fresh";
}

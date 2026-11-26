/**
 * Pure helpers for the Platform > Selgere ops tables (attribution, leads & sales, audit,
 * commission rates, materials, settings, messages). No React, no i18n, no network.
 * Values Core did not return stay `null` — nothing is estimated or invented.
 */
import type { AipifyStatusKind } from "@/lib/design/status-system";
import { CSP_BACKEND_NOT_APPLIED_ERROR } from "./constants";
import type { PlatformListResult } from "./platform-sellers-lists";

/* ------------------------------ API envelope ------------------------------ */

/** Postgres / PostgREST signals that the CSP tables have not been applied to Core yet. */
export function isCspTableNotAppliedMessage(message: string | undefined): boolean {
  if (!message) return false;
  return /does not exist|PGRST205|PGRST202|42P01|42883|schema cache/i.test(message);
}

/** Maps a loader result onto the fail-closed HTTP envelope. Errors never carry raw DB messages. */
export function buildPlatformListBody<T>(
  result: PlatformListResult<T>,
): { status: number; body: Record<string, unknown> } {
  if (result.kind === "ok") {
    return { status: 200, body: { found: true, rows: result.rows } };
  }
  if (isCspTableNotAppliedMessage(result.detail)) {
    return {
      status: 503,
      body: { found: false, backend_ready: false, error: CSP_BACKEND_NOT_APPLIED_ERROR },
    };
  }
  return { status: 500, body: { found: false, error: "csp_list_load_failed" } };
}

/** `null` when the body is not a `{ found: true, rows: [] }` envelope. */
export function parseOpsRows<T>(body: unknown): T[] | null {
  if (!body || typeof body !== "object" || Array.isArray(body)) return null;
  const rec = body as Record<string, unknown>;
  if (rec.found === false) return null;
  if (!Array.isArray(rec.rows)) return null;
  return rec.rows.filter((r): r is T => !!r && typeof r === "object" && !Array.isArray(r));
}

/* --------------------------------- Search --------------------------------- */

/** Case-insensitive "all words must match" search over the already-translated haystack. */
export function matchesSearch(haystack: ReadonlyArray<string | null | undefined>, query: string): boolean {
  const words = query.trim().toLowerCase().split(/\s+/).filter(Boolean);
  if (words.length === 0) return true;
  const text = haystack
    .filter((v): v is string => typeof v === "string")
    .join(" ")
    .toLowerCase();
  return words.every((w) => text.includes(w));
}

/* ------------------------------- Status kinds ------------------------------ */

export function saleStatusKind(status: string | null): AipifyStatusKind {
  switch (status) {
    case "earned":
    case "paid":
      return "completed";
    case "registered_awaiting_second_payment":
    case "pending_possible":
      return "waiting";
    case "approved_for_payout":
    case "queued_for_payout":
    case "attributed":
      return "information";
    case "reversed":
    case "rejected":
      return "not_allowed";
    default:
      return "information";
  }
}

export function linkActiveKind(active: boolean): AipifyStatusKind {
  return active ? "completed" : "restricted";
}

/* ----------------------------- Audit detail safety ----------------------------- */

const SENSITIVE_KEY = /secret|token|password|passwd|iban|swift|bic|account|bank|card|email|mail|phone|tel|address|key|auth|cookie|ssn|national|salary|signature/i;
const MAX_DETAIL_ENTRIES = 12;
const MAX_VALUE_LENGTH = 160;

export type AuditDetailEntry = { key: string; value: string };

/**
 * Flattens audit detail into primitive key/value pairs, dropping sensitive keys, nested
 * structures and anything that looks like an e-mail address. UI shows business-style key names.
 */
export function sanitizeAuditDetail(detail: Record<string, unknown> | null): AuditDetailEntry[] {
  if (!detail) return [];
  const out: AuditDetailEntry[] = [];
  for (const [key, raw] of Object.entries(detail)) {
    if (out.length >= MAX_DETAIL_ENTRIES) break;
    if (SENSITIVE_KEY.test(key)) continue;
    if (typeof raw !== "string" && typeof raw !== "number" && typeof raw !== "boolean") continue;
    const value = String(raw);
    if (/@/.test(value)) continue;
    out.push({
      key,
      value: value.length > MAX_VALUE_LENGTH ? `${value.slice(0, MAX_VALUE_LENGTH)}…` : value,
    });
  }
  return out;
}

/** "reason_code" → "Reason code" — only for the secondary detail block, never primary text. */
export function humanizeDetailKey(key: string): string {
  const spaced = key.replace(/[_-]+/g, " ").replace(/([a-z])([A-Z])/g, "$1 $2").trim();
  return spaced ? spaced.charAt(0).toUpperCase() + spaced.slice(1) : key;
}

/** Partner deep link used by Leads & sales and Attribution rows. */
export function partnerDeepLink(partnerId: string): string {
  return `/platform/sellers/partners?partner=${encodeURIComponent(partnerId)}`;
}

/** Accepts only plain UUID-like references from `?partner=` — anything else is ignored. */
export function parsePartnerQueryParam(value: string | string[] | undefined): string | null {
  const raw = Array.isArray(value) ? value[0] : value;
  if (typeof raw !== "string") return null;
  const trimmed = raw.trim();
  return /^[0-9a-fA-F-]{8,64}$/.test(trimmed) ? trimmed : null;
}

/* --------------------------------- Registry --------------------------------- */

export const OPS_CHANNEL_KEYS = [
  "facebook",
  "instagram",
  "x",
  "snapchat",
  "tiktok",
  "linkedin",
  "email",
  "qr",
  "other",
  "referral_link",
  "partner_code",
  "manual_platform_assignment",
] as const;

export const OPS_SALE_STATUS_KEYS = [
  "registered_awaiting_second_payment",
  "pending_possible",
  "earned",
  "approved_for_payout",
  "queued_for_payout",
  "paid",
  "reversed",
  "rejected",
  "attributed",
] as const;

export const OPS_AUDIT_ACTION_KEYS = [
  "partner_application_registered",
  "partner_status_changed",
  "partner_status_set",
  "csp_set_partner_status",
  "academy_attempt_recorded",
  "certification_awarded",
  "product_published",
  "product_updated",
  "settlement_status_changed",
  "settlement_paid",
  "attribution_link_created",
  "qualified_sale_recorded",
] as const;

export const OPS_ACTOR_KEYS = ["platform_admin", "partner", "system", "customer"] as const;

export const OPS_SUBJECT_KEYS = [
  "csp_partner_profiles",
  "csp_sales_products",
  "csp_qualified_sales",
  "csp_settlements",
  "csp_attribution_links",
  "csp_commission_rate_versions",
  "csp_certifications",
] as const;

export function pickKnown<T extends string>(value: string | null, known: readonly T[]): T | "unknown" {
  return value && (known as readonly string[]).includes(value) ? (value as T) : "unknown";
}

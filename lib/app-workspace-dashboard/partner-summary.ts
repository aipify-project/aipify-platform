import { isCspPartnerPortalStatusAllowed } from "@/lib/certified-sales-partner/partner-access";
import { parsePartnerOverview } from "@/lib/certified-sales-partner/partner-overview";
import type { WorkspacePartnerSummary } from "./types";

function asRecord(value: unknown): Record<string, unknown> | null {
  if (!value || typeof value !== "object" || Array.isArray(value)) return null;
  return value as Record<string, unknown>;
}

function finiteNumber(value: unknown): number | null {
  if (typeof value === "number" && Number.isFinite(value)) return value;
  if (typeof value === "string" && value.trim() !== "" && Number.isFinite(Number(value))) {
    return Number(value);
  }
  return null;
}

/**
 * Present existing Core partner economy figures — never recompute commission rules in APP.
 * Fail-closed when partner identity is missing or Core economy payload is unavailable.
 */
export function buildWorkspacePartnerSummary(input: {
  authorized: boolean | null;
  overviewPayload?: unknown;
  economyPayload?: unknown;
  economyError?: string | null;
}): WorkspacePartnerSummary {
  if (input.authorized === false) {
    return {
      availability: "not_authorized",
      kpis: {
        registeredSales: null,
        pendingCommission: null,
        earnedCommission: null,
        payableCommission: null,
        currency: null,
      },
      partnerHref: null,
      lastUpdatedAt: null,
      messageKey: "not_authorized",
    };
  }

  if (input.authorized !== true) {
    return {
      availability: "unavailable",
      kpis: {
        registeredSales: null,
        pendingCommission: null,
        earnedCommission: null,
        payableCommission: null,
        currency: null,
      },
      partnerHref: null,
      lastUpdatedAt: null,
      messageKey: "unavailable",
    };
  }

  const overview = parsePartnerOverview(input.overviewPayload);
  if (
    overview.partnerStatus &&
    !isCspPartnerPortalStatusAllowed(overview.partnerStatus)
  ) {
    return {
      availability: "not_authorized",
      kpis: {
        registeredSales: null,
        pendingCommission: null,
        earnedCommission: null,
        payableCommission: null,
        currency: null,
      },
      partnerHref: null,
      lastUpdatedAt: null,
      messageKey: "not_authorized",
    };
  }

  if (input.economyError || input.economyPayload == null) {
    return {
      availability: "unavailable",
      kpis: {
        registeredSales: null,
        pendingCommission: null,
        earnedCommission: null,
        payableCommission: null,
        currency: null,
      },
      partnerHref: "/partners",
      lastUpdatedAt: null,
      messageKey: input.economyError ? "error" : "unavailable",
    };
  }

  const root = asRecord(input.economyPayload) ?? {};
  const stats = asRecord(root.stats) ?? asRecord(root.summary) ?? root;
  const registeredSales =
    finiteNumber(stats.registered_sales) ??
    finiteNumber(stats.converted_customers) ??
    finiteNumber(stats.total_sales);
  const pendingCommission =
    finiteNumber(stats.pending_commissions) ??
    finiteNumber(stats.pending_commission) ??
    finiteNumber(stats.commission_pending);
  const earnedCommission =
    finiteNumber(stats.earned_commissions) ??
    finiteNumber(stats.earned_commission) ??
    finiteNumber(stats.commission_earned);
  const payableCommission =
    finiteNumber(stats.payable_commissions) ??
    finiteNumber(stats.upcoming_payouts) ??
    finiteNumber(stats.commission_payable);
  const currency =
    typeof stats.currency === "string" && /^[A-Z]{3}$/.test(stats.currency.trim())
      ? stats.currency.trim()
      : null;

  const hasAnyFigure =
    registeredSales != null ||
    pendingCommission != null ||
    earnedCommission != null ||
    payableCommission != null;

  if (!hasAnyFigure) {
    return {
      availability: "unavailable",
      kpis: {
        registeredSales: null,
        pendingCommission: null,
        earnedCommission: null,
        payableCommission: null,
        currency,
      },
      partnerHref: "/partners",
      lastUpdatedAt: null,
      messageKey: "unavailable",
    };
  }

  return {
    availability: "authorized",
    kpis: {
      registeredSales,
      pendingCommission,
      earnedCommission,
      payableCommission,
      currency,
    },
    partnerHref: "/partners",
    lastUpdatedAt:
      typeof root.generated_at === "string"
        ? root.generated_at
        : typeof stats.updated_at === "string"
          ? stats.updated_at
          : null,
  };
}

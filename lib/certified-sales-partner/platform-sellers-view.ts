/**
 * Pure view-model helpers for Platform > Selgere (Certified Sales Partners).
 * No React, no i18n, no network. Everything is parsed defensively: a value that Core did not
 * return stays `null` (or `null` list) so the UI can say "not reported" instead of inventing a zero.
 */
import type { AipifyStatusKind } from "@/lib/design/status-system";
import type { CspPartnerStatus, CspSettlementStatus } from "./constants";

function rec(v: unknown): Record<string, unknown> {
  return v && typeof v === "object" && !Array.isArray(v) ? (v as Record<string, unknown>) : {};
}

function num(v: unknown): number | null {
  if (typeof v === "number" && Number.isFinite(v)) return v;
  if (typeof v === "string" && v.trim() !== "" && Number.isFinite(Number(v))) return Number(v);
  return null;
}

function str(r: Record<string, unknown>, ...keys: string[]): string | null {
  for (const k of keys) {
    const v = r[k];
    if (typeof v === "string" && v.trim() !== "") return v;
  }
  return null;
}

function numberMap(v: unknown): Record<string, number> {
  const out: Record<string, number> = {};
  for (const [k, raw] of Object.entries(rec(v))) {
    const n = num(raw);
    if (n !== null) out[k] = n;
  }
  return out;
}

/** `null` = key absent / not a list (Core did not report it); `[]` = Core reported an empty list. */
function optionalList(payload: Record<string, unknown>, key: string): Array<Record<string, unknown>> | null {
  const candidate = payload[key];
  if (!Array.isArray(candidate)) return null;
  return candidate.filter((r): r is Record<string, unknown> => !!r && typeof r === "object" && !Array.isArray(r));
}

export type SellersPartnerRow = {
  id: string;
  status: string;
  name: string | null;
  country: string | null;
  createdAt: string | null;
  updatedAt: string | null;
  /** Business identity — `null` when Core did not return it (UI shows "not saved yet"). */
  legalBusinessName: string | null;
  businessRegistrationNumber: string | null;
  businessAddress: string | null;
  phone: string | null;
  email: string | null;
  /** `null` = Core did not report it. */
  emailVerified: boolean | null;
  authUserId: string | null;
};

export type SellersProductRow = {
  id: string;
  productKey: string;
  title: string;
  currency: string | null;
  fixedCommissionAmount: number | null;
  published: boolean;
  /** Present after channel schema + overview RPC enrichment. */
  publishSale: boolean | null;
  publishApp: boolean | null;
  masterActive: boolean | null;
  sku: string | null;
};

export type SellersSettlementRow = {
  id: string;
  partnerId: string | null;
  periodMonth: string | null;
  status: string;
  totalAmount: number | null;
  currency: string | null;
  lineCount: number | null;
  createdAt: string | null;
};

export type SellersAcademySummary = {
  attemptsTotal: number | null;
  attemptsPassed: number | null;
  attemptsFailed: number | null;
  certificationsActive: number | null;
};

export type SellersOverview = {
  partnersTotal: number | null;
  partnersByStatus: Record<string, number>;
  productsTotal: number | null;
  productsPublished: number | null;
  openSettlementsCount: number | null;
  openSettlementsByCurrency: Record<string, number>;
  unpaidSettlementsCount: number | null;
  /** Not part of `csp_get_platform_overview` today → null unless Core adds it. */
  certifiedPartners: number | null;
  qualifiedSales: number | null;
  academy: SellersAcademySummary | null;
  partners: SellersPartnerRow[] | null;
  products: SellersProductRow[] | null;
};

export function parseSellersOverview(payload: unknown): SellersOverview {
  const root = rec(payload);
  const open = rec(root.open_settlements);

  const academyRaw = root.academy ?? root.academy_summary;
  let academy: SellersAcademySummary | null = null;
  if (academyRaw && typeof academyRaw === "object" && !Array.isArray(academyRaw)) {
    const a = rec(academyRaw);
    academy = {
      attemptsTotal: num(a.attempts_total ?? a.attempts_count ?? a.attempts),
      attemptsPassed: num(a.attempts_passed ?? a.passed),
      attemptsFailed: num(a.attempts_failed ?? a.failed),
      certificationsActive: num(a.certifications_active ?? a.certified_partners ?? a.certifications),
    };
  }

  const partnerList = optionalList(root, "partners");
  const productList = optionalList(root, "products");

  return {
    partnersTotal: num(root.partners_total),
    partnersByStatus: numberMap(root.partners_by_status),
    productsTotal: num(root.products_total),
    productsPublished: num(root.products_published),
    openSettlementsCount: num(open.count),
    openSettlementsByCurrency: numberMap(open.by_currency),
    unpaidSettlementsCount: num(root.unpaid_settlements_count),
    certifiedPartners: num(root.certified_partners ?? root.certified_partners_count) ?? academy?.certificationsActive ?? null,
    qualifiedSales: num(root.qualified_sales_total ?? root.qualified_sales_count ?? root.sales_total),
    academy,
    partners: partnerList
      ? partnerList.flatMap((p) => {
          const id = str(p, "id", "partner_id");
          if (!id) return [];
          return [
            {
              id,
              status: str(p, "status") ?? "unknown",
              name: str(p, "display_name", "company_name", "name", "full_name"),
              country: str(p, "country"),
              createdAt: str(p, "created_at", "applied_at"),
              updatedAt: str(p, "updated_at"),
              legalBusinessName: str(p, "legal_business_name"),
              businessRegistrationNumber: str(p, "business_registration_number"),
              businessAddress: str(p, "business_address"),
              phone: str(p, "phone"),
              email: str(p, "email"),
              emailVerified: typeof p.email_verified === "boolean" ? p.email_verified : null,
              authUserId: str(p, "auth_user_id"),
            },
          ];
        })
      : null,
    products: productList
      ? productList.flatMap((p) => {
          const id = str(p, "id", "product_id", "product_key");
          const productKey = str(p, "product_key");
          if (!id || !productKey) return [];
          return [
            {
              id,
              productKey,
              title: str(p, "title") ?? productKey,
              currency: str(p, "currency"),
              fixedCommissionAmount: num(p.fixed_commission_amount),
              published: p.published === true,
              publishSale:
                typeof p.publish_sale === "boolean"
                  ? p.publish_sale
                  : typeof p.publishSale === "boolean"
                    ? p.publishSale
                    : null,
              publishApp:
                typeof p.publish_app === "boolean"
                  ? p.publish_app
                  : typeof p.publishApp === "boolean"
                    ? p.publishApp
                    : null,
              masterActive:
                typeof p.master_active === "boolean"
                  ? p.master_active
                  : typeof p.masterActive === "boolean"
                    ? p.masterActive
                    : null,
              sku: str(p, "sku"),
            },
          ];
        })
      : null,
  };
}

/** Applications that still need an admin decision. */
export function countPendingApplications(byStatus: Record<string, number>): number {
  return (byStatus.registered ?? 0) + (byStatus.under_review ?? 0) + (byStatus.needs_information ?? 0);
}

export function parseSettlementList(payload: unknown): SellersSettlementRow[] | null {
  const list = optionalList(rec(payload), "settlements");
  if (!list) return null;
  return list.flatMap((s) => {
    const id = str(s, "id");
    if (!id) return [];
    return [
      {
        id,
        partnerId: str(s, "partner_id"),
        periodMonth: str(s, "period_month"),
        status: str(s, "status") ?? "unknown",
        totalAmount: num(s.total_amount),
        currency: str(s, "currency"),
        lineCount: num(s.line_count),
        createdAt: str(s, "created_at"),
      },
    ];
  });
}

const PARTNER_STATUS_KIND: Record<CspPartnerStatus, AipifyStatusKind> = {
  registered: "information",
  under_review: "waiting",
  needs_information: "needs_attention",
  approved: "verified",
  rejected: "not_allowed",
  suspended: "restricted",
};

export function partnerStatusKind(status: string): AipifyStatusKind {
  return PARTNER_STATUS_KIND[status as CspPartnerStatus] ?? "information";
}

const SETTLEMENT_STATUS_KIND: Record<CspSettlementStatus, AipifyStatusKind> = {
  open: "waiting",
  approved: "information",
  closed: "needs_attention",
  paid: "completed",
  voided: "not_allowed",
};

export function settlementStatusKind(status: string): AipifyStatusKind {
  return SETTLEMENT_STATUS_KIND[status as CspSettlementStatus] ?? "information";
}

/** Suggested next admin decision for a partner (a suggestion only — the admin chooses). */
export function suggestedPartnerStatus(status: string): CspPartnerStatus {
  switch (status) {
    case "registered":
    case "needs_information":
    case "rejected":
      return "under_review";
    case "under_review":
    case "suspended":
      return "approved";
    case "approved":
      return "suspended";
    default:
      return "under_review";
  }
}

/** Next forward settlement step, or null when the settlement is final. */
export function nextSettlementStep(status: string): CspSettlementStatus | null {
  switch (status) {
    case "open":
      return "approved";
    case "approved":
      return "closed";
    case "closed":
      return "paid";
    default:
      return null;
  }
}

export function isFinalSettlementStatus(status: string): boolean {
  return status === "paid" || status === "voided";
}

/** Short, non-sensitive reference shown as a secondary technical hint. */
export function shortReference(id: string): string {
  return id.length > 8 ? `${id.slice(0, 8)}…` : id;
}

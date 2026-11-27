/**
 * Defensive parsing of the `csp_get_partner_overview` Core payload and server-side
 * sales-link gate derivation. Pure — no I/O. Never trusts client-supplied gate flags.
 */
import { canIssueSalesLink, type CspSalesLinkGate } from "./academy-quiz";

/** Partner statuses for which Core `csp_create_attribution_link` accepts link issuance. */
export const CSP_LINK_ELIGIBLE_PARTNER_STATUSES = ["approved", "active", "certified"] as const;

export type CspOverviewProduct = {
  id: string | null;
  productKey: string | null;
  fixedCommissionAmount: number | null;
  currency: string | null;
  certificationStatus: string | null;
};

export type CspOverviewCertification = {
  productId: string | null;
  productKey: string | null;
  status: string | null;
  score: number | null;
  passedAt: string | null;
};

export type CspParsedOverview = {
  partnerId: string | null;
  partnerStatus: string | null;
  displayName: string | null;
  /** ISO 3166-1 alpha-2 when Core returns it. */
  country: string | null;
  /** Registered business name when Core returns it. Empty metadata is not a substitute. */
  legalBusinessName: string | null;
  /** `agreement_accepted` when Core exposes it; null when the payload has no such field. */
  agreementAccepted: boolean | null;
  products: CspOverviewProduct[];
  certifications: CspOverviewCertification[];
};

function rec(v: unknown): Record<string, unknown> {
  return v && typeof v === "object" && !Array.isArray(v) ? (v as Record<string, unknown>) : {};
}
function str(v: unknown): string | null {
  return typeof v === "string" && v.trim().length > 0 ? v : null;
}
function isoCountry(v: unknown): string | null {
  if (typeof v !== "string") return null;
  const code = v.trim().toUpperCase();
  return /^[A-Z]{2}$/.test(code) ? code : null;
}
function num(v: unknown): number | null {
  if (typeof v === "number" && Number.isFinite(v)) return v;
  if (typeof v === "string" && v.trim() !== "" && Number.isFinite(Number(v))) return Number(v);
  return null;
}
function list(v: unknown): unknown[] {
  return Array.isArray(v) ? v : [];
}

export function parsePartnerOverview(data: unknown): CspParsedOverview {
  const root = rec(data);
  const partner = rec(root.partner);
  return {
    partnerId: str(partner.id),
    partnerStatus: str(partner.status),
    displayName: str(partner.display_name),
    country: isoCountry(partner.country),
    legalBusinessName: str(partner.legal_business_name),
    agreementAccepted: typeof partner.agreement_accepted === "boolean" ? partner.agreement_accepted : null,
    products: list(root.products).map((item) => {
      const p = rec(item);
      return {
        id: str(p.id),
        productKey: str(p.product_key),
        fixedCommissionAmount: num(p.fixed_commission_amount),
        currency: str(p.currency),
        certificationStatus: str(p.certification_status),
      };
    }),
    certifications: list(root.certifications).map((item) => {
      const c = rec(item);
      return {
        productId: str(c.product_id),
        productKey: str(c.product_key),
        status: str(c.status),
        score: num(c.score),
        passedAt: str(c.passed_at),
      };
    }),
  };
}

export type CspSalesLinkGateEvaluation = {
  gates: CspSalesLinkGate;
  allowed: boolean;
  /** Core product id (uuid) resolved from the published products list; null when not found. */
  productId: string | null;
  productKey: string | null;
};

/**
 * Derives the four sales-link gates from the Core overview.
 *  - partnerApproved: partner.status is an approved status.
 *  - productPublished: the product appears in `products[]` (Core lists published products only).
 *  - certificationPassed: `products[].certification_status` or `certifications[].status` is `passed`.
 *  - agreementAccepted: Core's explicit flag when present; otherwise approval implies the agreement
 *    was accepted (the overview carries no separate agreement field).
 *
 * `productRef` may be the Core product id or the product key.
 */
export function evaluateSalesLinkGates(
  overview: CspParsedOverview,
  productRef: string,
): CspSalesLinkGateEvaluation {
  const ref = (productRef ?? "").trim();
  const product = ref
    ? overview.products.find((p) => p.id === ref) ?? overview.products.find((p) => p.productKey === ref)
    : undefined;

  const partnerApproved =
    overview.partnerStatus !== null &&
    (CSP_LINK_ELIGIBLE_PARTNER_STATUSES as readonly string[]).includes(overview.partnerStatus);

  const certified =
    product !== undefined &&
    (product.certificationStatus === "passed" ||
      overview.certifications.some(
        (c) =>
          c.status === "passed" &&
          ((product.id !== null && c.productId === product.id) ||
            (product.productKey !== null && c.productKey === product.productKey)),
      ));

  const gates: CspSalesLinkGate = {
    partnerApproved,
    productPublished: product !== undefined && product.id !== null,
    certificationPassed: certified,
    agreementAccepted: partnerApproved && overview.agreementAccepted !== false,
  };

  return {
    gates,
    allowed: canIssueSalesLink(gates),
    productId: product?.id ?? null,
    productKey: product?.productKey ?? null,
  };
}

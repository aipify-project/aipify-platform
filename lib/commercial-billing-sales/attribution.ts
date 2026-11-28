/**
 * D. Sales attribution for checkout — personal links, tenant-bound, anti-self-referral.
 * Reuses `attribution-policy` (isSelfReferral, isCspLinkCode) and `commission-rules`
 * (isWithinAttributionWindow). Attribution never blocks a purchase; it only decides whether a
 * seller may be credited. Free Aipify Partner never needs a paid license.
 */

import { CSP_ATTRIBUTION_WINDOW_DAYS } from "@/lib/certified-sales-partner/constants";
import { isCspLinkCode, isSelfReferral } from "@/lib/certified-sales-partner/attribution-policy";
import { isWithinAttributionWindow } from "@/lib/certified-sales-partner/commission-rules";
import type { SalesPartnerLicenseSnapshot, SalesPartnerMembershipRef } from "@/lib/sales-partner-commercial-license";
import { authorizeSalesPartnerOperation } from "./license-snapshot";

export type SalesLinkRecord = {
  code: string;
  partnerId: string;
  partnerAuthUserId: string | null;
  programId: string;
  programKind: "aipify_certified_free" | "tenant_commercial";
  /** Program owner tenant (reserved internal key for the free Aipify program). */
  ownerTenantId: string;
  /** null = link is valid for any product. */
  productKey: string | null;
  active: boolean;
  /** First valid touch timestamp (ISO). */
  firstTouchAt: string;
};

export type SellerStanding = {
  /** csp_partner_profiles.status — free program. */
  cspPartnerStatus?: string | null;
  /** Tenant commercial program license snapshot (owner tenant scope). */
  license?: SalesPartnerLicenseSnapshot | null;
  membership?: SalesPartnerMembershipRef | null;
};

export type SalesAttribution = {
  linkCode: string;
  partnerId: string;
  programId: string;
  programKind: SalesLinkRecord["programKind"];
  ownerTenantId: string;
  /** Bound at checkout; never reassignable. */
  buyerTenantId: string;
  productKey: string;
  attributedAt: string;
  windowDays: number;
  partnerAuthUserId: string | null;
};

export type AttributionRejectionReason =
  | "no_link"
  | "link_inactive"
  | "link_code_invalid"
  | "product_mismatch"
  | "attribution_window_expired"
  | "self_referral"
  | "self_tenant_referral"
  | "partner_not_authorized"
  | "license_not_operational"
  | "membership_not_active"
  | "program_mismatch"
  | "buyer_tenant_required";

export type AttributionResolution =
  | { attributed: true; attribution: SalesAttribution }
  | { attributed: false; reason: AttributionRejectionReason };

function normProduct(k: string): string {
  return k.trim().toLowerCase().replace(/-/g, "_");
}

export function resolveSalesAttribution(input: {
  link: SalesLinkRecord | null | undefined;
  seller: SellerStanding;
  buyerTenantId: string | null | undefined;
  buyerAuthUserId?: string | null;
  productKey: string;
  now: Date;
}): AttributionResolution {
  const { link } = input;
  const buyerTenantId = typeof input.buyerTenantId === "string" ? input.buyerTenantId.trim() : "";
  if (!buyerTenantId) return { attributed: false, reason: "buyer_tenant_required" };
  if (!link) return { attributed: false, reason: "no_link" };
  if (!link.active) return { attributed: false, reason: "link_inactive" };

  if (link.programKind === "aipify_certified_free" && !isCspLinkCode(link.code)) {
    return { attributed: false, reason: "link_code_invalid" };
  }
  if (!link.code.trim() || !link.partnerId || !link.programId || !link.ownerTenantId) {
    return { attributed: false, reason: "link_code_invalid" };
  }
  if (link.productKey != null && normProduct(link.productKey) !== normProduct(input.productKey)) {
    return { attributed: false, reason: "product_mismatch" };
  }
  if (!isWithinAttributionWindow(link.firstTouchAt, input.now, CSP_ATTRIBUTION_WINDOW_DAYS)) {
    return { attributed: false, reason: "attribution_window_expired" };
  }
  if (isSelfReferral({ partnerAuthUserId: link.partnerAuthUserId, customerAuthUserId: input.buyerAuthUserId })) {
    return { attributed: false, reason: "self_referral" };
  }

  if (link.programKind === "aipify_certified_free") {
    const access = authorizeSalesPartnerOperation({
      kind: "aipify_certified_free",
      cspPartnerStatus: input.seller.cspPartnerStatus,
    });
    if (!access.allowed) return { attributed: false, reason: "partner_not_authorized" };
  } else {
    // A tenant cannot earn commission by selling to itself.
    if (link.ownerTenantId === buyerTenantId) return { attributed: false, reason: "self_tenant_referral" };
    const license = input.seller.license ?? null;
    if (license && license.program.programId !== link.programId) {
      return { attributed: false, reason: "program_mismatch" };
    }
    const access = authorizeSalesPartnerOperation({
      kind: "tenant_commercial",
      callerTenantId: link.ownerTenantId,
      license,
    });
    if (!access.allowed) return { attributed: false, reason: "license_not_operational" };
    const m = input.seller.membership;
    if (!m || m.status !== "active" || m.programId !== link.programId || m.role === "read_only") {
      return { attributed: false, reason: "membership_not_active" };
    }
  }

  return {
    attributed: true,
    attribution: {
      linkCode: link.code,
      partnerId: link.partnerId,
      programId: link.programId,
      programKind: link.programKind,
      ownerTenantId: link.ownerTenantId,
      buyerTenantId,
      productKey: normProduct(input.productKey),
      attributedAt: input.now.toISOString(),
      windowDays: CSP_ATTRIBUTION_WINDOW_DAYS,
      partnerAuthUserId: link.partnerAuthUserId,
    },
  };
}

/** Attribution is tenant-bound: only the tenant it was created for may consume it. */
export function assertAttributionBoundToTenant(
  attribution: SalesAttribution | null | undefined,
  tenantId: string,
): boolean {
  return attribution == null || attribution.buyerTenantId === tenantId;
}

/**
 * Defensive parsing of Unified Seller Bridge RPC payloads. Pure — no I/O.
 */

function rec(v: unknown): Record<string, unknown> {
  return v && typeof v === "object" && !Array.isArray(v) ? (v as Record<string, unknown>) : {};
}

function str(v: unknown): string | null {
  return typeof v === "string" && v.trim().length > 0 ? v.trim() : null;
}

function bool(v: unknown): boolean | null {
  return typeof v === "boolean" ? v : null;
}

export type UnifiedSellerSalesLinks = {
  ok: boolean;
  error: string | null;
  cspPartnerId: string | null;
  cspStatus: string | null;
  cspAttributionLinks: Array<{ code: string; active: boolean; channelOrigin: string | null }>;
  growthPartnerProfileId: string | null;
  growthPartnerStatus: string | null;
  certificationStatus: string | null;
  primaryLinkSlug: string | null;
  linkStatus: string | null;
  personalSalesPath: string | null;
  bridgeReady: boolean;
};

export function parseUnifiedSellerSalesLinks(data: unknown): UnifiedSellerSalesLinks {
  const root = rec(data);
  const links = Array.isArray(root.csp_attribution_links) ? root.csp_attribution_links : [];
  return {
    ok: root.ok === true,
    error: str(root.error),
    cspPartnerId: str(root.csp_partner_id),
    cspStatus: str(root.csp_status),
    cspAttributionLinks: links.map((item) => {
      const row = rec(item);
      return {
        code: str(row.code) ?? "",
        active: row.active === true,
        channelOrigin: str(row.channel_origin),
      };
    }).filter((item) => item.code.length > 0),
    growthPartnerProfileId: str(root.growth_partner_profile_id),
    growthPartnerStatus: str(root.growth_partner_status),
    certificationStatus: str(root.certification_status),
    primaryLinkSlug: str(root.primary_link_slug),
    linkStatus: str(root.link_status),
    personalSalesPath: str(root.personal_sales_path),
    bridgeReady: root.bridge_ready === true,
  };
}

export type UnifiedSellerEnsureResult = {
  ok: boolean;
  created: boolean | null;
  error: string | null;
  cspPartnerId: string | null;
  profileId: string | null;
  organizationId: string | null;
  primaryLinkSlug: string | null;
  partnerStatus: string | null;
  certificationStatus: string | null;
  linkActive: boolean | null;
};

export function parseUnifiedSellerEnsureResult(data: unknown): UnifiedSellerEnsureResult {
  const root = rec(data);
  return {
    ok: root.ok === true,
    created: typeof root.created === "boolean" ? root.created : null,
    error: str(root.error),
    cspPartnerId: str(root.csp_partner_id),
    profileId: str(root.profile_id),
    organizationId: str(root.organization_id),
    primaryLinkSlug: str(root.primary_link_slug),
    partnerStatus: str(root.partner_status),
    certificationStatus: str(root.certification_status),
    linkActive: bool(root.link_active),
  };
}

/** Personal sales product key mirrored by Core bridge mapping. */
export const UNIFIED_SELLER_PERSONAL_PRODUCT_KEY = "kompis_web" as const;

/**
 * Map CSP status + product-specific cert → GP capability.
 * Mirrors SQL `_usb_map_gp_status_from_csp(..., p_product_key)` — never invents certification.
 */
export function mapGpStatusFromCsp(input: {
  cspStatus: string | null | undefined;
  /** Must be the personal-sales product cert (default kompis_web), not "any product". */
  productCertPassed: boolean;
  productKey?: string | null;
}): {
  partnerStatus: "certified" | "suspended" | "certification_required";
  certificationStatus: "passed" | "pending";
  linkActive: boolean;
  productKey: string;
} {
  const status = (input.cspStatus ?? "").trim().toLowerCase();
  const productKey = (input.productKey ?? UNIFIED_SELLER_PERSONAL_PRODUCT_KEY).trim().toLowerCase() || UNIFIED_SELLER_PERSONAL_PRODUCT_KEY;
  const passed = input.productCertPassed === true;
  if (status === "suspended" || status === "terminated" || status === "rejected") {
    return {
      partnerStatus: "suspended",
      certificationStatus: passed ? "passed" : "pending",
      linkActive: false,
      productKey,
    };
  }
  if ((status === "approved" || status === "active" || status === "certified") && passed) {
    return {
      partnerStatus: "certified",
      certificationStatus: "passed",
      linkActive: true,
      productKey,
    };
  }
  return {
    partnerStatus: "certification_required",
    certificationStatus: passed ? "passed" : "pending",
    linkActive: false,
    productKey,
  };
}

/** Negative access expectations for bridge RPC wrappers (fail-closed). */
export function classifyBridgeAccessDenial(input: {
  authenticated: boolean;
  isPlatformAdmin: boolean;
  ownsCspPartner: boolean;
  rpc: "ensureForCsp" | "ensureOwn" | "syncFromCsp" | "getOwnLinks" | "internalMap" | "internalSync" | "internalEnsure";
}): "unauthorized" | "forbidden" | "allowed" {
  if (!input.authenticated) return "unauthorized";
  if (input.rpc === "internalMap" || input.rpc === "internalSync" || input.rpc === "internalEnsure") {
    return "forbidden";
  }
  if (input.rpc === "ensureForCsp") {
    return input.isPlatformAdmin ? "allowed" : "forbidden";
  }
  if (input.rpc === "ensureOwn" || input.rpc === "getOwnLinks") {
    return "allowed"; // ownership enforced inside RPC via auth.uid()
  }
  // syncFromCsp: platform admin or CSP owner
  if (input.isPlatformAdmin || input.ownsCspPartner) return "allowed";
  return "forbidden";
}
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

/** Map CSP status + product-cert passed → GP capability (mirrors SQL `_usb_map_gp_status_from_csp`). */
export function mapGpStatusFromCsp(input: {
  cspStatus: string | null | undefined;
  productCertPassed: boolean;
}): {
  partnerStatus: "certified" | "suspended" | "certification_required";
  certificationStatus: "passed" | "pending";
  linkActive: boolean;
} {
  const status = (input.cspStatus ?? "").trim().toLowerCase();
  const passed = input.productCertPassed === true;
  if (status === "suspended" || status === "terminated" || status === "rejected") {
    return {
      partnerStatus: "suspended",
      certificationStatus: passed ? "passed" : "pending",
      linkActive: false,
    };
  }
  if ((status === "approved" || status === "active" || status === "certified") && passed) {
    return {
      partnerStatus: "certified",
      certificationStatus: "passed",
      linkActive: true,
    };
  }
  return {
    partnerStatus: "certification_required",
    certificationStatus: passed ? "passed" : "pending",
    linkActive: false,
  };
}
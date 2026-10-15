/**
 * Read-only product status view contract for Platform customer detail.
 * Separates agreement/APP license, Website Kompis, Web install signals, and
 * Kompis Bedrift entitlement. Never invents Active from membership alone.
 */

import type { PlatformPortalCustomerDetail } from "./types";
import type { PlatformPortalKompisBedriftStatus } from "./kompis-bedrift-activation";
import type { PlatformPortalWebsiteKompisStatus } from "./website-kompis-activation";
import type { AccessProductStatus, AccessReasonCode } from "@/lib/core/access-control-plane/types";

export type ProductStatusTruthSource =
  | "customer_detail_entitlement"
  | "customer_detail_license"
  | "website_kompis_status_rpc"
  | "kompis_bedrift_status_rpc"
  | "usage_install_signal"
  | "commercial_subscription"
  | "unavailable";

export type ProductStatusTruthItem = {
  productId: "agreement" | "website_kompis" | "kompis_bedrift";
  status: AccessProductStatus;
  reasonCode: AccessReasonCode;
  source: ProductStatusTruthSource;
  /** True when UI must not claim a definitive green/red without Core proof. */
  unverified: boolean;
};

export type ProductStatusTruthOverlay = {
  websiteKompis?: PlatformPortalWebsiteKompisStatus | null;
  bedrift?: PlatformPortalKompisBedriftStatus | null;
};

export type ProductStatusTruth = {
  agreement: ProductStatusTruthItem;
  websiteKompis: ProductStatusTruthItem;
  kompisBedrift: ProductStatusTruthItem;
  /** Chips for control-plane header — no duplicate Kompis Web alias. */
  productChips: Array<{
    productId: "website_kompis" | "kompis_bedrift";
    labelKey: "website_kompis" | "bedrift";
    status: AccessProductStatus;
    reasonCode: AccessReasonCode;
    unverified: boolean;
  }>;
};

function norm(value: string | null | undefined): string {
  return (value ?? "").trim().toLowerCase();
}

function isActiveLike(status: string | null | undefined): boolean {
  const s = norm(status);
  return s === "active" || s === "licensed" || s === "enabled";
}

function hasEntitlementCode(
  detail: PlatformPortalCustomerDetail,
  code: string,
): { present: boolean; active: boolean } {
  const needle = code.toLowerCase();
  let present = false;
  let active = false;
  for (const row of detail.entitlements) {
    const c = norm(row.code);
    if (!c.includes(needle)) continue;
    present = true;
    if (isActiveLike(row.status)) active = true;
  }
  return { present, active };
}

function hasLicenseProduct(
  detail: PlatformPortalCustomerDetail,
  code: string,
): { present: boolean; active: boolean } {
  const needle = code.toLowerCase();
  let present = false;
  let active = false;
  for (const row of detail.licenses) {
    const c = norm(row.productCode);
    if (!c.includes(needle)) continue;
    present = true;
    if (isActiveLike(row.status)) active = true;
  }
  return { present, active };
}

function mapAgreement(detail: PlatformPortalCustomerDetail): ProductStatusTruthItem {
  const status = norm(detail.commercial.subscriptionStatus);
  if (status === "active" || detail.commercial.lifetime) {
    return {
      productId: "agreement",
      status: "active",
      reasonCode: "ok",
      source: "commercial_subscription",
      unverified: false,
    };
  }
  if (status === "trialing" || status === "trial") {
    return {
      productId: "agreement",
      status: "pending",
      reasonCode: "product_pending",
      source: "commercial_subscription",
      unverified: false,
    };
  }
  if (status === "past_due" || status === "overdue" || status === "unpaid") {
    return {
      productId: "agreement",
      status: "suspended",
      reasonCode: "subscription_invalid",
      source: "commercial_subscription",
      unverified: false,
    };
  }
  if (status === "cancelled" || status === "canceled") {
    return {
      productId: "agreement",
      status: "cancelled",
      reasonCode: "subscription_invalid",
      source: "commercial_subscription",
      unverified: false,
    };
  }
  if (status === "expired") {
    return {
      productId: "agreement",
      status: "expired",
      reasonCode: "subscription_invalid",
      source: "commercial_subscription",
      unverified: false,
    };
  }
  return {
    productId: "agreement",
    status: "unavailable",
    reasonCode: "subscription_invalid",
    source: "commercial_subscription",
    unverified: !status,
  };
}

function mapWebsiteKompis(
  detail: PlatformPortalCustomerDetail,
  overlay?: PlatformPortalWebsiteKompisStatus | null,
): ProductStatusTruthItem {
  if (overlay) {
    if (overlay.active || overlay.activationStatus === "active") {
      return {
        productId: "website_kompis",
        status: "active",
        reasonCode: "ok",
        source: "website_kompis_status_rpc",
        unverified: false,
      };
    }
    if (
      overlay.activationStatus === "ready_for_activation" ||
      overlay.eligible
    ) {
      return {
        productId: "website_kompis",
        status: "pending",
        reasonCode: "activation_gate_incomplete",
        source: "website_kompis_status_rpc",
        unverified: false,
      };
    }
    // RPC loaded but not ready — prefer install signal over hard unavailable.
    if (
      overlay.domain.hostname ||
      overlay.installation.installId ||
      detail.usage.domainCount > 0 ||
      detail.usage.installationCount > 0
    ) {
      return {
        productId: "website_kompis",
        status: "pending",
        reasonCode: "product_pending",
        source: "website_kompis_status_rpc",
        unverified: false,
      };
    }
    return {
      productId: "website_kompis",
      status: "unavailable",
      reasonCode: "product_not_entitled",
      source: "website_kompis_status_rpc",
      unverified: false,
    };
  }

  const ent = hasEntitlementCode(detail, "website_kompis");
  const lic = hasLicenseProduct(detail, "website_kompis");
  if (ent.active || lic.active) {
    return {
      productId: "website_kompis",
      status: "active",
      reasonCode: "ok",
      source: ent.active ? "customer_detail_entitlement" : "customer_detail_license",
      unverified: false,
    };
  }
  if (ent.present || lic.present) {
    return {
      productId: "website_kompis",
      status: "pending",
      reasonCode: "product_pending",
      source: ent.present ? "customer_detail_entitlement" : "customer_detail_license",
      unverified: false,
    };
  }
  if (detail.usage.domainCount > 0 || detail.usage.installationCount > 0) {
    return {
      productId: "website_kompis",
      status: "pending",
      reasonCode: "product_pending",
      source: "usage_install_signal",
      unverified: true,
    };
  }
  return {
    productId: "website_kompis",
    status: "unavailable",
    reasonCode: "product_not_entitled",
    source: "unavailable",
    unverified: true,
  };
}

function mapKompisBedrift(
  detail: PlatformPortalCustomerDetail,
  overlay?: PlatformPortalKompisBedriftStatus | null,
): ProductStatusTruthItem {
  if (overlay) {
    if (overlay.active || overlay.displayStatus === "active") {
      const licensed =
        overlay.existingActivation?.licensed === true &&
        overlay.existingActivation?.enabled === true;
      if (!licensed && !overlay.active) {
        return {
          productId: "kompis_bedrift",
          status: "conflict",
          reasonCode: "product_conflict",
          source: "kompis_bedrift_status_rpc",
          unverified: false,
        };
      }
      return {
        productId: "kompis_bedrift",
        status: "active",
        reasonCode: "ok",
        source: "kompis_bedrift_status_rpc",
        unverified: false,
      };
    }
    if (overlay.displayStatus === "eligible" || overlay.eligible) {
      return {
        productId: "kompis_bedrift",
        status: "pending",
        reasonCode: "activation_gate_incomplete",
        source: "kompis_bedrift_status_rpc",
        unverified: false,
      };
    }
    if (overlay.displayStatus === "unknown") {
      return {
        productId: "kompis_bedrift",
        status: "unavailable",
        reasonCode: "module_status_unknown",
        source: "kompis_bedrift_status_rpc",
        unverified: true,
      };
    }
    return {
      productId: "kompis_bedrift",
      status: "unavailable",
      reasonCode: "product_not_entitled",
      source: "kompis_bedrift_status_rpc",
      unverified: false,
    };
  }

  const ent = hasEntitlementCode(detail, "kompis_bedrift");
  if (ent.active) {
    return {
      productId: "kompis_bedrift",
      status: "active",
      reasonCode: "ok",
      source: "customer_detail_entitlement",
      unverified: false,
    };
  }
  if (ent.present) {
    return {
      productId: "kompis_bedrift",
      status: "pending",
      reasonCode: "product_pending",
      source: "customer_detail_entitlement",
      unverified: false,
    };
  }

  // Membership / lifetime / APP subscription must NEVER imply Bedrift active.
  return {
    productId: "kompis_bedrift",
    status: "unavailable",
    reasonCode: "product_not_entitled",
    source: "unavailable",
    unverified: true,
  };
}

/**
 * Build the authoritative product status view from customer detail + optional
 * live Core RPC overlays. Pure — no writes, no guessing Bedrift from membership.
 */
export function buildProductStatusTruth(
  detail: PlatformPortalCustomerDetail,
  overlay: ProductStatusTruthOverlay = {},
): ProductStatusTruth {
  const agreement = mapAgreement(detail);
  const websiteKompis = mapWebsiteKompis(detail, overlay.websiteKompis);
  const kompisBedrift = mapKompisBedrift(detail, overlay.bedrift);

  return {
    agreement,
    websiteKompis,
    kompisBedrift,
    productChips: [
      {
        productId: "website_kompis",
        labelKey: "website_kompis",
        status: websiteKompis.status,
        reasonCode: websiteKompis.reasonCode,
        unverified: websiteKompis.unverified,
      },
      {
        productId: "kompis_bedrift",
        labelKey: "bedrift",
        status: kompisBedrift.status,
        reasonCode: kompisBedrift.reasonCode,
        unverified: kompisBedrift.unverified,
      },
    ],
  };
}

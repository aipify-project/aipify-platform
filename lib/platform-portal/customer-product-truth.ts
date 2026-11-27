/**
 * Customer 360 product / license / delivery truth.
 * APP license ≠ Website Kompis entitlement ≠ Kompis Bedrift assignment.
 * Never invent zeros or green status from unrelated membership signals.
 */

import type {
  PlatformPortalCustomerDetail,
  PlatformPortalWebsiteKompisStatus,
} from "./types";

export type ProductDeliveryLayer =
  | "entitlement"
  | "subscription"
  | "setup"
  | "installation"
  | "runtime"
  | "usage";

export type ProductTruthStatus =
  | "active"
  | "entitled"
  | "ready_for_activation"
  | "needs_setup"
  | "not_entitled"
  | "suspended"
  | "unavailable"
  | "unknown";

export type CustomerProductTruthRow = {
  productKey: "app_license" | "website_kompis" | "kompis_bedrift";
  /** Human-facing layer labels stay in i18n — this is the machine status. */
  status: ProductTruthStatus;
  layers: Partial<Record<ProductDeliveryLayer, ProductTruthStatus>>;
  source:
    | "licenses"
    | "entitlements"
    | "website_kompis_status_rpc"
    | "kompis_bedrift_status_rpc"
    | "commercial"
    | "unavailable";
  lastCheckedAt: string | null;
};

export type ModulesTruth = {
  /** When false, UI must show unavailable — never "0/0". */
  available: boolean;
  activeCount: number | null;
  totalCount: number | null;
  source: "entitlements" | "unavailable";
  /** Entitlement row counts are not "activated services". */
  semantics: "entitlement_rows";
};

function licenseActive(detail: PlatformPortalCustomerDetail): boolean {
  return detail.licenses.some((l) => (l.status ?? "").toLowerCase() === "active");
}

function hasWebsiteKompisEntitlement(detail: PlatformPortalCustomerDetail): boolean {
  const needle = /website[_-]?kompis|kompis[_-]?web/i;
  return (
    detail.licenses.some((l) => needle.test(l.productCode ?? "") || needle.test(l.productName ?? "")) ||
    detail.entitlements.some((e) => needle.test(e.code ?? "") || needle.test(e.name ?? ""))
  );
}

function hasKompisBedriftEntitlement(detail: PlatformPortalCustomerDetail): boolean {
  const needle = /kompis[_-]?bedrift|bedrift/i;
  return detail.entitlements.some(
    (e) => needle.test(e.code ?? "") || needle.test(e.name ?? ""),
  );
}

/**
 * Modules metric from entitlements only when the array is a real payload.
 * Empty entitlements → unavailable (not fake 0/0).
 */
export function buildModulesTruth(detail: PlatformPortalCustomerDetail): ModulesTruth {
  if (!Array.isArray(detail.entitlements) || detail.entitlements.length === 0) {
    return {
      available: false,
      activeCount: null,
      totalCount: null,
      source: "unavailable",
      semantics: "entitlement_rows",
    };
  }
  const active = detail.entitlements.filter(
    (e) => (e.status ?? "").toLowerCase() === "active",
  ).length;
  return {
    available: true,
    activeCount: active,
    totalCount: detail.entitlements.length,
    source: "entitlements",
    semantics: "entitlement_rows",
  };
}

export function mapWebsiteKompisStatusToTruth(
  status: PlatformPortalWebsiteKompisStatus | null,
  detail: PlatformPortalCustomerDetail,
): CustomerProductTruthRow {
  const checkedAt = detail.metadata.generatedAt;
  if (!status) {
    const entitled = hasWebsiteKompisEntitlement(detail);
    return {
      productKey: "website_kompis",
      status: entitled ? "unknown" : "not_entitled",
      layers: {
        entitlement: entitled ? "entitled" : "not_entitled",
      },
      source: entitled ? "entitlements" : "unavailable",
      lastCheckedAt: checkedAt,
    };
  }

  const layers: CustomerProductTruthRow["layers"] = {
    entitlement: status.license.eligible
      ? status.active
        ? "active"
        : "entitled"
      : "not_entitled",
    subscription: status.agreement.eligible ? "active" : "not_entitled",
    setup:
      status.domain.eligible && status.installation.eligible
        ? "ready_for_activation"
        : "needs_setup",
    installation: status.installation.eligible
      ? status.installation.installId
        ? "active"
        : "needs_setup"
      : "needs_setup",
    runtime: status.domain.verified ? "active" : "needs_setup",
  };

  let overall: ProductTruthStatus = "needs_setup";
  if (status.active) overall = "active";
  else if (status.activationStatus === "ready_for_activation") overall = "ready_for_activation";
  else if (status.activationStatus === "suspended") overall = "suspended";
  else if (!status.license.eligible && !status.agreement.eligible) overall = "not_entitled";
  else if (status.activationStatus === "not_ready") overall = "needs_setup";

  return {
    productKey: "website_kompis",
    status: overall,
    layers,
    source: "website_kompis_status_rpc",
    lastCheckedAt: checkedAt,
  };
}

/**
 * Kompis Bedrift must never be inferred from APP membership alone.
 */
export function buildKompisBedriftTruthFromDetail(
  detail: PlatformPortalCustomerDetail,
): CustomerProductTruthRow {
  const entitled = hasKompisBedriftEntitlement(detail);
  return {
    productKey: "kompis_bedrift",
    status: entitled ? "entitled" : "not_entitled",
    layers: {
      entitlement: entitled ? "entitled" : "not_entitled",
    },
    source: entitled ? "entitlements" : "unavailable",
    lastCheckedAt: detail.metadata.generatedAt,
  };
}

export function buildAppLicenseTruth(
  detail: PlatformPortalCustomerDetail,
): CustomerProductTruthRow {
  const active = licenseActive(detail);
  const anyLicense = detail.licenses.length > 0;
  return {
    productKey: "app_license",
    status: active ? "active" : anyLicense ? "needs_setup" : "not_entitled",
    layers: {
      entitlement: active || anyLicense ? "entitled" : "not_entitled",
      subscription: detail.commercial.lifetime
        ? "active"
        : detail.commercial.subscriptionStatus
          ? "active"
          : "unknown",
    },
    source: anyLicense ? "licenses" : "commercial",
    lastCheckedAt: detail.metadata.generatedAt,
  };
}

export function buildCustomerProductTruthBundle(input: {
  detail: PlatformPortalCustomerDetail;
  websiteKompis: PlatformPortalWebsiteKompisStatus | null;
}): {
  appLicense: CustomerProductTruthRow;
  websiteKompis: CustomerProductTruthRow;
  kompisBedrift: CustomerProductTruthRow;
  modules: ModulesTruth;
} {
  return {
    appLicense: buildAppLicenseTruth(input.detail),
    websiteKompis: mapWebsiteKompisStatusToTruth(input.websiteKompis, input.detail),
    kompisBedrift: buildKompisBedriftTruthFromDetail(input.detail),
    modules: buildModulesTruth(input.detail),
  };
}

/** Display helper — never return "0/0" when source is unavailable. */
export function formatModulesMetric(
  modules: ModulesTruth,
  unavailableLabel: string,
): string {
  if (!modules.available || modules.activeCount == null || modules.totalCount == null) {
    return unavailableLabel;
  }
  return `${modules.activeCount}/${modules.totalCount}`;
}

import type { PlatformPortalCustomerDetail } from "@/lib/platform-portal/types";
import {
  buildKompisBedriftTruthFromDetail,
  buildModulesTruth,
} from "@/lib/platform-portal/customer-product-truth";
import { createAccessCorrelationId } from "./correlation";
import type {
  AccessProductStatus,
  AccessReasonCode,
  AccessSubscriptionStatus,
  PlatformCustomerControlPlaneSummary,
} from "./types";

function mapSubscription(status: string | null): AccessSubscriptionStatus {
  const s = (status ?? "").toLowerCase();
  if (s === "active" || s === "lifetime") return "active";
  if (s === "trialing" || s === "trial") return "trialing";
  if (s === "past_due" || s === "overdue") return "past_due";
  if (s === "cancelled" || s === "canceled") return "cancelled";
  if (s === "expired") return "expired";
  return "unknown";
}

function licenseRowsToProductStatus(
  detail: PlatformPortalCustomerDetail
): { status: AccessProductStatus; reason: AccessReasonCode } {
  const licenses = detail.licenses;
  if (licenses.length === 0) {
    return { status: "pending", reason: "product_pending" };
  }
  const active = licenses.filter((l) => (l.status ?? "").toLowerCase() === "active");
  const suspended = licenses.filter((l) =>
    ["suspended", "paused", "revoked"].includes((l.status ?? "").toLowerCase())
  );
  const expired = licenses.filter((l) =>
    ["expired", "cancelled", "canceled"].includes((l.status ?? "").toLowerCase())
  );
  if (active.length > 0) return { status: "active", reason: "ok" };
  if (suspended.length > 0) return { status: "suspended", reason: "product_suspended" };
  if (expired.length > 0) return { status: "expired", reason: "product_expired" };
  return { status: "pending", reason: "product_pending" };
}

function hasWebsiteKompisSignal(detail: PlatformPortalCustomerDetail): boolean {
  return (
    detail.licenses.some((l) =>
      (l.productCode ?? "").toLowerCase().includes("website_kompis")
    ) ||
    detail.entitlements.some((e) => (e.code ?? "").toLowerCase().includes("website_kompis"))
  );
}

function bedriftTruthToAccessStatus(
  truthStatus: ReturnType<typeof buildKompisBedriftTruthFromDetail>["status"]
): { status: AccessProductStatus; reason: AccessReasonCode } {
  switch (truthStatus) {
    case "active":
    case "entitled":
      return { status: "active", reason: "ok" };
    case "suspended":
      return { status: "suspended", reason: "product_suspended" };
    case "not_entitled":
      return { status: "unavailable", reason: "product_not_entitled" };
    case "ready_for_activation":
    case "needs_setup":
      return { status: "pending", reason: "product_pending" };
    default:
      return { status: "unavailable", reason: "product_not_entitled" };
  }
}

/**
 * Read-only Platform control-plane summary over existing customer detail payload.
 * One understandable status — drill-down remains in existing detail sections.
 * Kompis Bedrift is never inferred from APP membership.
 * Modules never report fake 0/0 when entitlements are empty.
 */
export function buildPlatformCustomerControlPlaneSummary(
  detail: PlatformPortalCustomerDetail
): PlatformCustomerControlPlaneSummary {
  const subscriptionStatus = mapSubscription(detail.commercial.subscriptionStatus);
  const licenseOverall = licenseRowsToProductStatus(detail);
  const webSignal = hasWebsiteKompisSignal(detail);
  const membershipReady = detail.usage.memberCount > 0;
  const provisioningReady =
    detail.usage.domainCount > 0 &&
    detail.usage.installationCount > 0 &&
    licenseOverall.status === "active";
  const bedrift = bedriftTruthToAccessStatus(buildKompisBedriftTruthFromDetail(detail).status);
  const modules = buildModulesTruth(detail);

  const products: PlatformCustomerControlPlaneSummary["products"] = [
    {
      productId: "website_kompis",
      labelKey: "website_kompis",
      status: webSignal
        ? licenseOverall.status
        : detail.usage.domainCount > 0
          ? "pending"
          : "unavailable",
      reasonCode: webSignal
        ? licenseOverall.reason
        : detail.usage.domainCount > 0
          ? "product_pending"
          : "product_not_entitled",
    },
    {
      productId: "kompisWeb",
      labelKey: "web",
      status: webSignal ? licenseOverall.status : "unavailable",
      reasonCode: webSignal ? licenseOverall.reason : "product_not_entitled",
    },
    {
      productId: "kompisBedrift",
      labelKey: "bedrift",
      status: bedrift.status,
      reasonCode: bedrift.reason,
    },
  ];

  let overallStatus: AccessProductStatus = "pending";
  let overallReasonCode: AccessReasonCode = "product_pending";
  if (!membershipReady) {
    overallStatus = "unavailable";
    overallReasonCode = "membership_missing";
  } else if (licenseOverall.status === "suspended") {
    overallStatus = "suspended";
    overallReasonCode = "product_suspended";
  } else if (licenseOverall.status === "expired" || licenseOverall.status === "cancelled") {
    overallStatus = licenseOverall.status;
    overallReasonCode = licenseOverall.reason;
  } else if (provisioningReady && licenseOverall.status === "active") {
    overallStatus = "active";
    overallReasonCode = "ok";
  } else if (detail.customer.requiresAttention) {
    overallStatus = "pending";
    overallReasonCode = "activation_gate_incomplete";
  }

  return {
    correlationId: createAccessCorrelationId(),
    customerId: detail.customer.id,
    workspaceLabel: detail.customer.legalName || detail.customer.name,
    membershipReady,
    subscriptionStatus,
    licenseOverall: licenseOverall.status,
    products,
    modulesActiveCount: modules.activeCount,
    modulesTotalCount: modules.totalCount,
    modulesAvailable: modules.available,
    domainCount: detail.usage.domainCount,
    installationCount: detail.usage.installationCount,
    provisioningReady,
    overallStatus,
    overallReasonCode,
    lastCheckedAt: detail.metadata.generatedAt,
  };
}

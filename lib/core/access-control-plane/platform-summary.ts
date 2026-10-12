import type { PlatformPortalCustomerDetail } from "@/lib/platform-portal/types";
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

/**
 * Read-only Platform control-plane summary over existing customer detail payload.
 * One understandable status — drill-down remains in existing detail sections.
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
      status: membershipReady
        ? subscriptionStatus === "cancelled" || subscriptionStatus === "expired"
          ? subscriptionStatus === "expired"
            ? "expired"
            : "cancelled"
          : "active"
        : "unavailable",
      reasonCode: membershipReady
        ? subscriptionStatus === "cancelled" || subscriptionStatus === "expired"
          ? "subscription_invalid"
          : "ok"
        : "membership_missing",
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
    modulesActiveCount: detail.entitlements.filter(
      (e) => (e.status ?? "").toLowerCase() === "active"
    ).length,
    modulesTotalCount: detail.entitlements.length,
    domainCount: detail.usage.domainCount,
    installationCount: detail.usage.installationCount,
    provisioningReady,
    overallStatus,
    overallReasonCode,
    lastCheckedAt: detail.metadata.generatedAt,
  };
}

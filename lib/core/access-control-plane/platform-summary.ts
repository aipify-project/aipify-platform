import type { PlatformPortalCustomerDetail } from "@/lib/platform-portal/types";
import {
  buildProductStatusTruth,
  type ProductStatusTruthOverlay,
} from "@/lib/platform-portal/product-status-truth";
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
  detail: PlatformPortalCustomerDetail,
): { status: AccessProductStatus; reason: AccessReasonCode } {
  const licenses = detail.licenses;
  if (licenses.length === 0) {
    return { status: "pending", reason: "product_pending" };
  }
  const active = licenses.filter((l) => (l.status ?? "").toLowerCase() === "active");
  const suspended = licenses.filter((l) =>
    ["suspended", "paused", "revoked"].includes((l.status ?? "").toLowerCase()),
  );
  const expired = licenses.filter((l) =>
    ["expired", "cancelled", "canceled"].includes((l.status ?? "").toLowerCase()),
  );
  if (active.length > 0) return { status: "active", reason: "ok" };
  if (suspended.length > 0) return { status: "suspended", reason: "product_suspended" };
  if (expired.length > 0) return { status: "expired", reason: "product_expired" };
  return { status: "pending", reason: "product_pending" };
}

/**
 * Read-only Platform control-plane summary over existing customer detail payload.
 * Product chips use the product-status-truth contract (Bedrift never from membership).
 */
export function buildPlatformCustomerControlPlaneSummary(
  detail: PlatformPortalCustomerDetail,
  overlay: ProductStatusTruthOverlay = {},
): PlatformCustomerControlPlaneSummary {
  const subscriptionStatus = mapSubscription(detail.commercial.subscriptionStatus);
  const licenseOverall = licenseRowsToProductStatus(detail);
  const truth = buildProductStatusTruth(detail, overlay);
  const membershipReady = detail.usage.memberCount > 0;
  const provisioningReady =
    detail.usage.domainCount > 0 &&
    detail.usage.installationCount > 0 &&
    licenseOverall.status === "active";

  const products: PlatformCustomerControlPlaneSummary["products"] = truth.productChips.map(
    (chip) => ({
      productId: chip.productId,
      labelKey: chip.labelKey,
      status: chip.status,
      reasonCode: chip.reasonCode,
    }),
  );

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
      (e) => (e.status ?? "").toLowerCase() === "active",
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

/**
 * Canonical Platform → APP access control plane (job 62).
 * Read-model only — no SQL, no payment mutation, no client trust of tenant/product ids.
 */

import type { AppProductContextId } from "@/lib/app-portal/product-context/constants";

/** Correlation id for observability (never contains secrets). */
export type AccessControlCorrelationId = string;

export type AccessProductStatus =
  | "pending"
  | "active"
  | "suspended"
  | "expired"
  | "cancelled"
  | "unavailable"
  | "conflict";

export type AccessLicenseServiceStatus = "active" | "grace_period" | "paused" | "unknown";

export type AccessSubscriptionStatus =
  | "active"
  | "trialing"
  | "past_due"
  | "cancelled"
  | "expired"
  | "unknown";

export type AccessModuleKind = "standard_included" | "paid_addon" | "reserved";

export type AccessModuleLifecycle =
  | "active"
  | "pending_payment"
  | "pending_provisioning"
  | "suspended"
  | "cancelled"
  | "expired"
  | "inactive"
  | "unavailable_for_product"
  | "hidden_reserved";

/** Stable reason codes — safe for logs / admin drill-down; never secrets. */
export type AccessReasonCode =
  | "ok"
  | "membership_missing"
  | "membership_revoked"
  | "product_not_entitled"
  | "product_suspended"
  | "product_expired"
  | "product_cancelled"
  | "product_pending"
  | "product_conflict"
  | "license_paused"
  | "license_unknown"
  | "subscription_invalid"
  | "module_inactive"
  | "module_pending"
  | "module_status_unknown"
  | "activation_gate_incomplete"
  | "cookie_not_authorization"
  | "path_not_authorized"
  | "fail_closed"
  | "reserved_capability_hidden";

export type AccessCapabilityCatalogEntry = {
  capabilityKey: string;
  kind: AccessModuleKind;
  /** Products that may eventually host this capability. */
  products: AppProductContextId[];
  /** Default lifecycle when not assigned. */
  defaultLifecycle: AccessModuleLifecycle;
  /** When true, never appear in customer navigation until a later job activates it. */
  menuHiddenUntilActivated: boolean;
};

export type AccessProductContextView = {
  productId: AppProductContextId;
  status: AccessProductStatus;
  authorized: boolean;
  reasonCode: AccessReasonCode;
  moduleKey: string | null;
};

export type AccessModuleView = {
  capabilityKey: string;
  kind: AccessModuleKind;
  lifecycle: AccessModuleLifecycle;
  visible: boolean;
  usable: boolean;
  reasonCode: AccessReasonCode;
  products: AppProductContextId[];
};

export type AccessControlPlaneSnapshot = {
  correlationId: AccessControlCorrelationId;
  organizationId: string | null;
  customerId: string | null;
  userId: string | null;
  role: string | null;
  membershipValid: boolean;
  subscriptionStatus: AccessSubscriptionStatus;
  licenseServiceStatus: AccessLicenseServiceStatus;
  products: AccessProductContextView[];
  modules: AccessModuleView[];
  /** Allowed product contexts for switcher / menu (server-approved only). */
  authorizedProductIds: AppProductContextId[];
  generatedAt: string;
};

export type ActivationGateInput = {
  paymentOrContractValid: boolean;
  subscriptionValid: boolean;
  licenseValid: boolean;
  moduleAssignmentValid: boolean;
  tenantProductValid: boolean;
  runtimeCapabilityReady: boolean;
};

export type ActivationGateResult = {
  open: boolean;
  reasonCode: AccessReasonCode;
  failedChecks: Array<keyof ActivationGateInput>;
};

export type PlatformCustomerControlPlaneSummary = {
  correlationId: AccessControlCorrelationId;
  customerId: string;
  workspaceLabel: string;
  membershipReady: boolean;
  subscriptionStatus: AccessSubscriptionStatus;
  licenseOverall: AccessProductStatus;
  products: Array<{
    productId: AppProductContextId | "website_kompis";
    labelKey: "web" | "bedrift" | "website_kompis";
    status: AccessProductStatus;
    reasonCode: AccessReasonCode;
  }>;
  modulesActiveCount: number;
  modulesTotalCount: number;
  domainCount: number;
  installationCount: number;
  provisioningReady: boolean;
  overallStatus: AccessProductStatus;
  overallReasonCode: AccessReasonCode;
  lastCheckedAt: string;
};

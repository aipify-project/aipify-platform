/**
 * Job 66 — deterministic connection aggregate status (server-composed; no LLM).
 */

import type {
  ConnectionAggregateStatus,
  ConnectionCheckpointId,
  ConnectionCheckpointState,
  ConnectionDiagnosisCode,
} from "@/lib/website-kompis-connection/source-inventory";

export type ConnectionCheckpoint = {
  id: ConnectionCheckpointId;
  state: ConnectionCheckpointState;
};

export type ConnectionDomainRow = {
  domainId: string;
  domain: string;
  isPrimary: boolean;
  domainStatus: string;
  verificationStatus: string;
  licenseStatus: string;
  hasCustomerBinding: boolean;
  bindingVerified: boolean;
  hasInstallId: boolean;
  /** Masked public install identifier when present (never a secret). */
  installIdMasked: string | null;
};

export type ConnectionStatusSummary = {
  aggregate: ConnectionAggregateStatus;
  diagnosis: ConnectionDiagnosisCode;
  checkpoints: ConnectionCheckpoint[];
  productEnabled: boolean | null;
  planName: string | null;
  licenseStatus: string | null;
  orgContextState: string;
  canManage: boolean;
  domainCenterLoaded: boolean;
  domains: ConnectionDomainRow[];
  activeDomainCount: number;
  pendingDomainCount: number;
  verifiedBoundDomainCount: number;
  installDetectedCount: number;
  pageVisibilityMode: "default_all_public_approved_pages";
  pageVisibilityEditable: false;
  runtimeLastSeenAvailable: false;
  subscriptionHrefSection: "subscription";
  supportReference: string;
};

export type BuildConnectionStatusInput = {
  orgContextState: string;
  planName: string | null;
  licenseStatus: string | null;
  productEnabled: boolean | null;
  canManage: boolean;
  domainCenterLoaded: boolean;
  accessDenied: boolean;
  domains: ConnectionDomainRow[];
  pendingDomainCount: number;
  correlationSeed?: string | null;
};

function maskInstallId(installId: string | null | undefined): string | null {
  if (!installId || typeof installId !== "string") return null;
  const trimmed = installId.trim();
  if (trimmed.length < 8) return "••••";
  return `${trimmed.slice(0, 4)}…${trimmed.slice(-4)}`;
}

export function maskWebsiteKompisInstallId(installId: string | null | undefined): string | null {
  return maskInstallId(installId);
}

function buildSupportReference(seed: string | null | undefined): string {
  const base = (seed ?? "wk-connection").replace(/[^a-zA-Z0-9_-]/g, "").slice(0, 24);
  return `WK-CONN-${base || "REF"}`;
}

/**
 * Precedence (fail closed):
 * suspended > error > action_required > pending > unconfigured > active
 * Public runtime may be unavailable without blocking Active when the required chain is ok.
 */
export function composeConnectionAggregate(
  checkpoints: ConnectionCheckpoint[],
): ConnectionAggregateStatus {
  const required = checkpoints.filter((c) => c.id !== "public_runtime");
  const requiredStates = new Set(required.map((c) => c.state));
  if (requiredStates.has("suspended")) return "suspended";
  if (requiredStates.has("error")) return "error";
  if (requiredStates.has("action_required")) return "action_required";
  if (requiredStates.has("pending")) return "pending";
  if (required.every((c) => c.state === "ok")) return "active";
  if (requiredStates.has("unconfigured") || requiredStates.has("unavailable")) {
    return "unconfigured";
  }
  return "unconfigured";
}

export function selectDiagnosisCode(input: {
  accessDenied: boolean;
  orgContextState: string;
  productEnabled: boolean | null;
  domains: ConnectionDomainRow[];
  pendingDomainCount: number;
  aggregate: ConnectionAggregateStatus;
}): ConnectionDiagnosisCode {
  if (input.accessDenied) return "access_denied";
  if (
    input.orgContextState === "license_inactive" ||
    input.orgContextState === "subscription_inactive"
  ) {
    return input.orgContextState === "subscription_inactive"
      ? "subscription_inactive"
      : "license_inactive";
  }
  if (input.productEnabled === false) return "product_not_enabled";
  if (input.domains.length === 0 && input.pendingDomainCount === 0) return "no_domain";
  if (input.pendingDomainCount > 0 && input.domains.every((d) => !d.bindingVerified)) {
    return "domain_unverified";
  }
  const anyVerified = input.domains.some((d) => d.bindingVerified);
  if (!anyVerified && input.domains.length > 0) return "domain_unverified";
  const anyInstall = input.domains.some((d) => d.hasInstallId);
  if (anyVerified && !anyInstall) return "install_missing";
  if (input.aggregate === "active") return "all_clear";
  if (input.aggregate === "pending") return "domain_unverified";
  if (input.aggregate === "error" || input.aggregate === "suspended") {
    return "unknown_conflict";
  }
  if (!anyInstall) return "install_missing";
  return "runtime_unknown";
}

export function buildConnectionStatusSummary(
  input: BuildConnectionStatusInput,
): ConnectionStatusSummary {
  const verifiedBoundDomainCount = input.domains.filter((d) => d.bindingVerified).length;
  const installDetectedCount = input.domains.filter((d) => d.hasInstallId).length;

  const productState: ConnectionCheckpointState =
    input.productEnabled === true
      ? "ok"
      : input.productEnabled === false
        ? "error"
        : "unavailable";

  let subscriptionState: ConnectionCheckpointState = "ok";
  let licenseState: ConnectionCheckpointState = "ok";
  if (input.orgContextState === "subscription_inactive") {
    subscriptionState = "suspended";
    licenseState = "suspended";
  } else if (input.orgContextState === "license_inactive") {
    subscriptionState = "ok";
    licenseState = "suspended";
  } else if (input.orgContextState === "entitlement_missing") {
    licenseState = "error";
  } else if (input.orgContextState !== "ready") {
    subscriptionState = "unavailable";
    licenseState = "unavailable";
  } else if (
    input.licenseStatus &&
    ["paused", "suspended", "cancelled", "expired"].includes(input.licenseStatus)
  ) {
    licenseState = "suspended";
  }

  let domainState: ConnectionCheckpointState = "unconfigured";
  if (input.pendingDomainCount > 0 && verifiedBoundDomainCount === 0) {
    domainState = "pending";
  } else if (verifiedBoundDomainCount > 0) {
    domainState = "ok";
  } else if (input.domains.length > 0) {
    domainState = "action_required";
  } else if (input.domainCenterLoaded) {
    domainState = "unconfigured";
  } else {
    domainState = "unavailable";
  }

  let installationState: ConnectionCheckpointState = "unconfigured";
  if (installDetectedCount > 0 && verifiedBoundDomainCount > 0) {
    installationState = "ok";
  } else if (verifiedBoundDomainCount > 0 && installDetectedCount === 0) {
    installationState = "action_required";
  } else if (domainState === "pending") {
    installationState = "pending";
  } else if (!input.domainCenterLoaded) {
    installationState = "unavailable";
  }

  const publicRuntimeState: ConnectionCheckpointState = "unavailable";

  const checkpoints: ConnectionCheckpoint[] = [
    { id: "product", state: productState },
    { id: "subscription", state: subscriptionState },
    { id: "license", state: licenseState },
    { id: "domain", state: domainState },
    { id: "installation", state: installationState },
    { id: "public_runtime", state: publicRuntimeState },
  ];

  let aggregate = composeConnectionAggregate(checkpoints);
  if (input.accessDenied) {
    aggregate = "error";
  }

  // Active requires product + license/subscription ok + domain verified + install detected.
  // Public runtime last-seen is not available — does not block Active when chain is otherwise complete.
  if (
    !input.accessDenied &&
    productState === "ok" &&
    (subscriptionState === "ok" || subscriptionState === "unavailable") &&
    licenseState === "ok" &&
    domainState === "ok" &&
    installationState === "ok"
  ) {
    aggregate = "active";
  }

  const diagnosis = selectDiagnosisCode({
    accessDenied: input.accessDenied,
    orgContextState: input.orgContextState,
    productEnabled: input.productEnabled,
    domains: input.domains,
    pendingDomainCount: input.pendingDomainCount,
    aggregate,
  });

  return {
    aggregate,
    diagnosis,
    checkpoints,
    productEnabled: input.productEnabled,
    planName: input.planName,
    licenseStatus: input.licenseStatus,
    orgContextState: input.orgContextState,
    canManage: input.canManage,
    domainCenterLoaded: input.domainCenterLoaded,
    domains: input.domains,
    activeDomainCount: input.domains.length,
    pendingDomainCount: input.pendingDomainCount,
    verifiedBoundDomainCount,
    installDetectedCount,
    pageVisibilityMode: "default_all_public_approved_pages",
    pageVisibilityEditable: false,
    runtimeLastSeenAvailable: false,
    subscriptionHrefSection: "subscription",
    supportReference: buildSupportReference(input.correlationSeed),
  };
}

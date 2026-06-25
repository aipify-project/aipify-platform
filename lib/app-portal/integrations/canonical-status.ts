import type { SemanticBadgeType } from "@/lib/design/semantic-status-system";
import type { AppPortalIntegrationConnection } from "./types";
export type IntegrationCanonicalStatus =
  | "not_configured"
  | "credential_saved"
  | "verification_pending"
  | "verification_failed"
  | "verified"
  | "active"
  | "inactive"
  | "revoked"
  | "removed";

export type IntegrationCanonicalStatusInput = {
  status?: string | null;
  canonical_status?: string | null;
  hasCredential?: boolean;
  last_test_success_at?: string | null;
  last_test_failed_at?: string | null;
  last_test_error?: string | null;
  activated_at?: string | null;
  deactivated_at?: string | null;
  removed_at?: string | null;
};

export type IntegrationCanonicalBadgeConfig = {
  canonicalStatus: IntegrationCanonicalStatus;
  badgeType: SemanticBadgeType;
  badgeValue: string;
  labelKey: string;
};

const CANONICAL_LABEL_KEYS: Record<IntegrationCanonicalStatus, string> = {
  not_configured: "customerApp.portalStructure.integrations.statuses.notConfigured",
  credential_saved: "customerApp.portalStructure.integrations.statuses.credentialSaved",
  verification_pending: "customerApp.portalStructure.integrations.statuses.pending",
  verification_failed: "customerApp.portalStructure.integrations.statuses.failed",
  verified: "customerApp.portalStructure.integrations.statuses.connected",
  active: "customerApp.portalStructure.integrations.statuses.active",
  inactive: "customerApp.portalStructure.integrations.statuses.inactive",
  revoked: "customerApp.portalStructure.integrations.statuses.revoked",
  removed: "customerApp.portalStructure.integrations.statuses.removed",
};

const CANONICAL_BADGE: Record<
  IntegrationCanonicalStatus,
  { type: SemanticBadgeType; value: string }
> = {
  not_configured: { type: "workflow", value: "open" },
  credential_saved: { type: "workflow", value: "open" },
  verification_pending: { type: "workflow", value: "pending" },
  verification_failed: { type: "severity", value: "critical" },
  verified: { type: "health", value: "healthy" },
  active: { type: "health", value: "healthy" },
  inactive: { type: "workflow", value: "paused" },
  revoked: { type: "severity", value: "critical" },
  removed: { type: "workflow", value: "closed" },
};

function normalizeKey(value: string | null | undefined): string {
  return (value ?? "").toLowerCase().replace(/[\s-]+/g, "_");
}

function parseTimestamp(value: string | null | undefined): number | null {
  if (!value) return null;
  const ms = new Date(value).getTime();
  return Number.isNaN(ms) ? null : ms;
}

function testFailedIsNewer(input: IntegrationCanonicalStatusInput): boolean {
  const failedAt = parseTimestamp(input.last_test_failed_at);
  if (failedAt === null) return false;
  const successAt = parseTimestamp(input.last_test_success_at);
  if (successAt === null) return true;
  return failedAt > successAt;
}

function isActivated(input: IntegrationCanonicalStatusInput): boolean {
  const activatedAt = parseTimestamp(input.activated_at);
  if (activatedAt === null) return normalizeKey(input.status) === "active";
  const deactivatedAt = parseTimestamp(input.deactivated_at);
  if (deactivatedAt === null) return true;
  return activatedAt > deactivatedAt;
}

function isDeactivated(input: IntegrationCanonicalStatusInput): boolean {
  const deactivatedAt = parseTimestamp(input.deactivated_at);
  if (deactivatedAt === null) return normalizeKey(input.status) === "inactive";
  const activatedAt = parseTimestamp(input.activated_at);
  if (activatedAt === null) return true;
  return deactivatedAt >= activatedAt;
}

export function resolveIntegrationCanonicalStatus(
  input: IntegrationCanonicalStatusInput
): IntegrationCanonicalStatus {
  if (input.removed_at) return "removed";

  const status = normalizeKey(input.status);
  if (status === "revoked") return "revoked";

  if (testFailedIsNewer(input)) {
    return "verification_failed";
  }

  if (
    (status === "failed" || status === "error" || status === "disconnected") &&
    !input.last_test_success_at
  ) {
    return "verification_failed";
  }

  if (status === "pending" || status === "" || status === "new") {
    if (input.hasCredential && !input.last_test_success_at) return "credential_saved";
    if (!input.hasCredential) return "not_configured";
    return "verification_pending";
  }

  if (status === "inactive" || isDeactivated(input)) return "inactive";

  if (status === "active" || isActivated(input)) return "active";

  if (input.last_test_success_at || status === "connected" || status === "verified") {
    return "verified";
  }

  return "verification_pending";
}

export function connectionToCanonicalInput(
  connection: AppPortalIntegrationConnection
): IntegrationCanonicalStatusInput {
  return {
    status: connection.status,
    canonical_status: connection.canonical_status,
    hasCredential: Boolean(connection.masked_credential_hint || connection.id),
    last_test_success_at: connection.last_test_success_at,
    last_test_failed_at: connection.last_test_failed_at,
    last_test_error: connection.last_test_error,
    activated_at: connection.activated_at,
    deactivated_at: connection.deactivated_at,
    removed_at: connection.removed_at,
  };
}

export function getIntegrationCanonicalBadgeConfig(
  canonicalStatus: IntegrationCanonicalStatus
): IntegrationCanonicalBadgeConfig {
  const badge = CANONICAL_BADGE[canonicalStatus];
  return {
    canonicalStatus,
    badgeType: badge.type,
    badgeValue: badge.value,
    labelKey: CANONICAL_LABEL_KEYS[canonicalStatus],
  };
}

export type IntegrationHubActionTier = "active" | "verified" | "failed" | "pending";

export function resolveCanonicalHubActionTier(
  canonicalStatus: IntegrationCanonicalStatus
): IntegrationHubActionTier {
  if (canonicalStatus === "verification_failed") return "failed";
  if (canonicalStatus === "active" || canonicalStatus === "inactive") return "active";
  if (canonicalStatus === "verified") return "verified";
  return "pending";
}

export function shouldShowLastTestSuccess(connection: AppPortalIntegrationConnection): boolean {
  const canonical = resolveIntegrationCanonicalStatus(connectionToCanonicalInput(connection));
  if (canonical === "verification_failed") return false;
  return Boolean(connection.last_test_success_at);
}

export function shouldShowLastTestFailed(connection: AppPortalIntegrationConnection): boolean {
  return resolveIntegrationCanonicalStatus(connectionToCanonicalInput(connection)) === "verification_failed";
}

const CANONICAL_TO_STATUS_LABEL_KEY: Record<
  IntegrationCanonicalStatus,
  keyof import("./types").IntegrationStatusLabels
> = {
  not_configured: "notConfigured",
  credential_saved: "credentialSaved",
  verification_pending: "pending",
  verification_failed: "failed",
  verified: "connected",
  active: "active",
  inactive: "inactive",
  revoked: "revoked",
  removed: "removed",
};

export function canonicalStatusLabelKey(
  canonicalStatus: IntegrationCanonicalStatus
): keyof import("./types").IntegrationStatusLabels {
  return CANONICAL_TO_STATUS_LABEL_KEY[canonicalStatus];
}

export type IntegrationSetupCompletionMode = "credential_saved" | "verified" | "active";

/** Map a persisted connection to wizard completion mode, or null when setup should continue. */
export function resolveCompletionModeFromConnection(
  connection: AppPortalIntegrationConnection | null | undefined
): IntegrationSetupCompletionMode | null {
  if (!connection) return null;

  const canonical = resolveIntegrationCanonicalStatus(connectionToCanonicalInput(connection));
  if (
    canonical === "verification_failed" ||
    canonical === "removed" ||
    canonical === "revoked" ||
    canonical === "not_configured" ||
    canonical === "verification_pending"
  ) {
    return null;
  }
  if (canonical === "active" || canonical === "inactive") return "active";
  if (canonical === "verified") return "verified";
  if (canonical === "credential_saved") return "credential_saved";
  return null;
}

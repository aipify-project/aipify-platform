import type { SemanticBadgeType } from "@/lib/design/semantic-status-system";
import {
  type IntegrationCanonicalStatus,
  type IntegrationCanonicalStatusInput,
  resolveIntegrationCanonicalStatus,
} from "@/lib/app-portal/integrations/canonical-status";

/** Customer-facing connection status for integration setup (list/hub). */
export type IntegrationConnectionSemanticStatus =
  | "pending"
  | "missing_info"
  | "needs_review"
  | "connected"
  | "failed"
  | "read_only";

/** Wizard-specific semantic phases for the connect flow. */
export type IntegrationWizardConnectionPhase =
  | "pending"
  | "credential_saved"
  | "failed"
  | "verified_read_only"
  | "active";

export type IntegrationConnectionBadgeConfig = {
  semanticStatus: IntegrationConnectionSemanticStatus;
  badgeType: SemanticBadgeType;
  badgeValue: string;
  labelKey: string;
};

export type IntegrationWizardPhaseBadgeConfig = {
  phase: IntegrationWizardConnectionPhase;
  badgeType: SemanticBadgeType;
  badgeValue: string;
  labelKey: string;
};

const STATUS_LABEL_KEYS: Record<IntegrationConnectionSemanticStatus, string> = {
  pending: "customerApp.portalStructure.integrations.statuses.pending",
  missing_info: "customerApp.portalStructure.integrations.statuses.missingInfo",
  needs_review: "customerApp.portalStructure.integrations.statuses.needsReview",
  connected: "customerApp.portalStructure.integrations.statuses.connected",
  failed: "customerApp.portalStructure.integrations.statuses.failed",
  read_only: "customerApp.portalStructure.integrations.statuses.readOnly",
};

const WIZARD_PHASE_LABEL_KEYS: Record<IntegrationWizardConnectionPhase, string> = {
  pending: "customerApp.portalStructure.integrations.statuses.pending",
  credential_saved: "customerApp.portalStructure.integrations.statuses.credentialSaved",
  failed: "customerApp.portalStructure.integrations.statuses.failed",
  verified_read_only: "customerApp.portalStructure.integrations.statuses.verifiedReadOnly",
  active: "customerApp.portalStructure.integrations.statuses.active",
};

const STATUS_BADGE: Record<
  IntegrationConnectionSemanticStatus,
  { type: SemanticBadgeType; value: string }
> = {
  pending: { type: "workflow", value: "pending" },
  missing_info: { type: "workflow", value: "open" },
  needs_review: { type: "workflow", value: "awaiting_approval" },
  connected: { type: "health", value: "healthy" },
  failed: { type: "severity", value: "critical" },
  read_only: { type: "access", value: "restricted" },
};

const WIZARD_PHASE_BADGE: Record<
  IntegrationWizardConnectionPhase,
  { type: SemanticBadgeType; value: string }
> = {
  pending: { type: "workflow", value: "pending" },
  credential_saved: { type: "workflow", value: "open" },
  failed: { type: "severity", value: "critical" },
  verified_read_only: { type: "health", value: "healthy" },
  active: { type: "health", value: "healthy" },
};

function normalizeStatusKey(status: string | null | undefined): string {
  return (status ?? "").toLowerCase().replace(/[\s-]+/g, "_");
}

function isReadOnlyPermission(permissionLevel: string | null | undefined): boolean {
  const permission = (permissionLevel ?? "").toLowerCase();
  return permission === "read_only" || permission === "readonly";
}

function testFailedAfterLastSuccess(options: {
  lastTestSuccessAt?: string | null;
  lastTestFailedAt?: string | null;
  lastTestError?: string | null;
}): boolean {
  return (
    resolveIntegrationCanonicalStatus({
      status: "connected",
      hasCredential: true,
      last_test_success_at: options.lastTestSuccessAt,
      last_test_failed_at: options.lastTestFailedAt,
      last_test_error: options.lastTestError,
    }) === "verification_failed"
  );
}

function toCanonicalInput(
  status: string | null | undefined,
  options?: {
    permissionLevel?: string | null;
    hasCredential?: boolean;
    lastTestSuccessAt?: string | null;
    lastTestFailedAt?: string | null;
    lastTestError?: string | null;
    activatedAt?: string | null;
    deactivatedAt?: string | null;
    removedAt?: string | null;
    canonicalStatus?: string | null;
  }
): IntegrationCanonicalStatusInput {
  return {
    status,
    canonical_status: options?.canonicalStatus,
    hasCredential: options?.hasCredential,
    last_test_success_at: options?.lastTestSuccessAt,
    last_test_failed_at: options?.lastTestFailedAt,
    last_test_error: options?.lastTestError,
    activated_at: options?.activatedAt,
    deactivated_at: options?.deactivatedAt,
    removed_at: options?.removedAt,
  };
}

function semanticFromCanonical(
  canonical: IntegrationCanonicalStatus,
  permissionLevel?: string | null
): IntegrationConnectionSemanticStatus {
  if (canonical === "verification_failed") return "failed";
  if (canonical === "inactive") return "needs_review";
  if (canonical === "revoked" || canonical === "removed") return "failed";
  if (canonical === "not_configured") return "missing_info";
  if (canonical === "credential_saved" || canonical === "verification_pending") return "pending";
  if (canonical === "active" || canonical === "verified") {
    return isReadOnlyPermission(permissionLevel) ? "read_only" : "connected";
  }
  return "pending";
}

export function mapConnectionStatusToSemantic(
  status: string | null | undefined,
  options?: {
    permissionLevel?: string | null;
    hasCredential?: boolean;
    lastTestSuccessAt?: string | null;
    lastTestFailedAt?: string | null;
    lastTestError?: string | null;
    activatedAt?: string | null;
    deactivatedAt?: string | null;
    removedAt?: string | null;
    canonicalStatus?: string | null;
  }
): IntegrationConnectionSemanticStatus {
  const key = normalizeStatusKey(status);
  if (key === "needs_review" || key === "review" || key === "attention") return "needs_review";
  if (key === "missing_info" || key === "incomplete" || key === "draft") return "missing_info";
  if (key === "read_only" || key === "readonly") return "read_only";

  const canonical = resolveIntegrationCanonicalStatus(toCanonicalInput(status, options));
  return semanticFromCanonical(canonical, options?.permissionLevel);
}

export function mapWizardConnectionPhase(
  status: string | null | undefined,
  options: {
    permissionLevel?: string | null;
    hasCredential?: boolean;
    lastTestSuccessAt?: string | null;
    lastTestFailedAt?: string | null;
    lastTestError?: string | null;
    activationComplete?: boolean;
    activatedAt?: string | null;
    deactivatedAt?: string | null;
    canonicalStatus?: string | null;
  }
): IntegrationWizardConnectionPhase {
  const canonical = resolveIntegrationCanonicalStatus(
    toCanonicalInput(status, {
      ...options,
      lastTestSuccessAt: options.lastTestSuccessAt,
      lastTestFailedAt: options.lastTestFailedAt,
      lastTestError: options.lastTestError,
      activatedAt: options.activatedAt,
      deactivatedAt: options.deactivatedAt,
      canonicalStatus: options.canonicalStatus,
    })
  );

  if (canonical === "active" || (options.activationComplete && canonical === "verified")) {
    return "active";
  }
  if (canonical === "verification_failed") return "failed";
  if (canonical === "verified" || canonical === "inactive") return "verified_read_only";
  if (canonical === "credential_saved") return "credential_saved";
  return "pending";
}

export function getIntegrationConnectionBadgeConfig(
  semanticStatus: IntegrationConnectionSemanticStatus
): IntegrationConnectionBadgeConfig {
  const badge = STATUS_BADGE[semanticStatus];
  return {
    semanticStatus,
    badgeType: badge.type,
    badgeValue: badge.value,
    labelKey: STATUS_LABEL_KEYS[semanticStatus],
  };
}

export function getIntegrationWizardPhaseBadgeConfig(
  phase: IntegrationWizardConnectionPhase
): IntegrationWizardPhaseBadgeConfig {
  const badge = WIZARD_PHASE_BADGE[phase];
  return {
    phase,
    badgeType: badge.type,
    badgeValue: badge.value,
    labelKey: WIZARD_PHASE_LABEL_KEYS[phase],
  };
}

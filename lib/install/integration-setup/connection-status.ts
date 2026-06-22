import type { SemanticBadgeType } from "@/lib/design/semantic-status-system";

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
  if (options.lastTestError && !options.lastTestSuccessAt) return true;
  if (!options.lastTestFailedAt) return false;
  if (!options.lastTestSuccessAt) return true;
  return (
    new Date(options.lastTestFailedAt).getTime() >
    new Date(options.lastTestSuccessAt).getTime()
  );
}

export function mapConnectionStatusToSemantic(
  status: string | null | undefined,
  options?: {
    permissionLevel?: string | null;
    hasCredential?: boolean;
    lastTestSuccessAt?: string | null;
    lastTestFailedAt?: string | null;
    lastTestError?: string | null;
  }
): IntegrationConnectionSemanticStatus {
  const key = normalizeStatusKey(status);
  const permission = (options?.permissionLevel ?? "").toLowerCase();

  if (key === "connected" || key === "active" || key === "verified") {
    if (testFailedAfterLastSuccess(options ?? {})) return "failed";
    if (isReadOnlyPermission(permission)) return "read_only";
    if (options?.lastTestSuccessAt) return "connected";
    return "connected";
  }

  if (key === "failed" || key === "error" || key === "disconnected") return "failed";
  if (key === "needs_review" || key === "review" || key === "attention") return "needs_review";
  if (key === "missing_info" || key === "incomplete" || key === "draft") return "missing_info";
  if (key === "read_only" || key === "readonly") return "read_only";

  if (!options?.hasCredential && (key === "pending" || key === "" || key === "new")) {
    return "missing_info";
  }

  if (testFailedAfterLastSuccess(options ?? {})) return "failed";
  if (options?.lastTestSuccessAt) {
    return isReadOnlyPermission(permission) ? "read_only" : "connected";
  }

  return "pending";
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
  }
): IntegrationWizardConnectionPhase {
  const key = normalizeStatusKey(status);

  if (options.activationComplete || key === "active") {
    if (options.lastTestSuccessAt && !testFailedAfterLastSuccess(options)) {
      return "active";
    }
  }

  if (testFailedAfterLastSuccess(options)) return "failed";
  if (key === "failed" || key === "error") return "failed";

  if (
    options.lastTestSuccessAt &&
    (key === "connected" || key === "verified" || key === "active")
  ) {
    return "verified_read_only";
  }

  if (options.hasCredential && !options.lastTestSuccessAt) {
    return "credential_saved";
  }

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

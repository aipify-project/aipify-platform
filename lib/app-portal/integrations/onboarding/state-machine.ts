import type { IntegrationCanonicalStatus } from "../canonical-status";
import type { CoreProviderInstallationState, CoreProviderReadinessLevel, CoreProviderSupportLevel } from "./enums";

const TRANSITIONS: Readonly<Record<CoreProviderInstallationState, readonly CoreProviderInstallationState[]>> = {
  not_started: ["requirements_pending", "awaiting_customer_action", "blocked", "unsupported"],
  requirements_pending: ["awaiting_customer_action", "awaiting_provider_action", "awaiting_aipify_action", "installation_in_progress", "blocked", "unsupported"],
  awaiting_customer_action: ["installation_in_progress", "credential_required", "blocked", "unsupported"],
  awaiting_provider_action: ["installation_in_progress", "blocked", "unsupported"],
  awaiting_aipify_action: ["installation_in_progress", "blocked", "unsupported"],
  installation_in_progress: ["credential_required", "connection_test_required", "verified", "blocked", "degraded"],
  credential_required: ["credential_stored", "blocked", "unsupported"],
  credential_stored: ["connection_test_required", "verified", "revoke_required", "blocked"],
  connection_test_required: ["connection_test_failed", "verified", "credential_required", "blocked"],
  connection_test_failed: ["credential_required", "connection_test_required", "blocked"],
  verified: ["activation_required", "active", "degraded", "revoke_required", "uninstall_pending"],
  activation_required: ["active", "verified", "blocked"],
  active: ["update_available", "degraded", "suspended", "revoke_required", "uninstall_pending"],
  update_available: ["upgrade_in_progress", "active", "uninstall_pending"],
  upgrade_in_progress: ["active", "degraded", "blocked"],
  degraded: ["connection_test_required", "verified", "suspended", "revoke_required", "uninstall_pending", "blocked"],
  suspended: ["connection_test_required", "verified", "revoke_required", "uninstall_pending", "removed"],
  revoke_required: ["credential_required", "uninstall_pending", "removed"],
  uninstall_pending: ["removed", "blocked"],
  removed: ["not_started"],
  blocked: ["requirements_pending", "not_started"],
  unsupported: [],
};

export type CoreProviderInstallationAuditEvent = {
  from: CoreProviderInstallationState; to: CoreProviderInstallationState; actor: "customer" | "aipify" | "provider" | "partner" | "system";
  reason: string; occurredAt: string;
};

export function canTransition(from: CoreProviderInstallationState, to: CoreProviderInstallationState): boolean {
  return TRANSITIONS[from].includes(to);
}
export function assertTransition(from: CoreProviderInstallationState, to: CoreProviderInstallationState): void {
  if (!canTransition(from, to)) throw new Error(`Invalid provider installation transition: ${from} -> ${to}`);
}
export function isActivationAllowed(
  state: CoreProviderInstallationState,
  readiness: CoreProviderReadinessLevel,
  support: CoreProviderSupportLevel
): boolean {
  return (state === "verified" || state === "activation_required") &&
    !["blocked", "unsupported", "deprecated"].includes(readiness) && support !== "unsupported";
}
export function mapSecretStreamStatusToInstallationState(status: IntegrationCanonicalStatus | string): CoreProviderInstallationState {
  switch (status) {
    case "not_configured": return "credential_required";
    case "credential_saved": return "credential_stored";
    case "verification_pending": return "connection_test_required";
    case "verification_failed": return "connection_test_failed";
    case "rotation_required": return "revoke_required";
    case "verified": return "verified";
    case "active": return "active";
    case "inactive": return "suspended";
    case "revoked": return "revoke_required";
    case "removed": return "removed";
    default: return "blocked";
  }
}

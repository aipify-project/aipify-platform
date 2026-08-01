import type { CoreProviderInstallationState } from "./enums";
import type { CoreProviderOnboardingContract } from "./types";
import { isActivationAllowed } from "./state-machine";

export type CoreProviderOnboardingSafeActions = {
  showOAuthConnect: boolean; showApiKeyFields: boolean; showConnectorDownload: boolean; showHostedActivate: boolean;
  showCustomSteps: boolean; showUpgrade: boolean; showRollback: boolean; showUninstall: boolean; showRotate: boolean;
  showRevoke: boolean; showHealthCheck: boolean; showActivate: boolean;
};
const TERMINAL = new Set<CoreProviderInstallationState>(["removed", "blocked", "unsupported"]);
const ACTIVE = new Set<CoreProviderInstallationState>(["active", "update_available", "degraded", "suspended"]);

/** Returns presentation-only actions; execution must still be authorized server-side. */
export function resolveOnboardingSafeActions(
  contract: CoreProviderOnboardingContract,
  state: CoreProviderInstallationState
): CoreProviderOnboardingSafeActions {
  const enabled = !TERMINAL.has(state);
  const hasCredentialWork = ["not_started", "requirements_pending", "awaiting_customer_action", "credential_required", "credential_stored", "connection_test_failed"].includes(state);
  return {
    showOAuthConnect: enabled && contract.onboardingMode === "oauth" && contract.supportsOAuth && hasCredentialWork,
    showApiKeyFields: enabled && contract.onboardingMode === "api_key_existing_provider" && contract.supportsApiKey && hasCredentialWork,
    showConnectorDownload: enabled && contract.onboardingMode === "installable_connector" && contract.supportsConnectorPackage && !!contract.packageMetadata && !ACTIVE.has(state),
    showHostedActivate: enabled && contract.onboardingMode === "aipify_hosted_connector" && contract.supportsHostedConnector && ["not_started", "requirements_pending", "awaiting_aipify_action", "verified", "activation_required"].includes(state),
    showCustomSteps: enabled && contract.onboardingMode === "custom_provider_implementation" && contract.supportsCustomImplementation,
    showUpgrade: enabled && contract.supportsUpgrade && state === "update_available",
    showRollback: enabled && contract.supportsRollback && state === "upgrade_in_progress",
    showUninstall: enabled && contract.supportsUninstall && state !== "uninstall_pending",
    showRotate: enabled && contract.supportsRotation && !["not_started", "requirements_pending"].includes(state),
    showRevoke: enabled && contract.supportsRevoke && !["not_started", "requirements_pending"].includes(state),
    showHealthCheck: enabled && contract.supportsHealthCheck && ["active", "degraded", "verified"].includes(state),
    showActivate: enabled && isActivationAllowed(state, contract.readinessLevel, contract.supportLevel),
  };
}

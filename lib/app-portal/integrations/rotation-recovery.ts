import {
  connectionToCanonicalInput,
  resolveIntegrationCanonicalStatus,
  type IntegrationCanonicalStatus,
} from "@/lib/app-portal/integrations/canonical-status";
import type {
  AppPortalIntegrationConnection,
  AppPortalIntegrationSetup,
} from "@/lib/app-portal/integrations/types";
import { INTEGRATION_WIZARD_STEPS } from "@/lib/install/integration-setup";

export function shouldShowIntegrationCompletionSummary(
  completionMode: string | null | undefined,
  canonicalStatus: IntegrationCanonicalStatus
): boolean {
  if (!completionMode) return false;
  if (canonicalStatus === "verification_failed") return false;
  if (canonicalStatus === "rotation_required") return false;
  return true;
}

export function resolveIntegrationWizardResumeStepIndex(
  setup: AppPortalIntegrationSetup
): number {
  const connection = setup.connection;
  if (!connection) return 0;

  const canonical = resolveIntegrationCanonicalStatus(connectionToCanonicalInput(connection));

  if (canonical === "rotation_required") {
    return INTEGRATION_WIZARD_STEPS.indexOf("enter_credential");
  }
  if (canonical === "verified" || canonical === "active" || canonical === "inactive") {
    return INTEGRATION_WIZARD_STEPS.indexOf("confirm_activation");
  }
  if (canonical === "credential_saved" || canonical === "verification_failed") {
    return INTEGRATION_WIZARD_STEPS.indexOf("test_connection");
  }
  if (connection.masked_credential_hint || connection.credentials_reference) {
    return INTEGRATION_WIZARD_STEPS.indexOf("enter_credential");
  }
  return 0;
}

export function enterCredentialStepIndex(): number {
  return INTEGRATION_WIZARD_STEPS.indexOf("enter_credential");
}

export function isRotationRequiredConnection(
  connection: AppPortalIntegrationConnection | null | undefined
): boolean {
  if (!connection) return false;
  return (
    resolveIntegrationCanonicalStatus(connectionToCanonicalInput(connection)) ===
    "rotation_required"
  );
}

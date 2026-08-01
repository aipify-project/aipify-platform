import { interpolateProviderContractLabel } from "./interpolate";
import { resolveVisibleSetupSteps } from "./parse";
import type { CoreAppIntegrationProviderContract } from "./types";

/** Generic step templates — never include a customer/provider proper name. */
export const DEFAULT_CONTRACT_STEP_TEMPLATES: Record<string, string> = {
  open_provider_admin: "Open {adminName}.",
  external_login: "Log in to {adminName}.",
  navigate_to_integration: "Open Integrations → Aipify.",
  create_credential: "Create a new {credentialName}.",
  confirm_scopes: "Confirm the required read-only access scopes.",
  copy_credential: "Copy the {credentialName} when it is shown.",
  return_to_app: "Return to Aipify.",
  save_credential: "Paste the {credentialName} into Aipify and save securely.",
  test_connection: "Test the connection.",
  open_menu: "Open Integrations → Aipify.",
  locate_keys: "Create a new {credentialName}.",
  choose_permissions: "Choose read-only access only.",
  avoid_permissions: "Confirm only the approved scopes are enabled.",
  copy_key: "Copy the {credentialName} when it is shown.",
  paste_in_aipify: "Paste the {credentialName} into Aipify.",
  login: "Log in to {adminName}.",
};

export function resolveContractSetupStepLabels(
  contract: CoreAppIntegrationProviderContract,
  localeTemplates?: Record<string, string>
): string[] {
  const templates = { ...DEFAULT_CONTRACT_STEP_TEMPLATES, ...(localeTemplates ?? {}) };
  const steps = resolveVisibleSetupSteps(contract);

  return steps.map((step) => {
    if (
      (step.actionType === "external_login" || step.requiresExternalLogin) &&
      contract.capabilities.requiresExternalLogin &&
      contract.externalLoginInstruction
    ) {
      return interpolateProviderContractLabel(contract.externalLoginInstruction, contract);
    }

    const template =
      (step.labelKey && templates[step.labelKey]) ||
      templates[step.key] ||
      templates[step.actionType] ||
      "Open {adminName}.";
    return interpolateProviderContractLabel(template, contract);
  });
}

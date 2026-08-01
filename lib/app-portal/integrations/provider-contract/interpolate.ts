import type { CoreAppIntegrationProviderContract } from "./types";

export type ProviderContractLabelVars = {
  providerName: string;
  adminName: string;
  credentialName: string;
};

export function providerContractLabelVars(
  contract: CoreAppIntegrationProviderContract
): ProviderContractLabelVars {
  return {
    providerName: contract.displayName,
    adminName: contract.adminDisplayName,
    credentialName: contract.credentialDisplayName,
  };
}

/**
 * Interpolate generic locale templates with provider contract fields.
 * Supports {providerName}, {adminName}, {credentialName}, and legacy {provider}.
 */
export function interpolateProviderContractLabel(
  template: string,
  vars: ProviderContractLabelVars | CoreAppIntegrationProviderContract
): string {
  const resolved: ProviderContractLabelVars =
    "providerKey" in vars
      ? providerContractLabelVars(vars)
      : vars;

  return template
    .replace(/\{providerName\}/g, resolved.providerName)
    .replace(/\{adminName\}/g, resolved.adminName)
    .replace(/\{credentialName\}/g, resolved.credentialName)
    .replace(/\{provider\}/g, resolved.providerName);
}

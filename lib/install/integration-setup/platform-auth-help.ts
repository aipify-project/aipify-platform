/** Supported integration providers with dedicated auth help content. */
export const INTEGRATION_AUTH_HELP_PROVIDERS = [
  "shopify",
  "wordpress",
  "woocommerce",
  "custom_api",
  "stripe",
  "unonight",
] as const;

export type IntegrationAuthHelpProvider = (typeof INTEGRATION_AUTH_HELP_PROVIDERS)[number];

export type IntegrationAuthHelpField =
  | "what"
  | "why"
  | "where"
  | "project"
  | "permissions"
  | "canChange"
  | "revoke";

const PROVIDER_STEP_COUNTS: Record<IntegrationAuthHelpProvider, number> = {
  shopify: 5,
  wordpress: 4,
  woocommerce: 5,
  custom_api: 4,
  stripe: 5,
  unonight: 5,
};

const PROVIDER_FIELDS: Record<IntegrationAuthHelpProvider, IntegrationAuthHelpField[]> = {
  shopify: ["what", "why", "where", "project", "permissions", "canChange", "revoke"],
  wordpress: ["what", "why", "where", "permissions", "canChange", "revoke"],
  woocommerce: ["what", "why", "where", "project", "permissions", "canChange", "revoke"],
  custom_api: ["what", "why", "where", "permissions", "canChange", "revoke"],
  stripe: ["what", "why", "where", "project", "permissions", "canChange", "revoke"],
  unonight: ["what", "why", "where", "project", "permissions", "canChange", "revoke"],
};

const AUTH_HELP_BASE = "customerApp.portalStructure.integrations.authHelp";

export function isIntegrationAuthHelpProvider(key: string): key is IntegrationAuthHelpProvider {
  return (INTEGRATION_AUTH_HELP_PROVIDERS as readonly string[]).includes(key);
}

export function resolveAuthHelpProvider(providerKey: string): IntegrationAuthHelpProvider {
  const normalized = providerKey.toLowerCase().replace(/[\s-]+/g, "_");
  if (isIntegrationAuthHelpProvider(normalized)) return normalized;
  return "custom_api";
}

export function getAuthHelpFieldKeys(provider: IntegrationAuthHelpProvider): IntegrationAuthHelpField[] {
  return PROVIDER_FIELDS[provider];
}

export function getAuthHelpStepCount(provider: IntegrationAuthHelpProvider): number {
  return PROVIDER_STEP_COUNTS[provider];
}

export function authHelpFieldKey(
  provider: IntegrationAuthHelpProvider,
  field: IntegrationAuthHelpField
): string {
  return `${AUTH_HELP_BASE}.${provider}.${field}`;
}

export function authHelpStepKey(
  provider: IntegrationAuthHelpProvider,
  stepIndex: number
): string {
  return `${AUTH_HELP_BASE}.${provider}.steps.${stepIndex + 1}`;
}

export function authHelpTechnicalDetailsKey(provider: IntegrationAuthHelpProvider): string {
  return `${AUTH_HELP_BASE}.${provider}.technicalDetails`;
}

export function authHelpSectionTitleKey(field: IntegrationAuthHelpField): string {
  return `${AUTH_HELP_BASE}.sectionTitles.${field}`;
}

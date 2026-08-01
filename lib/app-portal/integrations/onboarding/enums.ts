export const CORE_PROVIDER_ONBOARDING_MODES = [
  "oauth", "api_key_existing_provider", "installable_connector", "aipify_hosted_connector", "custom_provider_implementation",
] as const;
export type CoreProviderOnboardingMode = (typeof CORE_PROVIDER_ONBOARDING_MODES)[number];

export const CORE_PROVIDER_DISTRIBUTION_CHANNELS = [
  "provider_marketplace", "direct_download", "package_registry", "container_image", "customer_developer", "aipify_managed", "not_applicable",
] as const;
export type CoreProviderDistributionChannel = (typeof CORE_PROVIDER_DISTRIBUTION_CHANNELS)[number];

export const CORE_PROVIDER_IMPLEMENTATION_OWNERS = ["provider", "customer", "aipify", "shared"] as const;
export type CoreProviderImplementationOwner = (typeof CORE_PROVIDER_IMPLEMENTATION_OWNERS)[number];

export const CORE_PROVIDER_READINESS_LEVELS = ["reference_only", "development", "preview", "production_ready", "deprecated", "blocked", "unsupported"] as const;
export type CoreProviderReadinessLevel = (typeof CORE_PROVIDER_READINESS_LEVELS)[number];

export const CORE_PROVIDER_SUPPORT_LEVELS = ["self_service", "guided", "aipify_managed", "partner_managed", "customer_managed", "unsupported"] as const;
export type CoreProviderSupportLevel = (typeof CORE_PROVIDER_SUPPORT_LEVELS)[number];

export const CORE_PROVIDER_INSTALL_TARGETS = ["none", "provider_saas", "customer_server", "customer_cms", "customer_ecommerce", "customer_cloud", "customer_container_platform", "aipify_cloud", "customer_custom_system"] as const;
export type CoreProviderInstallTarget = (typeof CORE_PROVIDER_INSTALL_TARGETS)[number];

export const CORE_CONNECTOR_PACKAGE_TYPES = ["wordpress_plugin", "shopify_app", "npm_package", "php_package", "docker_image", "desktop_agent", "server_agent", "generic_archive", "custom"] as const;
export type CoreConnectorPackageType = (typeof CORE_CONNECTOR_PACKAGE_TYPES)[number];

export const CORE_PROVIDER_INSTALLATION_STATES = ["not_started", "requirements_pending", "awaiting_customer_action", "awaiting_provider_action", "awaiting_aipify_action", "installation_in_progress", "credential_required", "credential_stored", "connection_test_required", "connection_test_failed", "verified", "activation_required", "active", "update_available", "upgrade_in_progress", "degraded", "suspended", "revoke_required", "uninstall_pending", "removed", "blocked", "unsupported"] as const;
export type CoreProviderInstallationState = (typeof CORE_PROVIDER_INSTALLATION_STATES)[number];

export const CORE_CUSTOM_IMPLEMENTATION_STATES = ["not_started", "requirements_pending", "implementation_in_progress", "validation_pending", "certified", "blocked", "unsupported"] as const;
export type CoreCustomImplementationState = (typeof CORE_CUSTOM_IMPLEMENTATION_STATES)[number];

function isMember<T extends readonly string[]>(value: unknown, values: T): value is T[number] {
  return typeof value === "string" && (values as readonly string[]).includes(value);
}
export const isCoreProviderOnboardingMode = (value: unknown): value is CoreProviderOnboardingMode => isMember(value, CORE_PROVIDER_ONBOARDING_MODES);
export const isCoreProviderDistributionChannel = (value: unknown): value is CoreProviderDistributionChannel => isMember(value, CORE_PROVIDER_DISTRIBUTION_CHANNELS);
export const isCoreProviderImplementationOwner = (value: unknown): value is CoreProviderImplementationOwner => isMember(value, CORE_PROVIDER_IMPLEMENTATION_OWNERS);
export const isCoreProviderReadinessLevel = (value: unknown): value is CoreProviderReadinessLevel => isMember(value, CORE_PROVIDER_READINESS_LEVELS);
export const isCoreProviderSupportLevel = (value: unknown): value is CoreProviderSupportLevel => isMember(value, CORE_PROVIDER_SUPPORT_LEVELS);
export const isCoreProviderInstallTarget = (value: unknown): value is CoreProviderInstallTarget => isMember(value, CORE_PROVIDER_INSTALL_TARGETS);
export const isCoreConnectorPackageType = (value: unknown): value is CoreConnectorPackageType => isMember(value, CORE_CONNECTOR_PACKAGE_TYPES);
export const isCoreProviderInstallationState = (value: unknown): value is CoreProviderInstallationState => isMember(value, CORE_PROVIDER_INSTALLATION_STATES);
export const isCoreCustomImplementationState = (value: unknown): value is CoreCustomImplementationState => isMember(value, CORE_CUSTOM_IMPLEMENTATION_STATES);

import type { CoreProviderDistributionChannel, CoreProviderImplementationOwner, CoreProviderInstallationState, CoreProviderInstallTarget, CoreProviderOnboardingMode, CoreProviderReadinessLevel, CoreProviderSupportLevel } from "./enums";

export type CoreProviderOnboardingSeverity = "neutral" | "info" | "success" | "warning" | "danger";
type Presentation = { labelKey: string; severity: CoreProviderOnboardingSeverity };
const presentation = <T extends string>(prefix: string, values: readonly T[], severity: Partial<Record<T, CoreProviderOnboardingSeverity>> = {}) =>
  Object.fromEntries(values.map((value) => [value, { labelKey: `customerApp.portalStructure.integrations.onboarding.${prefix}.${value}`, severity: severity[value] ?? "neutral" }])) as Record<T, Presentation>;

export const ONBOARDING_MODE_LABELS = presentation("modes", ["oauth", "api_key_existing_provider", "installable_connector", "aipify_hosted_connector", "custom_provider_implementation"] as const, { custom_provider_implementation: "info" });
export const DISTRIBUTION_CHANNEL_LABELS = presentation("channels", ["provider_marketplace", "direct_download", "package_registry", "container_image", "customer_developer", "aipify_managed", "not_applicable"] as const);
export const IMPLEMENTATION_OWNER_LABELS = presentation("owners", ["provider", "customer", "aipify", "shared"] as const);
export const READINESS_LABELS = presentation("readiness", ["reference_only", "development", "preview", "production_ready", "deprecated", "blocked", "unsupported"] as const, { production_ready: "success", preview: "info", deprecated: "warning", blocked: "danger", unsupported: "danger" });
export const SUPPORT_LABELS = presentation("support", ["self_service", "guided", "aipify_managed", "partner_managed", "customer_managed", "unsupported"] as const, { aipify_managed: "success", unsupported: "danger" });
export const INSTALL_TARGET_LABELS = presentation("installTargets", ["none", "provider_saas", "customer_server", "customer_cms", "customer_ecommerce", "customer_cloud", "customer_container_platform", "aipify_cloud", "customer_custom_system"] as const);
export const INSTALLATION_STATE_LABELS = presentation("states", ["not_started", "requirements_pending", "awaiting_customer_action", "awaiting_provider_action", "awaiting_aipify_action", "installation_in_progress", "credential_required", "credential_stored", "connection_test_required", "connection_test_failed", "verified", "activation_required", "active", "update_available", "upgrade_in_progress", "degraded", "suspended", "revoke_required", "uninstall_pending", "removed", "blocked", "unsupported"] as const, { active: "success", verified: "success", connection_test_failed: "danger", degraded: "warning", blocked: "danger", unsupported: "danger", revoke_required: "warning" });

export const getOnboardingModePresentation = (value: CoreProviderOnboardingMode) => ONBOARDING_MODE_LABELS[value];
export const getDistributionChannelPresentation = (value: CoreProviderDistributionChannel) => DISTRIBUTION_CHANNEL_LABELS[value];
export const getImplementationOwnerPresentation = (value: CoreProviderImplementationOwner) => IMPLEMENTATION_OWNER_LABELS[value];
export const getReadinessPresentation = (value: CoreProviderReadinessLevel) => READINESS_LABELS[value];
export const getSupportPresentation = (value: CoreProviderSupportLevel) => SUPPORT_LABELS[value];
export const getInstallTargetPresentation = (value: CoreProviderInstallTarget) => INSTALL_TARGET_LABELS[value];
export const getInstallationStatePresentation = (value: CoreProviderInstallationState) => INSTALLATION_STATE_LABELS[value];

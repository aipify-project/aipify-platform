export const INSTALLATION_SUPPORT_MODES = [
  "self_service",
  "guided",
  "aipify_managed",
  "partner_managed",
  "customer_it_managed",
] as const;
export type InstallationSupportMode = (typeof INSTALLATION_SUPPORT_MODES)[number];

export const INSTALLATION_AUDIENCES = [
  "customer_owner",
  "customer_admin",
  "customer_member",
  "aipify_platform_admin",
  "aipify_operator",
  "partner",
  "customer_it",
  "external_provider",
] as const;
export type InstallationAudience = (typeof INSTALLATION_AUDIENCES)[number];

export const INSTALLATION_RESPONSIBLE_PARTIES = [
  "customer",
  "aipify",
  "partner",
  "provider",
  "customer_it",
] as const;
export type InstallationResponsibleParty = (typeof INSTALLATION_RESPONSIBLE_PARTIES)[number];

export const INSTALLATION_STEP_TYPES = [
  "introduction",
  "choose_support",
  "authorize_access",
  "provide_credentials",
  "enter_configuration",
  "invite_provider",
  "invite_partner",
  "invite_customer_it",
  "schedule_assistance",
  "install_connector",
  "configure_oauth",
  "configure_api_key",
  "configure_webhook",
  "upload_file",
  "confirm_dns",
  "verify_environment",
  "run_connection_test",
  "review_permissions",
  "accept_terms",
  "approval",
  "summary",
  "activate",
  "completion",
  "manual_internal_step",
  "waiting_external_party",
  "unsupported",
] as const;
export type InstallationStepType = (typeof INSTALLATION_STEP_TYPES)[number];

export const INSTALLATION_WIZARD_STATES = [
  "not_started",
  "support_selection",
  "awaiting_customer",
  "awaiting_aipify",
  "awaiting_partner",
  "awaiting_provider",
  "awaiting_customer_it",
  "in_progress",
  "credentials_required",
  "configuration_required",
  "ready_for_test",
  "testing",
  "test_failed",
  "verified",
  "ready_for_activation",
  "active",
  "paused",
  "blocked",
  "unsupported",
  "cancelled",
  "completed",
] as const;
export type InstallationWizardState = (typeof INSTALLATION_WIZARD_STATES)[number];

export const INSTALLATION_FIELD_TYPES = [
  "text",
  "email",
  "url",
  "hostname",
  "port",
  "select",
  "multi_select",
  "checkbox",
  "radio",
  "date",
  "datetime",
  "file",
  "secret_reference",
  "organization_lookup",
  "user_lookup",
  "invitation_recipient",
  "confirmation",
] as const;
export type InstallationFieldType = (typeof INSTALLATION_FIELD_TYPES)[number];

export const INSTALLATION_SECURITY_CLASSES = [
  "public",
  "internal",
  "sensitive",
  "secret",
] as const;
export type InstallationSecurityClass = (typeof INSTALLATION_SECURITY_CLASSES)[number];

function isMember<T extends readonly string[]>(value: unknown, values: T): value is T[number] {
  return typeof value === "string" && (values as readonly string[]).includes(value);
}

export const isInstallationSupportMode = (v: unknown): v is InstallationSupportMode =>
  isMember(v, INSTALLATION_SUPPORT_MODES);
export const isInstallationAudience = (v: unknown): v is InstallationAudience =>
  isMember(v, INSTALLATION_AUDIENCES);
export const isInstallationResponsibleParty = (v: unknown): v is InstallationResponsibleParty =>
  isMember(v, INSTALLATION_RESPONSIBLE_PARTIES);
export const isInstallationStepType = (v: unknown): v is InstallationStepType =>
  isMember(v, INSTALLATION_STEP_TYPES);
export const isInstallationWizardState = (v: unknown): v is InstallationWizardState =>
  isMember(v, INSTALLATION_WIZARD_STATES);
export const isInstallationFieldType = (v: unknown): v is InstallationFieldType =>
  isMember(v, INSTALLATION_FIELD_TYPES);
export const isInstallationSecurityClass = (v: unknown): v is InstallationSecurityClass =>
  isMember(v, INSTALLATION_SECURITY_CLASSES);

/** Prefer Aipify-managed when allowed — never default non-technical customers to self-service. */
export const DEFAULT_SUPPORT_MODE_PRIORITY: InstallationSupportMode[] = [
  "aipify_managed",
  "guided",
  "partner_managed",
  "customer_it_managed",
  "self_service",
];

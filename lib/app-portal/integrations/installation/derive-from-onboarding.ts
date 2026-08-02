import type { CoreProviderOnboardingMode } from "../onboarding/enums";
import { INSTALLATION_CONTRACT_VERSION } from "./parse";
import type { InstallationContract, InstallationStep } from "./types";
import type { InstallationSupportMode } from "./enums";

const K = (suffix: string) =>
  ({ kind: "locale_key" as const, key: `customerApp.portalStructure.integrations.installationWizard.${suffix}` });

function commonSteps(modeSteps: InstallationStep[]): InstallationStep[] {
  const intro: InstallationStep = {
    step_key: "introduction",
    step_type: "introduction",
    order: 10,
    title: K("steps.introduction.title"),
    description: K("steps.introduction.description"),
    audience: ["customer_owner", "customer_admin", "customer_member", "aipify_operator", "partner"],
    responsible_party: "aipify",
    support_modes: ["self_service", "guided", "aipify_managed", "partner_managed", "customer_it_managed"],
    required: true,
    prerequisites: [],
    blocking: false,
    customer_fields: [],
    actions: ["continue"],
    completion_rule: "acknowledge",
    failure_policy: "none",
    retry_policy: "n/a",
    help_resources: [],
    estimated_time_minutes: 1,
    security_classification: "public",
  };
  const choose: InstallationStep = {
    step_key: "choose_support",
    step_type: "choose_support",
    order: 20,
    title: K("steps.chooseSupport.title"),
    description: K("steps.chooseSupport.description"),
    audience: ["customer_owner", "customer_admin", "aipify_operator"],
    responsible_party: "customer",
    support_modes: ["self_service", "guided", "aipify_managed", "partner_managed", "customer_it_managed"],
    required: true,
    prerequisites: ["introduction"],
    blocking: true,
    customer_fields: [],
    actions: ["select_support_mode"],
    completion_rule: "support_mode_selected",
    failure_policy: "retry",
    retry_policy: "allow_retry",
    help_resources: [],
    estimated_time_minutes: 2,
    security_classification: "public",
  };
  const test: InstallationStep = {
    step_key: "run_connection_test",
    step_type: "run_connection_test",
    order: 80,
    title: K("steps.test.title"),
    description: K("steps.test.description"),
    audience: ["customer_owner", "customer_admin", "aipify_operator", "partner", "customer_it"],
    responsible_party: "aipify",
    support_modes: ["self_service", "guided", "aipify_managed", "partner_managed", "customer_it_managed"],
    required: true,
    prerequisites: [],
    blocking: true,
    customer_fields: [],
    actions: ["run_test"],
    completion_rule: "test_passed",
    failure_policy: "retry_or_escalate",
    retry_policy: "allow_retry",
    help_resources: [],
    estimated_time_minutes: 3,
    security_classification: "internal",
    internal_title: K("steps.test.internalTitle"),
    internal_description: K("steps.test.internalDescription"),
  };
  const review: InstallationStep = {
    step_key: "review_permissions",
    step_type: "review_permissions",
    order: 85,
    title: K("steps.review.title"),
    description: K("steps.review.description"),
    audience: ["customer_owner", "customer_admin"],
    responsible_party: "customer",
    support_modes: ["self_service", "guided", "aipify_managed", "partner_managed", "customer_it_managed"],
    required: true,
    prerequisites: ["run_connection_test"],
    blocking: true,
    customer_fields: [],
    actions: ["confirm_scopes"],
    completion_rule: "scopes_confirmed",
    failure_policy: "block",
    retry_policy: "allow_retry",
    help_resources: [],
    estimated_time_minutes: 2,
    security_classification: "public",
  };
  const activate: InstallationStep = {
    step_key: "activate",
    step_type: "activate",
    order: 90,
    title: K("steps.activate.title"),
    description: K("steps.activate.description"),
    audience: ["customer_owner", "customer_admin"],
    responsible_party: "customer",
    support_modes: ["self_service", "guided", "aipify_managed", "partner_managed", "customer_it_managed"],
    required: true,
    prerequisites: ["review_permissions"],
    blocking: true,
    customer_fields: [],
    actions: ["activate"],
    completion_rule: "explicit_activation",
    failure_policy: "block",
    retry_policy: "allow_retry",
    help_resources: [],
    estimated_time_minutes: 1,
    security_classification: "sensitive",
  };
  const completion: InstallationStep = {
    step_key: "completion",
    step_type: "completion",
    order: 100,
    title: K("steps.completion.title"),
    description: K("steps.completion.description"),
    audience: ["customer_owner", "customer_admin", "customer_member", "aipify_operator", "partner"],
    responsible_party: "aipify",
    support_modes: ["self_service", "guided", "aipify_managed", "partner_managed", "customer_it_managed"],
    required: true,
    prerequisites: ["activate"],
    blocking: false,
    customer_fields: [],
    actions: ["done"],
    completion_rule: "done",
    failure_policy: "none",
    retry_policy: "n/a",
    help_resources: [],
    estimated_time_minutes: 1,
    security_classification: "public",
  };
  return [intro, choose, ...modeSteps, test, review, activate, completion];
}

function supportModesForOnboarding(mode: CoreProviderOnboardingMode): InstallationSupportMode[] {
  switch (mode) {
    case "aipify_hosted_connector":
      return ["aipify_managed", "guided", "partner_managed"];
    case "custom_provider_implementation":
      return ["guided", "partner_managed", "customer_it_managed", "aipify_managed", "self_service"];
    case "installable_connector":
      return ["guided", "aipify_managed", "partner_managed", "customer_it_managed", "self_service"];
    case "oauth":
      return ["aipify_managed", "guided", "self_service", "partner_managed"];
    case "api_key_existing_provider":
    default:
      return ["aipify_managed", "guided", "self_service", "partner_managed", "customer_it_managed"];
  }
}

function modeSpecificSteps(mode: CoreProviderOnboardingMode): InstallationStep[] {
  switch (mode) {
    case "oauth":
      return [
        {
          step_key: "configure_oauth",
          step_type: "configure_oauth",
          order: 40,
          title: K("steps.oauth.title"),
          description: K("steps.oauth.description"),
          audience: ["customer_owner", "customer_admin"],
          responsible_party: "customer",
          support_modes: ["self_service", "guided"],
          required: true,
          prerequisites: ["choose_support"],
          blocking: true,
          customer_fields: [],
          actions: ["authorize"],
          completion_rule: "oauth_authorized",
          failure_policy: "retry_or_escalate",
          retry_policy: "allow_retry",
          help_resources: [],
          estimated_time_minutes: 5,
          security_classification: "sensitive",
          internal_title: K("steps.oauth.internalTitle"),
          internal_description: K("steps.oauth.internalDescription"),
        },
        {
          step_key: "waiting_aipify_oauth",
          step_type: "waiting_external_party",
          order: 45,
          title: K("steps.waitingAipify.title"),
          description: K("steps.waitingAipify.description"),
          audience: ["customer_owner", "customer_admin"],
          responsible_party: "aipify",
          support_modes: ["aipify_managed", "partner_managed"],
          required: true,
          prerequisites: ["choose_support"],
          blocking: true,
          customer_fields: [],
          actions: ["continue_later"],
          completion_rule: "external_complete",
          failure_policy: "escalate",
          retry_policy: "n/a",
          help_resources: [],
          estimated_time_minutes: 30,
          security_classification: "public",
        },
      ];
    case "installable_connector":
      return [
        {
          step_key: "install_connector",
          step_type: "install_connector",
          order: 40,
          title: K("steps.installConnector.title"),
          description: K("steps.installConnector.description"),
          audience: ["customer_owner", "customer_admin", "customer_it"],
          responsible_party: "customer",
          support_modes: ["self_service", "guided", "customer_it_managed"],
          required: true,
          prerequisites: ["choose_support"],
          blocking: true,
          customer_fields: [],
          actions: ["confirm_installed"],
          completion_rule: "connector_installed",
          failure_policy: "retry_or_escalate",
          retry_policy: "allow_retry",
          help_resources: [],
          estimated_time_minutes: 20,
          security_classification: "internal",
          internal_title: K("steps.installConnector.internalTitle"),
          internal_description: K("steps.installConnector.internalDescription"),
        },
        {
          step_key: "invite_customer_it",
          step_type: "invite_customer_it",
          order: 35,
          title: K("steps.inviteIt.title"),
          description: K("steps.inviteIt.description"),
          audience: ["customer_owner", "customer_admin"],
          responsible_party: "customer",
          support_modes: ["customer_it_managed", "partner_managed"],
          required: false,
          prerequisites: ["choose_support"],
          blocking: false,
          customer_fields: [
            {
              field_key: "it_recipient",
              field_type: "invitation_recipient",
              label: K("fields.itRecipient"),
              required: true,
              security_classification: "sensitive",
            },
          ],
          actions: ["send_invite"],
          completion_rule: "invite_sent",
          failure_policy: "retry",
          retry_policy: "allow_retry",
          help_resources: [],
          estimated_time_minutes: 5,
          security_classification: "sensitive",
        },
      ];
    case "aipify_hosted_connector":
      return [
        {
          step_key: "waiting_aipify_hosted",
          step_type: "waiting_external_party",
          order: 40,
          title: K("steps.hostedWaiting.title"),
          description: K("steps.hostedWaiting.description"),
          audience: ["customer_owner", "customer_admin"],
          responsible_party: "aipify",
          support_modes: ["aipify_managed", "guided", "partner_managed"],
          required: true,
          prerequisites: ["choose_support"],
          blocking: true,
          customer_fields: [],
          actions: ["continue_later"],
          completion_rule: "provisioned",
          failure_policy: "escalate",
          retry_policy: "n/a",
          help_resources: [],
          estimated_time_minutes: 15,
          security_classification: "public",
          internal_title: K("steps.hostedWaiting.internalTitle"),
          internal_description: K("steps.hostedWaiting.internalDescription"),
        },
      ];
    case "custom_provider_implementation":
      return [
        {
          step_key: "enter_configuration",
          step_type: "enter_configuration",
          order: 40,
          title: K("steps.customConfig.title"),
          description: K("steps.customConfig.description"),
          audience: ["customer_owner", "customer_admin", "customer_it", "partner"],
          responsible_party: "customer",
          support_modes: ["self_service", "guided", "customer_it_managed", "partner_managed"],
          required: true,
          prerequisites: ["choose_support"],
          blocking: true,
          customer_fields: [
            {
              field_key: "base_url",
              field_type: "url",
              label: K("fields.baseUrl"),
              required: true,
              security_classification: "internal",
              validation: { allowlist_hosts: [] },
            },
          ],
          actions: ["save_configuration"],
          completion_rule: "config_saved",
          failure_policy: "retry",
          retry_policy: "allow_retry",
          help_resources: [],
          estimated_time_minutes: 30,
          security_classification: "internal",
          internal_title: K("steps.customConfig.internalTitle"),
          internal_description: K("steps.customConfig.internalDescription"),
        },
        {
          step_key: "unsupported_notice",
          step_type: "unsupported",
          order: 15,
          title: K("steps.unsupported.title"),
          description: K("steps.unsupported.description"),
          audience: ["customer_owner", "customer_admin"],
          responsible_party: "aipify",
          support_modes: ["self_service"],
          required: false,
          prerequisites: [],
          blocking: false,
          customer_fields: [],
          actions: ["request_aipify_help"],
          completion_rule: "acknowledged",
          failure_policy: "escalate",
          retry_policy: "n/a",
          help_resources: [],
          estimated_time_minutes: 1,
          security_classification: "public",
        },
      ];
    case "api_key_existing_provider":
    default:
      return [
        {
          step_key: "provide_credentials",
          step_type: "provide_credentials",
          order: 40,
          title: K("steps.credentials.title"),
          description: K("steps.credentials.description"),
          audience: ["customer_owner", "customer_admin"],
          responsible_party: "customer",
          support_modes: ["self_service", "guided"],
          required: true,
          prerequisites: ["choose_support"],
          blocking: true,
          customer_fields: [
            {
              field_key: "api_key",
              field_type: "secret_reference",
              label: K("fields.apiKey"),
              required: true,
              masked: true,
              secret: true,
              security_classification: "secret",
            },
          ],
          actions: ["save_credential"],
          completion_rule: "credential_saved",
          failure_policy: "retry_or_escalate",
          retry_policy: "allow_retry",
          help_resources: [],
          estimated_time_minutes: 5,
          security_classification: "secret",
          internal_title: K("steps.credentials.internalTitle"),
          internal_description: K("steps.credentials.internalDescription"),
        },
        {
          step_key: "waiting_aipify_credentials",
          step_type: "waiting_external_party",
          order: 45,
          title: K("steps.waitingAipify.title"),
          description: K("steps.waitingAipify.description"),
          audience: ["customer_owner", "customer_admin"],
          responsible_party: "aipify",
          support_modes: ["aipify_managed", "partner_managed", "customer_it_managed"],
          required: true,
          prerequisites: ["choose_support"],
          blocking: true,
          customer_fields: [],
          actions: ["continue_later"],
          completion_rule: "external_complete",
          failure_policy: "escalate",
          retry_policy: "n/a",
          help_resources: [],
          estimated_time_minutes: 30,
          security_classification: "public",
        },
      ];
  }
}

const DEFAULT_ASSISTANCE = [
  {
    action_key: "ask_aipify_help",
    label: K("actions.askAipifyHelp"),
    description: K("actions.askAipifyHelpDescription"),
    handoff: "support" as const,
  },
  {
    action_key: "request_guided",
    label: K("actions.requestGuided"),
    support_mode: "guided" as const,
    // Guided is a request — not a calendar booking surface.
    requires_scheduling: false,
    handoff: "request" as const,
  },
  {
    action_key: "aipify_managed",
    label: K("actions.aipifyManaged"),
    support_mode: "aipify_managed" as const,
    requires_quote: false,
    handoff: "request" as const,
  },
  {
    action_key: "invite_provider",
    label: K("actions.inviteProvider"),
    requires_partner: false,
    handoff: "invite_placeholder" as const,
  },
  {
    action_key: "invite_it",
    label: K("actions.inviteIt"),
    support_mode: "customer_it_managed" as const,
    handoff: "invite" as const,
  },
  {
    action_key: "invite_partner",
    label: K("actions.invitePartner"),
    support_mode: "partner_managed" as const,
    requires_partner: true,
    handoff: "invite_placeholder" as const,
  },
  {
    action_key: "self_service",
    label: K("actions.selfService"),
    support_mode: "self_service" as const,
  },
  {
    action_key: "change_method",
    label: K("actions.changeMethod"),
  },
  {
    action_key: "contact_support",
    label: K("actions.contactSupport"),
    handoff: "support" as const,
  },
  {
    action_key: "continue_later",
    label: K("actions.continueLater"),
  },
];

/**
 * Derive a published installation_contract from existing onboarding_contract mode.
 * Used when provider row has no explicit installation_contract yet — no parallel registry.
 */
export function deriveInstallationContractFromOnboarding(opts: {
  providerKey: string;
  onboardingMode: CoreProviderOnboardingMode | string | null | undefined;
}): InstallationContract {
  const mode = (opts.onboardingMode ?? "api_key_existing_provider") as CoreProviderOnboardingMode;
  const support_modes = supportModesForOnboarding(mode);
  const default_support_mode = support_modes.includes("aipify_managed")
    ? "aipify_managed"
    : support_modes.includes("guided")
      ? "guided"
      : support_modes[0]!;

  return {
    contract_version: INSTALLATION_CONTRACT_VERSION,
    provider_key: opts.providerKey,
    installation_mode: mode,
    support_modes,
    default_support_mode,
    audience_variants: [
      "customer_owner",
      "customer_admin",
      "customer_member",
      "aipify_platform_admin",
      "aipify_operator",
      "partner",
      "customer_it",
      "external_provider",
    ],
    steps: commonSteps(modeSpecificSteps(mode)),
    dependencies: [
      { from: "introduction", to: "choose_support" },
      { from: "run_connection_test", to: "review_permissions" },
      { from: "review_permissions", to: "activate" },
      { from: "activate", to: "completion" },
    ],
    required_customer_inputs: [],
    responsible_party_default: mode === "aipify_hosted_connector" ? "aipify" : "customer",
    security_classification: "sensitive",
    validation: {
      require_verified_before_activation: true,
      block_on_unresolved_prerequisites: true,
    },
    completion_rules: ["all_required_steps_complete", "verified", "explicit_activation"],
    failure_policy: "retry_or_escalate",
    resume_policy: {
      allow_pause: true,
      pin_contract_version: true,
      stale_contract_strategy: "migrate_or_restart",
    },
    test_policy: {
      use_existing_provider_test: true,
      allow_retry: true,
      poll_interval_ms: 2000,
    },
    verification_policy: { use_existing_provider_verify: true },
    activation_requirements: {
      verified: true,
      approvals_complete: true,
      scopes_confirmed: true,
      no_unresolved_blockers: true,
      explicit_user_action: true,
      no_auto_activation: true,
    },
    documentation: {
      customer_help: K("help.customer"),
      internal_runbook: K("help.internal"),
    },
    estimated_time_minutes: 20,
    escalation: { path: "support", contact_action: "contact_support" },
    assistance_actions: DEFAULT_ASSISTANCE,
    invite: {
      supported_roles: ["customer_it", "external_provider", "partner"],
      token_ttl_hours: 72,
      revoke_supported: true,
      scoped_to_installation: true,
      backend_status: "typed_placeholder",
    },
    versioning: {
      status: "published",
      changelog: "Derived from onboarding_contract",
      compatibility_range: "1.x",
    },
    rtl_support: true,
    locale_fallback: "en",
  };
}

import type {
  BillingTrialStatus,
  InstallStatus,
  PlatformInstallActionResult,
  PlatformInstallBriefingResult,
  PlatformInstallCard,
  PlatformInstallDashboard,
} from "./types";

export function parsePlatformInstallCard(data: unknown): PlatformInstallCard {
  const d = (data ?? {}) as Record<string, unknown>;
  return {
    has_customer: Boolean(d.has_customer),
    install_score: Number(d.install_score ?? 0),
    steps_total: Number(d.steps_total ?? 0),
    philosophy: typeof d.philosophy === "string" ? d.philosophy : undefined,
    human_oversight_required: Boolean(d.human_oversight_required),
  };
}

export function parsePlatformInstallDashboard(data: unknown): PlatformInstallDashboard {
  const d = (data ?? {}) as Record<string, unknown>;
  return {
    has_customer: Boolean(d.has_customer),
    human_oversight_required: Boolean(d.human_oversight_required),
    philosophy: typeof d.philosophy === "string" ? d.philosophy : undefined,
    safety_note: typeof d.safety_note === "string" ? d.safety_note : undefined,
    install_assistant_enabled: Boolean(d.install_assistant_enabled ?? true),
    trial_days: Number(d.trial_days ?? 14),
    require_payment_before_trial: Boolean(d.require_payment_before_trial ?? true),
    install_score: Number(d.install_score ?? 0),
    steps_completed: Number(d.steps_completed ?? 0),
    steps_total: Number(d.steps_total ?? 0),
    health_checks_passed: Number(d.health_checks_passed ?? 0),
    active_installations: Number(d.active_installations ?? 0),
    session_id: typeof d.session_id === "string" ? d.session_id : undefined,
    session_status: typeof d.session_status === "string" ? d.session_status : undefined,
    trial_status: typeof d.trial_status === "string" ? d.trial_status : undefined,
    current_step: typeof d.current_step === "string" ? d.current_step : undefined,
    selected_platform: typeof d.selected_platform === "string" ? d.selected_platform : null,
    trial_ends_at: typeof d.trial_ends_at === "string" ? d.trial_ends_at : null,
    payment_method_registered: Boolean(d.payment_method_registered),
    billing_copy_short: typeof d.billing_copy_short === "string" ? d.billing_copy_short : undefined,
    billing_copy_full: typeof d.billing_copy_full === "string" ? d.billing_copy_full : undefined,
    wizard_steps: Array.isArray(d.wizard_steps) ? (d.wizard_steps as PlatformInstallDashboard["wizard_steps"]) : [],
    platform_connectors: Array.isArray(d.platform_connectors)
      ? (d.platform_connectors as PlatformInstallDashboard["platform_connectors"])
      : [],
    connector_installations: Array.isArray(d.connector_installations)
      ? (d.connector_installations as PlatformInstallDashboard["connector_installations"])
      : [],
    platform_permissions: Array.isArray(d.platform_permissions)
      ? (d.platform_permissions as PlatformInstallDashboard["platform_permissions"])
      : [],
    installation_errors: Array.isArray(d.installation_errors)
      ? (d.installation_errors as PlatformInstallDashboard["installation_errors"])
      : [],
    assistant_messages: Array.isArray(d.assistant_messages)
      ? (d.assistant_messages as PlatformInstallDashboard["assistant_messages"])
      : [],
    health_checks: Array.isArray(d.health_checks)
      ? (d.health_checks as PlatformInstallDashboard["health_checks"])
      : [],
    trial_reminders: Array.isArray(d.trial_reminders)
      ? (d.trial_reminders as PlatformInstallDashboard["trial_reminders"])
      : [],
    briefings: Array.isArray(d.briefings) ? (d.briefings as PlatformInstallDashboard["briefings"]) : [],
    integrations: typeof d.integrations === "object" && d.integrations
      ? (d.integrations as Record<string, string>)
      : undefined,
  };
}

export function parseInstallStatus(data: unknown): InstallStatus {
  const d = (data ?? {}) as Record<string, unknown>;
  return {
    has_customer: Boolean(d.has_customer),
    session_status: typeof d.session_status === "string" ? d.session_status : undefined,
    trial_status: typeof d.trial_status === "string" ? d.trial_status : undefined,
    current_step: typeof d.current_step === "string" ? d.current_step : undefined,
    selected_platform: typeof d.selected_platform === "string" ? d.selected_platform : null,
    trial_ends_at: typeof d.trial_ends_at === "string" ? d.trial_ends_at : null,
    payment_method_registered: Boolean(d.payment_method_registered),
    install_score: Number(d.install_score ?? 0),
  };
}

export function parseBillingTrialStatus(data: unknown): BillingTrialStatus {
  const d = (data ?? {}) as Record<string, unknown>;
  return {
    has_customer: Boolean(d.has_customer),
    trial_status: typeof d.trial_status === "string" ? d.trial_status : undefined,
    plan_key: typeof d.plan_key === "string" ? d.plan_key : undefined,
    trial_starts_at: typeof d.trial_starts_at === "string" ? d.trial_starts_at : null,
    trial_ends_at: typeof d.trial_ends_at === "string" ? d.trial_ends_at : null,
    payment_method_registered: Boolean(d.payment_method_registered),
    billing_copy_short: typeof d.billing_copy_short === "string" ? d.billing_copy_short : undefined,
    billing_copy_full: typeof d.billing_copy_full === "string" ? d.billing_copy_full : undefined,
  };
}

export function parsePlatformInstallActionResult(data: unknown): PlatformInstallActionResult {
  return (data ?? {}) as PlatformInstallActionResult;
}

export function parsePlatformInstallBriefingResult(data: unknown): PlatformInstallBriefingResult {
  return (data ?? {}) as PlatformInstallBriefingResult;
}

import type { InstallationWizardState } from "./enums";

const TRANSITIONS: Readonly<Record<InstallationWizardState, readonly InstallationWizardState[]>> = {
  not_started: ["support_selection", "in_progress", "paused", "cancelled", "unsupported"],
  support_selection: [
    "awaiting_customer",
    "awaiting_aipify",
    "awaiting_partner",
    "awaiting_provider",
    "awaiting_customer_it",
    "in_progress",
    "paused",
    "cancelled",
  ],
  awaiting_customer: ["in_progress", "credentials_required", "configuration_required", "paused", "blocked", "cancelled"],
  awaiting_aipify: ["in_progress", "ready_for_test", "paused", "blocked", "cancelled"],
  awaiting_partner: ["in_progress", "ready_for_test", "paused", "blocked", "cancelled"],
  awaiting_provider: ["in_progress", "ready_for_test", "paused", "blocked", "cancelled"],
  awaiting_customer_it: ["in_progress", "ready_for_test", "paused", "blocked", "cancelled"],
  in_progress: [
    "credentials_required",
    "configuration_required",
    "ready_for_test",
    "awaiting_aipify",
    "awaiting_partner",
    "awaiting_provider",
    "awaiting_customer_it",
    "awaiting_customer",
    "paused",
    "blocked",
    "cancelled",
  ],
  credentials_required: ["in_progress", "configuration_required", "ready_for_test", "paused", "blocked", "cancelled"],
  configuration_required: ["in_progress", "ready_for_test", "paused", "blocked", "cancelled"],
  ready_for_test: ["testing", "paused", "blocked", "cancelled"],
  testing: ["test_failed", "verified", "blocked"],
  test_failed: ["ready_for_test", "credentials_required", "configuration_required", "paused", "blocked", "cancelled"],
  verified: ["ready_for_activation", "paused", "cancelled"],
  ready_for_activation: ["active", "verified", "paused", "blocked", "cancelled"],
  active: ["completed", "paused", "cancelled"],
  paused: [
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
    "verified",
    "ready_for_activation",
    "cancelled",
  ],
  blocked: ["in_progress", "support_selection", "paused", "cancelled", "not_started"],
  unsupported: [],
  cancelled: ["not_started"],
  completed: [],
};

export type InstallationTransitionAudit = {
  from: InstallationWizardState;
  to: InstallationWizardState;
  actor: string;
  reason: string;
  occurredAt: string;
  idempotencyKey?: string;
};

export function canInstallationTransition(
  from: InstallationWizardState,
  to: InstallationWizardState
): boolean {
  if (from === to) return true; // idempotent no-op
  return TRANSITIONS[from].includes(to);
}

export function assertInstallationTransition(
  from: InstallationWizardState,
  to: InstallationWizardState
): void {
  if (!canInstallationTransition(from, to)) {
    throw new Error(`Invalid installation wizard transition: ${from} -> ${to}`);
  }
}

export function isActivationGateOpen(state: InstallationWizardState): boolean {
  return state === "verified" || state === "ready_for_activation";
}

export function canActivateFromWizard(state: InstallationWizardState): boolean {
  return state === "ready_for_activation" || state === "verified";
}

/** Map support mode to waiting state after selection. */
export function waitingStateForSupportMode(
  mode: "self_service" | "guided" | "aipify_managed" | "partner_managed" | "customer_it_managed"
): InstallationWizardState {
  switch (mode) {
    case "aipify_managed":
      return "awaiting_aipify";
    case "partner_managed":
      return "awaiting_partner";
    case "customer_it_managed":
      return "awaiting_customer_it";
    case "guided":
      return "awaiting_customer";
    case "self_service":
    default:
      return "in_progress";
  }
}

import type { IntegrationHubActionTier } from "../hub-actions";
import type { AppPortalIntegrationSetup } from "../types";
import {
  DEFAULT_SUPPORT_MODE_PRIORITY,
  type InstallationSupportMode,
  type InstallationWizardState,
} from "./enums";
import type { InstallationAssistanceAction } from "./types";

/** Explicit wizard runtime modes — never inferred from route alone. */
export const INSTALLATION_WIZARD_MODES = ["install", "preview"] as const;
export type InstallationWizardMode = (typeof INSTALLATION_WIZARD_MODES)[number];

export function isInstallationWizardMode(value: unknown): value is InstallationWizardMode {
  return typeof value === "string" && (INSTALLATION_WIZARD_MODES as readonly string[]).includes(value);
}

export function isInstallationWizardPreviewMode(mode: InstallationWizardMode | undefined): boolean {
  return mode === "preview";
}

/**
 * Customer APP may offer at most these support modes.
 * `partner_managed` is Core/Platform routing — never a direct customer choice.
 */
export const CUSTOMER_FACING_SUPPORT_MODES = [
  "aipify_managed",
  "guided",
  "self_service",
  "customer_it_managed",
] as const satisfies readonly InstallationSupportMode[];

export type CustomerFacingSupportMode = (typeof CUSTOMER_FACING_SUPPORT_MODES)[number];

export function isCustomerFacingSupportMode(
  mode: InstallationSupportMode
): mode is CustomerFacingSupportMode {
  return (CUSTOMER_FACING_SUPPORT_MODES as readonly string[]).includes(mode);
}

/** Ordered customer choices; IT only when the contract allows it. */
export function listCustomerFacingSupportModes(
  modes: readonly InstallationSupportMode[]
): CustomerFacingSupportMode[] {
  const allowed = new Set(modes);
  return CUSTOMER_FACING_SUPPORT_MODES.filter((mode) => allowed.has(mode));
}

export function selectDefaultCustomerFacingSupportMode(
  modes: readonly InstallationSupportMode[]
): CustomerFacingSupportMode | null {
  const visible = listCustomerFacingSupportModes(modes);
  if (!visible.length) return null;
  for (const mode of DEFAULT_SUPPORT_MODE_PRIORITY) {
    if (mode === "partner_managed") continue;
    if (visible.includes(mode as CustomerFacingSupportMode)) {
      return mode as CustomerFacingSupportMode;
    }
  }
  return visible[0]!;
}

/** Never show these as customer-facing assistance choices (install or preview). */
export const CUSTOMER_EXCLUDED_ASSISTANCE_ACTION_KEYS = [
  "invite_partner",
  "continue_later",
] as const;

/** Preview examples — labels only; UI must render them disabled. */
export const PREVIEW_EXAMPLE_ASSISTANCE_ACTION_KEYS = [
  "ask_aipify_help",
  "change_method",
  "self_service",
] as const;

/**
 * Customer APP never presents partner invite / partner support as a direct choice.
 * Also hides Continue later from choice panels (footer pause remains install-only).
 */
export function listCustomerFacingAssistanceActions<T extends { action_key: string; support_mode?: string | null }>(
  actions: readonly T[]
): T[] {
  const excluded = new Set<string>(CUSTOMER_EXCLUDED_ASSISTANCE_ACTION_KEYS);
  return actions.filter(
    (action) =>
      !excluded.has(action.action_key) &&
      action.support_mode !== "partner_managed"
  );
}

/**
 * Preview shows a small set of disabled example actions from the contract.
 * Never include continue-later, invite, order, or scheduling actions.
 */
export function listPreviewExampleAssistanceActions(
  actions: readonly InstallationAssistanceAction[]
): InstallationAssistanceAction[] {
  const byKey = new Map(actions.map((action) => [action.action_key, action]));
  const examples: InstallationAssistanceAction[] = [];
  for (const key of PREVIEW_EXAMPLE_ASSISTANCE_ACTION_KEYS) {
    const action = byKey.get(key);
    if (!action) continue;
    if (action.handoff === "invite_placeholder") continue;
    if (action.requires_quote || action.requires_order || action.requires_scheduling) continue;
    examples.push(action);
  }
  return examples;
}

export type PreviewSupportPresentationKey =
  | "choose"
  | "aipify_managed"
  | "guided"
  | "self_service"
  | "customer_it_managed";

export function previewPresentationKeyForSupportMode(
  mode: InstallationSupportMode | null | undefined
): PreviewSupportPresentationKey {
  if (!mode || !isCustomerFacingSupportMode(mode)) return "choose";
  return mode;
}

/**
 * Preview never enters live waiting states — those imply an external process already started.
 * After a local support choice, stay in a calm in-progress presentation state.
 */
export function previewStateAfterSupportSelect(
  _mode: InstallationSupportMode
): InstallationWizardState {
  return "in_progress";
}

export function isPreviewLiveWaitingState(state: InstallationWizardState): boolean {
  return (
    state === "awaiting_aipify" ||
    state === "awaiting_partner" ||
    state === "awaiting_provider" ||
    state === "awaiting_customer_it" ||
    state === "awaiting_customer"
  );
}

/** Write endpoints the preview renderer must never call. */
export const INSTALLATION_WIZARD_PREVIEW_BLOCKED_ENDPOINTS = [
  "/api/app-portal/integrations/installation/session",
  "/api/app-portal/integrations/installation/invite",
  "/api/app-portal/integrations/save",
  "/api/app-portal/integrations/test",
  "/api/app-portal/integrations/activate",
  "/api/app-portal/integrations/deactivate",
  "/api/app-portal/integrations/remove",
] as const;

export function isPreviewBlockedWriteEndpoint(url: string): boolean {
  const path = url.split("?")[0] ?? url;
  return (INSTALLATION_WIZARD_PREVIEW_BLOCKED_ENDPOINTS as readonly string[]).some(
    (blocked) => path === blocked || path.endsWith(blocked)
  );
}

export type InstallationWizardPreviewViewState = {
  support_mode: InstallationSupportMode | null;
  state: InstallationWizardState;
  current_step_key: string | null;
  completed_step_keys: string[];
  paused: boolean;
};

export function createInstallationWizardPreviewViewState(): InstallationWizardPreviewViewState {
  return {
    support_mode: null,
    state: "not_started",
    current_step_key: null,
    completed_step_keys: [],
    paused: false,
  };
}

/**
 * Strip persisted session for preview rendering.
 * Preview must never read or mutate an active installation session.
 */
export function prepareSetupForInstallationWizardPreview(
  setup: AppPortalIntegrationSetup
): AppPortalIntegrationSetup {
  return {
    ...setup,
    installation_session: null,
  };
}

/**
 * Connected integrations (active / verified / failed connection rows) may open
 * read-only wizard preview when the user can manage integrations.
 */
export function canShowInstallationWizardPreview(opts: {
  canManage: boolean;
  actionTier: IntegrationHubActionTier;
}): boolean {
  if (!opts.canManage) return false;
  return (
    opts.actionTier === "active" ||
    opts.actionTier === "verified" ||
    opts.actionTier === "failed"
  );
}

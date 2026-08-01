import type { IntegrationHubActionTier } from "../hub-actions";
import type { AppPortalIntegrationSetup } from "../types";
import type { InstallationSupportMode, InstallationWizardState } from "./enums";

/** Explicit wizard runtime modes — never inferred from route alone. */
export const INSTALLATION_WIZARD_MODES = ["install", "preview"] as const;
export type InstallationWizardMode = (typeof INSTALLATION_WIZARD_MODES)[number];

export function isInstallationWizardMode(value: unknown): value is InstallationWizardMode {
  return typeof value === "string" && (INSTALLATION_WIZARD_MODES as readonly string[]).includes(value);
}

export function isInstallationWizardPreviewMode(mode: InstallationWizardMode | undefined): boolean {
  return mode === "preview";
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

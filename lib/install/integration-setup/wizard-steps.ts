/** Customer-facing 7-step integration wizard (non-technical language). */
export const INTEGRATION_WIZARD_STEPS = [
  "choose_system",
  "explain_access",
  "find_credential",
  "enter_credential",
  "test_connection",
  "access_summary",
  "confirm_activation",
] as const;

export type IntegrationWizardStep = (typeof INTEGRATION_WIZARD_STEPS)[number];

/** Legacy 8-step internal keys from the original App Portal setup flow. */
export const LEGACY_SETUP_STEPS = [
  "select_platform",
  "explain_needs",
  "find_api_key",
  "choose_permissions",
  "validate_connection",
  "access_summary",
  "save_securely",
  "log_action",
] as const;

export type LegacySetupStep = (typeof LEGACY_SETUP_STEPS)[number];

/** Maps each legacy internal step to its customer-facing wizard step index (0–6). */
export const LEGACY_STEP_TO_WIZARD_INDEX: Record<LegacySetupStep, number> = {
  select_platform: 0,
  explain_needs: 1,
  find_api_key: 2,
  choose_permissions: 1,
  validate_connection: 3,
  access_summary: 5,
  save_securely: 4,
  log_action: 6,
};

export function getWizardStepIndex(step: IntegrationWizardStep): number {
  return INTEGRATION_WIZARD_STEPS.indexOf(step);
}

export function wizardStepAt(index: number): IntegrationWizardStep {
  return INTEGRATION_WIZARD_STEPS[Math.max(0, Math.min(INTEGRATION_WIZARD_STEPS.length - 1, index))]!;
}

export function legacyStepToWizardIndex(legacyStep: string): number {
  const mapped = LEGACY_STEP_TO_WIZARD_INDEX[legacyStep as LegacySetupStep];
  return mapped ?? 0;
}

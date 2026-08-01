import type { InstallationAudience, InstallationSupportMode } from "./enums";
import type { InstallationContract, InstallationStep } from "./types";

const CUSTOMER_AUDIENCES: InstallationAudience[] = [
  "customer_owner",
  "customer_admin",
  "customer_member",
];

const INTERNAL_AUDIENCES: InstallationAudience[] = [
  "aipify_platform_admin",
  "aipify_operator",
  "partner",
  "customer_it",
  "external_provider",
];

export function isCustomerAudience(audience: InstallationAudience): boolean {
  return CUSTOMER_AUDIENCES.includes(audience);
}

export function isInternalAudience(audience: InstallationAudience): boolean {
  return INTERNAL_AUDIENCES.includes(audience);
}

export function stepVisibleForAudience(
  step: InstallationStep,
  audience: InstallationAudience
): boolean {
  return step.audience.includes(audience);
}

export function stepVisibleForSupportMode(
  step: InstallationStep,
  supportMode: InstallationSupportMode
): boolean {
  return step.support_modes.includes(supportMode);
}

/**
 * Plan visible steps for the active support mode + audience.
 * Customers never see internal-only technical steps.
 */
export function planInstallationSteps(
  contract: InstallationContract,
  opts: {
    supportMode: InstallationSupportMode;
    audience: InstallationAudience;
    completedStepKeys?: readonly string[];
  }
): InstallationStep[] {
  const completed = new Set(opts.completedStepKeys ?? []);
  return contract.steps
    .filter((step) => stepVisibleForSupportMode(step, opts.supportMode))
    .filter((step) => stepVisibleForAudience(step, opts.audience))
    .filter((step) => {
      if (step.skip_rule === "skip_if_complete" && completed.has(step.step_key)) return false;
      return true;
    })
    .sort((a, b) => a.order - b.order);
}

export function nextSafeStep(
  planned: InstallationStep[],
  completedStepKeys: readonly string[]
): InstallationStep | null {
  const completed = new Set(completedStepKeys);
  for (const step of planned) {
    const prereqsMet = step.prerequisites.every((p) => completed.has(p));
    if (!prereqsMet) {
      if (step.blocking) return null;
      continue;
    }
    if (!completed.has(step.step_key)) return step;
  }
  return null;
}

export function canSkipStep(step: InstallationStep, completed: ReadonlySet<string>): boolean {
  if (step.required || step.blocking) return false;
  return step.prerequisites.every((p) => completed.has(p));
}

/** Present customer-facing vs internal copy from the same step. */
export function resolveStepPresentation(
  step: InstallationStep,
  audience: InstallationAudience
): { title: InstallationStep["title"]; description: InstallationStep["description"] } {
  if (isInternalAudience(audience) && step.internal_title && step.internal_description) {
    return { title: step.internal_title, description: step.internal_description };
  }
  return { title: step.title, description: step.description };
}

import { isCoreProviderOnboardingMode } from "../onboarding/enums";
import { deriveInstallationContractFromOnboarding } from "./derive-from-onboarding";
import { parseInstallationContract } from "./parse";
import type { InstallationContract, InstallationContractParseResult } from "./types";

/**
 * Resolve authoritative installation contract for APP rendering.
 * Prefer published installation_contract on provider row; else derive from onboarding_contract.
 */
export function resolveInstallationContract(opts: {
  providerKey: string;
  installationContract?: unknown;
  onboardingMode?: string | null;
  allowDraft?: boolean;
}): InstallationContractParseResult {
  if (opts.installationContract != null && opts.installationContract !== "") {
    const parsed = parseInstallationContract(opts.installationContract, {
      expectedProviderKey: opts.providerKey,
      allowDraft: opts.allowDraft,
    });
    if (parsed.ok) return parsed;
    // Fall through to derive only when explicitly missing; invalid published contracts fail closed.
    const row =
      opts.installationContract && typeof opts.installationContract === "object"
        ? (opts.installationContract as Record<string, unknown>)
        : null;
    if (row && Object.keys(row).length > 0) {
      return parsed;
    }
  }

  const mode = isCoreProviderOnboardingMode(opts.onboardingMode)
    ? opts.onboardingMode
    : "api_key_existing_provider";
  const derived = deriveInstallationContractFromOnboarding({
    providerKey: opts.providerKey,
    onboardingMode: mode,
  });
  return { ok: true, contract: derived, warnings: [] };
}

export function requireInstallationContract(
  result: InstallationContractParseResult
): InstallationContract {
  if (!result.ok) {
    throw new Error(
      `Invalid installation_contract: ${result.issues.map((i) => i.code).join(",")}`
    );
  }
  return result.contract;
}

import {
  DEFAULT_SUPPORT_MODE_PRIORITY,
  type InstallationSupportMode,
} from "./enums";
import type { InstallationContract } from "./types";

/**
 * Core chooses the simplest safe installation flow the provider supports.
 * Never auto-select self_service for non-technical customers when better options exist.
 */
export function selectDefaultSupportMode(
  contract: InstallationContract,
  opts?: { preferSelfService?: boolean }
): InstallationSupportMode {
  const allowed = new Set(contract.support_modes);
  if (opts?.preferSelfService && allowed.has("self_service")) {
    return "self_service";
  }
  if (allowed.has(contract.default_support_mode)) {
    return contract.default_support_mode;
  }
  for (const mode of DEFAULT_SUPPORT_MODE_PRIORITY) {
    if (allowed.has(mode)) return mode;
  }
  return contract.support_modes[0]!;
}

export function isSupportModeAllowed(
  contract: InstallationContract,
  mode: InstallationSupportMode
): boolean {
  return contract.support_modes.includes(mode);
}

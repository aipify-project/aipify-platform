import type { InstallationContractParseResult } from "@/lib/app-portal/integrations/installation";
import { parseInstallationContract } from "@/lib/app-portal/integrations/installation";

/**
 * Read-only Platform Admin preview hook for installation_contract.
 * Full structured editor depends on:
 * AIPIFY.PLATFORM.PROVIDER.ONBOARDING.PREMIUM.STRUCTURED.ADMIN.V2
 */
export function previewPlatformInstallationContract(
  raw: unknown,
  providerKey: string
): InstallationContractParseResult {
  return parseInstallationContract(raw, {
    expectedProviderKey: providerKey,
    allowDraft: true,
  });
}

export const INSTALLATION_PLATFORM_EDITOR_DEPENDENCY =
  "AIPIFY.PLATFORM.PROVIDER.ONBOARDING.PREMIUM.STRUCTURED.ADMIN.V2" as const;

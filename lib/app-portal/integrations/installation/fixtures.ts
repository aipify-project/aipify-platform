import { deriveInstallationContractFromOnboarding } from "./derive-from-onboarding";
import type { InstallationContract } from "./types";

/** Reference fixtures only — not live Production providers. */
export const fixtureInstallationOauth: InstallationContract = deriveInstallationContractFromOnboarding({
  providerKey: "commerce_provider",
  onboardingMode: "oauth",
});

export const fixtureInstallationApiKey: InstallationContract = deriveInstallationContractFromOnboarding({
  providerKey: "api_key_provider",
  onboardingMode: "api_key_existing_provider",
});

export const fixtureInstallationInstallable: InstallationContract =
  deriveInstallationContractFromOnboarding({
    providerKey: "cms_provider",
    onboardingMode: "installable_connector",
  });

export const fixtureInstallationHosted: InstallationContract = deriveInstallationContractFromOnboarding({
  providerKey: "hosted_connector",
  onboardingMode: "aipify_hosted_connector",
});

export const fixtureInstallationCustom: InstallationContract = deriveInstallationContractFromOnboarding({
  providerKey: "custom_erp",
  onboardingMode: "custom_provider_implementation",
});

export const INSTALLATION_CONTRACT_FIXTURES = [
  fixtureInstallationOauth,
  fixtureInstallationApiKey,
  fixtureInstallationInstallable,
  fixtureInstallationHosted,
  fixtureInstallationCustom,
] as const;

import { PlatformProviderOnboardingPanel } from "@/components/platform/provider-onboarding/PlatformProviderOnboardingPanel";
import { getCustomerAppPageDictionary } from "@/lib/i18n/get-dictionary";
import { getLocale } from "@/lib/i18n/get-locale";
import { createTranslator } from "@/lib/i18n/translate";

export default async function PlatformProviderOnboardingPage() {
  const locale = await getLocale();
  const dict = await getCustomerAppPageDictionary(locale, {
    splits: ["portalStructure"],
    namespaces: ["platform"],
  });
  const t = createTranslator(dict);

  return (
    <PlatformProviderOnboardingPanel
      translate={(key) => t(key)}
      labels={{
        title: t("platform.providerOnboarding.title"),
        subtitle: t("platform.providerOnboarding.subtitle"),
        loading: t("platform.providerOnboarding.loading"),
        loadFailed: t("platform.providerOnboarding.loadFailed"),
        providers: t("platform.providerOnboarding.providers"),
        fixtures: t("platform.providerOnboarding.fixtures"),
        save: t("platform.providerOnboarding.save"),
        saved: t("platform.providerOnboarding.saved"),
        invalidContract: t("platform.providerOnboarding.invalidContract"),
        denied: t("platform.providerOnboarding.denied"),
        advancedEditor: t("platform.providerOnboarding.advancedEditor"),
        selectProvider: t("platform.providerOnboarding.selectProvider"),
        available: t("platform.providerOnboarding.available"),
        unavailable: t("platform.providerOnboarding.unavailable"),
        preview: t("platform.providerOnboarding.preview"),
      }}
    />
  );
}

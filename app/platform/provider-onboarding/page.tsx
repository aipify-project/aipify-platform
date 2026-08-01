import { PlatformProviderOnboardingPanel } from "@/components/platform/provider-onboarding/PlatformProviderOnboardingPanel";
import { getCustomerAppPageDictionary } from "@/lib/i18n/get-dictionary";
import { getLocale } from "@/lib/i18n/get-locale";
import { createTranslator } from "@/lib/i18n/translate";
import { buildPlatformProviderOnboardingPanelProps } from "@/lib/platform/provider-onboarding/panel-props";

export default async function PlatformProviderOnboardingPage() {
  const locale = await getLocale();
  const dict = await getCustomerAppPageDictionary(locale, {
    splits: ["portalStructure"],
    namespaces: ["platform"],
  });
  const t = createTranslator(dict);
  const props = buildPlatformProviderOnboardingPanelProps(t);

  return (
    <PlatformProviderOnboardingPanel
      messageCatalog={props.messageCatalog}
      labels={props.labels}
    />
  );
}

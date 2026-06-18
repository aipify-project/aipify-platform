import { ImplementationOnboardingCenterPanel } from "@/components/app/implementation-onboarding-center";
import { buildImplementationOnboardingCenterLabels } from "@/lib/implementation-onboarding-center/labels";
import type { ImplementationOnboardingSection } from "@/lib/implementation-onboarding-center";
import { getCustomerAppDictionaryForModule } from "@/lib/i18n/get-dictionary";
import { getLocale } from "@/lib/i18n/get-locale";
import { createTranslator } from "@/lib/i18n/translate";

export async function ImplementationOnboardingSectionPage({
  activeSection,
}: {
  activeSection: ImplementationOnboardingSection;
}) {
  const locale = await getLocale();
  const dict = await getCustomerAppDictionaryForModule(locale, "implementationOnboardingCenter");
  const t = createTranslator(dict);
  const labels = buildImplementationOnboardingCenterLabels(t);

  return <ImplementationOnboardingCenterPanel labels={labels} activeSection={activeSection} />;
}

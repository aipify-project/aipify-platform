import { GettingStartedPanel } from "@/components/app/app-portal/GettingStartedPanel";
import { buildOnboardingLabels } from "@/lib/app-portal/onboarding";
import { getCustomerAppDictionaryForSplits } from "@/lib/i18n/get-dictionary";
import { getLocale } from "@/lib/i18n/get-locale";
import { createTranslator } from "@/lib/i18n/translate";

export default async function GettingStartedPage() {
  const locale = await getLocale();
  const dict = await getCustomerAppDictionaryForSplits(locale, ["dashboard"]);
  const t = createTranslator(dict);
  return (
    <div className="p-6">
      <GettingStartedPanel labels={buildOnboardingLabels(t)} />
    </div>
  );
}

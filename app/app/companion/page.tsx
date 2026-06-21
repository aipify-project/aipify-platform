import { CompanionPanel } from "@/components/app/companion-experience";
import { buildCompanionExperienceLabels } from "@/lib/app/companion/labels";
import { getCustomerAppDictionaryForSplits } from "@/lib/i18n/get-dictionary";
import { getLocale } from "@/lib/i18n/get-locale";
import { createTranslator } from "@/lib/i18n/translate";

export default async function AipifyCompanionPage() {
  const locale = await getLocale();
  const dict = await getCustomerAppDictionaryForSplits(locale, ["companion"]);
  const labels = buildCompanionExperienceLabels(createTranslator(dict));

  return (
    <CompanionPanel
      labels={labels}
      locale={locale}
      pathname="/app/companion"
      mode="fullpage"
    />
  );
}

import { ServiceCasePanel } from "@/components/app/service-case";
import { buildServiceCaseLabels } from "@/lib/service-case/labels";
import { getCustomerAppDictionaryForSplits } from "@/lib/i18n/get-dictionary";
import { getLocale } from "@/lib/i18n/get-locale";
import { createTranslator } from "@/lib/i18n/translate";

export default async function CasesPage() {
  const locale = await getLocale();
  const dict = await getCustomerAppDictionaryForSplits(locale, ["settings"]);
  const t = createTranslator(dict);
  const labels = buildServiceCaseLabels(t);

  return <ServiceCasePanel labels={labels} />;
}

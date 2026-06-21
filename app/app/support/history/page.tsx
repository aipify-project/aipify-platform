import { SupportHistoryPanel } from "@/components/app/app-portal/SupportHistoryPanel";
import { buildSupportHistoryLabels } from "@/lib/app-portal/support-history";
import { getCustomerAppDictionaryForSplits } from "@/lib/i18n/get-dictionary";
import { getLocale } from "@/lib/i18n/get-locale";
import { createTranslator } from "@/lib/i18n/translate";

export default async function SupportHistoryPage() {
  const locale = await getLocale();
  const dict = await getCustomerAppDictionaryForSplits(locale, ["portalStructure"]);
  const t = createTranslator(dict);

  return (
    <SupportHistoryPanel labels={buildSupportHistoryLabels(t)} locale={locale} />
  );
}

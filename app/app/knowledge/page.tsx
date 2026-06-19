import { CorporateMemoryEnginePanel } from "@/components/app/corporate-memory";
import { buildCorporateMemoryLabels } from "@/lib/corporate-memory/labels";
import { getCustomerAppDictionaryForSplits } from "@/lib/i18n/get-dictionary";
import { getLocale } from "@/lib/i18n/get-locale";
import { createTranslator } from "@/lib/i18n/translate";

export default async function KnowledgePage() {
  const locale = await getLocale();
  const dict = await getCustomerAppDictionaryForSplits(locale, ["settings"]);
  const t = createTranslator(dict);
  const labels = buildCorporateMemoryLabels(t);

  return <CorporateMemoryEnginePanel labels={labels} />;
}

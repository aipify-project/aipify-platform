import { SalesRevenuePipelinePanel } from "@/components/app/sales-revenue-pipeline";
import { buildSalesRevenuePipelineLabels } from "@/lib/sales-revenue-pipeline/labels";
import { getCustomerAppDictionaryForSplits } from "@/lib/i18n/get-dictionary";
import { getLocale } from "@/lib/i18n/get-locale";
import { createTranslator } from "@/lib/i18n/translate";

export default async function SalesPage() {
  const locale = await getLocale();
  const dict = await getCustomerAppDictionaryForSplits(locale, ["settings"]);
  const t = createTranslator(dict);
  const labels = buildSalesRevenuePipelineLabels(t);

  return <SalesRevenuePipelinePanel labels={labels} />;
}

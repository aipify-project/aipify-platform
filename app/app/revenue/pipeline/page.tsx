import { RevenueOperationsPanel } from "@/components/app/revenue-operations";
import { buildCustomerRevenueOperationsLabels } from "@/lib/customer-revenue-operations";
import { getCustomerAppDictionaryForModule } from "@/lib/i18n/get-dictionary";
import { getLocale } from "@/lib/i18n/get-locale";
import { createTranslator } from "@/lib/i18n/translate";

export default async function RevenuePipelinePage() {
  const dict = await getCustomerAppDictionaryForModule(await getLocale(), "revenueOperations");
  const labels = buildCustomerRevenueOperationsLabels(createTranslator(dict));
  return (
    <RevenueOperationsPanel
      backHref="/app/revenue"
      initialTab="pipeline"
      visibleTabs={["overview", "pipeline", "forecasts", "expansion", "executive"]}
      titleOverride={labels.pipelinePage.title}
      subtitleOverride={labels.pipelinePage.subtitle}
      labels={labels}
    />
  );
}

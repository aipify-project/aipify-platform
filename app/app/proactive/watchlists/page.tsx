import { ProactivePanel } from "@/components/app/proactive-operations";
import { buildProactiveLabels } from "@/lib/customer-proactive-operations";
import { getCustomerAppDictionaryForModule } from "@/lib/i18n/get-dictionary";
import { getLocale } from "@/lib/i18n/get-locale";
import { createTranslator } from "@/lib/i18n/translate";

export default async function ProactiveWatchlistsPage() {
  const dict = await getCustomerAppDictionaryForModule(await getLocale(), "proactiveOperations");
  const labels = buildProactiveLabels(createTranslator(dict));
  return (
    <ProactivePanel
      backHref="/app/proactive"
      initialTab="insights"
      visibleTabs={["insights", "observations", "opportunities", "recommendations", "overview"]}
      titleOverride={labels.watchlistsTitle}
      labels={labels}
    />
  );
}

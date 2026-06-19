import { RiskOperationsPanel } from "@/components/app/risk-operations";
import { buildRiskOperationsLabels } from "@/lib/risk-operations/labels";
import { getCustomerAppDictionaryForSplits } from "@/lib/i18n/get-dictionary";
import { getLocale } from "@/lib/i18n/get-locale";
import { createTranslator } from "@/lib/i18n/translate";

export default async function BusinessContinuityPage() {
  const locale = await getLocale();
  const dict = await getCustomerAppDictionaryForSplits(locale, ["settings"]);
  const t = createTranslator(dict);
  const labels = buildRiskOperationsLabels(t);

  return (
    <RiskOperationsPanel
      labels={labels}
      initialTab="business_continuity"
      titleOverride={labels.continuityTitlePage}
      visibleTabs={["overview", "business_continuity", "dependencies", "incidents", "reports"]}
    />
  );
}

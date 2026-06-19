import { QualityOperationsPanel } from "@/components/app/quality-operations";
import { buildQualityOperationsLabels } from "@/lib/quality-operations/labels";
import { getCustomerAppDictionaryForSplits } from "@/lib/i18n/get-dictionary";
import { getLocale } from "@/lib/i18n/get-locale";
import { createTranslator } from "@/lib/i18n/translate";

export default async function QualityStandardsPage() {
  const locale = await getLocale();
  const dict = await getCustomerAppDictionaryForSplits(locale, ["settings"]);
  const t = createTranslator(dict);
  const labels = buildQualityOperationsLabels(t);

  return (
    <QualityOperationsPanel
      labels={labels}
      initialTab="standards"
      titleOverride={labels.standardsTitle}
      visibleTabs={["overview", "standards", "compliance", "reports"]}
    />
  );
}

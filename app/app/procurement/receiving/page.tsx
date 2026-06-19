import { ProcurementOperationsPanel } from "@/components/app/procurement-operations";
import { buildProcurementOperationsLabels } from "@/lib/procurement-operations/labels";
import { getCustomerAppDictionaryForSplits } from "@/lib/i18n/get-dictionary";
import { getLocale } from "@/lib/i18n/get-locale";
import { createTranslator } from "@/lib/i18n/translate";

export default async function ProcurementReceivingPage() {
  const locale = await getLocale();
  const dict = await getCustomerAppDictionaryForSplits(locale, ["settings"]);
  const t = createTranslator(dict);
  const labels = buildProcurementOperationsLabels(t);

  return (
    <ProcurementOperationsPanel
      labels={labels}
      initialTab="incoming_goods"
      titleOverride={labels.receivingTitle}
      visibleTabs={["overview", "incoming_goods", "orders", "reports"]}
    />
  );
}

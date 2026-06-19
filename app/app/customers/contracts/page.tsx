import { CustomerRelationshipPanel } from "@/components/app/customer-relationship";
import { buildCustomerRelationshipLabels } from "@/lib/customer-relationship/labels";
import { getCustomerAppDictionaryForSplits } from "@/lib/i18n/get-dictionary";
import { getLocale } from "@/lib/i18n/get-locale";
import { createTranslator } from "@/lib/i18n/translate";

export default async function CustomerContractsPage() {
  const locale = await getLocale();
  const dict = await getCustomerAppDictionaryForSplits(locale, ["settings"]);
  const t = createTranslator(dict);
  const labels = buildCustomerRelationshipLabels(t);

  return (
    <CustomerRelationshipPanel
      labels={labels}
      initialTab="contracts"
      titleOverride={labels.contractsTitle}
      visibleTabs={["overview", "contracts", "renewals", "reports"]}
    />
  );
}

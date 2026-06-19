import { LeadManagementPanel } from "@/components/app/customer-relationship";
import { buildCustomerRelationshipLabels } from "@/lib/customer-relationship/labels";
import { getCustomerAppDictionaryForSplits } from "@/lib/i18n/get-dictionary";
import { getLocale } from "@/lib/i18n/get-locale";
import { createTranslator } from "@/lib/i18n/translate";

export default async function LeadsPage() {
  const locale = await getLocale();
  const dict = await getCustomerAppDictionaryForSplits(locale, ["settings"]);
  const t = createTranslator(dict);
  const labels = buildCustomerRelationshipLabels(t);

  return <LeadManagementPanel labels={labels} />;
}

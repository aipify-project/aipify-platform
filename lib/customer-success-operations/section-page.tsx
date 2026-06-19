import { CustomerSuccessOperationsPanel } from "@/components/app/customer-success-operations";
import { buildCsar587CustomerLabels } from "@/lib/customer-success-operations/labels";
import type { Csar587CustomerSection } from "@/lib/customer-success-operations/config";
import { getCustomerAppDictionaryForModule } from "@/lib/i18n/get-dictionary";
import { getLocale } from "@/lib/i18n/get-locale";
import { createTranslator } from "@/lib/i18n/translate";

export async function CustomerSuccessOperationsSectionPage({
  activeSection,
}: {
  activeSection: Csar587CustomerSection;
}) {
  const locale = await getLocale();
  const dict = await getCustomerAppDictionaryForModule(locale, "customerSuccessOperations");
  const t = createTranslator(dict);
  const labels = buildCsar587CustomerLabels(t);

  return <CustomerSuccessOperationsPanel labels={labels} activeSection={activeSection} />;
}

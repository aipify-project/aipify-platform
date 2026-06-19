import { RevenueOperationsPanel } from "@/components/app/revenue-operations";
import { buildCustomerRevenueOperationsLabels } from "@/lib/customer-revenue-operations";
import { getCustomerAppDictionaryForModule } from "@/lib/i18n/get-dictionary";
import { getLocale } from "@/lib/i18n/get-locale";
import { createTranslator } from "@/lib/i18n/translate";

export default async function RevenueOperationsPage() {
  const dict = await getCustomerAppDictionaryForModule(await getLocale(), "revenueOperations");
  return (
    <RevenueOperationsPanel backHref="/app" labels={buildCustomerRevenueOperationsLabels(createTranslator(dict))} />
  );
}

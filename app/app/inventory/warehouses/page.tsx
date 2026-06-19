import { InventoryOperationsPanel } from "@/components/app/inventory-operations";
import { buildInventoryOperationsLabels } from "@/lib/inventory-operations/labels";
import { getCustomerAppDictionaryForSplits } from "@/lib/i18n/get-dictionary";
import { getLocale } from "@/lib/i18n/get-locale";
import { createTranslator } from "@/lib/i18n/translate";

export default async function InventoryWarehousesPage() {
  const locale = await getLocale();
  const dict = await getCustomerAppDictionaryForSplits(locale, ["settings"]);
  const t = createTranslator(dict);
  const labels = buildInventoryOperationsLabels(t);

  return <InventoryOperationsPanel labels={labels} initialTab="warehouses" />;
}

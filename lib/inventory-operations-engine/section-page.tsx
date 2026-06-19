import { InventoryOperationsEnginePanel } from "@/components/app/inventory-operations/InventoryOperationsEnginePanel";
import { buildInventoryOperationsEngineLabels } from "@/lib/inventory-operations-engine/labels";
import type { Inv613Section } from "@/lib/inventory-operations-engine/config";
import { getCustomerAppDictionaryForSplits } from "@/lib/i18n/get-dictionary";
import { getLocale } from "@/lib/i18n/get-locale";
import { createTranslator } from "@/lib/i18n/translate";

export async function InventoryOperationsSectionPage({
  activeSection,
}: {
  activeSection: Inv613Section;
}) {
  const locale = await getLocale();
  const dict = await getCustomerAppDictionaryForSplits(locale, ["settings"]);
  const t = createTranslator(dict);
  return (
    <InventoryOperationsEnginePanel
      labels={buildInventoryOperationsEngineLabels(t)}
      activeSection={activeSection}
    />
  );
}

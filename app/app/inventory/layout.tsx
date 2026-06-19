import type { ReactNode } from "react";
import { InventoryOperationsNav } from "@/components/app/inventory-operations";
import { buildInventoryOperationsEngineLabels } from "@/lib/inventory-operations-engine/labels";
import { getCustomerAppDictionaryForSplits } from "@/lib/i18n/get-dictionary";
import { getLocale } from "@/lib/i18n/get-locale";
import { createTranslator } from "@/lib/i18n/translate";

export default async function InventoryLayout({ children }: { children: ReactNode }) {
  const locale = await getLocale();
  const dict = await getCustomerAppDictionaryForSplits(locale, ["settings"]);
  const t = createTranslator(dict);
  const labels = buildInventoryOperationsEngineLabels(t);

  return (
    <div className="mx-auto max-w-7xl space-y-6 p-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-aipify-text">{labels.title}</h1>
        <p className="mt-2 text-aipify-text-secondary">{labels.subtitle}</p>
      </div>
      <InventoryOperationsNav labels={labels.sections} />
      {children}
    </div>
  );
}

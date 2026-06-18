import { AipifyOperationsCenterPanel } from "@/components/app/operations-center";
import { buildOperationsCenterLabels } from "@/lib/operations-center/labels";
import { getCustomerAppDictionaryForModule } from "@/lib/i18n/get-dictionary";
import { getLocale } from "@/lib/i18n/get-locale";
import { createTranslator } from "@/lib/i18n/translate";

export default async function OperationsPage() {
  const locale = await getLocale();
  const dict = await getCustomerAppDictionaryForModule(locale, "operationsCenter");
  const t = createTranslator(dict);

  return (
    <div className="mx-auto max-w-7xl p-6">
      <AipifyOperationsCenterPanel labels={buildOperationsCenterLabels(t)} />
    </div>
  );
}

import type { ReactNode } from "react";
import { CustomerSuccessOperationsNav } from "@/components/app/customer-success-operations";
import { buildCsar587CustomerLabels } from "@/lib/customer-success-operations/labels";
import { getCustomerAppDictionaryForModule } from "@/lib/i18n/get-dictionary";
import { getLocale } from "@/lib/i18n/get-locale";
import { createTranslator } from "@/lib/i18n/translate";

export default async function CustomerSuccessLayout({ children }: { children: ReactNode }) {
  const locale = await getLocale();
  const dict = await getCustomerAppDictionaryForModule(locale, "customerSuccessOperations");
  const t = createTranslator(dict);
  const labels = buildCsar587CustomerLabels(t);

  return (
    <div className="mx-auto max-w-7xl space-y-6 p-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-gray-900">{labels.title}</h1>
        <p className="mt-2 text-gray-600">{labels.subtitle}</p>
      </div>
      <CustomerSuccessOperationsNav labels={labels.sections} />
      {children}
    </div>
  );
}

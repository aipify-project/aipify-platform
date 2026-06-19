import type { ReactNode } from "react";
import { CompanionMemoryCenterNav } from "@/components/app/companion-memory-center";
import { buildCompanionMemoryCenterLabels } from "@/lib/companion-memory-center-engine/labels";
import { getCustomerAppDictionaryForModule } from "@/lib/i18n/get-dictionary";
import { getLocale } from "@/lib/i18n/get-locale";
import { createTranslator } from "@/lib/i18n/translate";

export default async function CompanionMemoryCenterLayout({ children }: { children: ReactNode }) {
  const locale = await getLocale();
  const dict = await getCustomerAppDictionaryForModule(locale, "companionMemoryCenter");
  const t = createTranslator(dict);
  const labels = buildCompanionMemoryCenterLabels(t);

  return (
    <div className="mx-auto max-w-7xl space-y-6 p-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-gray-900">{labels.title}</h1>
        <p className="mt-2 text-gray-600">{labels.subtitle}</p>
      </div>
      <CompanionMemoryCenterNav labels={labels.sections} />
      {children}
    </div>
  );
}

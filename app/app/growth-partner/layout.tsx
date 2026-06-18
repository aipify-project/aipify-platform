import type { ReactNode } from "react";
import { GrowthPartnerOpsNav } from "@/components/app/growth-partner-operations-center";
import { buildGrowthPartnerOperationsCenterLabels } from "@/lib/growth-partner-operations-center/labels";
import { getCustomerAppDictionaryForModule } from "@/lib/i18n/get-dictionary";
import { getLocale } from "@/lib/i18n/get-locale";
import { createTranslator } from "@/lib/i18n/translate";

export default async function GrowthPartnerLayout({ children }: { children: ReactNode }) {
  const locale = await getLocale();
  const dict = await getCustomerAppDictionaryForModule(locale, "growthPartnerOperationsCenter");
  const t = createTranslator(dict);
  const labels = buildGrowthPartnerOperationsCenterLabels(t);

  return (
    <div className="mx-auto max-w-7xl space-y-6 p-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-gray-900">{labels.title}</h1>
        <p className="mt-2 text-gray-600">{labels.subtitle}</p>
      </div>
      <GrowthPartnerOpsNav labels={labels.sections} />
      {children}
    </div>
  );
}

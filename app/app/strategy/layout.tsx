import type { ReactNode } from "react";
import { StrategyCenterNav } from "@/components/app/strategy-center";
import { buildStrategyCenterLabels } from "@/lib/strategy-center-engine/labels";
import { getCustomerAppDictionaryForModule } from "@/lib/i18n/get-dictionary";
import { getLocale } from "@/lib/i18n/get-locale";
import { createTranslator } from "@/lib/i18n/translate";

export default async function StrategyLayout({ children }: { children: ReactNode }) {
  const locale = await getLocale();
  const dict = await getCustomerAppDictionaryForModule(locale, "strategyCenter");
  const t = createTranslator(dict);
  const labels = buildStrategyCenterLabels(t);

  return (
    <div className="mx-auto max-w-7xl space-y-6 p-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-gray-900">{labels.title}</h1>
        <p className="mt-2 text-gray-600">{labels.subtitle}</p>
      </div>
      <StrategyCenterNav labels={labels.sections} />
      {children}
    </div>
  );
}

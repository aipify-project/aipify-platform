import type { ReactNode } from "react";
import { AbsenceCoverageNav } from "@/components/app/absence-coverage";
import { buildAbsenceCoverageLabels } from "@/lib/absence-coverage-engine/labels";
import { getCustomerAppDictionaryForModule } from "@/lib/i18n/get-dictionary";
import { getLocale } from "@/lib/i18n/get-locale";
import { createTranslator } from "@/lib/i18n/translate";

export default async function AbsenceCoverageLayout({ children }: { children: ReactNode }) {
  const locale = await getLocale();
  const dict = await getCustomerAppDictionaryForModule(locale, "absenceCoverage");
  const t = createTranslator(dict);
  const labels = buildAbsenceCoverageLabels(t);

  return (
    <div className="mx-auto max-w-7xl space-y-6 p-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-gray-900">{labels.title}</h1>
        <p className="mt-2 text-gray-600">{labels.subtitle}</p>
      </div>
      <AbsenceCoverageNav labels={labels.sections} />
      {children}
    </div>
  );
}

import type { ReactNode } from "react";
import { ChangeOperationsNav } from "@/components/platform/change-operations";
import { buildChangeOperationsLabels } from "@/lib/change-operations-engine/labels";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import { getLocale } from "@/lib/i18n/get-locale";
import { createTranslator } from "@/lib/i18n/translate";

export default async function PlatformChangeOperationsLayout({ children }: { children: ReactNode }) {
  const locale = await getLocale();
  const dict = await getDictionary(locale, ["platform"]);
  const t = createTranslator(dict);
  const labels = buildChangeOperationsLabels(t);

  return (
    <div className="mx-auto max-w-7xl space-y-6 p-4 sm:p-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-gray-900">{labels.title}</h1>
        <p className="mt-2 text-gray-600">{labels.subtitle}</p>
      </div>
      <ChangeOperationsNav labels={labels.sections} />
      {children}
    </div>
  );
}

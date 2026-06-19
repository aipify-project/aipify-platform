import type { ReactNode } from "react";
import { EcosystemCenterNav } from "@/components/platform/ecosystem-center";
import { buildEcosystemCenterLabels } from "@/lib/ecosystem-center-engine/labels";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import { getLocale } from "@/lib/i18n/get-locale";
import { createTranslator } from "@/lib/i18n/translate";

export default async function PlatformEcosystemLayout({ children }: { children: ReactNode }) {
  const locale = await getLocale();
  const dict = await getDictionary(locale, ["platform"]);
  const t = createTranslator(dict);
  const labels = buildEcosystemCenterLabels(t);

  return (
    <div className="mx-auto max-w-7xl space-y-6 p-4 sm:p-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-gray-900">{labels.title}</h1>
        <p className="mt-2 text-gray-600">{labels.subtitle}</p>
      </div>
      <EcosystemCenterNav labels={labels.sections} />
      {children}
    </div>
  );
}

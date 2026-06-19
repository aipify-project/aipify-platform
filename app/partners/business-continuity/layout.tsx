import type { ReactNode } from "react";
import { PartnerBusinessContinuityNav } from "@/components/partners/business-continuity";
import { buildPartnerBusinessContinuityLabels } from "@/lib/business-continuity-engine/labels";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import { getLocale } from "@/lib/i18n/get-locale";
import { createTranslator } from "@/lib/i18n/translate";

export default async function PartnerBusinessContinuityLayout({ children }: { children: ReactNode }) {
  const dict = await getDictionary(await getLocale(), ["common", "partnersPortal"]);
  const t = createTranslator(dict);
  const labels = buildPartnerBusinessContinuityLabels(t);

  return (
    <div className="mx-auto max-w-7xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-gray-900">{labels.title}</h1>
        <p className="mt-2 text-gray-600">{labels.subtitle}</p>
      </div>
      <PartnerBusinessContinuityNav labels={labels.sections} />
      {children}
    </div>
  );
}

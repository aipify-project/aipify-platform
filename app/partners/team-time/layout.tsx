import type { ReactNode } from "react";
import { PartnerTeamTimeNav } from "@/components/partners/team-time";
import { buildPartnerTeamTimeLabels } from "@/lib/time-attendance-engine/labels";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import { getLocale } from "@/lib/i18n/get-locale";
import { createTranslator } from "@/lib/i18n/translate";

export default async function PartnerTeamTimeLayout({ children }: { children: ReactNode }) {
  const dict = await getDictionary(await getLocale(), ["partnersPortal"]);
  const t = createTranslator(dict);
  const labels = buildPartnerTeamTimeLabels(t);

  return (
    <div className="mx-auto max-w-5xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-gray-900">{labels.title}</h1>
        <p className="mt-2 text-gray-600">{labels.subtitle}</p>
      </div>
      <PartnerTeamTimeNav labels={labels.sections} />
      {children}
    </div>
  );
}

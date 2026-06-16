import { GrowthPartnerPortalPanel } from "@/components/growth-partner-portal";
import { buildGrowthPartnerPortalLabels } from "@/lib/growth-partner-portal/labels";
import type { GrowthPartnerPortalSectionKey } from "@/lib/growth-partner-portal";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import { getLocale } from "@/lib/i18n/get-locale";
import { createTranslator } from "@/lib/i18n/translate";

export async function renderGrowthPartnerPortalSection(section: GrowthPartnerPortalSectionKey) {
  const dict = await getDictionary(await getLocale(), ["growthPartnerPortal"]);
  const t = createTranslator(dict);
  const labels = buildGrowthPartnerPortalLabels(t, section);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold tracking-tight text-slate-900">{labels.pageTitle}</h2>
        <p className="mt-2 text-slate-600">{labels.pageSubtitle}</p>
      </div>
      <GrowthPartnerPortalPanel section={section} labels={labels} />
    </div>
  );
}

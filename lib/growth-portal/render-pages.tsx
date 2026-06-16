import { GrowthPortalFoundationPanel } from "@/components/growth-portal";
import { buildGrowthPortalLabels } from "@/lib/growth-portal/labels";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import { getLocale } from "@/lib/i18n/get-locale";
import { createTranslator } from "@/lib/i18n/translate";

export async function renderGrowthPortalFoundationPage(
  titleKey: string,
  subtitleKey: string
) {
  const dict = await getDictionary(await getLocale(), ["growthPortal", "auth"]);
  const t = createTranslator(dict);
  const labels = buildGrowthPortalLabels(t);

  return (
    <GrowthPortalFoundationPanel
      title={t(titleKey)}
      subtitle={t(subtitleKey)}
      structureNote={labels.foundation.structureNote}
      backLabel={labels.foundation.back}
    />
  );
}

export async function renderGrowthPartnerSection(section: Parameters<
  typeof import("@/lib/growth-partner-portal/render-section")["renderGrowthPartnerPortalSection"]
>[0]) {
  const { renderGrowthPartnerPortalSection } = await import(
    "@/lib/growth-partner-portal/render-section"
  );
  return renderGrowthPartnerPortalSection(section);
}

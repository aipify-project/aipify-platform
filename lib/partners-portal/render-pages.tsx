import { PartnersPortalFoundationPanel } from "@/components/partners-portal";
import { buildPartnersPortalLabels } from "@/lib/partners-portal/labels";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import { getLocale } from "@/lib/i18n/get-locale";
import { createTranslator } from "@/lib/i18n/translate";

export async function renderPartnersPortalFoundationPage(
  titleKey: string,
  subtitleKey: string
) {
  const dict = await getDictionary(await getLocale(), ["partnersPortal", "auth"]);
  const t = createTranslator(dict);
  const labels = buildPartnersPortalLabels(t);

  return (
    <PartnersPortalFoundationPanel
      title={t(titleKey)}
      subtitle={t(subtitleKey)}
      structureNote={labels.foundation.structureNote}
      backLabel={labels.foundation.back}
    />
  );
}

export async function renderPartnersSection(section: Parameters<
  typeof import("@/lib/growth-partner-portal/render-section")["renderGrowthPartnerPortalSection"]
>[0]) {
  const { renderGrowthPartnerPortalSection } = await import(
    "@/lib/growth-partner-portal/render-section"
  );
  return renderGrowthPartnerPortalSection(section);
}

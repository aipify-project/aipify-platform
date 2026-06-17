import { PartnerPortalPanel } from "@/components/partner-portal";
import { buildPartnerPortalPanelLabels } from "@/lib/partner-portal/panel-labels";
import type { PartnerPortalSectionKey } from "@/lib/partner-portal";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import { getLocale } from "@/lib/i18n/get-locale";
import { createTranslator } from "@/lib/i18n/translate";

export async function renderPartnerSectionPage(section: PartnerPortalSectionKey) {
  const dict = await getDictionary(await getLocale(), ["partnerPortal"]);
  const t = createTranslator(dict);
  return <PartnerPortalPanel section={section} labels={buildPartnerPortalPanelLabels(t, section)} />;
}

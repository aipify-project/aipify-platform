import { PartnersPortalDashboardPanel } from "@/components/partners-portal";
import {
  buildPartnersPortalLabels,
  buildPartnersPortalNavLabels,
} from "@/lib/partners-portal/labels";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import { getLocale } from "@/lib/i18n/get-locale";
import { createTranslator } from "@/lib/i18n/translate";

export default async function PartnersPortalPage() {
  const dict = await getDictionary(await getLocale(), ["partnersPortal"]);
  const t = createTranslator(dict);
  const labels = buildPartnersPortalLabels(t);
  const navLabels = buildPartnersPortalNavLabels(t);

  return (
    <PartnersPortalDashboardPanel labels={labels.dashboard} navLabels={navLabels} />
  );
}

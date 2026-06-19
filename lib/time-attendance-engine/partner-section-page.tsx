import { PartnerTeamTimePanel } from "@/components/partners/team-time";
import { buildPartnerTeamTimeLabels } from "@/lib/time-attendance-engine/labels";
import type { Ta609PartnerSection } from "@/lib/time-attendance-engine/config";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import { getLocale } from "@/lib/i18n/get-locale";
import { createTranslator } from "@/lib/i18n/translate";

export async function PartnerTeamTimeSectionPage({ activeSection }: { activeSection: Ta609PartnerSection }) {
  const dict = await getDictionary(await getLocale(), ["partnersPortal"]);
  const t = createTranslator(dict);
  return <PartnerTeamTimePanel labels={buildPartnerTeamTimeLabels(t)} activeSection={activeSection} />;
}

import { PartnerSettlementsPanel } from "@/components/partner-portal";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import { getLocale } from "@/lib/i18n/get-locale";
import { createTranslator } from "@/lib/i18n/translate";
import { buildPartnerSettlementsLabels } from "@/lib/partner-settlements/labels";

export default async function PartnerSettlementsPage() {
  const dict = await getDictionary(await getLocale(), ["partnerSettlements"]);
  const t = createTranslator(dict);
  return <PartnerSettlementsPanel labels={buildPartnerSettlementsLabels(t)} />;
}

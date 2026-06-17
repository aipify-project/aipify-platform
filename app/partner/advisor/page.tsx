import { PartnerAdvisorPanel } from "@/components/partner-portal";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import { getLocale } from "@/lib/i18n/get-locale";
import { createTranslator } from "@/lib/i18n/translate";
import { buildPartnerAdvisorLabels } from "@/lib/partner-advisor/labels";

export default async function PartnerAdvisorPage() {
  const dict = await getDictionary(await getLocale(), ["partnerAdvisor"]);
  const t = createTranslator(dict);
  return <PartnerAdvisorPanel labels={buildPartnerAdvisorLabels(t)} />;
}

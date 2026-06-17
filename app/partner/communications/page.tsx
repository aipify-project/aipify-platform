import { PartnerCommunicationsPanel } from "@/components/partner-portal";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import { getLocale } from "@/lib/i18n/get-locale";
import { createTranslator } from "@/lib/i18n/translate";
import { buildPartnerCommunicationsLabels } from "@/lib/partner-communications-email/labels";

export default async function PartnerCommunicationsPage() {
  const dict = await getDictionary(await getLocale(), ["partnerCommunications"]);
  const t = createTranslator(dict);
  return <PartnerCommunicationsPanel labels={buildPartnerCommunicationsLabels(t)} />;
}

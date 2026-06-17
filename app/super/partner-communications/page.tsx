import { SuperPartnerCommunicationsPanel } from "@/components/super-admin/SuperPartnerCommunicationsPanel";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import { getLocale } from "@/lib/i18n/get-locale";
import { createTranslator } from "@/lib/i18n/translate";
import { buildSuperPartnerCommunicationsLabels } from "@/lib/partner-communications-email/labels";

export default async function SuperPartnerCommunicationsPage() {
  const dict = await getDictionary(await getLocale(), ["superAdmin"]);
  const t = createTranslator(dict);
  return <SuperPartnerCommunicationsPanel labels={buildSuperPartnerCommunicationsLabels(t)} />;
}

import { PartnerCommissionsPanel } from "@/components/partner-portal";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import { getLocale } from "@/lib/i18n/get-locale";
import { createTranslator } from "@/lib/i18n/translate";
import { buildPartnerCommissionsLabels } from "@/lib/partner-commissions/labels";

export default async function PartnerCommissionsPage() {
  const dict = await getDictionary(await getLocale(), ["partnerCommissions"]);
  const t = createTranslator(dict);
  return <PartnerCommissionsPanel labels={buildPartnerCommissionsLabels(t)} />;
}

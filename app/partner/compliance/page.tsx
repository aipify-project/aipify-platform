import { PartnerCompliancePanel } from "@/components/partner-portal";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import { getLocale } from "@/lib/i18n/get-locale";
import { createTranslator } from "@/lib/i18n/translate";
import { buildPartnerComplianceLabels } from "@/lib/partner-compliance/labels";

export default async function PartnerCompliancePage() {
  const dict = await getDictionary(await getLocale(), ["partnerCompliance"]);
  const t = createTranslator(dict);
  return <PartnerCompliancePanel labels={buildPartnerComplianceLabels(t)} />;
}

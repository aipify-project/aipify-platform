import { PartnerOpportunitiesPanel } from "@/components/partner-portal";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import { getLocale } from "@/lib/i18n/get-locale";
import { createTranslator } from "@/lib/i18n/translate";
import { buildPartnerOpportunitiesLabels } from "@/lib/partner-opportunities/labels";

export default async function PartnerOpportunitiesPage() {
  const dict = await getDictionary(await getLocale(), ["partnerOpportunities"]);
  const t = createTranslator(dict);
  return <PartnerOpportunitiesPanel labels={buildPartnerOpportunitiesLabels(t)} />;
}

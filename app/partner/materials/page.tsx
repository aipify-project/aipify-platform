import { PartnerMaterialsPanel } from "@/components/partner-portal";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import { getLocale } from "@/lib/i18n/get-locale";
import { createTranslator } from "@/lib/i18n/translate";
import { buildPartnerMaterialsLabels } from "@/lib/partner-materials/labels";

export default async function PartnerMaterialsPage() {
  const dict = await getDictionary(await getLocale(), ["partnerMaterials"]);
  const t = createTranslator(dict);
  return <PartnerMaterialsPanel labels={buildPartnerMaterialsLabels(t)} />;
}

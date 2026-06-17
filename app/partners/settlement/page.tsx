import { GrowthPartnerEconomyPanel } from "@/components/partners-portal/GrowthPartnerEconomyPanel";
import { buildGrowthPartnerEconomyLabels } from "@/lib/partners-portal/economy-engine";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import { getLocale } from "@/lib/i18n/get-locale";
import { createTranslator } from "@/lib/i18n/translate";

export default async function PartnerSettlementPage() {
  const dict = await getDictionary(await getLocale(), ["partnersPortal", "auth"]);
  const t = createTranslator(dict);
  return (
    <div className="p-6">
      <GrowthPartnerEconomyPanel labels={buildGrowthPartnerEconomyLabels(t)} />
    </div>
  );
}

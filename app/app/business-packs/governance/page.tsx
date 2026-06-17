import { BusinessPackGovernancePanel } from "@/components/app/app-portal/BusinessPackGovernancePanel";
import { buildGovernanceLabels } from "@/lib/app-portal/business-pack-governance";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import { getLocale } from "@/lib/i18n/get-locale";
import { createTranslator } from "@/lib/i18n/translate";

export default async function BusinessPackGovernancePage() {
  const locale = await getLocale();
  const dict = await getDictionary(locale, ["customerApp"]);
  const t = createTranslator(dict);
  return (
    <div className="p-6">
      <BusinessPackGovernancePanel labels={buildGovernanceLabels(t)} />
    </div>
  );
}

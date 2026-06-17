import { BusinessPackCompliancePanel } from "@/components/app/app-portal/BusinessPackCompliancePanel";
import { buildComplianceLabels } from "@/lib/app-portal/business-pack-compliance";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import { getLocale } from "@/lib/i18n/get-locale";
import { createTranslator } from "@/lib/i18n/translate";

export default async function BusinessPackCompliancePage() {
  const locale = await getLocale();
  const dict = await getDictionary(locale, ["customerApp"]);
  const t = createTranslator(dict);
  return (
    <div className="p-6">
      <BusinessPackCompliancePanel labels={buildComplianceLabels(t)} />
    </div>
  );
}

import { CompliancePanel } from "@/components/app/app-portal/CompliancePanel";
import { buildComplianceLabels } from "@/lib/app-portal/compliance";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import { getLocale } from "@/lib/i18n/get-locale";
import { createTranslator } from "@/lib/i18n/translate";

export default async function CompliancePage() {
  const locale = await getLocale();
  const dict = await getDictionary(locale, ["customerApp"]);
  const t = createTranslator(dict);
  return (
    <div className="p-6">
      <CompliancePanel labels={buildComplianceLabels(t)} />
    </div>
  );
}

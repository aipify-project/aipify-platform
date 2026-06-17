import { BusinessPackAutomationPanel } from "@/components/app/app-portal/BusinessPackAutomationPanel";
import { buildAutomationLabels } from "@/lib/app-portal/business-pack-automation";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import { getLocale } from "@/lib/i18n/get-locale";
import { createTranslator } from "@/lib/i18n/translate";

export default async function BusinessPackAutomationPage() {
  const locale = await getLocale();
  const dict = await getDictionary(locale, ["customerApp"]);
  const t = createTranslator(dict);
  return (
    <div className="p-6">
      <BusinessPackAutomationPanel labels={buildAutomationLabels(t)} />
    </div>
  );
}

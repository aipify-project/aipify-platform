import { SupportAssistantPanel } from "@/components/app/app-portal/SupportAssistantPanel";
import { buildSupportAssistantLabels } from "@/lib/app-portal/support-assistant";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import { getLocale } from "@/lib/i18n/get-locale";
import { createTranslator } from "@/lib/i18n/translate";

export default async function SupportAssistantPage() {
  const locale = await getLocale();
  const dict = await getDictionary(locale, ["customerApp"]);
  const t = createTranslator(dict);
  return (
    <div className="p-6">
      <SupportAssistantPanel labels={buildSupportAssistantLabels(t)} />
    </div>
  );
}

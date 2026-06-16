import { ExecutiveCompanionPanel } from "@/components/app/app-portal/ExecutiveCompanionPanel";
import { buildExecutiveCompanionLabels } from "@/lib/app-portal/executive-companion";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import { getLocale } from "@/lib/i18n/get-locale";
import { createTranslator } from "@/lib/i18n/translate";

export default async function ExecutiveCompanionPage() {
  const locale = await getLocale();
  const dict = await getDictionary(locale, ["customerApp"]);
  const t = createTranslator(dict);
  return (
    <div className="p-6">
      <ExecutiveCompanionPanel labels={buildExecutiveCompanionLabels(t)} />
    </div>
  );
}

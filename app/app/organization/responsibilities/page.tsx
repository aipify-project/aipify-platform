import { ResponsibilitiesPanel } from "@/components/app/app-portal/ResponsibilitiesPanel";
import { buildResponsibilitiesLabels } from "@/lib/app-portal/responsibilities";
import { getCustomerAppDictionaryForSplits } from "@/lib/i18n/get-dictionary";
import { getLocale } from "@/lib/i18n/get-locale";
import { createTranslator } from "@/lib/i18n/translate";

export default async function ResponsibilitiesPage() {
  const locale = await getLocale();
  const dict = await getCustomerAppDictionaryForSplits(locale, ["dashboard"]);
  const t = createTranslator(dict);
  return (
    <div className="p-6">
      <ResponsibilitiesPanel labels={buildResponsibilitiesLabels(t)} />
    </div>
  );
}

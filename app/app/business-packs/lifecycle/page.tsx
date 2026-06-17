import { BusinessPackLifecyclePanel } from "@/components/app/app-portal/BusinessPackLifecyclePanel";
import { buildPackLifecycleLabels } from "@/lib/app-portal/business-pack-lifecycle";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import { getLocale } from "@/lib/i18n/get-locale";
import { createTranslator } from "@/lib/i18n/translate";

export default async function BusinessPackLifecyclePage() {
  const locale = await getLocale();
  const dict = await getDictionary(locale, ["customerApp"]);
  const t = createTranslator(dict);
  return (
    <div className="p-6">
      <BusinessPackLifecyclePanel labels={buildPackLifecycleLabels(t)} />
    </div>
  );
}

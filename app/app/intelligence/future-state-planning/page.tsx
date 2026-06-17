import { FutureStatePlanningPanel } from "@/components/app/app-portal/FutureStatePlanningPanel";
import { buildFutureStatePlanningLabels } from "@/lib/app-portal/future-state-planning";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import { getLocale } from "@/lib/i18n/get-locale";
import { createTranslator } from "@/lib/i18n/translate";

export default async function FutureStatePlanningPage() {
  const locale = await getLocale();
  const dict = await getDictionary(locale, ["customerApp"]);
  const t = createTranslator(dict);
  return (
    <div className="p-6">
      <FutureStatePlanningPanel labels={buildFutureStatePlanningLabels(t)} />
    </div>
  );
}

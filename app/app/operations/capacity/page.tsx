import { CapacityWorkloadPanel } from "@/components/app/app-portal/CapacityWorkloadPanel";
import { buildCapacityWorkloadLabels } from "@/lib/app-portal/capacity-workload";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import { getLocale } from "@/lib/i18n/get-locale";
import { createTranslator } from "@/lib/i18n/translate";

export default async function CapacityPage() {
  const locale = await getLocale();
  const dict = await getDictionary(locale, ["customerApp"]);
  const t = createTranslator(dict);
  return (
    <div className="p-6">
      <CapacityWorkloadPanel labels={buildCapacityWorkloadLabels(t)} />
    </div>
  );
}

import { PrioritizationEngineDetailPanel } from "@/components/app/app-portal/PrioritizationEngineDetailPanel";
import { buildPrioritizationEngineLabels } from "@/lib/app-portal/prioritization-engine";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import { getLocale } from "@/lib/i18n/get-locale";
import { createTranslator } from "@/lib/i18n/translate";

type Props = { params: Promise<{ id: string }> };

export default async function PrioritizationEngineDetailPage({ params }: Props) {
  const { id } = await params;
  const locale = await getLocale();
  const dict = await getDictionary(locale, ["customerApp"]);
  const t = createTranslator(dict);
  return (
    <div className="p-6">
      <PrioritizationEngineDetailPanel itemId={id} labels={buildPrioritizationEngineLabels(t)} />
    </div>
  );
}

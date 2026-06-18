import { ScenarioPlanningDetailPanel } from "@/components/app/app-portal/ScenarioPlanningDetailPanel";
import { buildScenarioPlanningLabels } from "@/lib/app-portal/scenario-planning";
import { getCustomerAppDictionaryForSplits } from "@/lib/i18n/get-dictionary";
import { getLocale } from "@/lib/i18n/get-locale";
import { createTranslator } from "@/lib/i18n/translate";

type PageProps = { params: Promise<{ id: string }> };

export default async function ScenarioPlanningDetailPage({ params }: PageProps) {
  const { id } = await params;
  const locale = await getLocale();
  const dict = await getCustomerAppDictionaryForSplits(locale, ["dashboard"]);
  const t = createTranslator(dict);
  return (
    <div className="p-6">
      <ScenarioPlanningDetailPanel scenarioId={id} labels={buildScenarioPlanningLabels(t)} />
    </div>
  );
}

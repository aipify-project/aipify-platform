import { SimulationRunDetailPanel } from "@/components/app/simulation-lab";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import { getLocale } from "@/lib/i18n/get-locale";
import { createTranslator } from "@/lib/i18n/translate";

type PageProps = { params: Promise<{ id: string }> };

export default async function SimulationRunPage({ params }: PageProps) {
  const { id } = await params;
  const dict = await getDictionary(await getLocale(), ["customerApp"]);
  const t = createTranslator(dict);
  const p = "customerApp.simulationLab";

  return (
    <div className="mx-auto max-w-4xl p-6">
      <SimulationRunDetailPanel
        runId={id}
        labels={{
          loading: t(`${p}.loading`),
          notFound: t(`${p}.notFound`),
          back: t(`${p}.back`),
          runResults: t(`${p}.runResults`),
          productionIsolated: t(`${p}.productionIsolated`),
          confidence: t(`${p}.confidence`),
          estimatedValue: t(`${p}.estimatedValue`),
          estimatedRisk: t(`${p}.estimatedRisk`),
          timeSaved: t(`${p}.timeSaved`),
          workloadChange: t(`${p}.workloadChange`),
          governanceImpact: t(`${p}.governanceImpact`),
          viewExplanation: t(`${p}.viewExplanation`),
          outcomes: t(`${p}.outcomes`),
          assumptions: t(`${p}.assumptions`),
          impactScore: t(`${p}.impactScore`),
        }}
      />
    </div>
  );
}

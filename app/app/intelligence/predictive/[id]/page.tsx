import { PredictiveIntelligenceDetailPanel } from "@/components/app/app-portal/PredictiveIntelligenceDetailPanel";
import { buildPredictiveIntelligenceLabels } from "@/lib/app-portal/predictive-intelligence";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import { getLocale } from "@/lib/i18n/get-locale";
import { createTranslator } from "@/lib/i18n/translate";

type PageProps = { params: Promise<{ id: string }> };

export default async function PredictiveIntelligenceDetailPage({ params }: PageProps) {
  const { id } = await params;
  const locale = await getLocale();
  const dict = await getDictionary(locale, ["customerApp"]);
  const t = createTranslator(dict);
  return (
    <div className="p-6">
      <PredictiveIntelligenceDetailPanel labels={buildPredictiveIntelligenceLabels(t)} predictionId={id} />
    </div>
  );
}

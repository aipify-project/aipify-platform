import { LearningImprovementDetailPanel } from "@/components/app/app-portal/LearningImprovementDetailPanel";
import { buildLearningImprovementLabels } from "@/lib/app-portal/learning-improvement";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import { getLocale } from "@/lib/i18n/get-locale";
import { createTranslator } from "@/lib/i18n/translate";

type Props = { params: Promise<{ id: string }> };

export default async function LearningImprovementDetailPage({ params }: Props) {
  const { id } = await params;
  const locale = await getLocale();
  const dict = await getDictionary(locale, ["customerApp"]);
  const t = createTranslator(dict);
  return (
    <div className="p-6">
      <LearningImprovementDetailPanel recordId={id} labels={buildLearningImprovementLabels(t)} />
    </div>
  );
}

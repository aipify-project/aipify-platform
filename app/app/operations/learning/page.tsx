import { LearningImprovementPanel } from "@/components/app/app-portal/LearningImprovementPanel";
import { buildLearningImprovementLabels } from "@/lib/app-portal/learning-improvement";
import { getCustomerAppDictionaryForSplits } from "@/lib/i18n/get-dictionary";
import { getLocale } from "@/lib/i18n/get-locale";
import { createTranslator } from "@/lib/i18n/translate";

export default async function LearningImprovementPage() {
  const locale = await getLocale();
  const dict = await getCustomerAppDictionaryForSplits(locale, ["dashboard"]);
  const t = createTranslator(dict);
  return (
    <div className="p-6">
      <LearningImprovementPanel labels={buildLearningImprovementLabels(t)} />
    </div>
  );
}

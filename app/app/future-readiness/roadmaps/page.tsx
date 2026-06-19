import { FutureReadinessPanel } from "@/components/app/future-readiness-operations";
import { buildFutureReadinessLabels } from "@/lib/customer-future-readiness-operations";
import { getCustomerAppDictionaryForModule } from "@/lib/i18n/get-dictionary";
import { getLocale } from "@/lib/i18n/get-locale";
import { createTranslator } from "@/lib/i18n/translate";

export default async function FutureReadinessRoadmapsPage() {
  const dict = await getCustomerAppDictionaryForModule(await getLocale(), "futureReadinessOperations");
  const labels = buildFutureReadinessLabels(createTranslator(dict));
  return (
    <FutureReadinessPanel
      backHref="/app/future-readiness"
      initialTab="roadmaps"
      visibleTabs={["roadmaps", "initiatives", "scenarios", "threats", "overview"]}
      titleOverride={labels.roadmapsTitle}
      labels={labels}
    />
  );
}

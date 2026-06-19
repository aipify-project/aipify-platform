import { ResiliencePanel } from "@/components/app/resilience-operations";
import { buildResilienceLabels } from "@/lib/customer-resilience-operations";
import { getCustomerAppDictionaryForModule } from "@/lib/i18n/get-dictionary";
import { getLocale } from "@/lib/i18n/get-locale";
import { createTranslator } from "@/lib/i18n/translate";

export default async function ResilienceEmergencyPage() {
  const dict = await getCustomerAppDictionaryForModule(await getLocale(), "resilienceOperations");
  const labels = buildResilienceLabels(createTranslator(dict));
  return (
    <ResiliencePanel
      backHref="/app/resilience"
      initialTab="crisis"
      visibleTabs={["crisis", "incidents", "recovery", "continuity", "overview"]}
      titleOverride={labels.emergencyTitle}
      labels={labels}
    />
  );
}

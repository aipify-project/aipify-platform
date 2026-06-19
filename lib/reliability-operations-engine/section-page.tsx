import { ReliabilityOperationsPanel } from "@/components/platform/reliability-operations";
import { buildReliabilityOperationsLabels } from "@/lib/reliability-operations-engine/labels";
import type { Rel604PlatformSection } from "@/lib/reliability-operations-engine/config";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import { getLocale } from "@/lib/i18n/get-locale";
import { createTranslator } from "@/lib/i18n/translate";

export async function ReliabilityOperationsSectionPage({
  activeSection,
}: {
  activeSection: Rel604PlatformSection;
}) {
  const locale = await getLocale();
  const dict = await getDictionary(locale, ["platform"]);
  const t = createTranslator(dict);
  return <ReliabilityOperationsPanel labels={buildReliabilityOperationsLabels(t)} activeSection={activeSection} />;
}

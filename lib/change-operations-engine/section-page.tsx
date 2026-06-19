import { ChangeOperationsPanel } from "@/components/platform/change-operations";
import { buildChangeOperationsLabels } from "@/lib/change-operations-engine/labels";
import type { Chg605Section } from "@/lib/change-operations-engine/config";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import { getLocale } from "@/lib/i18n/get-locale";
import { createTranslator } from "@/lib/i18n/translate";

export async function ChangeOperationsSectionPage({
  activeSection,
}: {
  activeSection: Chg605Section | "calendar" | "history" | "advisory";
}) {
  const locale = await getLocale();
  const dict = await getDictionary(locale, ["platform"]);
  const t = createTranslator(dict);
  return <ChangeOperationsPanel labels={buildChangeOperationsLabels(t)} activeSection={activeSection} />;
}

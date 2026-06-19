import { EcosystemCenterPanel } from "@/components/platform/ecosystem-center";
import { buildEcosystemCenterLabels } from "@/lib/ecosystem-center-engine/labels";
import type { Ep601Section } from "@/lib/ecosystem-center-engine/config";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import { getLocale } from "@/lib/i18n/get-locale";
import { createTranslator } from "@/lib/i18n/translate";

export async function EcosystemCenterSectionPage({ activeSection }: { activeSection: Ep601Section }) {
  const locale = await getLocale();
  const dict = await getDictionary(locale, ["platform"]);
  const t = createTranslator(dict);
  return <EcosystemCenterPanel labels={buildEcosystemCenterLabels(t)} activeSection={activeSection} />;
}

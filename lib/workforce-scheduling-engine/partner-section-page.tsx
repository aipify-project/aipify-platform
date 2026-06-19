import { PartnerWorkforceSchedulingPanel } from "@/components/partners/workforce-scheduling";
import { buildPartnerWorkforceSchedulingLabels } from "@/lib/workforce-scheduling-engine/labels";
import type { Wfs608PartnerSection } from "@/lib/workforce-scheduling-engine/config";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import { getLocale } from "@/lib/i18n/get-locale";
import { createTranslator } from "@/lib/i18n/translate";

export async function PartnerWorkforceSchedulingSectionPage({
  activeSection,
}: {
  activeSection: Wfs608PartnerSection;
}) {
  const dict = await getDictionary(await getLocale(), ["common", "partnersPortal"]);
  const t = createTranslator(dict);
  return (
    <PartnerWorkforceSchedulingPanel
      labels={buildPartnerWorkforceSchedulingLabels(t)}
      activeSection={activeSection}
    />
  );
}

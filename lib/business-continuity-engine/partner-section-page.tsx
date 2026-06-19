import { PartnerBusinessContinuityPanel } from "@/components/partners/business-continuity";
import { buildPartnerBusinessContinuityLabels } from "@/lib/business-continuity-engine/labels";
import type { PartnerBc607Section } from "@/lib/business-continuity-engine/config";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import { getLocale } from "@/lib/i18n/get-locale";
import { createTranslator } from "@/lib/i18n/translate";

export async function PartnerBusinessContinuitySectionPage({
  activeSection,
}: {
  activeSection: PartnerBc607Section;
}) {
  const locale = await getLocale();
  const dict = await getDictionary(locale, ["common", "partnersPortal"]);
  const t = createTranslator(dict);
  return (
    <PartnerBusinessContinuityPanel
      labels={buildPartnerBusinessContinuityLabels(t)}
      activeSection={activeSection}
    />
  );
}

import { CompanionFeedbackCenterPanel } from "@/components/app/companion-feedback-center";
import { buildCompanionFeedbackCenterLabels } from "@/lib/companion-feedback-center-engine/labels";
import type { Cife596Section } from "@/lib/companion-feedback-center-engine/config";
import { getCustomerAppDictionaryForModule } from "@/lib/i18n/get-dictionary";
import { getLocale } from "@/lib/i18n/get-locale";
import { createTranslator } from "@/lib/i18n/translate";

export async function CompanionFeedbackCenterSectionPage({ activeSection }: { activeSection: Cife596Section }) {
  const locale = await getLocale();
  const dict = await getCustomerAppDictionaryForModule(locale, "companionFeedbackCenter");
  const t = createTranslator(dict);
  return (
    <CompanionFeedbackCenterPanel labels={buildCompanionFeedbackCenterLabels(t)} activeSection={activeSection} />
  );
}

import { VocFeedbackCenterPanel } from "@/components/platform/voice-of-the-customer";
import { buildVocFeedbackCenterLabels } from "@/lib/voice-of-the-customer";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import { getLocale } from "@/lib/i18n/get-locale";
import { createTranslator } from "@/lib/i18n/translate";

export default async function PlatformFeedbackCenterPage() {
  const locale = await getLocale();
  const dict = await getDictionary(locale, ["platform"]);
  const t = createTranslator(dict);

  return (
    <VocFeedbackCenterPanel
      backHref="/platform"
      labels={buildVocFeedbackCenterLabels(t)}
    />
  );
}

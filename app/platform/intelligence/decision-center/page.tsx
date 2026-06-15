import { PlatformDecisionCenterPanel } from "@/components/platform/platform-decision-center";
import { buildPlatformDecisionCenterLabels } from "@/lib/platform-decision-center";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import { getLocale } from "@/lib/i18n/get-locale";
import { createTranslator } from "@/lib/i18n/translate";

export default async function PlatformDecisionCenterPage() {
  const locale = await getLocale();
  const dict = await getDictionary(locale, ["platform"]);
  const t = createTranslator(dict);

  return (
    <PlatformDecisionCenterPanel
      backHref="/platform/intelligence"
      labels={buildPlatformDecisionCenterLabels(t)}
    />
  );
}

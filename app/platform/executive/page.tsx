import PlatformExecutiveCenterPanel from "@/components/platform/PlatformExecutiveCenterPanel";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import { getLocale } from "@/lib/i18n/get-locale";
import { createTranslator } from "@/lib/i18n/translate";
import { buildExecutiveCenterLabels } from "@/lib/platform/executive-page-labels";
import { buildSinceLastLoginLabels } from "@/lib/since-last-login";

export default async function ExecutiveCenterPage() {
  const locale = await getLocale();
  const dict = await getDictionary(locale, ["platform"]);
  const t = createTranslator(dict);

  return (
    <PlatformExecutiveCenterPanel
      labels={buildExecutiveCenterLabels(t)}
      sinceLastLoginLabels={buildSinceLastLoginLabels(t)}
    />
  );
}

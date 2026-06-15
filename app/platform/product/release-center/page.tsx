import { ReleaseCenterPanel } from "@/components/platform/release-center";
import { buildReleaseCenterLabels } from "@/lib/release-center";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import { getLocale } from "@/lib/i18n/get-locale";
import { createTranslator } from "@/lib/i18n/translate";

export default async function PlatformReleaseCenterPage() {
  const locale = await getLocale();
  const dict = await getDictionary(locale, ["platform"]);
  const t = createTranslator(dict);

  return (
    <ReleaseCenterPanel
      backHref="/platform/product/roadmap-center"
      labels={buildReleaseCenterLabels(t)}
    />
  );
}

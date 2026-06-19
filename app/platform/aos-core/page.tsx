import { PlatformAosCorePanel } from "@/components/platform/platform-aos-core";
import { buildPlatformAosCoreLabels } from "@/lib/platform-aos-core";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import { getLocale } from "@/lib/i18n/get-locale";
import { createTranslator } from "@/lib/i18n/translate";

export default async function PlatformAosCorePage() {
  const locale = await getLocale();
  const dict = await getDictionary(locale, ["platform"]);
  return (
    <PlatformAosCorePanel
      backHref="/platform"
      labels={buildPlatformAosCoreLabels(createTranslator(dict))}
    />
  );
}

import { PlatformHealthOperationsCenterPanel } from "@/components/platform/platform-health-operations-center";
import { buildPlatformHealthOperationsLabels } from "@/lib/platform-health-operations-center";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import { getLocale } from "@/lib/i18n/get-locale";
import { createTranslator } from "@/lib/i18n/translate";

export default async function PlatformHealthOperationsCenterPage() {
  const locale = await getLocale();
  const dict = await getDictionary(locale, ["platform"]);
  const t = createTranslator(dict);

  return (
    <PlatformHealthOperationsCenterPanel
      backHref="/platform"
      labels={buildPlatformHealthOperationsLabels(t)}
    />
  );
}

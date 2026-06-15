import { ExecutiveOperationsCenterPanel } from "@/components/platform/executive-operations-center";
import { buildExecutiveOperationsLabels } from "@/lib/executive-operations-center";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import { getLocale } from "@/lib/i18n/get-locale";
import { createTranslator } from "@/lib/i18n/translate";

export default async function PlatformExecutiveOperationsCenterPage() {
  const locale = await getLocale();
  const dict = await getDictionary(locale, ["platform"]);
  const t = createTranslator(dict);

  return (
    <ExecutiveOperationsCenterPanel
      backHref="/platform/executive"
      labels={buildExecutiveOperationsLabels(t)}
    />
  );
}

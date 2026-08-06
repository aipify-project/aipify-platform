import { PlatformExceptionQueuePanel } from "@/components/platform/control-plane";
import { buildPlatformControlPlaneLabels } from "@/lib/platform-control-plane";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import { getLocale } from "@/lib/i18n/get-locale";
import { createTranslator } from "@/lib/i18n/translate";

export default async function PlatformExceptionQueuePage() {
  const locale = await getLocale();
  const dict = await getDictionary(locale, ["platform"]);
  const t = createTranslator(dict);
  const labels = buildPlatformControlPlaneLabels(t);

  return <PlatformExceptionQueuePanel labels={labels} />;
}

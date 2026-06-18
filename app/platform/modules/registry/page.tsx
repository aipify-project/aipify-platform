import { PlatformModuleRegistryPanel } from "@/components/platform/module-registry/PlatformModuleRegistryPanel";
import { buildPlatformModuleRegistryLabels } from "@/lib/module-registry/labels";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import { getLocale } from "@/lib/i18n/get-locale";
import { createTranslator } from "@/lib/i18n/translate";

export default async function PlatformModuleRegistryPage() {
  const locale = await getLocale();
  const dict = await getDictionary(locale, ["platform"]);
  const t = createTranslator(dict);
  const labels = buildPlatformModuleRegistryLabels(t);

  return <PlatformModuleRegistryPanel labels={labels} />;
}

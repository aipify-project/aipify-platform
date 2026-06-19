import { BusinessPackRuntimePlatformPanel } from "@/components/platform/business-pack-runtime";
import { buildBusinessPackRuntimePlatformLabels } from "@/lib/business-pack-runtime-engine/labels";
import type { Bpr603PlatformSection } from "@/lib/business-pack-runtime-engine/config";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import { getLocale } from "@/lib/i18n/get-locale";
import { createTranslator } from "@/lib/i18n/translate";

export async function BusinessPackRuntimePlatformSectionPage({ section }: { section: Bpr603PlatformSection }) {
  const locale = await getLocale();
  const dict = await getDictionary(locale, ["platform"]);
  const t = createTranslator(dict);
  const labels = buildBusinessPackRuntimePlatformLabels(t);

  return <BusinessPackRuntimePlatformPanel labels={labels} section={section} />;
}

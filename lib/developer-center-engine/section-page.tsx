import { DeveloperCenterPanel } from "@/components/platform/developer-center";
import { buildDeveloperCenterLabels } from "@/lib/developer-center-engine/labels";
import type { Bp602Section } from "@/lib/developer-center-engine/config";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import { getLocale } from "@/lib/i18n/get-locale";
import { createTranslator } from "@/lib/i18n/translate";

export async function DeveloperCenterSectionPage({ section }: { section: Bp602Section }) {
  const locale = await getLocale();
  const dict = await getDictionary(locale, ["platform"]);
  const t = createTranslator(dict);
  const labels = buildDeveloperCenterLabels(t);

  return <DeveloperCenterPanel labels={labels} section={section} />;
}

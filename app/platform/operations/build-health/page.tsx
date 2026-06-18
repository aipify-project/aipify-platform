import { BuildHealthCenterPanel } from "@/components/platform/build-governance";
import { buildBuildGovernanceLabels } from "@/lib/build-governance/labels";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import { getLocale } from "@/lib/i18n/get-locale";
import { createTranslator } from "@/lib/i18n/translate";

export default async function PlatformBuildHealthCenterPage() {
  const locale = await getLocale();
  const dict = await getDictionary(locale, ["platform"]);
  const t = createTranslator(dict);

  return (
    <BuildHealthCenterPanel
      labels={buildBuildGovernanceLabels(t)}
      registryHref="/platform/operations/route-registry"
    />
  );
}

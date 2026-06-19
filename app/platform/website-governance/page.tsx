import { WebsiteGovernancePanel } from "@/components/platform/website-governance";
import { buildWebsiteGovernancePanelLabels } from "@/lib/marketing/governance/labels";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import { getLocale } from "@/lib/i18n/get-locale";
import { createTranslator } from "@/lib/i18n/translate";

export default async function PlatformWebsiteGovernancePage() {
  const locale = await getLocale();
  const dict = await getDictionary(locale, ["platform"]);
  const t = createTranslator(dict);

  return <WebsiteGovernancePanel labels={buildWebsiteGovernancePanelLabels(t)} />;
}

import { CompanionWorkspaceIntelligencePanel } from "@/components/app/desktop/CompanionWorkspaceIntelligencePanel";
import { buildCompanionWorkspaceIntelligenceLabels } from "@/lib/companion-workspace-intelligence/labels";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import { getLocale } from "@/lib/i18n/get-locale";
import { createTranslator } from "@/lib/i18n/translate";

export default async function DesktopWorkspacePage() {
  const dict = await getDictionary(await getLocale(), ["companionWorkspaceIntelligence"]);
  const t = createTranslator(dict);
  return (
    <CompanionWorkspaceIntelligencePanel labels={buildCompanionWorkspaceIntelligenceLabels(t)} />
  );
}

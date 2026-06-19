import { CompanionSkillsPanel } from "@/components/app/companion-skills-operations";
import { buildCompanionSkillsLabels } from "@/lib/customer-companion-skills-operations";
import { getCustomerAppDictionaryForModule } from "@/lib/i18n/get-dictionary";
import { getLocale } from "@/lib/i18n/get-locale";
import { createTranslator } from "@/lib/i18n/translate";

export default async function CompanionSkillsMarketplacePage() {
  const dict = await getCustomerAppDictionaryForModule(await getLocale(), "companionSkillsOperations");
  const labels = buildCompanionSkillsLabels(createTranslator(dict));
  return (
    <CompanionSkillsPanel
      backHref="/app/companion/skills"
      initialTab="marketplace"
      visibleTabs={["overview", "marketplace", "installed", "permissions", "executive"]}
      titleOverride={labels.marketplacePage.title}
      subtitleOverride={labels.marketplacePage.subtitle}
      labels={labels}
    />
  );
}

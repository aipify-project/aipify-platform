import { CompanionSkillsPanel } from "@/components/app/companion-skills-operations";
import { buildCompanionSkillsLabels } from "@/lib/customer-companion-skills-operations";
import { getCustomerAppDictionaryForModule } from "@/lib/i18n/get-dictionary";
import { getLocale } from "@/lib/i18n/get-locale";
import { createTranslator } from "@/lib/i18n/translate";

export default async function CompanionSkillsTrainingPage() {
  const dict = await getCustomerAppDictionaryForModule(await getLocale(), "companionSkillsOperations");
  const labels = buildCompanionSkillsLabels(createTranslator(dict));
  return (
    <CompanionSkillsPanel
      backHref="/app/companion/skills"
      initialTab="training"
      visibleTabs={["overview", "training", "installed", "specialists", "companion"]}
      titleOverride={labels.trainingPage.title}
      subtitleOverride={labels.trainingPage.subtitle}
      labels={labels}
    />
  );
}

import { CompanionSkillsPanel } from "@/components/app/companion-skills-operations";
import { buildCompanionSkillsLabels } from "@/lib/customer-companion-skills-operations";
import { getCustomerAppDictionaryForModule } from "@/lib/i18n/get-dictionary";
import { getLocale } from "@/lib/i18n/get-locale";
import { createTranslator } from "@/lib/i18n/translate";

export default async function CompanionSkillsPage() {
  const dict = await getCustomerAppDictionaryForModule(await getLocale(), "companionSkillsOperations");
  return (
    <CompanionSkillsPanel backHref="/app/companion" labels={buildCompanionSkillsLabels(createTranslator(dict))} />
  );
}

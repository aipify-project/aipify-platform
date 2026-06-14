import { SkillsMarketplaceExperiencePanel } from "@/components/shared/skills-marketplace";
import { buildSkillsMarketplaceLabels } from "@/lib/skills-marketplace";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import { getLocale } from "@/lib/i18n/get-locale";
import { createTranslator } from "@/lib/i18n/translate";

export default async function AppSkillsPage() {
  const locale = await getLocale();
  const dict = await getDictionary(locale, ["customerApp"]);
  const t = createTranslator(dict);

  return (
    <SkillsMarketplaceExperiencePanel
      scope="customer"
      skillsBasePath="/app/skills"
      labels={buildSkillsMarketplaceLabels(t, "customerApp")}
    />
  );
}

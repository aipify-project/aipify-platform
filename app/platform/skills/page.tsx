import { SkillsMarketplaceExperiencePanel } from "@/components/shared/skills-marketplace";
import { buildSkillsMarketplaceLabels } from "@/lib/skills-marketplace";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import { getLocale } from "@/lib/i18n/get-locale";
import { createTranslator } from "@/lib/i18n/translate";

export default async function PlatformSkillsPage() {
  const locale = await getLocale();
  const dict = await getDictionary(locale, ["platform"]);
  const t = createTranslator(dict);

  return (
    <SkillsMarketplaceExperiencePanel
      scope="platform"
      skillsBasePath="/platform/skills"
      showGovernance
      labels={buildSkillsMarketplaceLabels(t, "platform")}
    />
  );
}

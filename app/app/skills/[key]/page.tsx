import { SkillDetailExperiencePanel } from "@/components/app/skills/SkillDetailExperiencePanel";
import { buildSkillsMarketplaceLabels } from "@/lib/skills-marketplace";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import { getLocale } from "@/lib/i18n/get-locale";
import { createTranslator } from "@/lib/i18n/translate";

export default async function AppSkillDetailPage({
  params,
}: {
  params: Promise<{ key: string }>;
}) {
  const { key } = await params;
  const locale = await getLocale();
  const dict = await getDictionary(locale, ["customerApp"]);
  const t = createTranslator(dict);

  return (
    <SkillDetailExperiencePanel
      skillKey={key}
      labels={buildSkillsMarketplaceLabels(t, "customerApp")}
    />
  );
}

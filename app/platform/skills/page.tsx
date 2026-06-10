import { PlatformSkillsScaffold } from "@/components/platform/skills";
import { getSkillRegistrySummary } from "@/lib/core/skills";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import { getLocale } from "@/lib/i18n/get-locale";
import { createTranslator } from "@/lib/i18n/translate";

export default async function PlatformSkillsPage() {
  const locale = await getLocale();
  const dict = await getDictionary(locale, ["platform"]);
  const t = createTranslator(dict);
  const summary = getSkillRegistrySummary();

  return (
    <PlatformSkillsScaffold
      title={t("platform.skills.title")}
      subtitle={t("platform.skills.subtitle")}
      registryLabel={t("platform.skills.registryLabel")}
      registryStats={t("platform.skills.registryStats")
        .replace("{total}", String(summary.total))
        .replace("{core}", String(summary.coreCount))
        .replace("{operational}", String(summary.byCategory.operational))}
      areas={[
        t("platform.skills.areas.registry"),
        t("platform.skills.areas.governance"),
        t("platform.skills.areas.testing"),
        t("platform.skills.areas.rollouts"),
        t("platform.skills.areas.metrics"),
      ]}
    />
  );
}

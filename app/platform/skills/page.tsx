import { PlatformSkillOSPanel } from "@/components/platform/skills";
import { getSkillRegistrySummary } from "@/lib/core/skills";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import { getLocale } from "@/lib/i18n/get-locale";
import { createTranslator } from "@/lib/i18n/translate";

export default async function PlatformSkillsPage() {
  const locale = await getLocale();
  const dict = await getDictionary(locale, ["platform", "branding"]);
  const t = createTranslator(dict);
  const summary = getSkillRegistrySummary();

  return (
    <PlatformSkillOSPanel
      codeRegistryStats={t("platform.skills.registryStats")
        .replace("{total}", String(summary.total))
        .replace("{core}", String(summary.coreCount))
        .replace("{operational}", String(summary.byCategory.operational))}
      labels={{
        title: t("platform.skills.title"),
        subtitle: t("platform.skills.subtitle"),
        loading: t("platform.skills.loading"),
        empty: t("platform.skills.empty"),
        pulseLabel: t("branding.pulseLabel"),
        principle: t("platform.skills.principle"),
        registry: {
          total: t("platform.skills.registry.total"),
          versions: t("platform.skills.registry.versions"),
          installs: t("platform.skills.registry.installs"),
        },
        status: { title: t("platform.skills.status.title") },
        category: { title: t("platform.skills.category.title") },
        pipeline: { title: t("platform.skills.pipeline.title") },
        codeRegistry: {
          title: t("platform.skills.codeRegistry.title"),
          stats: t("platform.skills.registryStats"),
        },
      }}
    />
  );
}

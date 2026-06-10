import PlatformActionTemplatesPanel from "@/components/platform/PlatformActionTemplatesPanel";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import { getLocale } from "@/lib/i18n/get-locale";
import { createTranslator } from "@/lib/i18n/translate";

export default async function ActionTemplatesPage() {
  const dict = await getDictionary(await getLocale(), ["platform"]);
  const t = createTranslator(dict);

  return (
    <PlatformActionTemplatesPanel
      labels={{
        title: t("platform.actions.pages.templates.title"),
        subtitle: t("platform.actions.pages.templates.subtitle"),
        loading: t("platform.actions.loading"),
        empty: t("platform.actions.pages.templates.empty"),
        category: t("platform.actions.templates.category"),
        riskLevel: t("platform.actions.templates.riskLevel"),
        steps: t("platform.actions.templates.steps"),
        outcome: t("platform.actions.templates.outcome"),
        rollback: t("platform.actions.templates.rollback"),
        yes: t("platform.actions.yes"),
        no: t("platform.actions.no"),
        riskLabels: {
          low: t("platform.actions.risk.low"),
          medium: t("platform.actions.risk.medium"),
          high: t("platform.actions.risk.high"),
          critical: t("platform.actions.risk.critical"),
        },
      }}
    />
  );
}

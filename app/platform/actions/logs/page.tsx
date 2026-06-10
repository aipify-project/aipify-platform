import PlatformActionLogsPanel from "@/components/platform/PlatformActionLogsPanel";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import { getLocale } from "@/lib/i18n/get-locale";
import { createTranslator } from "@/lib/i18n/translate";

export default async function ActionLogsPage() {
  const locale = await getLocale();
  const dict = await getDictionary(locale, ["platform"]);
  const t = createTranslator(dict);

  return (
    <PlatformActionLogsPanel
      locale={locale}
      labels={{
        title: t("platform.actions.pages.logs.title"),
        subtitle: t("platform.actions.pages.logs.subtitle"),
        loading: t("platform.actions.loading"),
        empty: t("platform.actions.pages.logs.empty"),
        action: t("platform.actions.logs.action"),
        event: t("platform.actions.logs.event"),
        actor: t("platform.actions.logs.actor"),
        result: t("platform.actions.logs.result"),
        duration: t("platform.actions.logs.duration"),
        environment: t("platform.actions.logs.environment"),
        timestamp: t("platform.actions.logs.timestamp"),
      }}
    />
  );
}

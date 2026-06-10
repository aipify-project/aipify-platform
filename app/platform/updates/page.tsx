import { PlatformUpdatesPanel } from "@/components/platform/update-engine";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import { getLocale } from "@/lib/i18n/get-locale";
import { createTranslator } from "@/lib/i18n/translate";

export default async function PlatformUpdatesPage() {
  const locale = await getLocale();
  const dict = await getDictionary(locale, ["platform", "branding"]);
  const t = createTranslator(dict);

  return (
    <PlatformUpdatesPanel
      locale={locale}
      labels={{
        title: t("platform.updates.title"),
        subtitle: t("platform.updates.subtitle"),
        loading: t("platform.updates.loading"),
        empty: t("platform.updates.empty"),
        version: t("platform.updates.version"),
        status: t("platform.updates.status"),
        type: t("platform.updates.type"),
        channel: t("platform.updates.channel"),
        scheduled: t("platform.updates.scheduled"),
        affected: t("platform.updates.affected"),
        view: t("platform.updates.view"),
        areas: {
          scheduled: t("platform.updates.areas.scheduled"),
          history: t("platform.updates.areas.history"),
          rollout: t("platform.updates.areas.rollout"),
          failed: t("platform.updates.areas.failed"),
          rollback: t("platform.updates.areas.rollback"),
        },
        pulseLabel: t("branding.pulseLabel"),
      }}
    />
  );
}

import { PlatformPresencePilotPanel } from "@/components/platform/presence";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import { getLocale } from "@/lib/i18n/get-locale";
import { createTranslator } from "@/lib/i18n/translate";

export default async function PlatformPresencePilotPage() {
  const locale = await getLocale();
  const dict = await getDictionary(locale, ["presence", "platform"]);
  const t = createTranslator(dict);

  return (
    <PlatformPresencePilotPanel
      labels={{
        title: t("presence.pilot.title"),
        subtitle: t("presence.pilot.subtitle"),
        loading: t("presence.center.loading"),
        empty: t("presence.pilot.empty"),
        principle: t("presence.desktop.principle"),
        metrics: {
          sent: t("presence.pilot.metrics.sent"),
          actions: t("presence.pilot.metrics.actions"),
          dismissRate: t("presence.pilot.metrics.dismissRate"),
          usefulness: t("presence.pilot.metrics.usefulness"),
          feedEntries: t("presence.pilot.metrics.feedEntries"),
          engagement: t("presence.pilot.metrics.engagement"),
          approvalRate: t("presence.pilot.metrics.approvalRate"),
          feedQuality: t("presence.pilot.metrics.feedQuality"),
        },
      }}
    />
  );
}

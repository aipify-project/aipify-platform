import { PlatformImpactPanel } from "@/components/platform/impact";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import { getLocale } from "@/lib/i18n/get-locale";
import { createTranslator } from "@/lib/i18n/translate";

export default async function PlatformImpactPage() {
  const locale = await getLocale();
  const dict = await getDictionary(locale, ["platform", "branding"]);
  const t = createTranslator(dict);

  return (
    <PlatformImpactPanel
      labels={{
        title: t("platform.impact.title"),
        subtitle: t("platform.impact.subtitle"),
        loading: t("platform.impact.loading"),
        empty: t("platform.impact.empty"),
        pulseLabel: t("branding.pulseLabel"),
        principle: t("platform.impact.principle"),
        cards: {
          supportResolved: t("platform.impact.cards.supportResolved"),
          actionsCompleted: t("platform.impact.cards.actionsCompleted"),
          recommendations: t("platform.impact.cards.recommendations"),
          selfHealing: t("platform.impact.cards.selfHealing"),
          responseTimeSaved: t("platform.impact.cards.responseTimeSaved"),
          timeSaved: t("platform.impact.cards.timeSaved"),
          ytdTenants: t("platform.impact.cards.ytdTenants"),
        },
        trend: {
          title: t("platform.impact.trend.title"),
          month: t("platform.impact.trend.month"),
          totalEvents: t("platform.impact.trend.totalEvents"),
          supportResolved: t("platform.impact.trend.supportResolved"),
          actionsCompleted: t("platform.impact.trend.actionsCompleted"),
        },
        marketing: {
          title: t("platform.impact.marketing.title"),
          subtitle: t("platform.impact.marketing.subtitle"),
          generate: t("platform.impact.marketing.generate"),
          download: t("platform.impact.marketing.download"),
          internalOnly: t("platform.impact.marketing.internalOnly"),
          publicAllowed: t("platform.impact.marketing.publicAllowed"),
          approvePublic: t("platform.impact.marketing.approvePublic"),
          approved: t("platform.impact.marketing.approved"),
          minimumGroup: t("platform.impact.marketing.minimumGroup"),
        },
        units: {
          minutes: t("platform.impact.units.minutes"),
          tenants: t("platform.impact.units.tenants"),
        },
      }}
    />
  );
}

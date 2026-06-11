import { FrictionIntelligencePanel } from "@/components/app/friction-intelligence/FrictionIntelligencePanel";
import { FRICTION_CATEGORIES, FRICTION_SCORE_LEVELS } from "@/lib/aipify/friction-intelligence";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import { getLocale } from "@/lib/i18n/get-locale";
import { createTranslator } from "@/lib/i18n/translate";

export default async function FrictionExecutiveReportPage() {
  const locale = await getLocale();
  const dict = await getDictionary(locale, ["customerApp"]);
  const t = createTranslator(dict);

  const scoreLevels = Object.fromEntries(
    FRICTION_SCORE_LEVELS.map((s) => [s, t(`customerApp.friction.scoreLevels.${s}`)])
  );
  const categories = Object.fromEntries(
    FRICTION_CATEGORIES.map((c) => [c, t(`customerApp.friction.categories.${c}`)])
  );

  return (
    <FrictionIntelligencePanel
      executiveReport
      labels={{
        title: t("customerApp.friction.title"),
        subtitle: t("customerApp.friction.executiveSubtitle"),
        loading: t("customerApp.friction.loading"),
        back: t("customerApp.friction.backToFriction"),
        youControl: t("customerApp.friction.youControl"),
        privacy: t("customerApp.friction.privacy"),
        upgradeTitle: t("customerApp.friction.upgrade.title"),
        upgradeBody: t("customerApp.friction.upgrade.body"),
        upgradeCta: t("customerApp.friction.upgrade.cta"),
        refresh: t("customerApp.friction.refresh"),
        executiveReport: t("customerApp.friction.executiveReport"),
        viewExecutiveReport: t("customerApp.friction.viewExecutiveReport"),
        sections: {
          overview: t("customerApp.friction.sections.overview"),
          categories: t("customerApp.friction.sections.categories"),
          events: t("customerApp.friction.sections.events"),
          recommendations: t("customerApp.friction.sections.recommendations"),
          history: t("customerApp.friction.sections.history"),
        },
        scoreLevels,
        categories,
        actions: {
          accept: t("customerApp.friction.actions.accept"),
          dismiss: t("customerApp.friction.actions.dismiss"),
          sendToActionCenter: t("customerApp.friction.actions.sendToActionCenter"),
        },
        emptyEvents: t("customerApp.friction.emptyEvents"),
        emptyRecommendations: t("customerApp.friction.emptyRecommendations"),
        emptyHistory: t("customerApp.friction.emptyHistory"),
        eventCount: t("customerApp.friction.eventCount"),
      }}
    />
  );
}

import { GoalsDashboardPanel } from "@/components/app/assistant";
import { ACCOUNTABILITY_LEVELS, GOAL_CATEGORIES } from "@/lib/goals-dreams-engine";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import { getLocale } from "@/lib/i18n/get-locale";
import { createTranslator } from "@/lib/i18n/translate";

export default async function AppAssistantGoalsPage() {
  const locale = await getLocale();
  const dict = await getDictionary(locale, ["customerApp"]);
  const t = createTranslator(dict);

  const mapKeys = <K extends string>(keys: readonly K[], prefix: string) =>
    Object.fromEntries(keys.map((k) => [k, t(`customerApp.goalsDreams.${prefix}.${k}`)])) as Record<
      K,
      string
    >;

  return (
    <GoalsDashboardPanel
      labels={{
        title: t("customerApp.goalsDreams.title"),
        subtitle: t("customerApp.goalsDreams.subtitle"),
        loading: t("customerApp.goalsDreams.loading"),
        back: t("customerApp.goalsDreams.back"),
        save: t("customerApp.goalsDreams.save"),
        saved: t("customerApp.goalsDreams.saved"),
        privacy: t("customerApp.goalsDreams.privacy"),
        export: t("customerApp.goalsDreams.export"),
        checkIn: t("customerApp.goalsDreams.checkIn"),
        completeMilestone: t("customerApp.goalsDreams.completeMilestone"),
        pause: t("customerApp.goalsDreams.pause"),
        sections: {
          active: t("customerApp.goalsDreams.sections.active"),
          completed: t("customerApp.goalsDreams.sections.completed"),
          milestones: t("customerApp.goalsDreams.sections.milestones"),
          actions: t("customerApp.goalsDreams.sections.actions"),
          nextSteps: t("customerApp.goalsDreams.sections.nextSteps"),
          celebrations: t("customerApp.goalsDreams.sections.celebrations"),
          checkIns: t("customerApp.goalsDreams.sections.checkIns"),
          settings: t("customerApp.goalsDreams.sections.settings"),
        },
        settings: {
          accountability: t("customerApp.goalsDreams.settings.accountability"),
          proactive: t("customerApp.goalsDreams.settings.proactive"),
          celebrations: t("customerApp.goalsDreams.settings.celebrations"),
          setbacks: t("customerApp.goalsDreams.settings.setbacks"),
          checkInDays: t("customerApp.goalsDreams.settings.checkInDays"),
        },
        categories: mapKeys(GOAL_CATEGORIES, "categories"),
        accountabilityLevels: mapKeys(ACCOUNTABILITY_LEVELS, "accountabilityLevels"),
        empty: t("customerApp.goalsDreams.empty"),
      }}
    />
  );
}

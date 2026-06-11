import { StrategicGoalsPanel } from "@/components/app/strategic-goals/StrategicGoalsPanel";
import {
  GOAL_CATEGORIES,
  GOAL_PRIORITIES,
  GOAL_STATUSES,
} from "@/lib/aipify/strategic-goals";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import { getLocale } from "@/lib/i18n/get-locale";
import { createTranslator } from "@/lib/i18n/translate";

export default async function StrategicGoalsPage() {
  const locale = await getLocale();
  const dict = await getDictionary(locale, ["customerApp"]);
  const t = createTranslator(dict);

  const statuses = Object.fromEntries(
    GOAL_STATUSES.map((s) => [s, t(`customerApp.strategicGoals.statuses.${s}`)])
  );
  const categories = Object.fromEntries(
    GOAL_CATEGORIES.map((c) => [c, t(`customerApp.strategicGoals.categories.${c}`)])
  );
  const priorities = Object.fromEntries(
    GOAL_PRIORITIES.map((p) => [p, t(`customerApp.strategicGoals.priorities.${p}`)])
  );

  return (
    <StrategicGoalsPanel
      labels={{
        title: t("customerApp.strategicGoals.title"),
        subtitle: t("customerApp.strategicGoals.subtitle"),
        loading: t("customerApp.strategicGoals.loading"),
        back: t("customerApp.strategicGoals.back"),
        youControl: t("customerApp.strategicGoals.youControl"),
        privacy: t("customerApp.strategicGoals.privacy"),
        upgradeTitle: t("customerApp.strategicGoals.upgrade.title"),
        upgradeBody: t("customerApp.strategicGoals.upgrade.body"),
        upgradeCta: t("customerApp.strategicGoals.upgrade.cta"),
        createGoal: t("customerApp.strategicGoals.createGoal"),
        saveGoal: t("customerApp.strategicGoals.saveGoal"),
        cancel: t("customerApp.strategicGoals.cancel"),
        archive: t("customerApp.strategicGoals.archive"),
        refresh: t("customerApp.strategicGoals.refresh"),
        sections: {
          active: t("customerApp.strategicGoals.sections.active"),
          health: t("customerApp.strategicGoals.sections.health"),
          milestones: t("customerApp.strategicGoals.sections.milestones"),
          atRisk: t("customerApp.strategicGoals.sections.atRisk"),
          recommended: t("customerApp.strategicGoals.sections.recommended"),
          completed: t("customerApp.strategicGoals.sections.completed"),
          timeline: t("customerApp.strategicGoals.sections.timeline"),
          create: t("customerApp.strategicGoals.sections.create"),
        },
        statuses,
        categories,
        priorities,
        fields: {
          title: t("customerApp.strategicGoals.fields.title"),
          description: t("customerApp.strategicGoals.fields.description"),
          category: t("customerApp.strategicGoals.fields.category"),
          priority: t("customerApp.strategicGoals.fields.priority"),
          baseline: t("customerApp.strategicGoals.fields.baseline"),
          target: t("customerApp.strategicGoals.fields.target"),
          current: t("customerApp.strategicGoals.fields.current"),
          unit: t("customerApp.strategicGoals.fields.unit"),
          startDate: t("customerApp.strategicGoals.fields.startDate"),
          targetDate: t("customerApp.strategicGoals.fields.targetDate"),
        },
        emptyActive: t("customerApp.strategicGoals.emptyActive"),
        emptyAtRisk: t("customerApp.strategicGoals.emptyAtRisk"),
        emptyMilestones: t("customerApp.strategicGoals.emptyMilestones"),
        emptyTimeline: t("customerApp.strategicGoals.emptyTimeline"),
        emptyCompleted: t("customerApp.strategicGoals.emptyCompleted"),
        progress: t("customerApp.strategicGoals.progress"),
      }}
    />
  );
}

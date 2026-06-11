import { LifeDashboardPanel } from "@/components/app/assistant";
import {
  LIFE_AREAS,
  LIFE_PERSONALITIES,
  LIFE_PRIORITIES,
  NOTIFICATION_FREQUENCIES,
  PROACTIVITY_LEVELS,
} from "@/lib/life-os";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import { getLocale } from "@/lib/i18n/get-locale";
import { createTranslator } from "@/lib/i18n/translate";

export default async function AppAssistantLifePage() {
  const locale = await getLocale();
  const dict = await getDictionary(locale, ["customerApp"]);
  const t = createTranslator(dict);

  const priorityLabels = Object.fromEntries(
    LIFE_PRIORITIES.map((p) => [p, t(`customerApp.lifeOs.priorities.${p}`)])
  );
  const lifeAreaLabels = Object.fromEntries(
    LIFE_AREAS.map((a) => [a, t(`customerApp.lifeOs.lifeAreas.${a}`)])
  );
  const personalityLabels = Object.fromEntries(
    LIFE_PERSONALITIES.map((p) => [p, t(`customerApp.lifeOs.personalities.${p}`)])
  );
  const proactivityLabels = Object.fromEntries(
    PROACTIVITY_LEVELS.map((l) => [l, t(`customerApp.lifeOs.proactivityLevels.${l}`)])
  );
  const frequencyLabels = Object.fromEntries(
    NOTIFICATION_FREQUENCIES.map((f) => [f, t(`customerApp.lifeOs.notificationFrequencies.${f}`)])
  );

  return (
    <LifeDashboardPanel
      locale={locale}
      labels={{
        title: t("customerApp.lifeOs.title"),
        subtitle: t("customerApp.lifeOs.subtitle"),
        loading: t("customerApp.lifeOs.loading"),
        back: t("customerApp.lifeOs.back"),
        save: t("customerApp.lifeOs.save"),
        saved: t("customerApp.lifeOs.saved"),
        privacy: t("customerApp.lifeOs.privacy"),
        planWeek: t("customerApp.lifeOs.planWeek"),
        planning: t("customerApp.lifeOs.planning"),
        postpone: t("customerApp.lifeOs.postpone"),
        empty: t("customerApp.lifeOs.empty"),
        viewMemories: t("customerApp.lifeOs.viewMemories"),
        sections: {
          dailyBriefing: t("customerApp.lifeOs.sections.dailyBriefing"),
          eveningReview: t("customerApp.lifeOs.sections.eveningReview"),
          todayOverview: t("customerApp.lifeOs.sections.todayOverview"),
          upcomingEvents: t("customerApp.lifeOs.sections.upcomingEvents"),
          priorityTasks: t("customerApp.lifeOs.sections.priorityTasks"),
          familyReminders: t("customerApp.lifeOs.sections.familyReminders"),
          suggestedActions: t("customerApp.lifeOs.sections.suggestedActions"),
          conflicts: t("customerApp.lifeOs.sections.conflicts"),
          proactiveQuestions: t("customerApp.lifeOs.sections.proactiveQuestions"),
          checklists: t("customerApp.lifeOs.sections.checklists"),
          lifeBalance: t("customerApp.lifeOs.sections.lifeBalance"),
          settings: t("customerApp.lifeOs.sections.settings"),
        },
        settings: {
          proactivity: t("customerApp.lifeOs.settings.proactivity"),
          notifications: t("customerApp.lifeOs.settings.notifications"),
          personality: t("customerApp.lifeOs.settings.personality"),
          dailyBriefing: t("customerApp.lifeOs.settings.dailyBriefing"),
          eveningReview: t("customerApp.lifeOs.settings.eveningReview"),
          energyAware: t("customerApp.lifeOs.settings.energyAware"),
          lifeAreas: t("customerApp.lifeOs.settings.lifeAreas"),
        },
        priorities: priorityLabels,
        lifeAreas: lifeAreaLabels,
        personalities: personalityLabels,
        proactivityLevels: proactivityLabels,
        notificationFrequencies: frequencyLabels,
      }}
    />
  );
}

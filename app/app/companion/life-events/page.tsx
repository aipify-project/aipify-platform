import { LifeEventsPanel } from "@/components/app/companion/LifeEventsPanel";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import { getLocale } from "@/lib/i18n/get-locale";
import { createTranslator } from "@/lib/i18n/translate";

export default async function LifeEventsPage() {
  const dict = await getDictionary(await getLocale(), ["customerApp"]);
  const t = createTranslator(dict);
  const p = "customerApp.lifeEvents";

  return (
    <LifeEventsPanel
      labels={{
        title: t(`${p}.title`),
        subtitle: t(`${p}.subtitle`),
        loading: t(`${p}.loading`),
        corePrinciple: t(`${p}.corePrinciple`),
        visionTitle: t(`${p}.visionTitle`),
        userControlTitle: t(`${p}.userControlTitle`),
        upcomingTitle: t(`${p}.upcomingTitle`),
        remindersTitle: t(`${p}.remindersTitle`),
        suggestedActionsTitle: t(`${p}.suggestedActionsTitle`),
        preparationTitle: t(`${p}.preparationTitle`),
        careInsightsTitle: t(`${p}.careInsightsTitle`),
        completedTitle: t(`${p}.completedTitle`),
        settingsTitle: t(`${p}.settingsTitle`),
        proactivityLevel: t(`${p}.proactivityLevel`),
        suggestActions: t(`${p}.suggestActions`),
        executeActions: t(`${p}.executeActions`),
        optOut: t(`${p}.optOut`),
        saveSettings: t(`${p}.saveSettings`),
        approve: t(`${p}.approve`),
        decline: t(`${p}.decline`),
        complete: t(`${p}.complete`),
        dismiss: t(`${p}.dismiss`),
        snooze: t(`${p}.snooze`),
        daysUntil: t(`${p}.daysUntil`),
        importance: t(`${p}.importance`),
        noUpcoming: t(`${p}.noUpcoming`),
        noReminders: t(`${p}.noReminders`),
        noActions: t(`${p}.noActions`),
        privacyNote: t(`${p}.privacyNote`),
        trustAdoptionLink: t(`${p}.trustAdoptionLink`),
        approvalsLink: t(`${p}.approvalsLink`),
        marketplaceLink: t(`${p}.marketplaceLink`),
        categories: {
          personal_events: t(`${p}.categories.personal_events`),
          professional_events: t(`${p}.categories.professional_events`),
          health_wellbeing_events: t(`${p}.categories.health_wellbeing_events`),
        },
        importanceLevels: {
          optional: t(`${p}.importanceLevels.optional`),
          important: t(`${p}.importanceLevels.important`),
          very_important: t(`${p}.importanceLevels.very_important`),
          never_forget: t(`${p}.importanceLevels.never_forget`),
        },
      }}
    />
  );
}

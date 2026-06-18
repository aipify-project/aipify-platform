import { CompanionOrchestrationPanel } from "@/components/app/companion/CompanionOrchestrationPanel";
import { getCustomerAppDictionaryForModule } from "@/lib/i18n/get-dictionary";
import { getLocale } from "@/lib/i18n/get-locale";
import { createTranslator } from "@/lib/i18n/translate";

export default async function CompanionOrchestrationPage() {
  const dict = await getCustomerAppDictionaryForModule(await getLocale(), "companionOrchestration");
  const t = createTranslator(dict);
  const p = "customerApp.companionOrchestration";

  return (
    <CompanionOrchestrationPanel
      labels={{
        title: t(`${p}.title`),
        subtitle: t(`${p}.subtitle`),
        loading: t(`${p}.loading`),
        corePrinciple: t(`${p}.corePrinciple`),
        visionTitle: t(`${p}.visionTitle`),
        responsePrincipleTitle: t(`${p}.responsePrincipleTitle`),
        healthTitle: t(`${p}.healthTitle`),
        registryTitle: t(`${p}.registryTitle`),
        eventsTitle: t(`${p}.eventsTitle`),
        conflictsTitle: t(`${p}.conflictsTitle`),
        settingsTitle: t(`${p}.settingsTitle`),
        testTitle: t(`${p}.testTitle`),
        testPlaceholder: t(`${p}.testPlaceholder`),
        testSubmit: t(`${p}.testSubmit`),
        testResponseLabel: t(`${p}.testResponseLabel`),
        orchestrationEnabled: t(`${p}.orchestrationEnabled`),
        sensitivity: t(`${p}.sensitivity`),
        notificationLevel: t(`${p}.notificationLevel`),
        saveSettings: t(`${p}.saveSettings`),
        activeCompanions: t(`${p}.activeCompanions`),
        events30d: t(`${p}.events30d`),
        conflictsResolved: t(`${p}.conflictsResolved`),
        avgEffectiveness: t(`${p}.avgEffectiveness`),
        avgAcceptance: t(`${p}.avgAcceptance`),
        multiCompanionEvents: t(`${p}.multiCompanionEvents`),
        priority: t(`${p}.priority`),
        status: t(`${p}.status`),
        usage: t(`${p}.usage`),
        effectiveness: t(`${p}.effectiveness`),
        acceptance: t(`${p}.acceptance`),
        enabled: t(`${p}.enabled`),
        disabled: t(`${p}.disabled`),
        capabilitiesActivated: t(`${p}.capabilitiesActivated`),
        conflictDetected: t(`${p}.conflictDetected`),
        privacyNote: t(`${p}.privacyNote`),
        actionMemoryLink: t(`${p}.actionMemoryLink`),
        lifeEventsLink: t(`${p}.lifeEventsLink`),
        companionActionsLink: t(`${p}.companionActionsLink`),
        sensitivityLevels: {
          conservative: t(`${p}.sensitivityLevels.conservative`),
          balanced: t(`${p}.sensitivityLevels.balanced`),
          proactive: t(`${p}.sensitivityLevels.proactive`),
        },
        notificationLevels: {
          minimal: t(`${p}.notificationLevels.minimal`),
          important: t(`${p}.notificationLevels.important`),
          all: t(`${p}.notificationLevels.all`),
        },
        priorityLevels: {
          "1": t(`${p}.priorityLevels.1`),
          "2": t(`${p}.priorityLevels.2`),
          "3": t(`${p}.priorityLevels.3`),
          "4": t(`${p}.priorityLevels.4`),
          "5": t(`${p}.priorityLevels.5`),
        },
      }}
    />
  );
}

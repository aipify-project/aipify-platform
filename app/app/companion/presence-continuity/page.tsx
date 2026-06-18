import { PresenceContinuityPanel } from "@/components/app/companion/PresenceContinuityPanel";
import { getCustomerAppDictionaryForModule } from "@/lib/i18n/get-dictionary";
import { getLocale } from "@/lib/i18n/get-locale";
import { createTranslator } from "@/lib/i18n/translate";

export default async function PresenceContinuityPage() {
  const dict = await getCustomerAppDictionaryForModule(await getLocale(), "presenceContinuity");
  const t = createTranslator(dict);
  const p = "customerApp.presenceContinuity";

  return (
    <PresenceContinuityPanel
      labels={{
        title: t(`${p}.title`),
        subtitle: t(`${p}.subtitle`),
        loading: t(`${p}.loading`),
        corePrinciple: t(`${p}.corePrinciple`),
        philosophyTitle: t(`${p}.philosophyTitle`),
        visionTitle: t(`${p}.visionTitle`),
        presenceStatus: t(`${p}.presenceStatus`),
        resumeTitle: t(`${p}.resumeTitle`),
        continueSession: t(`${p}.continueSession`),
        sinceLastSessionTitle: t(`${p}.sinceLastSessionTitle`),
        contextTitle: t(`${p}.contextTitle`),
        prioritiesTitle: t(`${p}.prioritiesTitle`),
        initiativesTitle: t(`${p}.initiativesTitle`),
        insightsTitle: t(`${p}.insightsTitle`),
        executiveTitle: t(`${p}.executiveTitle`),
        settingsTitle: t(`${p}.settingsTitle`),
        presenceState: t(`${p}.presenceState`),
        greetingStyle: t(`${p}.greetingStyle`),
        briefingFrequency: t(`${p}.briefingFrequency`),
        sinceLastSessionDetail: t(`${p}.sinceLastSessionDetail`),
        focusBehavior: t(`${p}.focusBehavior`),
        saveSettings: t(`${p}.saveSettings`),
        dismiss: t(`${p}.dismiss`),
        privacyNote: t(`${p}.privacyNote`),
        commandCenterLink: t(`${p}.commandCenterLink`),
        trustAdoptionLink: t(`${p}.trustAdoptionLink`),
        identityLink: t(`${p}.identityLink`),
        attentionLink: t(`${p}.attentionLink`),
        states: {
          offline: t(`${p}.states.offline`),
          available: t(`${p}.states.available`),
          focused: t(`${p}.states.focused`),
          active_companion: t(`${p}.states.active_companion`),
        },
      }}
    />
  );
}

import { CompanionIdentityRelationshipPanel } from "@/components/app/companion/CompanionIdentityRelationshipPanel";
import { getCustomerAppDictionaryForModule } from "@/lib/i18n/get-dictionary";
import { getLocale } from "@/lib/i18n/get-locale";
import { createTranslator } from "@/lib/i18n/translate";

export default async function CompanionIdentityRelationshipPage() {
  const dict = await getCustomerAppDictionaryForModule(await getLocale(), "companionIdentityRelationship");
  const t = createTranslator(dict);
  const p = "customerApp.companionIdentityRelationship";

  return (
    <CompanionIdentityRelationshipPanel
      labels={{
        title: t(`${p}.title`),
        subtitle: t(`${p}.subtitle`),
        loading: t(`${p}.loading`),
        corePrinciple: t(`${p}.corePrinciple`),
        visionTitle: t(`${p}.visionTitle`),
        identitySettingsTitle: t(`${p}.identitySettingsTitle`),
        displayName: t(`${p}.displayName`),
        officialNameNote: t(`${p}.officialNameNote`),
        relationshipMode: t(`${p}.relationshipMode`),
        communicationPrefsTitle: t(`${p}.communicationPrefsTitle`),
        tonePreference: t(`${p}.tonePreference`),
        proactivityLevel: t(`${p}.proactivityLevel`),
        humorPreference: t(`${p}.humorPreference`),
        notificationStyle: t(`${p}.notificationStyle`),
        encouragementPreference: t(`${p}.encouragementPreference`),
        briefingStyle: t(`${p}.briefingStyle`),
        personalization: t(`${p}.personalization`),
        saveSettings: t(`${p}.saveSettings`),
        trustIndicatorsTitle: t(`${p}.trustIndicatorsTitle`),
        milestonesTitle: t(`${p}.milestonesTitle`),
        reviewsTitle: t(`${p}.reviewsTitle`),
        personalizationTitle: t(`${p}.personalizationTitle`),
        introductionTitle: t(`${p}.introductionTitle`),
        submitReview: t(`${p}.submitReview`),
        achieved: t(`${p}.achieved`),
        pending: t(`${p}.pending`),
        privacyNote: t(`${p}.privacyNote`),
        trustAdoptionLink: t(`${p}.trustAdoptionLink`),
        lifeEventsLink: t(`${p}.lifeEventsLink`),
        legacyIdentityLink: t(`${p}.legacyIdentityLink`),
        assistantIdentityLink: t(`${p}.assistantIdentityLink`),
        modes: {
          business: t(`${p}.modes.business`),
          companion: t(`${p}.modes.companion`),
          hybrid: t(`${p}.modes.hybrid`),
        },
      }}
    />
  );
}

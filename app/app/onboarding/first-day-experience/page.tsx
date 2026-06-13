import { FirstDayExperiencePanel } from "@/components/app/onboarding";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import { getLocale } from "@/lib/i18n/get-locale";
import { createTranslator } from "@/lib/i18n/translate";

export default async function FirstDayExperiencePage() {
  const locale = await getLocale();
  const dict = await getDictionary(locale, ["customerApp"]);
  const t = createTranslator(dict);
  const ns = "customerApp.firstDayExperience";

  return (
    <FirstDayExperiencePanel
      labels={{
        title: t(`${ns}.title`),
        subtitle: t(`${ns}.subtitle`),
        loading: t(`${ns}.loading`),
        corePrinciple: t(`${ns}.corePrinciple`),
        currentStep: t(`${ns}.currentStep`),
        advanceStep: t(`${ns}.advanceStep`),
        advancing: t(`${ns}.advancing`),
        welcomeTitle: t(`${ns}.welcomeTitle`),
        discoveryTitle: t(`${ns}.discoveryTitle`),
        valueMomentsTitle: t(`${ns}.valueMomentsTitle`),
        capabilityTitle: t(`${ns}.capabilityTitle`),
        permissionTitle: t(`${ns}.permissionTitle`),
        personalizationTitle: t(`${ns}.personalizationTitle`),
        firstSuccessTitle: t(`${ns}.firstSuccessTitle`),
        readinessTitle: t(`${ns}.readinessTitle`),
        recommendationsTitle: t(`${ns}.recommendationsTitle`),
        confidenceTitle: t(`${ns}.confidenceTitle`),
        auditTitle: t(`${ns}.auditTitle`),
        noAudit: t(`${ns}.noAudit`),
        completeTask: t(`${ns}.completeTask`),
        completing: t(`${ns}.completing`),
        savePersonalization: t(`${ns}.savePersonalization`),
        trustScore: t(`${ns}.trustScore`),
        onboardingLink: t(`${ns}.onboardingLink`),
        aipifyInstallLink: t(`${ns}.aipifyInstallLink`),
        privacyNote: t(`${ns}.privacyNote`),
        steps: {
          "1": t(`${ns}.steps.welcome`),
          "2": t(`${ns}.steps.discoverySummary`),
          "3": t(`${ns}.steps.valueMoments`),
          "4": t(`${ns}.steps.capabilityTour`),
          "5": t(`${ns}.steps.permissionReview`),
          "6": t(`${ns}.steps.personalization`),
          "7": t(`${ns}.steps.firstSuccess`),
          "8": t(`${ns}.steps.readinessReport`),
        },
        adoptionStages: {
          observer: t(`${ns}.adoptionStages.observer`),
          assistant: t(`${ns}.adoptionStages.assistant`),
          coordinator: t(`${ns}.adoptionStages.coordinator`),
          action_companion: t(`${ns}.adoptionStages.actionCompanion`),
          trusted_companion: t(`${ns}.adoptionStages.trustedCompanion`),
        },
      }}
    />
  );
}

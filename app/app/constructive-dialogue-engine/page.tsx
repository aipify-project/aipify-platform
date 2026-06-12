import { ConstructiveDialogueEngineDashboardPanel } from "@/components/app/constructive-dialogue-engine";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import { getLocale } from "@/lib/i18n/get-locale";
import { createTranslator } from "@/lib/i18n/translate";

export default async function ConstructiveDialogueEnginePage() {
  const dict = await getDictionary(await getLocale(), ["customerApp"]);
  const t = createTranslator(dict);
  const p = "customerApp.constructiveDialogueEngine";

  return (
    <div className="mx-auto max-w-6xl space-y-6 p-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-gray-900">{t(`${p}.title`)}</h1>
        <p className="mt-2 text-gray-600">{t(`${p}.subtitle`)}</p>
      </div>
      <ConstructiveDialogueEngineDashboardPanel
        labels={{
          loading: t(`${p}.loading`),
          blueprintTitle: t(`${p}.blueprintTitle`),
          eraCrossLinksBanner: t(`${p}.eraCrossLinksBanner`),
          eraCrossLinksNote: t(`${p}.eraCrossLinksNote`),
          constructiveDialogueCenter: t(`${p}.constructiveDialogueCenter`),
          humanOversightRequired: t(`${p}.humanOversightRequired`),
          reflectionOptIn: t(`${p}.reflectionOptIn`),
          currentReadinessLevel: t(`${p}.currentReadinessLevel`),
          notForcedAgreement: t(`${p}.notForcedAgreement`),
          dialoguePrograms: t(`${p}.dialoguePrograms`),
          dialogueReviews: t(`${p}.dialogueReviews`),
          dialogueMemory: t(`${p}.dialogueMemory`),
          constructiveDialogueCenterCapabilities: t(`${p}.constructiveDialogueCenterCapabilities`),
          peacebuildingEngine: t(`${p}.peacebuildingEngine`),
          conflictNavigation: t(`${p}.conflictNavigation`),
          executiveDialogueReviews: t(`${p}.executiveDialogueReviews`),
          dialogueCompanion: t(`${p}.dialogueCompanion`),
          perspectiveExpansion: t(`${p}.perspectiveExpansion`),
          relationshipResilience: t(`${p}.relationshipResilience`),
          dialogueMemoryEngine: t(`${p}.dialogueMemoryEngine`),
          dialogueProgramsSection: t(`${p}.dialogueProgramsSection`),
          dialogueReviewsSection: t(`${p}.dialogueReviewsSection`),
          dialogueMemorySection: t(`${p}.dialogueMemorySection`),
          crossLinks: t(`${p}.crossLinks`),
          selfLoveConnection: t(`${p}.selfLoveConnection`),
          blueprintObjectives: t(`${p}.blueprintObjectives`),
          companionLimitations: t(`${p}.companionLimitations`),
          successCriteria: t(`${p}.successCriteria`),
          criterionMet: t(`${p}.criterionMet`),
          criterionPending: t(`${p}.criterionPending`),
        }}
      />
    </div>
  );
}

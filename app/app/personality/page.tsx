import { PersonalityDashboardPanel } from "@/components/app/personality";
import { getCustomerAppDictionaryForModule } from "@/lib/i18n/get-dictionary";
import { getLocale } from "@/lib/i18n/get-locale";
import { createTranslator } from "@/lib/i18n/translate";

export default async function PersonalityPage() {
  const dict = await getCustomerAppDictionaryForModule(await getLocale(), "personalityEngine");
  const t = createTranslator(dict);
  const p = "customerApp.personalityEngine";

  return (
    <div className="mx-auto max-w-6xl space-y-6 p-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-gray-900">{t(`${p}.title`)}</h1>
        <p className="mt-2 text-gray-600">{t(`${p}.subtitle`)}</p>
        <p className="mt-2 text-sm text-amber-700">{t(`${p}.philosophy`)}</p>
      </div>
      <PersonalityDashboardPanel
        labels={{
          loading: t(`${p}.loading`),
          currentMode: t(`${p}.currentMode`),
          crisisSuppression: t(`${p}.crisisSuppression`),
          humorEnabled: t(`${p}.humorEnabled`),
          emojiEnabled: t(`${p}.emojiEnabled`),
          humorAppropriate: t(`${p}.humorAppropriate`),
          humorNever: t(`${p}.humorNever`),
          humorShould: t(`${p}.humorShould`),
          humorShouldNever: t(`${p}.humorShouldNever`),
          personalConnection: t(`${p}.personalConnection`),
          exampleExchanges: t(`${p}.exampleExchanges`),
          userSays: t(`${p}.userSays`),
          aipifyResponds: t(`${p}.aipifyResponds`),
          examplesSection: t(`${p}.examplesSection`),
          humorSuppressed: t(`${p}.humorSuppressed`),
          trustBoundaries: t(`${p}.trustBoundaries`),
          avoid: t(`${p}.avoid`),
          prefer: t(`${p}.prefer`),
          relatedEngines: t(`${p}.relatedEngines`),
          safetyNote: t(`${p}.safetyNote`),
          playfulBellTitle: t("customerApp.personality.playfulBell.title"),
          playfulMomentsEnabled: t("customerApp.personality.playfulBell.playfulMomentsEnabled"),
          bellMomentsEnabled: t("customerApp.personality.playfulBell.bellMomentsEnabled"),
          playfulSuppressed: t("customerApp.personality.playfulBell.playfulSuppressed"),
          bellMoments: t("customerApp.personality.playfulBell.bellMoments"),
          whenToUse: t("customerApp.personality.playfulBell.whenToUse"),
          whenNotToUse: t("customerApp.personality.playfulBell.whenNotToUse"),
          foxExchange: t("customerApp.personality.playfulBell.foxExchange"),
          successCriteria: t(`${p}.successCriteria`),
          communicationPreferences: t(`${p}.communicationPreferences`),
          harmlessMemory: t(`${p}.harmlessMemory`),
          allowed: t(`${p}.allowed`),
          forbidden: t(`${p}.forbidden`),
          humorBoundaries: t(`${p}.humorBoundaries`),
          playfulMomentsBlueprint: t(`${p}.playfulMomentsBlueprint`),
          selfLoveConnection: t(`${p}.selfLoveConnection`),
          trustConnection: t(`${p}.trustConnection`),
          visionPhrases: t(`${p}.visionPhrases`),
          mapsToMode: t(`${p}.mapsToMode`),
        }}
      />
    </div>
  );
}

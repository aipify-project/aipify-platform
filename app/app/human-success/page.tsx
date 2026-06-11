import { HumanSuccessDashboardPanel } from "@/components/app/human-success";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import { getLocale } from "@/lib/i18n/get-locale";
import { createTranslator } from "@/lib/i18n/translate";

export default async function HumanSuccessPage() {
  const dict = await getDictionary(await getLocale(), ["customerApp"]);
  const t = createTranslator(dict);
  const p = "customerApp.humanSuccessEngine";

  return (
    <div className="mx-auto max-w-6xl space-y-6 p-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-gray-900">{t(`${p}.title`)}</h1>
        <p className="mt-2 text-gray-600">{t(`${p}.subtitle`)}</p>
        <p className="mt-2 text-sm text-sky-700">{t(`${p}.philosophy`)}</p>
      </div>
      <HumanSuccessDashboardPanel
        labels={{
          loading: t(`${p}.loading`),
          adoptionScore: t(`${p}.adoptionScore`),
          orgAdoption: t(`${p}.orgAdoption`),
          personalSuccess: t(`${p}.personalSuccess`),
          personalOnly: t(`${p}.personalOnly`),
          privacyNote: t(`${p}.privacyNote`),
          valueReinforcement: t(`${p}.valueReinforcement`),
          generateBriefing: t(`${p}.generateBriefing`),
          onboardingSection: t(`${p}.onboardingSection`),
          journeysSection: t(`${p}.journeysSection`),
          learningSection: t(`${p}.learningSection`),
          frictionSection: t(`${p}.frictionSection`),
          championsSection: t(`${p}.championsSection`),
          championsNote: t(`${p}.championsNote`),
          milestonesSection: t(`${p}.milestonesSection`),
          journey: t(`${p}.journey`),
          steps: t(`${p}.steps`),
          completed: t(`${p}.completed`),
          nextStep: t(`${p}.nextStep`),
          advanceJourney: t(`${p}.advanceJourney`),
          complete: t(`${p}.complete`),
          dismiss: t(`${p}.dismiss`),
          safetyNote: t(`${p}.safetyNote`),
        }}
      />
    </div>
  );
}

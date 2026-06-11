import { PersonalityDashboardPanel } from "@/components/app/personality";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import { getLocale } from "@/lib/i18n/get-locale";
import { createTranslator } from "@/lib/i18n/translate";

export default async function PersonalityPage() {
  const dict = await getDictionary(await getLocale(), ["customerApp"]);
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
          examplesSection: t(`${p}.examplesSection`),
          humorSuppressed: t(`${p}.humorSuppressed`),
          safetyNote: t(`${p}.safetyNote`),
        }}
      />
    </div>
  );
}

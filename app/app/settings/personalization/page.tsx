import { PersonalizationSettingsPanel } from "@/components/app/workstyle";
import { getCustomerAppDictionaryForModule } from "@/lib/i18n/get-dictionary";
import { getLocale } from "@/lib/i18n/get-locale";
import { createTranslator } from "@/lib/i18n/translate";

export default async function PersonalizationSettingsPage() {
  const dict = await getCustomerAppDictionaryForModule(await getLocale(), "workstyleEngine");
  const t = createTranslator(dict);
  const p = "customerApp.workstyleEngine";

  return (
    <div className="mx-auto max-w-4xl space-y-6 p-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-gray-900">{t(`${p}.title`)}</h1>
        <p className="mt-2 text-gray-600">{t(`${p}.subtitle`)}</p>
        <p className="mt-2 text-sm text-indigo-700">{t(`${p}.philosophy`)}</p>
      </div>
      <PersonalizationSettingsPanel
        labels={{
          loading: t(`${p}.loading`),
          back: t(`${p}.back`),
          youControl: t(`${p}.youControl`),
          privacyNote: t(`${p}.privacyNote`),
          personalizationEnabled: t(`${p}.personalizationEnabled`),
          humorEnabled: t(`${p}.humorEnabled`),
          saved: t(`${p}.saved`),
          suggestionsSection: t(`${p}.suggestionsSection`),
          suggestionsNote: t(`${p}.suggestionsNote`),
          confidence: t(`${p}.confidence`),
          accept: t(`${p}.accept`),
          dismiss: t(`${p}.dismiss`),
          communication: t(`${p}.communication`),
          notifications: t(`${p}.notifications`),
          learning: t(`${p}.learning`),
          explanation: t(`${p}.explanation`),
          collaboration: t(`${p}.collaboration`),
          desktop: t(`${p}.desktop`),
          safetyNote: t(`${p}.safetyNote`),
        }}
      />
    </div>
  );
}

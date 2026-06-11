import { CustomerSuccessEngineDashboardPanel } from "@/components/app/customer-success-engine";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import { getLocale } from "@/lib/i18n/get-locale";
import { createTranslator } from "@/lib/i18n/translate";

export default async function CustomerSuccessEnginePage() {
  const dict = await getDictionary(await getLocale(), ["customerApp"]);
  const t = createTranslator(dict);
  const p = "customerApp.customerSuccessEngine";

  return (
    <div className="mx-auto max-w-6xl space-y-6 p-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-gray-900">{t(`${p}.title`)}</h1>
        <p className="mt-2 text-gray-600">{t(`${p}.subtitle`)}</p>
      </div>
      <CustomerSuccessEngineDashboardPanel labels={{ loading: t(`${p}.loading`),
          engineTitle: t(`${p}.engineTitle`),
          noItems: t(`${p}.noItems`),
          principles: t(`${p}.principles`),
          health_score: t(`${p}.health_score`),
          adoption_score: t(`${p}.adoption_score`),
          satisfaction_score: t(`${p}.satisfaction_score`),
          pending_interventions: t(`${p}.pending_interventions`),
          interventions: t(`${p}.interventions`),
          onboarding: t(`${p}.onboarding`),
          subscription: t(`${p}.subscription`) }} />
    </div>
  );
}

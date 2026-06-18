import { CompanionBriefingPageIntro } from "@/components/app/briefing";
import { CustomerSuccessEngineDashboardPanel } from "@/components/app/customer-success-engine";
import { buildCompanionBriefingLabels } from "@/lib/app/companion-briefing-labels";
import { getCustomerAppDictionaryForModule } from "@/lib/i18n/get-dictionary";
import { getLocale } from "@/lib/i18n/get-locale";
import { createTranslator } from "@/lib/i18n/translate";

export default async function CustomerSuccessEnginePage() {
  const dict = await getCustomerAppDictionaryForModule(await getLocale(), "customerSuccessEngine");
  const t = createTranslator(dict);
  const p = "customerApp.customerSuccessEngine";

  return (
    <div className="mx-auto max-w-6xl space-y-6 p-6">
      <CompanionBriefingPageIntro
        title={t(`${p}.title`)}
        subtitle={t(`${p}.subtitle`)}
        context="customer_success"
        labels={buildCompanionBriefingLabels(t)}
      />
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

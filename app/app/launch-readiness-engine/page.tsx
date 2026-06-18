import { LaunchReadinessEngineDashboardPanel } from "@/components/app/launch-readiness-engine";
import { getCustomerAppDictionaryForModule } from "@/lib/i18n/get-dictionary";
import { getLocale } from "@/lib/i18n/get-locale";
import { createTranslator } from "@/lib/i18n/translate";

export default async function LaunchReadinessEnginePage() {
  const dict = await getCustomerAppDictionaryForModule(await getLocale(), "launchReadinessEngine");
  const t = createTranslator(dict);
  const p = "customerApp.launchReadinessEngine";

  return (
    <div className="mx-auto max-w-6xl space-y-6 p-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-gray-900">{t(`${p}.title`)}</h1>
        <p className="mt-2 text-gray-600">{t(`${p}.subtitle`)}</p>
      </div>
      <LaunchReadinessEngineDashboardPanel labels={{ loading: t(`${p}.loading`),
          engineTitle: t(`${p}.engineTitle`),
          noItems: t(`${p}.noItems`),
          principles: t(`${p}.principles`),
          total_items: t(`${p}.total_items`),
          approved_items: t(`${p}.approved_items`),
          blocked_items: t(`${p}.blocked_items`),
          monitoring_alerts: t(`${p}.monitoring_alerts`),
          checklist: t(`${p}.checklist`),
          pilot: t(`${p}.pilot`),
          deployments: t(`${p}.deployments`) }} />
    </div>
  );
}

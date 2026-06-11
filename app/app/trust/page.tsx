import { TrustDashboardPanel } from "@/components/app/trust-engine";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import { getLocale } from "@/lib/i18n/get-locale";
import { createTranslator } from "@/lib/i18n/translate";

export default async function TrustPage() {
  const dict = await getDictionary(await getLocale(), ["customerApp"]);
  const t = createTranslator(dict);
  const p = "customerApp.trustEngine";

  return (
    <div className="mx-auto max-w-6xl space-y-6 p-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-gray-900">{t(`${p}.title`)}</h1>
        <p className="mt-2 text-gray-600">{t(`${p}.subtitle`)}</p>
      </div>
      <TrustDashboardPanel
        labels={{
          loading: t(`${p}.loading`),
          trustScore: t(`${p}.trustScore`),
          coverage: t(`${p}.coverage`),
          viewRate: t(`${p}.viewRate`),
          overrideRate: t(`${p}.overrideRate`),
          escalations: t(`${p}.escalations`),
          recentExplanations: t(`${p}.recentExplanations`),
          recentFeedback: t(`${p}.recentFeedback`),
          safetyNote: t(`${p}.safetyNote`),
        }}
      />
    </div>
  );
}

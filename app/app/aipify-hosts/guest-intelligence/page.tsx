import { AipifyHostsGuestIntelligenceDashboardPanel } from "@/components/app/aipify-hosts-guest-intelligence";
import { getCustomerAppDictionaryForModule } from "@/lib/i18n/get-dictionary";
import { getLocale } from "@/lib/i18n/get-locale";
import { createTranslator } from "@/lib/i18n/translate";

export default async function AipifyHostsGuestIntelligencePage() {
  const dict = await getCustomerAppDictionaryForModule(await getLocale(), "aipifyHostsGuestIntelligence");
  const t = createTranslator(dict);
  const p = "customerApp.aipifyHostsGuestIntelligence";

  return (
    <div className="mx-auto max-w-6xl space-y-6 p-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-gray-900">{t(`${p}.title`)}</h1>
        <p className="mt-2 text-gray-600">{t(`${p}.subtitle`)}</p>
      </div>
      <AipifyHostsGuestIntelligenceDashboardPanel
        labels={{
          loading: t(`${p}.loading`),
          errorTitle: t(`${p}.errorTitle`),
          errorMessage: t(`${p}.errorMessage`),
          retry: t(`${p}.retry`),
          loyaltySnapshot: t(`${p}.loyaltySnapshot`),
          overallSatisfaction: t(`${p}.overallSatisfaction`),
          repeatGuestPct: t(`${p}.repeatGuestPct`),
          returningGuests: t(`${p}.returningGuests`),
          earlyWarnings: t(`${p}.earlyWarnings`),
          guestInsights: t(`${p}.guestInsights`),
          executiveMetrics: t(`${p}.executiveMetrics`),
          modules: t(`${p}.modules`),
          included: t(`${p}.included`),
          upgradeRequired: t(`${p}.upgradeRequired`),
          guestSegments: t(`${p}.guestSegments`),
          journeyStages: t(`${p}.journeyStages`),
          feedbackCategories: t(`${p}.feedbackCategories`),
          successMetrics: t(`${p}.successMetrics`),
          backToHosts: t(`${p}.backToHosts`),
          exploreKnowledge: t(`${p}.exploreKnowledge`),
        }}
      />
    </div>
  );
}

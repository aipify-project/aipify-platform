import { AipifyHostsDashboardPanel } from "@/components/app/aipify-hosts";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import { getLocale } from "@/lib/i18n/get-locale";
import { createTranslator } from "@/lib/i18n/translate";

export default async function AipifyHostsPage() {
  const dict = await getDictionary(await getLocale(), ["customerApp"]);
  const t = createTranslator(dict);
  const p = "customerApp.aipifyHosts";

  return (
    <div className="mx-auto max-w-6xl space-y-6 p-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-gray-900">{t(`${p}.title`)}</h1>
        <p className="mt-2 text-gray-600">{t(`${p}.subtitle`)}</p>
      </div>
      <AipifyHostsDashboardPanel
        labels={{
          loading: t(`${p}.loading`),
          errorTitle: t(`${p}.errorTitle`),
          errorMessage: t(`${p}.errorMessage`),
          retry: t(`${p}.retry`),
          executiveSnapshot: t(`${p}.executiveSnapshot`),
          properties: t(`${p}.properties`),
          healthScore: t(`${p}.healthScore`),
          package: t(`${p}.package`),
          platforms: t(`${p}.platforms`),
          supportedPlatforms: t(`${p}.supportedPlatforms`),
          modules: t(`${p}.modules`),
          packages: t(`${p}.packages`),
          included: t(`${p}.included`),
          upgradeRequired: t(`${p}.upgradeRequired`),
          moduleCount: t(`${p}.moduleCount`),
          emptyPropertiesTitle: t(`${p}.emptyPropertiesTitle`),
          emptyPropertiesMessage: t(`${p}.emptyPropertiesMessage`),
          addProperty: t(`${p}.addProperty`),
          exploreKnowledge: t(`${p}.exploreKnowledge`),
          propertiesList: t(`${p}.propertiesList`),
          directBooking: t(`${p}.directBooking`),
          successMetrics: t(`${p}.successMetrics`),
          openAutomation: t(`${p}.openAutomation`),
        }}
      />
    </div>
  );
}

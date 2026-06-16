import { BusinessPackLicenseEngineDashboardPanel } from "@/components/app/business-pack-license-engine";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import { getLocale } from "@/lib/i18n/get-locale";
import { createTranslator } from "@/lib/i18n/translate";

export default async function BusinessPackLicenseEnginePage() {
  const dict = await getDictionary(await getLocale(), ["customerApp"]);
  const t = createTranslator(dict);
  const p = "customerApp.businessPackLicenseEngine";

  return (
    <div className="mx-auto max-w-6xl space-y-6 p-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-gray-900">{t(`${p}.title`)}</h1>
        <p className="mt-2 text-gray-600">{t(`${p}.subtitle`)}</p>
      </div>
      <BusinessPackLicenseEngineDashboardPanel
        labels={{
          loading: t(`${p}.loading`),
          engineTitle: t(`${p}.engineTitle`),
          packDefinitions: t(`${p}.packDefinitions`),
          activeLicenses: t(`${p}.activeLicenses`),
          trialLicenses: t(`${p}.trialLicenses`),
          auditEvents: t(`${p}.auditEvents`),
          upgradeFlow: t(`${p}.upgradeFlow`),
          licenseMetrics: t(`${p}.licenseMetrics`),
          governance: t(`${p}.governance`),
          catalogTitle: t(`${p}.catalogTitle`),
          tiers: t(`${p}.tiers`),
          trialAvailable: t(`${p}.trialAvailable`),
          viewLicenseCenter: t(`${p}.viewLicenseCenter`),
          successCriteria: t(`${p}.successCriteria`),
        }}
      />
    </div>
  );
}

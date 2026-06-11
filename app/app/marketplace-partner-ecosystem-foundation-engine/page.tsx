import { MarketplacePartnerEcosystemFoundationEngineDashboardPanel } from "@/components/app/marketplace-partner-ecosystem-foundation-engine";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import { getLocale } from "@/lib/i18n/get-locale";
import { createTranslator } from "@/lib/i18n/translate";

export default async function MarketplacePartnerEcosystemFoundationEnginePage() {
  const dict = await getDictionary(await getLocale(), ["customerApp"]);
  const t = createTranslator(dict);
  const p = "customerApp.marketplacePartnerEcosystemFoundationEngine";

  return (
    <div className="mx-auto max-w-6xl space-y-6 p-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-gray-900">{t(`${p}.title`)}</h1>
        <p className="mt-2 text-gray-600">{t(`${p}.subtitle`)}</p>
      </div>
      <MarketplacePartnerEcosystemFoundationEngineDashboardPanel labels={{
          loading: t(`${p}.loading`),
          engineTitle: t(`${p}.engineTitle`),
          summary: t(`${p}.summary`),
          principles: t(`${p}.principles`),
          approvedPartners: t(`${p}.approvedPartners`),
          pendingPartners: t(`${p}.pendingPartners`),
          offerings: t(`${p}.offerings`),
          certificationStatus: t(`${p}.certificationStatus`),
          qualityIndicators: t(`${p}.qualityIndicators`),
          integrationNotes: t(`${p}.integrationNotes`),
          approve: t(`${p}.approve`),
          suspend: t(`${p}.suspend`),
          recertify: t(`${p}.recertify`),
          actionFailed: t(`${p}.actionFailed`),
        }} />
    </div>
  );
}

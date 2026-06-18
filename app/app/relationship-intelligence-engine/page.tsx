import { RelationshipIntelligenceEngineDashboardPanel } from "@/components/app/relationship-intelligence-engine";
import { getCustomerAppDictionaryForModule } from "@/lib/i18n/get-dictionary";
import { getLocale } from "@/lib/i18n/get-locale";
import { createTranslator } from "@/lib/i18n/translate";

export default async function RelationshipIntelligenceEnginePage() {
  const dict = await getCustomerAppDictionaryForModule(await getLocale(), "relationshipIntelligenceEngine");
  const t = createTranslator(dict);
  const p = "customerApp.relationshipIntelligenceEngine";

  return (
    <div className="mx-auto max-w-6xl space-y-6 p-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-gray-900">{t(`${p}.title`)}</h1>
        <p className="mt-2 text-gray-600">{t(`${p}.subtitle`)}</p>
      </div>
      <RelationshipIntelligenceEngineDashboardPanel labels={{
          loading: t(`${p}.loading`),
          engineTitle: t(`${p}.engineTitle`),
          distinctionNote: t(`${p}.distinctionNote`),
          personalRsi: t(`${p}.personalRsi`),
          supportAi: t(`${p}.supportAi`),
          partnerSuccess: t(`${p}.partnerSuccess`),
          totalProfiles: t(`${p}.totalProfiles`),
          openInsights: t(`${p}.openInsights`),
          atRiskProfiles: t(`${p}.atRiskProfiles`),
          recentInteractions: t(`${p}.recentInteractions`),
          categories: t(`${p}.categories`),
          ethicalBoundaries: t(`${p}.ethicalBoundaries`),
          profiles: t(`${p}.profiles`),
          noProfiles: t(`${p}.noProfiles`),
          strength: t(`${p}.strength`),
          frequency: t(`${p}.frequency`),
          sentiment: t(`${p}.sentiment`),
          insights: t(`${p}.insights`),
          noInsights: t(`${p}.noInsights`),
          recommendedAction: t(`${p}.recommendedAction`),
          resolve: t(`${p}.resolve`),
          dismiss: t(`${p}.dismiss`),
          abosPrinciple: t(`${p}.abosPrinciple`),
          exportManifest: t(`${p}.exportManifest`),
          exporting: t(`${p}.exporting`),
          exportFailed: t(`${p}.exportFailed`),
          actionFailed: t(`${p}.actionFailed`),
        }} />
    </div>
  );
}

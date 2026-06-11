import { ProductAutomationDashboardPanel } from "@/components/app/product-automation";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import { getLocale } from "@/lib/i18n/get-locale";
import { createTranslator } from "@/lib/i18n/translate";

export default async function ProductAutomationPage() {
  const dict = await getDictionary(await getLocale(), ["customerApp"]);
  const t = createTranslator(dict);
  const p = "customerApp.productAutomation";

  return (
    <div className="mx-auto max-w-6xl space-y-6 p-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-gray-900">{t(`${p}.title`)}</h1>
        <p className="mt-2 text-gray-600">{t(`${p}.subtitle`)}</p>
      </div>
      <ProductAutomationDashboardPanel
        labels={{
          loading: t(`${p}.loading`),
          readinessOverview: t(`${p}.readinessOverview`),
          awaitingApproval: t(`${p}.awaitingApproval`),
          seoRecommendations: t(`${p}.seoRecommendations`),
          qualityWarnings: t(`${p}.qualityWarnings`),
          generateBriefing: t(`${p}.generateBriefing`),
          brandVoice: t(`${p}.brandVoice`),
          importedProducts: t(`${p}.importedProducts`),
          translationOpportunities: t(`${p}.translationOpportunities`),
          pendingApprovals: t(`${p}.pendingApprovals`),
          bulkTranslate: t(`${p}.bulkTranslate`),
          bulkSeo: t(`${p}.bulkSeo`),
          translate: t(`${p}.translate`),
          rewrite: t(`${p}.rewrite`),
          analyzeSeo: t(`${p}.analyzeSeo`),
          approve: t(`${p}.approve`),
          categorySuggestions: t(`${p}.categorySuggestions`),
          approvalWorkflow: t(`${p}.approvalWorkflow`),
          recentTranslations: t(`${p}.recentTranslations`),
          recentRewrites: t(`${p}.recentRewrites`),
          bulkActions: t(`${p}.bulkActions`),
          recentBriefings: t(`${p}.recentBriefings`),
          commerceIntelligence: t(`${p}.commerceIntelligence`),
          dropshippingOperations: t(`${p}.dropshippingOperations`),
          platformInstall: t(`${p}.platformInstall`),
          knowledgeCenter: t(`${p}.knowledgeCenter`),
        }}
      />
    </div>
  );
}

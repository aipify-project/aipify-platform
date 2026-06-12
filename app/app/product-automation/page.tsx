import { CompanionBriefingPageIntro } from "@/components/app/briefing";
import { ProductAutomationDashboardPanel } from "@/components/app/product-automation";
import { buildCompanionBriefingLabels } from "@/lib/app/companion-briefing-labels";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import { getLocale } from "@/lib/i18n/get-locale";
import { createTranslator } from "@/lib/i18n/translate";

export default async function ProductAutomationPage() {
  const dict = await getDictionary(await getLocale(), ["customerApp"]);
  const t = createTranslator(dict);
  const p = "customerApp.productAutomationEngine";

  return (
    <div className="mx-auto max-w-6xl space-y-6 p-6">
      <CompanionBriefingPageIntro
        title={t(`${p}.title`)}
        subtitle={t(`${p}.subtitle`)}
        context="product_automation"
        labels={buildCompanionBriefingLabels(t)}
      />
      <ProductAutomationDashboardPanel
        labels={{
          loading: t(`${p}.loading`),
          blueprintTitle: t(`${p}.blueprintTitle`),
          blueprintPhase: t(`${p}.blueprintPhase`),
          engagementSummary: t(`${p}.engagementSummary`),
          pipelineSteps: t(`${p}.pipelineSteps`),
          primaryLocales: t(`${p}.primaryLocales`),
          translationVersions: t(`${p}.translationVersions`),
          rewritingVersions: t(`${p}.rewritingVersions`),
          seoOpen: t(`${p}.seoOpen`),
          productsTracked: t(`${p}.productsTracked`),
          objectives: t(`${p}.objectives`),
          workflowPipeline: t(`${p}.workflowPipeline`),
          supportedLocales: t(`${p}.supportedLocales`),
          companionGuidance: t(`${p}.companionGuidance`),
          approvalPrinciples: t(`${p}.approvalPrinciples`),
          successCriteria: t(`${p}.successCriteria`),
          integrationLinks: t(`${p}.integrationLinks`),
          visionPhrases: t(`${p}.visionPhrases`),
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
          workflowOrchestration: t(`${p}.workflowOrchestration`),
          approvals: t(`${p}.approvals`),
          platformInstall: t(`${p}.platformInstall`),
          knowledgeCenter: t(`${p}.knowledgeCenter`),
        }}
      />
    </div>
  );
}

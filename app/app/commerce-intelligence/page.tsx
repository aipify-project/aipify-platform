import { CompanionBriefingPageIntro } from "@/components/app/briefing";
import { CommerceIntelligenceDashboardPanel } from "@/components/app/commerce-intelligence";
import { buildCompanionBriefingLabels } from "@/lib/app/companion-briefing-labels";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import { getLocale } from "@/lib/i18n/get-locale";
import { createTranslator } from "@/lib/i18n/translate";

export default async function CommerceIntelligencePage() {
  const dict = await getDictionary(await getLocale(), ["customerApp"]);
  const t = createTranslator(dict);
  const p = "customerApp.commerceIntelligence";

  return (
    <div className="mx-auto max-w-6xl space-y-6 p-6">
      <CompanionBriefingPageIntro
        title={t(`${p}.title`)}
        subtitle={t(`${p}.subtitle`)}
        context="commerce_intelligence"
        labels={buildCompanionBriefingLabels(t)}
      />
      <CommerceIntelligenceDashboardPanel
        labels={{
          loading: t(`${p}.loading`),
          commerceIntelligence: t(`${p}.commerceIntelligence`),
          opportunities: t(`${p}.opportunities`),
          trendingSignals: t(`${p}.trendingSignals`),
          watchlist: t(`${p}.watchlist`),
          runDiscovery: t(`${p}.runDiscovery`),
          generateBriefing: t(`${p}.generateBriefing`),
          avgScore: t(`${p}.avgScore`),
          productsToAvoid: t(`${p}.productsToAvoid`),
          bestOpportunities: t(`${p}.bestOpportunities`),
          approveAction: t(`${p}.approveAction`),
          addWatchlist: t(`${p}.addWatchlist`),
          onWatchlist: t(`${p}.onWatchlist`),
          analyzeMargin: t(`${p}.analyzeMargin`),
          trendingNow: t(`${p}.trendingNow`),
          unknownProduct: t(`${p}.unknownProduct`),
          highMarginCandidates: t(`${p}.highMarginCandidates`),
          netMargin: t(`${p}.netMargin`),
          supplierWatchlist: t(`${p}.supplierWatchlist`),
          seasonalOpportunities: t(`${p}.seasonalOpportunities`),
          storeFitRecommendations: t(`${p}.storeFitRecommendations`),
          recentBriefings: t(`${p}.recentBriefings`),
          platformInstall: t(`${p}.platformInstall`),
          commercial: t(`${p}.commercial`),
          commercePerformance: t(`${p}.commercePerformance`),
          knowledgeCenter: t(`${p}.knowledgeCenter`),
          blueprintTitle: t(`${p}.blueprintTitle`),
          blueprintObjectives: t(`${p}.blueprintObjectives`),
          companionGuidance: t(`${p}.companionGuidance`),
          notGenericAi: t(`${p}.notGenericAi`),
          limitationPrinciples: t(`${p}.limitationPrinciples`),
          selfLoveConnection: t(`${p}.selfLoveConnection`),
          successCriteria: t(`${p}.successCriteria`),
          criterionMet: t(`${p}.criterionMet`),
          criterionPending: t(`${p}.criterionPending`),
        }}
      />
    </div>
  );
}

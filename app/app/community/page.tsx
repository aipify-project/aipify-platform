import { CommunityHubPanel } from "@/components/app/community-intelligence";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import { getLocale } from "@/lib/i18n/get-locale";
import { createTranslator } from "@/lib/i18n/translate";

export default async function CommunityPage() {
  const dict = await getDictionary(await getLocale(), ["customerApp"]);
  const t = createTranslator(dict);
  const p = "customerApp.communityIntelligence";

  return (
    <div className="mx-auto max-w-6xl space-y-6 p-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-gray-900">{t(`${p}.title`)}</h1>
        <p className="mt-2 text-gray-600">{t(`${p}.subtitle`)}</p>
      </div>
      <CommunityHubPanel
        labels={{
          loading: t(`${p}.loading`),
          adminDashboard: t(`${p}.adminDashboard`),
          engineTitle: t(`${p}.engineTitle`),
          blueprintPhase: t(`${p}.blueprintPhase`),
          engagementSummary: t(`${p}.engagementSummary`),
          contributionsTotal: t(`${p}.contributionsTotal`),
          publishedContributions: t(`${p}.publishedContributions`),
          pendingReviewsCount: t(`${p}.pendingReviewsCount`),
          briefingsTotal: t(`${p}.briefingsTotal`),
          briefingsLast30d: t(`${p}.briefingsLast30d`),
          ratingsTotal: t(`${p}.ratingsTotal`),
          healthScore: t(`${p}.healthScore`),
          intelligenceScore: t(`${p}.intelligenceScore`),
          contributionScore: t(`${p}.contributionScore`),
          generateBriefing: t(`${p}.generateBriefing`),
          scoreComponents: t(`${p}.scoreComponents`),
          communityObjectives: t(`${p}.communityObjectives`),
          collectiveInsightExamples: t(`${p}.collectiveInsightExamples`),
          privacyPrinciples: t(`${p}.privacyPrinciples`),
          communityContributions: t(`${p}.communityContributions`),
          companionExamples: t(`${p}.companionExamples`),
          successCriteria: t(`${p}.successCriteria`),
          selfLoveConnection: t(`${p}.selfLoveConnection`),
          openSelfLove: t(`${p}.openSelfLove`),
          trustConnection: t(`${p}.trustConnection`),
          dogfooding: t(`${p}.dogfooding`),
          aipifyGroup: t(`${p}.aipifyGroup`),
          unonightPilot: t(`${p}.unonightPilot`),
          visionPhrases: t(`${p}.visionPhrases`),
          featuredLearnings: t(`${p}.featuredLearnings`),
          featuredInsights: t(`${p}.featuredInsights`),
          bestPractices: t(`${p}.bestPractices`),
          topRated: t(`${p}.topRated`),
          popularResources: t(`${p}.popularResources`),
          recentlyValidated: t(`${p}.recentlyValidated`),
          industryInsights: t(`${p}.industryInsights`),
          blueprintRecommendations: t(`${p}.blueprintRecommendations`),
          intelligenceCategories: t(`${p}.intelligenceCategories`),
          noInsights: t(`${p}.noInsights`),
          rate: t(`${p}.rate`),
          briefings: t(`${p}.briefings`),
          approvalWorkflow: t(`${p}.approvalWorkflow`),
        }}
      />
    </div>
  );
}

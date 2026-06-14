import { KnowledgeEvolutionCenterPanel } from "@/components/app/knowledge-evolution-center";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import { getLocale } from "@/lib/i18n/get-locale";
import { createTranslator } from "@/lib/i18n/translate";

export default async function KnowledgeEvolutionCenterPage() {
  const locale = await getLocale();
  const dict = await getDictionary(locale, ["customerApp"]);
  const t = createTranslator(dict);
  const p = "customerApp.knowledgeEvolutionCenter";

  return (
    <KnowledgeEvolutionCenterPanel
      labels={{
        title: t(`${p}.title`),
        subtitle: t(`${p}.subtitle`),
        loading: t(`${p}.loading`),
        corePrinciple: t(`${p}.corePrinciple`),
        philosophyTitle: t(`${p}.philosophyTitle`),
        visionTitle: t(`${p}.visionTitle`),
        knowledgeCenterLink: t(`${p}.knowledgeCenterLink`),
        organizationalLearningLink: t(`${p}.organizationalLearningLink`),
        organizationalMemoryLink: t(`${p}.organizationalMemoryLink`),
        knowledgeEngineLink: t(`${p}.knowledgeEngineLink`),
        employeeKnowledgeLink: t(`${p}.employeeKnowledgeLink`),
        dashboardTitle: t(`${p}.dashboardTitle`),
        domainsTitle: t(`${p}.domainsTitle`),
        assetsTitle: t(`${p}.assetsTitle`),
        reviewQueueTitle: t(`${p}.reviewQueueTitle`),
        versionHistoryTitle: t(`${p}.versionHistoryTitle`),
        smeTitle: t(`${p}.smeTitle`),
        lifecycleTitle: t(`${p}.lifecycleTitle`),
        searchTitle: t(`${p}.searchTitle`),
        insightsTitle: t(`${p}.insightsTitle`),
        recommendationsTitle: t(`${p}.recommendationsTitle`),
        executiveTitle: t(`${p}.executiveTitle`),
        reviewsTitle: t(`${p}.reviewsTitle`),
        emptySection: t(`${p}.emptySection`),
        dismiss: t(`${p}.dismiss`),
        accept: t(`${p}.accept`),
        scheduleReview: t(`${p}.scheduleReview`),
        completeReview: t(`${p}.completeReview`),
        markImproved: t(`${p}.markImproved`),
        generateReport: t(`${p}.generateReport`),
        exportSnapshot: t(`${p}.exportSnapshot`),
        humansDecide: t(`${p}.humansDecide`),
        privacyNote: t(`${p}.privacyNote`),
        usage: t(`${p}.usage`),
        daysSinceReview: t(`${p}.daysSinceReview`),
        domains: {
          support: t(`${p}.domains.support`),
          operational: t(`${p}.domains.operational`),
          technical: t(`${p}.domains.technical`),
          executive: t(`${p}.domains.executive`),
          learning: t(`${p}.domains.learning`),
        },
        healthLabels: {
          excellent: t(`${p}.healthLabels.excellent`),
          healthy: t(`${p}.healthLabels.healthy`),
          needs_review: t(`${p}.healthLabels.needs_review`),
          critical: t(`${p}.healthLabels.critical`),
        },
        lifecycleStages: {
          created: t(`${p}.lifecycleStages.created`),
          validated: t(`${p}.lifecycleStages.validated`),
          published: t(`${p}.lifecycleStages.published`),
          utilized: t(`${p}.lifecycleStages.utilized`),
          reviewed: t(`${p}.lifecycleStages.reviewed`),
          improved: t(`${p}.lifecycleStages.improved`),
          archived: t(`${p}.lifecycleStages.archived`),
        },
        reviewTypes: {
          aging: t(`${p}.reviewTypes.aging`),
          low_confidence: t(`${p}.reviewTypes.low_confidence`),
          frequently_questioned: t(`${p}.reviewTypes.frequently_questioned`),
          contradictory: t(`${p}.reviewTypes.contradictory`),
          underutilized: t(`${p}.reviewTypes.underutilized`),
        },
        validationTypes: {
          subject_matter: t(`${p}.validationTypes.subject_matter`),
          technical: t(`${p}.validationTypes.technical`),
          leadership: t(`${p}.validationTypes.leadership`),
          cross_functional: t(`${p}.validationTypes.cross_functional`),
        },
        metrics: {
          totalAssets: t(`${p}.metrics.totalAssets`),
          requiringReview: t(`${p}.metrics.requiringReview`),
          outdated: t(`${p}.metrics.outdated`),
          recentlyImproved: t(`${p}.metrics.recentlyImproved`),
          reviewCompletion: t(`${p}.metrics.reviewCompletion`),
          searchEffectiveness: t(`${p}.metrics.searchEffectiveness`),
          utilization: t(`${p}.metrics.utilization`),
          trust: t(`${p}.metrics.trust`),
        },
        executiveFields: {
          maturity: t(`${p}.executiveFields.maturity`),
          risks: t(`${p}.executiveFields.risks`),
          validation: t(`${p}.executiveFields.validation`),
          momentum: t(`${p}.executiveFields.momentum`),
        },
      }}
    />
  );
}

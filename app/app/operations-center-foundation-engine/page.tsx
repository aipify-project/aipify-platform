import { OperationsCenterFoundationEngineDashboardPanel } from "@/components/app/operations-center-foundation-engine";
import { getCustomerAppDictionaryForModule } from "@/lib/i18n/get-dictionary";
import { getLocale } from "@/lib/i18n/get-locale";
import { createTranslator } from "@/lib/i18n/translate";

export default async function OperationsCenterFoundationEnginePage() {
  const dict = await getCustomerAppDictionaryForModule(await getLocale(), "operationsCenterFoundationEngine");
  const t = createTranslator(dict);
  const p = "customerApp.operationsCenterFoundationEngine";

  const labelKeys = [
    "loading",
    "engineTitle",
    "summary",
    "principles",
    "sinceLastTime",
    "supportResolved",
    "kcUpdated",
    "tasksCompleted",
    "bottlenecks",
    "bellMoments",
    "recognitionMoments",
    "moduleOverviews",
    "viewModule",
    "urgentEvents",
    "openEvents",
    "pendingApprovals",
    "urgentActions",
    "openOperationalEvents",
    "noEvents",
    "acknowledge",
    "resolve",
    "working",
    "companionExamples",
    "successCriteria",
    "selfLoveConnection",
    "trustConnection",
  ] as const;

  const blueprintLabelKeys = [
    "blueprintObjectives",
    "organizationalConnections",
    "crossFunctionalObservations",
    "informationFlowVisibility",
    "bottleneckIdentification",
    "collaborationOpportunities",
    "leadershipInsights",
    "privacyPrinciples",
    "engagementSummary",
    "moduleOverviewBlocks",
    "openOperationsEvents",
    "urgentOperationsEvents",
    "tasksOverdue",
    "knowledgeOpenGaps",
    "blueprintSuccessCriteria",
    "visionPhrases",
    "blueprintSelfLoveConnection",
    "blueprintTrustConnection",
  ] as const;

  const phase75LabelKeys = [
    "phase75Title",
    "eocbpObjectives",
    "executiveDashboard",
    "dailyExecutiveBriefings",
    "executivePriorityCenter",
    "organizationalHealthOverview",
    "meetingDecisionContinuity",
    "strategicMomentumTracking",
    "eocbpCompanionGuidance",
    "eocbpEngagementSummary",
    "pendingLeadershipApprovals",
    "executiveOverviewSignals",
    "recognitionSignals",
    "eocbpSuccessCriteria",
    "eocbpVisionPhrases",
    "eocbpSelfLoveConnection",
    "eocbpTrustConnection",
  ] as const;

  const phase130LabelKeys = [
    "phase130Title",
    "eraCapstoneBanner",
    "eoccep130Objectives",
    "enterpriseCommandDashboard",
    "initiativeOrchestration",
    "executiveAlignment",
    "decisionExecution",
    "executiveCompanionNetwork",
    "organizationalHealthMonitoring",
    "executiveReviewCycles",
    "enterpriseMemoryIntegration",
    "companionLimitations",
    "enterpriseKnowledgeLibrary",
    "eoccep130EngagementSummary",
    "enterpriseDashboardDimensions",
    "companionNetworkCount",
    "eraCrossLinkCount",
    "eoccep130SuccessCriteria",
    "eoccep130VisionPhrases",
    "eoccep130SelfLoveConnection",
  ] as const;

  const labels = {
    ...Object.fromEntries(labelKeys.map((key) => [key, t(`${p}.${key}`)])),
    ...Object.fromEntries(blueprintLabelKeys.map((key) => [key, t(`${p}.blueprint.phase70.${key}`)])),
    ...Object.fromEntries(phase75LabelKeys.map((key) => [key, t(`${p}.blueprint.phase75.${key}`)])),
    ...Object.fromEntries(phase130LabelKeys.map((key) => [key, t(`${p}.blueprint.phase130.${key}`)])),
  } as Record<string, string>;

  return (
    <div className="mx-auto max-w-6xl space-y-6 p-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-gray-900">{t(`${p}.title`)}</h1>
        <p className="mt-2 text-gray-600">{t(`${p}.subtitle`)}</p>
      </div>
      <OperationsCenterFoundationEngineDashboardPanel labels={labels} />
    </div>
  );
}

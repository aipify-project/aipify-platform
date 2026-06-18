import { DecisionSupportCenterPanel } from "@/components/app/executive/DecisionSupportCenterPanel";
import { getCustomerAppDictionaryForSplits } from "@/lib/i18n/get-dictionary";
import { getLocale } from "@/lib/i18n/get-locale";
import { createTranslator } from "@/lib/i18n/translate";

export default async function ExecutiveDecisionSupportPage() {
  const locale = await getLocale();
  const dict = await getCustomerAppDictionaryForSplits(locale, ["dashboard"]);
  const t = createTranslator(dict);
  const p = "customerApp.executiveDecisionSupport";

  return (
    <DecisionSupportCenterPanel
      locale={locale}
      labels={{
        title: t(`${p}.title`),
        subtitle: t(`${p}.subtitle`),
        loading: t(`${p}.loading`),
        corePrinciple: t(`${p}.corePrinciple`),
        philosophyTitle: t(`${p}.philosophyTitle`),
        visionTitle: t(`${p}.visionTitle`),
        executiveLink: t(`${p}.executiveLink`),
        assistantDecisionsLink: t(`${p}.assistantDecisionsLink`),
        approvalCenterLink: t(`${p}.approvalCenterLink`),
        dashboardTitle: t(`${p}.dashboardTitle`),
        workspaceTitle: t(`${p}.workspaceTitle`),
        insightsTitle: t(`${p}.insightsTitle`),
        stakeholderTitle: t(`${p}.stakeholderTitle`),
        auditTitle: t(`${p}.auditTitle`),
        decidedTitle: t(`${p}.decidedTitle`),
        emptyDecisions: t(`${p}.emptyDecisions`),
        emptyInsights: t(`${p}.emptyInsights`),
        emptyStakeholder: t(`${p}.emptyStakeholder`),
        owner: t(`${p}.owner`),
        stakeholders: t(`${p}.stakeholders`),
        status: t(`${p}.status`),
        category: t(`${p}.category`),
        timeSensitivity: t(`${p}.timeSensitivity`),
        deadline: t(`${p}.deadline`),
        framework: t(`${p}.framework`),
        objectives: t(`${p}.objectives`),
        assumptions: t(`${p}.assumptions`),
        alternatives: t(`${p}.alternatives`),
        risks: t(`${p}.risks`),
        outcome: t(`${p}.outcome`),
        advanceStatus: t(`${p}.advanceStatus`),
        markDecided: t(`${p}.markDecided`),
        archive: t(`${p}.archive`),
        dismiss: t(`${p}.dismiss`),
        youDecide: t(`${p}.youDecide`),
        categories: {
          personal: t(`${p}.categories.personal`),
          business: t(`${p}.categories.business`),
          executive: t(`${p}.categories.executive`),
          community: t(`${p}.categories.community`),
        },
        states: {
          gathering_info: t(`${p}.states.gathering_info`),
          under_evaluation: t(`${p}.states.under_evaluation`),
          awaiting_approval: t(`${p}.states.awaiting_approval`),
          decided: t(`${p}.states.decided`),
          archived: t(`${p}.states.archived`),
        },
        frameworks: {
          pros_cons: t(`${p}.frameworks.pros_cons`),
          weighted_criteria: t(`${p}.frameworks.weighted_criteria`),
          scenario_analysis: t(`${p}.frameworks.scenario_analysis`),
          risk_review: t(`${p}.frameworks.risk_review`),
        },
        sensitivities: {
          low: t(`${p}.sensitivities.low`),
          medium: t(`${p}.sensitivities.medium`),
          high: t(`${p}.sensitivities.high`),
          critical: t(`${p}.sensitivities.critical`),
        },
        inputTypes: {
          comment: t(`${p}.inputTypes.comment`),
          rating: t(`${p}.inputTypes.rating`),
          risk_observation: t(`${p}.inputTypes.risk_observation`),
          alternative: t(`${p}.inputTypes.alternative`),
          consensus: t(`${p}.inputTypes.consensus`),
        },
        metrics: {
          active: t(`${p}.metrics.active`),
          pendingEval: t(`${p}.metrics.pendingEval`),
          awaitingApproval: t(`${p}.metrics.awaitingApproval`),
          stakeholderInputs: t(`${p}.metrics.stakeholderInputs`),
          highSensitivity: t(`${p}.metrics.highSensitivity`),
          decided: t(`${p}.metrics.decided`),
          frameworkAdoption: t(`${p}.metrics.frameworkAdoption`),
          confidence: t(`${p}.metrics.confidence`),
        },
        privacyNote: t(`${p}.privacyNote`),
      }}
    />
  );
}

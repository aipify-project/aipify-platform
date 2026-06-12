import { GovernancePolicyEngineDashboardPanel } from "@/components/app/governance-policy-engine";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import { getLocale } from "@/lib/i18n/get-locale";
import { createTranslator } from "@/lib/i18n/translate";

export default async function GovernancePolicyEnginePage() {
  const dict = await getDictionary(await getLocale(), ["customerApp"]);
  const t = createTranslator(dict);
  const p = "customerApp.governancePolicyEngine";
  const bp = `${p}.blueprint.phase67`;

  return (
    <div className="mx-auto max-w-6xl space-y-6 p-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-gray-900">{t(`${p}.title`)}</h1>
        <p className="mt-2 text-gray-600">{t(`${p}.subtitle`)}</p>
      </div>
      <GovernancePolicyEngineDashboardPanel
        labels={{
          loading: t(`${p}.loading`),
          governancePolicyEngine: t(`${p}.governancePolicyEngine`),
          secureAiActions: t(`${p}.secureAiActions`),
          auditAccountability: t(`${p}.auditAccountability`),
          qualityGuardian: t(`${p}.qualityGuardian`),
          approvals: t(`${p}.approvals`),
          activePolicies: t(`${p}.activePolicies`),
          openViolations: t(`${p}.openViolations`),
          pendingApprovals: t(`${p}.pendingApprovals`),
          autonomyLevel: t(`${p}.autonomyLevel`),
          activePoliciesList: t(`${p}.activePoliciesList`),
          runViolationScan: t(`${p}.runViolationScan`),
          noPolicies: t(`${p}.noPolicies`),
          scheduleReview: t(`${p}.scheduleReview`),
          policyViolations: t(`${p}.policyViolations`),
          noViolations: t(`${p}.noViolations`),
          acknowledge: t(`${p}.acknowledge`),
          upcomingReviews: t(`${p}.upcomingReviews`),
          noReviews: t(`${p}.noReviews`),
          pendingApprovalsList: t(`${p}.pendingApprovalsList`),
          noPendingApprovals: t(`${p}.noPendingApprovals`),
          recommendations: t(`${p}.recommendations`),
          principles: t(`${p}.principles`),
          categoryAiAutonomy: t(`${p}.categoryAiAutonomy`),
          categoryApproval: t(`${p}.categoryApproval`),
          categorySupport: t(`${p}.categorySupport`),
          categoryAccess: t(`${p}.categoryAccess`),
          categoryKnowledge: t(`${p}.categoryKnowledge`),
          categoryIntegration: t(`${p}.categoryIntegration`),
          categoryRetention: t(`${p}.categoryRetention`),
          blueprintObjectives: t(`${bp}.objectives`),
          boardPreparation: t(`${bp}.boardPreparation`),
          boardMeetingSupport: t(`${bp}.boardMeetingSupport`),
          strategicOversight: t(`${bp}.strategicOversight`),
          riskAwareness: t(`${bp}.riskAwareness`),
          blueprintGovernancePrinciples: t(`${bp}.governancePrinciples`),
          decisionContinuity: t(`${bp}.decisionContinuity`),
          selfLoveConnection: t(`${bp}.selfLoveConnection`),
          trustConnection: t(`${bp}.trustConnection`),
          dogfooding: t(`${bp}.dogfooding`),
          engagementSummary: t(`${bp}.engagementSummary`),
          scheduledReviews: t(`${bp}.scheduledReviews`),
          overdueReviews: t(`${bp}.overdueReviews`),
          successCriteria: t(`${bp}.successCriteria`),
          criterionMet: t(`${bp}.criterionMet`),
          criterionPending: t(`${bp}.criterionPending`),
        }}
      />
    </div>
  );
}

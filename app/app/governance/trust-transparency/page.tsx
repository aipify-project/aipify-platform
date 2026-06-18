import { TrustTransparencyPanel } from "@/components/app/governance/TrustTransparencyPanel";
import { getCustomerAppDictionaryForSplits } from "@/lib/i18n/get-dictionary";
import { getLocale } from "@/lib/i18n/get-locale";
import { createTranslator } from "@/lib/i18n/translate";

export default async function TrustTransparencyPage() {
  const locale = await getLocale();
  const dict = await getCustomerAppDictionaryForSplits(locale, ["settings"]);
  const t = createTranslator(dict);
  const p = "customerApp.trustTransparency";

  return (
    <TrustTransparencyPanel
      locale={locale}
      labels={{
        title: t(`${p}.title`),
        subtitle: t(`${p}.subtitle`),
        loading: t(`${p}.loading`),
        corePrinciple: t(`${p}.corePrinciple`),
        visionTitle: t(`${p}.visionTitle`),
        governanceLink: t(`${p}.governanceLink`),
        governanceTrustLink: t(`${p}.governanceTrustLink`),
        approvalCenterLink: t(`${p}.approvalCenterLink`),
        permissionsAccessLink: t(`${p}.permissionsAccessLink`),
        dashboardTitle: t(`${p}.dashboardTitle`),
        trustIndicatorsTitle: t(`${p}.trustIndicatorsTitle`),
        sections: {
          activity: t(`${p}.sections.activity`),
          decision: t(`${p}.sections.decision`),
          permission: t(`${p}.sections.permission`),
          approval: t(`${p}.sections.approval`),
          selfHealing: t(`${p}.sections.selfHealing`),
          recommendation: t(`${p}.sections.recommendation`),
          audit: t(`${p}.sections.audit`),
        },
        emptySection: t(`${p}.emptySection`),
        action: t(`${p}.action`),
        why: t(`${p}.why`),
        permissionsUsed: t(`${p}.permissionsUsed`),
        riskLevel: t(`${p}.riskLevel`),
        userControl: t(`${p}.userControl`),
        infoConsidered: t(`${p}.infoConsidered`),
        alternatives: t(`${p}.alternatives`),
        ifNothingDone: t(`${p}.ifNothingDone`),
        companion: t(`${p}.companion`),
        approvalRequired: t(`${p}.approvalRequired`),
        outcome: t(`${p}.outcome`),
        whatFailed: t(`${p}.whatFailed`),
        aipifyAttempt: t(`${p}.aipifyAttempt`),
        recoverySucceeded: t(`${p}.recoverySucceeded`),
        recoveryFailed: t(`${p}.recoveryFailed`),
        downtimePrevented: t(`${p}.downtimePrevented`),
        manualReview: t(`${p}.manualReview`),
        governanceRecommendationsTitle: t(`${p}.governanceRecommendationsTitle`),
        emptyRecommendations: t(`${p}.emptyRecommendations`),
        dismiss: t(`${p}.dismiss`),
        requestReview: t(`${p}.requestReview`),
        disableCategory: t(`${p}.disableCategory`),
        riskLevels: {
          low: t(`${p}.riskLevels.low`),
          moderate: t(`${p}.riskLevels.moderate`),
          elevated: t(`${p}.riskLevels.elevated`),
          high: t(`${p}.riskLevels.high`),
        },
        eventTypes: {
          recommendation_issued: t(`${p}.eventTypes.recommendation_issued`),
          approval_completed: t(`${p}.eventTypes.approval_completed`),
          action_executed: t(`${p}.eventTypes.action_executed`),
          self_healing: t(`${p}.eventTypes.self_healing`),
          permission_request: t(`${p}.eventTypes.permission_request`),
          governance_override: t(`${p}.eventTypes.governance_override`),
          view_center: t(`${p}.eventTypes.view_center`),
        },
        metrics: {
          actionsMonth: t(`${p}.metrics.actionsMonth`),
          recommendations: t(`${p}.metrics.recommendations`),
          approved: t(`${p}.metrics.approved`),
          rejected: t(`${p}.metrics.rejected`),
          selfHealing: t(`${p}.metrics.selfHealing`),
          compliance: t(`${p}.metrics.compliance`),
        },
        indicators: {
          governance: t(`${p}.indicators.governance`),
          permissionHygiene: t(`${p}.indicators.permissionHygiene`),
          approvalResponsiveness: t(`${p}.indicators.approvalResponsiveness`),
          transparency: t(`${p}.indicators.transparency`),
          selfHealing: t(`${p}.indicators.selfHealing`),
        },
        privacyNote: t(`${p}.privacyNote`),
      }}
    />
  );
}

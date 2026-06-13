import { PermissionAccessGovernancePanel } from "@/components/app/governance/PermissionAccessGovernancePanel";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import { getLocale } from "@/lib/i18n/get-locale";
import { createTranslator } from "@/lib/i18n/translate";

export default async function PermissionAccessGovernancePage() {
  const locale = await getLocale();
  const dict = await getDictionary(locale, ["customerApp"]);
  const t = createTranslator(dict);
  const p = "customerApp.permissionAccessGovernance";

  return (
    <PermissionAccessGovernancePanel
      locale={locale}
      labels={{
        title: t(`${p}.title`),
        subtitle: t(`${p}.subtitle`),
        loading: t(`${p}.loading`),
        corePrinciple: t(`${p}.corePrinciple`),
        visionTitle: t(`${p}.visionTitle`),
        governanceLink: t(`${p}.governanceLink`),
        identityAccessLink: t(`${p}.identityAccessLink`),
        approvalCenterLink: t(`${p}.approvalCenterLink`),
        dashboardTitle: t(`${p}.dashboardTitle`),
        activeTitle: t(`${p}.activeTitle`),
        pendingRequestsTitle: t(`${p}.pendingRequestsTitle`),
        highImpactTitle: t(`${p}.highImpactTitle`),
        revokedTitle: t(`${p}.revokedTitle`),
        companionTitle: t(`${p}.companionTitle`),
        historyTitle: t(`${p}.historyTitle`),
        recommendationsTitle: t(`${p}.recommendationsTitle`),
        executiveTitle: t(`${p}.executiveTitle`),
        emptyActive: t(`${p}.emptyActive`),
        emptyPending: t(`${p}.emptyPending`),
        emptyRecommendations: t(`${p}.emptyRecommendations`),
        resource: t(`${p}.resource`),
        permission: t(`${p}.permission`),
        purpose: t(`${p}.purpose`),
        riskLevel: t(`${p}.riskLevel`),
        grantedBy: t(`${p}.grantedBy`),
        grantedOn: t(`${p}.grantedOn`),
        expires: t(`${p}.expires`),
        whatCanDo: t(`${p}.whatCanDo`),
        whatCannotDo: t(`${p}.whatCannotDo`),
        revokeInstructions: t(`${p}.revokeInstructions`),
        whyNeeded: t(`${p}.whyNeeded`),
        revoke: t(`${p}.revoke`),
        downgrade: t(`${p}.downgrade`),
        approve: t(`${p}.approve`),
        deny: t(`${p}.deny`),
        dismiss: t(`${p}.dismiss`),
        categories: {
          data_access: t(`${p}.categories.data_access`),
          action_access: t(`${p}.categories.action_access`),
          business_access: t(`${p}.categories.business_access`),
          community_access: t(`${p}.categories.community_access`),
          companion_access: t(`${p}.categories.companion_access`),
        },
        riskLevels: {
          low: t(`${p}.riskLevels.low`),
          moderate: t(`${p}.riskLevels.moderate`),
          elevated: t(`${p}.riskLevels.elevated`),
          high: t(`${p}.riskLevels.high`),
        },
        permissionLevels: {
          "1": t(`${p}.permissionLevels.1`),
          "2": t(`${p}.permissionLevels.2`),
          "3": t(`${p}.permissionLevels.3`),
          "4": t(`${p}.permissionLevels.4`),
        },
        expirationTypes: {
          permanent: t(`${p}.expirationTypes.permanent`),
          temporary: t(`${p}.expirationTypes.temporary`),
          project: t(`${p}.expirationTypes.project`),
          time_limited: t(`${p}.expirationTypes.time_limited`),
        },
        eventTypes: {
          granted: t(`${p}.eventTypes.granted`),
          revoked: t(`${p}.eventTypes.revoked`),
          downgraded: t(`${p}.eventTypes.downgraded`),
          expired: t(`${p}.eventTypes.expired`),
          reviewed: t(`${p}.eventTypes.reviewed`),
          failed_attempt: t(`${p}.eventTypes.failed_attempt`),
        },
        metrics: {
          active: t(`${p}.metrics.active`),
          recentGranted: t(`${p}.metrics.recentGranted`),
          highImpact: t(`${p}.metrics.highImpact`),
          revoked: t(`${p}.metrics.revoked`),
          pendingRequests: t(`${p}.metrics.pendingRequests`),
          companion: t(`${p}.metrics.companion`),
          compliance: t(`${p}.metrics.compliance`),
          avgReview: t(`${p}.metrics.avgReview`),
        },
        privacyNote: t(`${p}.privacyNote`),
      }}
    />
  );
}

import { IdentityPermissionsDashboardPanel } from "@/components/app/identity-permissions";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import { getLocale } from "@/lib/i18n/get-locale";
import { createTranslator } from "@/lib/i18n/translate";

export default async function IdentityPermissionsPage() {
  const dict = await getDictionary(await getLocale(), ["customerApp"]);
  const t = createTranslator(dict);
  const p = "customerApp.identityPermissions";

  return (
    <div className="mx-auto max-w-6xl space-y-6 p-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-gray-900">{t(`${p}.title`)}</h1>
        <p className="mt-2 text-gray-600">{t(`${p}.subtitle`)}</p>
      </div>
      <IdentityPermissionsDashboardPanel
        labels={{
          loading: t(`${p}.loading`),
          engineTitle: t(`${p}.engineTitle`),
          aipifyCore: t(`${p}.aipifyCore`),
          multiTenant: t(`${p}.multiTenant`),
          organizationWorkspace: t(`${p}.organizationWorkspace`),
          team: t(`${p}.team`),
          approvals: t(`${p}.approvals`),
          identityOverview: t(`${p}.identityOverview`),
          role: t(`${p}.role`),
          activeUsers: t(`${p}.activeUsers`),
          pendingInvitations: t(`${p}.pendingInvitations`),
          pendingApprovals: t(`${p}.pendingApprovals`),
          suspendedUsers: t(`${p}.suspendedUsers`),
          roleDistribution: t(`${p}.roleDistribution`),
          approvalQueue: t(`${p}.approvalQueue`),
          approve: t(`${p}.approve`),
          reject: t(`${p}.reject`),
          aiRiskClassification: t(`${p}.aiRiskClassification`),
          autoAllowed: t(`${p}.autoAllowed`),
          approvalRequired: t(`${p}.approvalRequired`),
          yourPermissions: t(`${p}.yourPermissions`),
          mfaReadiness: t(`${p}.mfaReadiness`),
          recentAccessEvents: t(`${p}.recentAccessEvents`),
          successCriteria: t(`${p}.successCriteria`),
          defaultRoles: t(`${p}.defaultRoles`),
          scaffold: t(`${p}.scaffold`),
          permissionCategories: t(`${p}.permissionCategories`),
          leastPrivilege: t(`${p}.leastPrivilege`),
          accessReviews: t(`${p}.accessReviews`),
          accessReviewsNote: t(`${p}.accessReviewsNote`),
          pendingAccessReviews: t(`${p}.pendingAccessReviews`),
          scheduledReviews: t(`${p}.scheduledReviews`),
          privilegedAccountsOnly: t(`${p}.privilegedAccountsOnly`),
          notifyOwners: t(`${p}.notifyOwners`),
          accessReviewSaveFailed: t(`${p}.accessReviewSaveFailed`),
          companionPermissionPrefs: t(`${p}.companionPermissionPrefs`),
          companionPermissionPrefsNote: t(`${p}.companionPermissionPrefsNote`),
          companionViewDefault: t(`${p}.companionViewDefault`),
          companionManageRestricted: t(`${p}.companionManageRestricted`),
          selfLoveBoundary: t(`${p}.selfLoveBoundary`),
          companionPrefsSaveFailed: t(`${p}.companionPrefsSaveFailed`),
          auditRequirements: t(`${p}.auditRequirements`),
          blueprintLinks: t(`${p}.blueprintLinks`),
        }}
      />
    </div>
  );
}

import { AipifyHostsTeamCenterDashboardPanel } from "@/components/app/aipify-hosts-team-center";
import { getCustomerAppDictionaryForModule } from "@/lib/i18n/get-dictionary";
import { getLocale } from "@/lib/i18n/get-locale";
import { createTranslator } from "@/lib/i18n/translate";

export default async function AipifyHostsTeamPage() {
  const dict = await getCustomerAppDictionaryForModule(await getLocale(), "aipifyHostsTeamCenter");
  const t = createTranslator(dict);
  const p = "customerApp.aipifyHostsTeamCenter";

  const roleKeys = ["owner", "property_manager", "cleaner", "maintenance", "support"] as const;
  const invStatusKeys = ["pending", "accepted", "expired", "revoked"] as const;
  const permKeys = [
    "full_access", "billing_access", "team_management", "property_management", "approval_rights",
    "manage_assigned_properties", "manage_operations", "assign_tasks", "view_reports",
    "view_assigned_tasks", "update_cleaning_status", "report_issues", "upload_completion_evidence",
    "view_work_orders", "update_maintenance_status", "report_completed_work",
    "view_guest_requests", "update_request_statuses", "escalate_incidents",
  ] as const;
  const activityKeys = ["user_invited", "role_changed", "permission_updated", "user_removed", "dashboard_view"] as const;

  const labels: Record<string, string> = {
    loading: t(`${p}.loading`),
    errorTitle: t(`${p}.errorTitle`),
    errorMessage: t(`${p}.errorMessage`),
    retry: t(`${p}.retry`),
    backToHosts: t(`${p}.backToHosts`),
    governanceNote: t(`${p}.governanceNote`),
    memberName: t(`${p}.memberName`),
    email: t(`${p}.email`),
    role: t(`${p}.role`),
    propertiesAssigned: t(`${p}.propertiesAssigned`),
    allProperties: t(`${p}.allProperties`),
    actions: t(`${p}.actions`),
    manageMember: t(`${p}.manageMember`),
    removeMember: t(`${p}.removeMember`),
    emptyMembersTitle: t(`${p}.emptyMembersTitle`),
    emptyMembersMessage: t(`${p}.emptyMembersMessage`),
    permissions: t(`${p}.permissions`),
    sendInvitation: t(`${p}.sendInvitation`),
    emailPlaceholder: t(`${p}.emailPlaceholder`),
    sendInvite: t(`${p}.sendInvite`),
    invitationStatus: t(`${p}.invitationStatus`),
    expiresAt: t(`${p}.expiresAt`),
    revokeInvitation: t(`${p}.revokeInvitation`),
    emptyInvitationsTitle: t(`${p}.emptyInvitationsTitle`),
    emptyInvitationsMessage: t(`${p}.emptyInvitationsMessage`),
    emptyActivityMessage: t(`${p}.emptyActivityMessage`),
    manageMemberTitle: t(`${p}.manageMemberTitle`),
    close: t(`${p}.close`),
    changeRole: t(`${p}.changeRole`),
    assignProperties: t(`${p}.assignProperties`),
    actionRecorded: t(`${p}.actionRecorded`),
    actionFailed: t(`${p}.actionFailed`),
  };

  for (const key of roleKeys) labels[`role_${key}`] = t(`${p}.roles.${key}`);
  for (const key of invStatusKeys) labels[`invstatus_${key}`] = t(`${p}.invitationStatuses.${key}`);
  for (const key of permKeys) labels[`perm_${key}`] = t(`${p}.permissionsCatalog.${key}`);
  for (const key of activityKeys) labels[`activity_${key}`] = t(`${p}.activityTypes.${key}`);

  return (
    <div className="mx-auto max-w-6xl space-y-6 p-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-gray-900">{t(`${p}.title`)}</h1>
        <p className="mt-2 text-gray-600">{t(`${p}.subtitle`)}</p>
      </div>
      <AipifyHostsTeamCenterDashboardPanel labels={labels} />
    </div>
  );
}

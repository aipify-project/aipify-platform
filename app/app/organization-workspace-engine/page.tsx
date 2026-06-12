import { OrganizationWorkspaceEngineDashboardPanel } from "@/components/app/organization-workspace-engine";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import { getLocale } from "@/lib/i18n/get-locale";
import { createTranslator } from "@/lib/i18n/translate";

export default async function OrganizationWorkspaceEnginePage() {
  const dict = await getDictionary(await getLocale(), ["customerApp"]);
  const t = createTranslator(dict);
  const p = "customerApp.organizationWorkspaceEngine";

  return (
    <div className="mx-auto max-w-6xl space-y-6 p-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-gray-900">{t(`${p}.title`)}</h1>
        <p className="mt-2 text-gray-600">{t(`${p}.subtitle`)}</p>
      </div>
      <OrganizationWorkspaceEngineDashboardPanel
        labels={{
          loading: t(`${p}.loading`),
          engineTitle: t(`${p}.engineTitle`),
          distinctionNote: t(`${p}.distinctionNote`),
          multiTenant: t(`${p}.multiTenant`),
          identityPermissions: t(`${p}.identityPermissions`),
          orgStructure: t(`${p}.orgStructure`),
          hierarchyOrg: t(`${p}.hierarchyOrg`),
          hierarchyWorkspace: t(`${p}.hierarchyWorkspace`),
          hierarchyUsers: t(`${p}.hierarchyUsers`),
          hierarchyRoles: t(`${p}.hierarchyRoles`),
          totalWorkspaces: t(`${p}.totalWorkspaces`),
          activeWorkspaces: t(`${p}.activeWorkspaces`),
          totalMembers: t(`${p}.totalMembers`),
          customRoles: t(`${p}.customRoles`),
          workspaces: t(`${p}.workspaces`),
          noWorkspaces: t(`${p}.noWorkspaces`),
          members: t(`${p}.members`),
          current: t(`${p}.current`),
          switchWorkspace: t(`${p}.switchWorkspace`),
          switching: t(`${p}.switching`),
          switchFailed: t(`${p}.switchFailed`),
          createWorkspace: t(`${p}.createWorkspace`),
          workspaceNamePlaceholder: t(`${p}.workspaceNamePlaceholder`),
          workspaceSlugPlaceholder: t(`${p}.workspaceSlugPlaceholder`),
          createWorkspaceButton: t(`${p}.createWorkspaceButton`),
          creating: t(`${p}.creating`),
          createFailed: t(`${p}.createFailed`),
          roleSummary: t(`${p}.roleSummary`),
          noRoleData: t(`${p}.noRoleData`),
          customRolesSection: t(`${p}.customRolesSection`),
          noCustomRoles: t(`${p}.noCustomRoles`),
          roleNamePlaceholder: t(`${p}.roleNamePlaceholder`),
          createCustomRole: t(`${p}.createCustomRole`),
          roleCreateFailed: t(`${p}.roleCreateFailed`),
          integrationLinks: t(`${p}.integrationLinks`),
          principles: t(`${p}.principles`),
          exportSummary: t(`${p}.exportSummary`),
          exporting: t(`${p}.exporting`),
          exportFailed: t(`${p}.exportFailed`),
        }}
      />
    </div>
  );
}

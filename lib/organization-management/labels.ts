import type { Translator } from "@/lib/i18n/translate";

export function buildOrganizationManagementLabels(t: Translator) {
  const p = "customerApp.organizationManagement";
  return {
    title: t(`${p}.title`),
    subtitle: t(`${p}.subtitle`),
    principle: t(`${p}.principle`),
    accessDenied: t(`${p}.accessDenied`),
    overview: t(`${p}.overview`),
    departments: t(`${p}.departments`),
    teams: t(`${p}.teams`),
    locations: t(`${p}.locations`),
    managers: t(`${p}.managers`),
    organizationChart: t(`${p}.organizationChart`),
    policies: t(`${p}.policies`),
    reports: t(`${p}.reports`),
    employees: t(`${p}.employees`),
    activeEmployees: t(`${p}.activeEmployees`),
    createDepartment: t(`${p}.createDepartment`),
    createTeam: t(`${p}.createTeam`),
    createLocation: t(`${p}.createLocation`),
    departmentName: t(`${p}.departmentName`),
    teamName: t(`${p}.teamName`),
    locationName: t(`${p}.locationName`),
    save: t(`${p}.save`),
    search: t(`${p}.search`),
    searchPlaceholder: t(`${p}.searchPlaceholder`),
    noDepartments: t(`${p}.noDepartments`),
    noTeams: t(`${p}.noTeams`),
    noLocations: t(`${p}.noLocations`),
    assignedDomains: t(`${p}.assignedDomains`),
    assignedPacks: t(`${p}.assignedPacks`),
    openTasks: t(`${p}.openTasks`),
    employeesLink: t(`${p}.employeesLink`),
    domainsLink: t(`${p}.domainsLink`),
    auditLog: t(`${p}.auditLog`),
    customFields: t(`${p}.customFields`),
    departmentSize: t(`${p}.departmentSize`),
    packUsage: t(`${p}.packUsage`),
  };
}

export type OrganizationManagementLabels = ReturnType<typeof buildOrganizationManagementLabels>;

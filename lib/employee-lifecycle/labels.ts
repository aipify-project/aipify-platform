import type { Translator } from "@/lib/i18n/translate";

export function buildEmployeeLifecycleLabels(t: Translator) {
  const p = "customerApp.employeeLifecycle";
  return {
    title: t(`${p}.title`),
    subtitle: t(`${p}.subtitle`),
    principle: t(`${p}.principle`),
    accessDenied: t(`${p}.accessDenied`),
    overview: t(`${p}.overview`),
    employees: t(`${p}.employees`),
    invitations: t(`${p}.invitations`),
    onboarding: t(`${p}.onboarding`),
    roles: t(`${p}.roles`),
    departments: t(`${p}.departments`),
    managers: t(`${p}.managers`),
    documents: t(`${p}.documents`),
    offboarding: t(`${p}.offboarding`),
    reports: t(`${p}.reports`),
    training: t(`${p}.training`),
    totalEmployees: t(`${p}.totalEmployees`),
    activeEmployees: t(`${p}.activeEmployees`),
    onboardingActive: t(`${p}.onboardingActive`),
    pendingInvitations: t(`${p}.pendingInvitations`),
    offboardingActive: t(`${p}.offboardingActive`),
    inviteEmployee: t(`${p}.inviteEmployee`),
    employeeName: t(`${p}.employeeName`),
    employeeEmail: t(`${p}.employeeEmail`),
    startOnboarding: t(`${p}.startOnboarding`),
    startOffboarding: t(`${p}.startOffboarding`),
    completeStep: t(`${p}.completeStep`),
    recordTraining: t(`${p}.recordTraining`),
    noEmployees: t(`${p}.noEmployees`),
    noEmployeesHint: t(`${p}.noEmployeesHint`),
    auditLog: t(`${p}.auditLog`),
    onboardingLink: t(`${p}.onboardingLink`),
    offboardingLink: t(`${p}.offboardingLink`),
    backToEmployees: t(`${p}.backToEmployees`),
    onboardingTitle: t(`${p}.onboardingTitle`),
    offboardingTitle: t(`${p}.offboardingTitle`),
    templates: t(`${p}.templates`),
    checklist: t(`${p}.checklist`),
    completeOffboarding: t(`${p}.completeOffboarding`),
    assetsAssigned: t(`${p}.assetsAssigned`),
    save: t(`${p}.save`),
  };
}

export type EmployeeLifecycleLabels = ReturnType<typeof buildEmployeeLifecycleLabels>;

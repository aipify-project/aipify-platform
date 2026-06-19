import type { Translator } from "@/lib/i18n/translate";
import type { AiWorkforceLabels, AiWorkforceTab } from "./types";
import { EMPLOYEE_STATUSES, GOVERNANCE_SEVERITIES, PERFORMANCE_STATUSES } from "./constants";

const TAB_KEYS: AiWorkforceTab[] = [
  "overview", "employees", "departments", "assignments", "performance",
  "training", "governance", "companion", "executive", "reports",
];

export function buildAiWorkforceLabels(t: Translator): AiWorkforceLabels {
  const p = "aiWorkforceOperations";

  return {
    title: t(`${p}.title`),
    subtitle: t(`${p}.subtitle`),
    loading: t(`${p}.loading`),
    back: t(`${p}.back`),
    principle: t(`${p}.principle`),
    supervisorRule: t(`${p}.supervisorRule`),
    emptyState: t(`${p}.emptyState`),
    accessDenied: t(`${p}.accessDenied`),
    tabs: Object.fromEntries(
      TAB_KEYS.map((key) => [key, t(`${p}.tabs.${key}`)])
    ) as AiWorkforceLabels["tabs"],
    overview: {
      digitalEmployees: t(`${p}.overview.digitalEmployees`),
      activeEmployees: t(`${p}.overview.activeEmployees`),
      departments: t(`${p}.overview.departments`),
      assignments: t(`${p}.overview.assignments`),
      trainingInProgress: t(`${p}.overview.trainingInProgress`),
      governanceOpen: t(`${p}.overview.governanceOpen`),
      avgPerformanceScore: t(`${p}.overview.avgPerformanceScore`),
      hybridTeams: t(`${p}.overview.hybridTeams`),
    },
    actions: {
      createEmployee: t(`${p}.actions.createEmployee`),
      createAssignment: t(`${p}.actions.createAssignment`),
      completeTraining: t(`${p}.actions.completeTraining`),
      updatePerformance: t(`${p}.actions.updatePerformance`),
      disableEmployee: t(`${p}.actions.disableEmployee`),
      openEmployees: t(`${p}.actions.openEmployees`),
      openTraining: t(`${p}.actions.openTraining`),
      openLegacyWorkforce: t(`${p}.actions.openLegacyWorkforce`),
    },
    employeeStatuses: Object.fromEntries(
      EMPLOYEE_STATUSES.map((key) => [key, t(`${p}.employeeStatuses.${key}`)])
    ) as AiWorkforceLabels["employeeStatuses"],
    performanceStatuses: Object.fromEntries(
      PERFORMANCE_STATUSES.map((key) => [key, t(`${p}.performanceStatuses.${key}`)])
    ) as AiWorkforceLabels["performanceStatuses"],
    governanceSeverities: Object.fromEntries(
      GOVERNANCE_SEVERITIES.map((key) => [key, t(`${p}.governanceSeverities.${key}`)])
    ) as AiWorkforceLabels["governanceSeverities"],
    employeesPage: {
      title: t(`${p}.employeesPage.title`),
      subtitle: t(`${p}.employeesPage.subtitle`),
    },
    trainingPage: {
      title: t(`${p}.trainingPage.title`),
      subtitle: t(`${p}.trainingPage.subtitle`),
    },
  };
}

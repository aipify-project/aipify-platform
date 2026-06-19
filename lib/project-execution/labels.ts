import type { Translator } from "@/lib/i18n/translate";

export function buildProjectExecutionLabels(t: Translator) {
  const p = "customerApp.projectExecution";
  return {
    title: t(`${p}.title`),
    subtitle: t(`${p}.subtitle`),
    principle: t(`${p}.principle`),
    accessDenied: t(`${p}.accessDenied`),
    overview: t(`${p}.overview`),
    activeProjects: t(`${p}.activeProjects`),
    planning: t(`${p}.planning`),
    milestones: t(`${p}.milestones`),
    deliverables: t(`${p}.deliverables`),
    resources: t(`${p}.resources`),
    budgets: t(`${p}.budgets`),
    risks: t(`${p}.risks`),
    reports: t(`${p}.reports`),
    totalProjects: t(`${p}.totalProjects`),
    activeCount: t(`${p}.activeCount`),
    atRisk: t(`${p}.atRisk`),
    overdueMilestones: t(`${p}.overdueMilestones`),
    openRisks: t(`${p}.openRisks`),
    createProject: t(`${p}.createProject`),
    projectName: t(`${p}.projectName`),
    projectDescription: t(`${p}.projectDescription`),
    createMilestone: t(`${p}.createMilestone`),
    completeMilestone: t(`${p}.completeMilestone`),
    approveDeliverable: t(`${p}.approveDeliverable`),
    closeProject: t(`${p}.closeProject`),
    addRisk: t(`${p}.addRisk`),
    fromTemplate: t(`${p}.fromTemplate`),
    noProjects: t(`${p}.noProjects`),
    noProjectsHint: t(`${p}.noProjectsHint`),
    auditLog: t(`${p}.auditLog`),
    completionPercent: t(`${p}.completionPercent`),
    budgetRemaining: t(`${p}.budgetRemaining`),
    save: t(`${p}.save`),
  };
}

export type ProjectExecutionLabels = ReturnType<typeof buildProjectExecutionLabels>;

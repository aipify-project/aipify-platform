import type { Translator } from "@/lib/i18n/translate";

export function buildServiceCaseLabels(t: Translator) {
  const p = "customerApp.serviceCase";
  return {
    title: t(`${p}.title`),
    subtitle: t(`${p}.subtitle`),
    principle: t(`${p}.principle`),
    accessDenied: t(`${p}.accessDenied`),
    overview: t(`${p}.overview`),
    openCases: t(`${p}.openCases`),
    assignedCases: t(`${p}.assignedCases`),
    escalations: t(`${p}.escalations`),
    completedCases: t(`${p}.completedCases`),
    sla: t(`${p}.sla`),
    customerSuccess: t(`${p}.customerSuccess`),
    reports: t(`${p}.reports`),
    totalCases: t(`${p}.totalCases`),
    openCasesCount: t(`${p}.openCasesCount`),
    escalated: t(`${p}.escalated`),
    overdue: t(`${p}.overdue`),
    slaAtRisk: t(`${p}.slaAtRisk`),
    createCase: t(`${p}.createCase`),
    caseTitle: t(`${p}.caseTitle`),
    caseDescription: t(`${p}.caseDescription`),
    assignCase: t(`${p}.assignCase`),
    escalateCase: t(`${p}.escalateCase`),
    resolveCase: t(`${p}.resolveCase`),
    closeCase: t(`${p}.closeCase`),
    noCases: t(`${p}.noCases`),
    noCasesHint: t(`${p}.noCasesHint`),
    auditLog: t(`${p}.auditLog`),
    customerSuccessLink: t(`${p}.customerSuccessLink`),
    backToCases: t(`${p}.backToCases`),
    customerSuccessTitle: t(`${p}.customerSuccessTitle`),
    customerHealth: t(`${p}.customerHealth`),
    successActions: t(`${p}.successActions`),
    feedback: t(`${p}.feedback`),
    healthy: t(`${p}.healthy`),
    stable: t(`${p}.stable`),
    atRisk: t(`${p}.atRisk`),
    critical: t(`${p}.critical`),
    save: t(`${p}.save`),
  };
}

export type ServiceCaseLabels = ReturnType<typeof buildServiceCaseLabels>;

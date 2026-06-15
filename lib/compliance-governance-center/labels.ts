import type { Translator } from "@/lib/i18n/translate";
import {
  ALERT_TYPES,
  GOVERNANCE_MODULES,
  POLICY_CATEGORIES,
  POLICY_STATUSES,
  RETENTION_DATA_TYPES,
  RISK_LEVELS,
  ACCESS_RECORD_TYPES,
} from "./constants";
import type { ComplianceGovernanceCenterLabels } from "./types";

export function buildComplianceGovernanceCenterLabels(t: Translator): ComplianceGovernanceCenterLabels {
  const p = "platform.complianceGovernanceCenter";

  return {
    title: t(`${p}.title`),
    subtitle: t(`${p}.subtitle`),
    loading: t(`${p}.loading`),
    back: t(`${p}.back`),
    principle: t(`${p}.principle`),
    emptyState: t(`${p}.emptyState`),
    sections: {
      overview: t(`${p}.sections.overview`),
      modules: t(`${p}.sections.modules`),
      policies: t(`${p}.sections.policies`),
      approvals: t(`${p}.sections.approvals`),
      retention: t(`${p}.sections.retention`),
      access: t(`${p}.sections.access`),
      alerts: t(`${p}.sections.alerts`),
      exceptions: t(`${p}.sections.exceptions`),
      reports: t(`${p}.sections.reports`),
      audit: t(`${p}.sections.audit`),
      filters: t(`${p}.sections.filters`),
      createPolicy: t(`${p}.sections.createPolicy`),
    },
    overview: {
      complianceAlerts: t(`${p}.overview.complianceAlerts`),
      policiesRequiringReview: t(`${p}.overview.policiesRequiringReview`),
      pendingApprovals: t(`${p}.overview.pendingApprovals`),
      governanceExceptions: t(`${p}.overview.governanceExceptions`),
      auditFindings: t(`${p}.overview.auditFindings`),
      highRiskActivities: t(`${p}.overview.highRiskActivities`),
    },
    table: {
      policyName: t(`${p}.table.policyName`),
      category: t(`${p}.table.category`),
      owner: t(`${p}.table.owner`),
      effectiveDate: t(`${p}.table.effectiveDate`),
      reviewDate: t(`${p}.table.reviewDate`),
      status: t(`${p}.table.status`),
      riskLevel: t(`${p}.table.riskLevel`),
      request: t(`${p}.table.request`),
      submittedBy: t(`${p}.table.submittedBy`),
      priority: t(`${p}.table.priority`),
      dueDate: t(`${p}.table.dueDate`),
      approver: t(`${p}.table.approver`),
      actions: t(`${p}.table.actions`),
      dataType: t(`${p}.table.dataType`),
      retentionDays: t(`${p}.table.retentionDays`),
      subject: t(`${p}.table.subject`),
      detail: t(`${p}.table.detail`),
      message: t(`${p}.table.message`),
      severity: t(`${p}.table.severity`),
      title: t(`${p}.table.title`),
      expiresAt: t(`${p}.table.expiresAt`),
    },
    categories: Object.fromEntries(
      POLICY_CATEGORIES.map((key) => [key, t(`${p}.categories.${key}`)])
    ) as ComplianceGovernanceCenterLabels["categories"],
    policyStatuses: Object.fromEntries(
      POLICY_STATUSES.map((key) => [key, t(`${p}.policyStatuses.${key}`)])
    ) as ComplianceGovernanceCenterLabels["policyStatuses"],
    riskLevels: Object.fromEntries(
      RISK_LEVELS.map((key) => [key, t(`${p}.riskLevels.${key}`)])
    ) as ComplianceGovernanceCenterLabels["riskLevels"],
    priorities: Object.fromEntries(
      RISK_LEVELS.map((key) => [key, t(`${p}.priorities.${key}`)])
    ) as ComplianceGovernanceCenterLabels["priorities"],
    retentionTypes: Object.fromEntries(
      RETENTION_DATA_TYPES.map((key) => [key, t(`${p}.retentionTypes.${key}`)])
    ) as ComplianceGovernanceCenterLabels["retentionTypes"],
    accessTypes: Object.fromEntries(
      ACCESS_RECORD_TYPES.map((key) => [key, t(`${p}.accessTypes.${key}`)])
    ) as ComplianceGovernanceCenterLabels["accessTypes"],
    alertTypes: Object.fromEntries(
      ALERT_TYPES.map((key) => [key, t(`${p}.alertTypes.${key}`)])
    ) as ComplianceGovernanceCenterLabels["alertTypes"],
    modules: Object.fromEntries(
      GOVERNANCE_MODULES.map((key) => [key, t(`${p}.modules.${key}`)])
    ) as ComplianceGovernanceCenterLabels["modules"],
    filters: {
      category: t(`${p}.filters.category`),
      status: t(`${p}.filters.status`),
      riskLevel: t(`${p}.filters.riskLevel`),
      owner: t(`${p}.filters.owner`),
      reviewFrom: t(`${p}.filters.reviewFrom`),
      reviewTo: t(`${p}.filters.reviewTo`),
      allCategories: t(`${p}.filters.allCategories`),
      allStatuses: t(`${p}.filters.allStatuses`),
      allRiskLevels: t(`${p}.filters.allRiskLevels`),
      apply: t(`${p}.filters.apply`),
    },
    reports: {
      governanceActivities: t(`${p}.reports.governanceActivities`),
      approvalHistories: t(`${p}.reports.approvalHistories`),
      policyCompliance: t(`${p}.reports.policyCompliance`),
      auditSummaries: t(`${p}.reports.auditSummaries`),
      exportPdf: t(`${p}.reports.exportPdf`),
      exportExcel: t(`${p}.reports.exportExcel`),
      exportCsv: t(`${p}.reports.exportCsv`),
    },
    actions: {
      approve: t(`${p}.actions.approve`),
      reject: t(`${p}.actions.reject`),
      requestChanges: t(`${p}.actions.requestChanges`),
      escalate: t(`${p}.actions.escalate`),
      activatePolicy: t(`${p}.actions.activatePolicy`),
      archivePolicy: t(`${p}.actions.archivePolicy`),
      resolveAlert: t(`${p}.actions.resolveAlert`),
      resolveException: t(`${p}.actions.resolveException`),
      completeAccessReview: t(`${p}.actions.completeAccessReview`),
      updateRetention: t(`${p}.actions.updateRetention`),
      applying: t(`${p}.actions.applying`),
    },
    create: {
      policyName: t(`${p}.create.policyName`),
      owner: t(`${p}.create.owner`),
      summary: t(`${p}.create.summary`),
      submit: t(`${p}.create.submit`),
      placeholderName: t(`${p}.create.placeholderName`),
      placeholderOwner: t(`${p}.create.placeholderOwner`),
      placeholderSummary: t(`${p}.create.placeholderSummary`),
    },
  };
}

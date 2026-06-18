import type { Translator } from "@/lib/i18n/translate";

export function buildAutonomousOrganizationCenterLabels(t: Translator) {
  const p = "customerApp.autonomousOrganizationCenter";
  return {
    title: t(`${p}.title`),
    subtitle: t(`${p}.subtitle`),
    philosophy: t(`${p}.philosophy`),
    governanceNote: t(`${p}.governanceNote`),
    privacyNote: t(`${p}.privacyNote`),
    refresh: t(`${p}.refresh`),
    emptyState: t(`${p}.emptyState`),
    accessDenied: t(`${p}.accessDenied`),
    owner: t(`${p}.owner`),
    policy: t(`${p}.policy`),
    threshold: t(`${p}.threshold`),
    autonomyLevel: t(`${p}.autonomyLevel`),
    lastRun: t(`${p}.lastRun`),
    successRate: t(`${p}.successRate`),
    currentLevel: t(`${p}.currentLevel`),
    sections: {
      autonomousOperations: t(`${p}.sections.autonomousOperations`),
      delegatedResponsibilities: t(`${p}.sections.delegatedResponsibilities`),
      approvalPolicies: t(`${p}.sections.approvalPolicies`),
      humanOversight: t(`${p}.sections.humanOversight`),
      autonomousPerformance: t(`${p}.sections.autonomousPerformance`),
      governanceControls: t(`${p}.sections.governanceControls`),
    },
    delegationFramework: { title: t(`${p}.delegationFramework.title`) },
    policyEngine: { title: t(`${p}.policyEngine.title`) },
    humanOversightCenter: { title: t(`${p}.humanOversightCenter.title`) },
    autonomousSupportOperations: { title: t(`${p}.autonomousSupportOperations.title`) },
    autonomousAdminOperations: { title: t(`${p}.autonomousAdminOperations.title`) },
    autonomousPerformanceDashboard: { title: t(`${p}.autonomousPerformanceDashboard.title`) },
    executiveAutonomyDashboard: { title: t(`${p}.executiveAutonomyDashboard.title`) },
    autonomyLevels: { title: t(`${p}.autonomyLevels.title`) },
    companionAdvisor: { title: t(`${p}.companionAdvisor.title`), reason: t(`${p}.companionAdvisor.reason`) },
    enterpriseControls: {
      title: t(`${p}.enterpriseControls.title`),
      enabled: t(`${p}.enterpriseControls.enabled`),
      disabled: t(`${p}.enterpriseControls.disabled`),
      executiveApproval: t(`${p}.enterpriseControls.executiveApproval`),
    },
    actions: {
      acknowledge: t(`${p}.actions.acknowledge`),
      dismiss: t(`${p}.actions.dismiss`),
      approve: t(`${p}.actions.approve`),
      reject: t(`${p}.actions.reject`),
      escalate: t(`${p}.actions.escalate`),
      override: t(`${p}.actions.override`),
    },
    status: {
      completed: t(`${p}.status.completed`),
      notAllowed: t(`${p}.status.notAllowed`),
      requiresAttention: t(`${p}.status.requiresAttention`),
      information: t(`${p}.status.information`),
      restricted: t(`${p}.status.restricted`),
      verified: t(`${p}.status.verified`),
      waiting: t(`${p}.status.waiting`),
    },
    links: {
      legacyAutonomous: t(`${p}.links.legacyAutonomous`),
      approvals: t(`${p}.links.approvals`),
      actionCenter: t(`${p}.links.actionCenter`),
      humanOversight: t(`${p}.links.humanOversight`),
    },
  };
}

export type AutonomousOrganizationCenterLabels = ReturnType<typeof buildAutonomousOrganizationCenterLabels>;

export function getAutonomyLevelLabel(level: number, levels: { level: number; label: string }[]): string {
  const match = levels.find((l) => l.level === level);
  return match?.label ?? `Level ${level}`;
}

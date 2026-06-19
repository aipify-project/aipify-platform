import type { Translator } from "@/lib/i18n/translate";
import type { CompanionGovernanceLabels, CompanionGovernanceTab } from "./types";
import { GOVERNANCE_TABS } from "./constants";

export function buildCompanionGovernanceLabels(t: Translator): CompanionGovernanceLabels {
  const p = "companionGovernanceOperations";

  return {
    title: t(`${p}.title`),
    subtitle: t(`${p}.subtitle`),
    loading: t(`${p}.loading`),
    back: t(`${p}.back`),
    principle: t(`${p}.principle`),
    emptyState: t(`${p}.emptyState`),
    tabs: Object.fromEntries(
      GOVERNANCE_TABS.map((key) => [key, t(`${p}.tabs.${key}`)])
    ) as Record<CompanionGovernanceTab, string>,
    overview: {
      capabilities: t(`${p}.overview.capabilities`),
      policies: t(`${p}.overview.policies`),
      pendingApprovals: t(`${p}.overview.pendingApprovals`),
      governanceAlerts: t(`${p}.overview.governanceAlerts`),
      riskEvents: t(`${p}.overview.riskEvents`),
      trustScore: t(`${p}.overview.trustScore`),
      auditEntries: t(`${p}.overview.auditEntries`),
    },
    actions: {
      refreshTrust: t(`${p}.actions.refreshTrust`),
      approveAction: t(`${p}.actions.approveAction`),
      denyAction: t(`${p}.actions.denyAction`),
      openApprovals: t(`${p}.actions.openApprovals`),
      openOrchestration: t(`${p}.actions.openOrchestration`),
      openMemory: t(`${p}.actions.openMemory`),
      openAudit: t(`${p}.actions.openAudit`),
    },
    sections: {
      permissionBoundaries: t(`${p}.sections.permissionBoundaries`),
      recommendations: t(`${p}.sections.recommendations`),
      transparencyEngine: t(`${p}.sections.transparencyEngine`),
      ethicsFramework: t(`${p}.sections.ethicsFramework`),
      riskDetection: t(`${p}.sections.riskDetection`),
      knowledgeGovernance: t(`${p}.sections.knowledgeGovernance`),
      memoryGovernance: t(`${p}.sections.memoryGovernance`),
      specialistGovernance: t(`${p}.sections.specialistGovernance`),
      reviewBoard: t(`${p}.sections.reviewBoard`),
      audit: t(`${p}.sections.audit`),
    },
    confidenceLevels: {
      high: t(`${p}.confidenceLevels.high`),
      moderate: t(`${p}.confidenceLevels.moderate`),
      limited: t(`${p}.confidenceLevels.limited`),
    },
    trustLabels: {
      trusted: t(`${p}.trustLabels.trusted`),
      healthy: t(`${p}.trustLabels.healthy`),
      needs_review: t(`${p}.trustLabels.needs_review`),
      governance_risk: t(`${p}.trustLabels.governance_risk`),
    },
  };
}

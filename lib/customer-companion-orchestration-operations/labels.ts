import type { Translator } from "@/lib/i18n/translate";
import type { CompanionOrchestrationLabels, CompanionOrchestrationTab } from "./types";
import { ORCHESTRATION_TABS } from "./constants";

export function buildCompanionOrchestrationOperationsLabels(t: Translator): CompanionOrchestrationLabels {
  const p = "companionOrchestrationOperations";

  return {
    title: t(`${p}.title`),
    subtitle: t(`${p}.subtitle`),
    loading: t(`${p}.loading`),
    back: t(`${p}.back`),
    principle: t(`${p}.principle`),
    emptyState: t(`${p}.emptyState`),
    tabs: Object.fromEntries(
      ORCHESTRATION_TABS.map((key) => [key, t(`${p}.tabs.${key}`)])
    ) as Record<CompanionOrchestrationTab, string>,
    overview: {
      registeredSpecialists: t(`${p}.overview.registeredSpecialists`),
      activeSpecialists: t(`${p}.overview.activeSpecialists`),
      busySpecialists: t(`${p}.overview.busySpecialists`),
      reviewRequired: t(`${p}.overview.reviewRequired`),
      activeAssignments: t(`${p}.overview.activeAssignments`),
      coordinationEvents: t(`${p}.overview.coordinationEvents`),
      pendingApprovals: t(`${p}.overview.pendingApprovals`),
      companionHealthScore: t(`${p}.overview.companionHealthScore`),
    },
    actions: {
      refreshPerformance: t(`${p}.actions.refreshPerformance`),
      delegateTask: t(`${p}.actions.delegateTask`),
      createCollaboration: t(`${p}.actions.createCollaboration`),
      openSkills: t(`${p}.actions.openSkills`),
      openMemory: t(`${p}.actions.openMemory`),
      openApprovals: t(`${p}.actions.openApprovals`),
    },
    sections: {
      collaborationEvents: t(`${p}.sections.collaborationEvents`),
      contextSharing: t(`${p}.sections.contextSharing`),
      unifiedPrinciple: t(`${p}.sections.unifiedPrinciple`),
      teamStructures: t(`${p}.sections.teamStructures`),
      meetingCouncil: t(`${p}.sections.meetingCouncil`),
      decisionCollaborations: t(`${p}.sections.decisionCollaborations`),
      skillsIntegration: t(`${p}.sections.skillsIntegration`),
      memoryIntegration: t(`${p}.sections.memoryIntegration`),
      businessPackSpecialists: t(`${p}.sections.businessPackSpecialists`),
      approvalFlow: t(`${p}.sections.approvalFlow`),
      audit: t(`${p}.sections.audit`),
    },
    specialistStatuses: {
      active: t(`${p}.specialistStatuses.active`),
      busy: t(`${p}.specialistStatuses.busy`),
      review_required: t(`${p}.specialistStatuses.review_required`),
      restricted: t(`${p}.specialistStatuses.restricted`),
      disabled: t(`${p}.specialistStatuses.disabled`),
    },
  };
}

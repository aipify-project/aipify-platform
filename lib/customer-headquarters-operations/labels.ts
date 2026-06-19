import type { Translator } from "@/lib/i18n/translate";
import type { HeadquartersLabels, HeadquartersTab } from "./types";
import { HEADQUARTERS_TABS } from "./constants";

export function buildHeadquartersLabels(t: Translator): HeadquartersLabels {
  const p = "headquartersOperations";

  return {
    title: t(`${p}.title`),
    subtitle: t(`${p}.subtitle`),
    operationsTitle: t(`${p}.operationsTitle`),
    executiveTitle: t(`${p}.executiveTitle`),
    warRoomTitle: t(`${p}.warRoomTitle`),
    loading: t(`${p}.loading`),
    back: t(`${p}.back`),
    principle: t(`${p}.principle`),
    emptyState: t(`${p}.emptyState`),
    tabs: Object.fromEntries(
      HEADQUARTERS_TABS.map((key) => [key, t(`${p}.tabs.${key}`)])
    ) as Record<HeadquartersTab, string>,
    overview: {
      organizationHealth: t(`${p}.overview.organizationHealth`),
      revenueHealth: t(`${p}.overview.revenueHealth`),
      operationalHealth: t(`${p}.overview.operationalHealth`),
      customerHealth: t(`${p}.overview.customerHealth`),
      partnerHealth: t(`${p}.overview.partnerHealth`),
      riskHealth: t(`${p}.overview.riskHealth`),
      companionHealth: t(`${p}.overview.companionHealth`),
      liveStatus: t(`${p}.overview.liveStatus`),
      activeAlerts: t(`${p}.overview.activeAlerts`),
      pendingApprovals: t(`${p}.overview.pendingApprovals`),
      organizationPulse: t(`${p}.overview.organizationPulse`),
    },
    operations: {
      activeProjects: t(`${p}.operations.activeProjects`),
      pendingTasks: t(`${p}.operations.pendingTasks`),
      criticalIssues: t(`${p}.operations.criticalIssues`),
    },
    executive: {
      strategicHealth: t(`${p}.executive.strategicHealth`),
      majorRisks: t(`${p}.executive.majorRisks`),
      futureReadiness: t(`${p}.executive.futureReadiness`),
    },
    actions: {
      refreshHeadquarters: t(`${p}.actions.refreshHeadquarters`),
      activateWarRoom: t(`${p}.actions.activateWarRoom`),
      assignAction: t(`${p}.actions.assignAction`),
      acknowledgeAlert: t(`${p}.actions.acknowledgeAlert`),
      generateBriefing: t(`${p}.actions.generateBriefing`),
      openOperations: t(`${p}.actions.openOperations`),
      openExecutive: t(`${p}.actions.openExecutive`),
      openWarRoom: t(`${p}.actions.openWarRoom`),
      openExecutiveCopilot: t(`${p}.actions.openExecutiveCopilot`),
    },
    sections: {
      liveActivityFeed: t(`${p}.sections.liveActivityFeed`),
      actionCoordinationBoard: t(`${p}.sections.actionCoordinationBoard`),
      organizationalPulse: t(`${p}.sections.organizationalPulse`),
      meetingCommandCenter: t(`${p}.sections.meetingCommandCenter`),
      crossDepartmentCoordination: t(`${p}.sections.crossDepartmentCoordination`),
      operationsDirector: t(`${p}.sections.operationsDirector`),
      headquartersAssistant: t(`${p}.sections.headquartersAssistant`),
      audit: t(`${p}.sections.audit`),
    },
    pulseStatus: {
      strong: t(`${p}.pulseStatus.strong`),
      slowing: t(`${p}.pulseStatus.slowing`),
      immediate_review: t(`${p}.pulseStatus.immediate_review`),
    },
    departmentStatus: {
      active: t(`${p}.departmentStatus.active`),
      overloaded: t(`${p}.departmentStatus.overloaded`),
      watch: t(`${p}.departmentStatus.watch`),
      critical: t(`${p}.departmentStatus.critical`),
      offline: t(`${p}.departmentStatus.offline`),
    },
  };
}

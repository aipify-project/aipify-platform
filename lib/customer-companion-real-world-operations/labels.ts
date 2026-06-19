import type { Translator } from "@/lib/i18n/translate";
import type { CompanionRealWorldLabels, CompanionRealWorldTab } from "./types";
import { REAL_WORLD_TABS } from "./constants";

export function buildCompanionRealWorldLabels(t: Translator): CompanionRealWorldLabels {
  const p = "companionRealWorldOperations";

  return {
    title: t(`${p}.title`),
    subtitle: t(`${p}.subtitle`),
    loading: t(`${p}.loading`),
    back: t(`${p}.back`),
    principle: t(`${p}.principle`),
    emptyState: t(`${p}.emptyState`),
    bookingsTitle: t(`${p}.bookingsTitle`),
    tabs: Object.fromEntries(
      REAL_WORLD_TABS.map((key) => [key, t(`${p}.tabs.${key}`)])
    ) as Record<CompanionRealWorldTab, string>,
    overview: {
      activeRequests: t(`${p}.overview.activeRequests`),
      pendingApprovals: t(`${p}.overview.pendingApprovals`),
      upcomingBookings: t(`${p}.overview.upcomingBookings`),
      activeExecutions: t(`${p}.overview.activeExecutions`),
      activeDeliveries: t(`${p}.overview.activeDeliveries`),
      totalServiceCost: t(`${p}.overview.totalServiceCost`),
      completedServices: t(`${p}.overview.completedServices`),
    },
    actions: {
      refreshCoordination: t(`${p}.actions.refreshCoordination`),
      createRequest: t(`${p}.actions.createRequest`),
      approveService: t(`${p}.actions.approveService`),
      denyService: t(`${p}.actions.denyService`),
      confirmBooking: t(`${p}.actions.confirmBooking`),
      cancelBooking: t(`${p}.actions.cancelBooking`),
      openBookings: t(`${p}.actions.openBookings`),
      openEcosystem: t(`${p}.actions.openEcosystem`),
      openGovernance: t(`${p}.actions.openGovernance`),
    },
    sections: {
      actionWorkflow: t(`${p}.sections.actionWorkflow`),
      costGovernance: t(`${p}.sections.costGovernance`),
      approvalMatrix: t(`${p}.sections.approvalMatrix`),
      locationAwareness: t(`${p}.sections.locationAwareness`),
      serviceCoordinator: t(`${p}.sections.serviceCoordinator`),
      businessPackIntegration: t(`${p}.sections.businessPackIntegration`),
      serviceHistory: t(`${p}.sections.serviceHistory`),
      audit: t(`${p}.sections.audit`),
    },
    bookingStatuses: {
      pending: t(`${p}.bookingStatuses.pending`),
      confirmed: t(`${p}.bookingStatuses.confirmed`),
      requires_review: t(`${p}.bookingStatuses.requires_review`),
      cancelled: t(`${p}.bookingStatuses.cancelled`),
    },
    approvalLevels: {
      employee: t(`${p}.approvalLevels.employee`),
      manager: t(`${p}.approvalLevels.manager`),
      department: t(`${p}.approvalLevels.department`),
      finance: t(`${p}.approvalLevels.finance`),
      executive: t(`${p}.approvalLevels.executive`),
    },
  };
}

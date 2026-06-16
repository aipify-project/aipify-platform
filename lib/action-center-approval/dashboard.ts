import type { ApprovalDashboardWidget, ApprovalDelegationCenter } from "./types";

export function buildApprovalDashboardWidgets(
  center: ApprovalDelegationCenter | null
): ApprovalDashboardWidget[] {
  if (!center?.found) return [];

  return [
    { id: "pendingApprovals", titleKey: "pendingApprovals", items: center.pending_approvals ?? [] },
    { id: "awaitingMyReview", titleKey: "awaitingMyReview", items: center.awaiting_my_review ?? [] },
    { id: "recentlyApproved", titleKey: "recentlyApproved", items: center.recently_approved ?? [] },
    { id: "rejected", titleKey: "rejected", items: center.rejected ?? [] },
    { id: "escalated", titleKey: "escalated", items: center.escalated ?? [] },
    { id: "executiveDecisions", titleKey: "executiveDecisions", items: center.executive_decisions ?? [] },
  ];
}

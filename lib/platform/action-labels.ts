import type { PlatformActionCardLabels } from "@/components/platform/PlatformActionCard";

type Translator = (key: string) => string;

export function buildActionCardLabels(t: Translator): PlatformActionCardLabels {
  return {
    riskLevel: t("platform.actions.card.riskLevel"),
    reason: t("platform.actions.card.reason"),
    recommendedBy: t("platform.actions.card.recommendedBy"),
    environment: t("platform.actions.card.environment"),
    customer: t("platform.actions.card.customer"),
    preparedSteps: t("platform.actions.card.preparedSteps"),
    expectedOutcome: t("platform.actions.card.expectedOutcome"),
    expectedImpact: t("platform.actions.card.expectedImpact"),
    approvalStatus: t("platform.actions.card.approvalStatus"),
    estimatedTime: t("platform.actions.card.estimatedTime"),
    rollbackAvailable: t("platform.actions.card.rollbackAvailable"),
    rollbackYes: t("platform.actions.card.rollbackYes"),
    rollbackNo: t("platform.actions.card.rollbackNo"),
    whatWillChange: t("platform.actions.card.whatWillChange"),
    changes: t("platform.actions.card.changes"),
    previewImpact: t("platform.actions.card.previewImpact"),
    rollbackInstructions: t("platform.actions.card.rollbackInstructions"),
    approve: t("platform.actions.card.approve"),
    reject: t("platform.actions.card.reject"),
    execute: t("platform.actions.card.execute"),
    rollback: t("platform.actions.card.rollback"),
    processing: t("platform.actions.card.processing"),
    statusLabels: {
      pending_approval: t("platform.actions.status.pending"),
      approved: t("platform.actions.status.approved"),
      executing: t("platform.actions.status.executing"),
      success: t("platform.actions.status.success"),
      partial_success: t("platform.actions.status.partialSuccess"),
      failed: t("platform.actions.status.failed"),
      rolled_back: t("platform.actions.status.rolledBack"),
      verification_pending: t("platform.actions.status.verificationPending"),
      rejected: t("platform.actions.status.rejected"),
    },
    riskLabels: {
      low: t("platform.actions.risk.low"),
      medium: t("platform.actions.risk.medium"),
      high: t("platform.actions.risk.high"),
      critical: t("platform.actions.risk.critical"),
    },
  };
}

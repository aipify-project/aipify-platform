import type { PlatformActionCardLabels } from "@/components/platform/PlatformActionCard";
import { buildActionCardLabels } from "@/lib/platform/action-labels";

type Translator = (key: string) => string;

export function buildActionListPanelLabels(
  t: Translator,
  pageKey: "pending" | "approved" | "executed" | "failed"
) {
  const card = buildActionCardLabels(t);
  return {
    title: t(`platform.actions.pages.${pageKey}.title`),
    subtitle: t(`platform.actions.pages.${pageKey}.subtitle`),
    loading: t("platform.actions.loading"),
    empty: t(`platform.actions.pages.${pageKey}.empty`),
    lifecycle: t("platform.actions.lifecycle"),
    metrics: {
      pending: t("platform.actions.metrics.pending"),
      approved: t("platform.actions.metrics.approved"),
      executed: t("platform.actions.metrics.executed"),
      failed: t("platform.actions.metrics.failed"),
      hoursSaved: t("platform.actions.metrics.hoursSaved"),
      rollbacks: t("platform.actions.metrics.rollbacks"),
    },
    card: card as PlatformActionCardLabels,
  };
}

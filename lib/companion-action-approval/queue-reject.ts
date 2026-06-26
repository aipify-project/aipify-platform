import type { CompanionActionCenter, CompanionActionQueueItem } from "./types";

export function canRejectQueuedAction(
  item: CompanionActionQueueItem,
  actionHistory: CompanionActionCenter["action_history"],
): boolean {
  if (!item.action_request_id.trim()) {
    return false;
  }

  if (item.queue_status !== "queued") {
    return false;
  }

  const history = actionHistory.find((entry) => entry.id === item.action_request_id);
  if (!history) {
    return false;
  }

  return history.lifecycle_status === "approved" && history.execution_status === "queued";
}

export function buildGovernedRejectPayload(
  actionRequestId: string,
  reason?: string | null,
): Record<string, unknown> {
  const payload: Record<string, unknown> = {
    action: "reject",
    action_id: actionRequestId,
  };

  const trimmedReason = reason?.trim();
  if (trimmedReason) {
    payload.reason = trimmedReason;
  }

  return payload;
}

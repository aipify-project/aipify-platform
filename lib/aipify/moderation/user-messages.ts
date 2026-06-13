import type { ModerationDecision } from "./types";

/** i18n key suffix under customerApp.aipifyModeration.userMessages */
export function getModerationUserMessageKey(
  decision: ModerationDecision,
  status?: string
): string {
  if (status === "approved" || decision === "auto_approve") return "approved";
  if (status === "rejected" || decision === "auto_reject") return "rejected";
  return "pendingReview";
}

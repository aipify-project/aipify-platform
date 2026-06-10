import { formatExpectedDowntime } from "./engine";

export type UpdatePresenceContext = {
  scheduledAt?: Date | string;
  expectedDurationMinutes?: number;
};

export function getScheduledUpdatePresenceMessage(
  ctx: UpdatePresenceContext
): string {
  if (!ctx.scheduledAt) {
    return "Scheduled update planned. No customer data will be changed.";
  }
  const date =
    typeof ctx.scheduledAt === "string"
      ? new Date(ctx.scheduledAt)
      : ctx.scheduledAt;
  const time = date.toLocaleTimeString(undefined, {
    hour: "2-digit",
    minute: "2-digit",
  });
  return `Scheduled update tonight at ${time}.`;
}

export const UPDATE_IN_PROGRESS_PRESENCE_MESSAGE =
  "Aipify is updating safely.";

export const UPDATE_COMPLETED_PRESENCE_MESSAGE =
  "Update completed successfully. No action required.";

export const UPDATE_FAILED_PRESENCE_MESSAGE =
  "Aipify detected an update issue and requires review.";

export function buildMaintenanceAnnouncement(ctx: UpdatePresenceContext): string {
  if (!ctx.scheduledAt) {
    return "Scheduled maintenance: Aipify will be updated soon. No customer data will be changed.";
  }
  const date =
    typeof ctx.scheduledAt === "string"
      ? new Date(ctx.scheduledAt)
      : ctx.scheduledAt;
  const dateLabel = date.toLocaleDateString(undefined, {
    day: "numeric",
    month: "long",
  });
  const timeLabel = date.toLocaleTimeString(undefined, {
    hour: "2-digit",
    minute: "2-digit",
  });
  const duration = formatExpectedDowntime(ctx.expectedDurationMinutes ?? 5);
  return `Scheduled maintenance: Aipify will be updated on ${dateLabel} at ${timeLabel}. Expected downtime: ${duration}. No customer data will be changed.`;
}

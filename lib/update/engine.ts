import type {
  MaintenanceWindowStatus,
  NotificationChannel,
  UpdateAuditEventType,
  UpdateChannel,
  UpdateType,
} from "./types";

/** Core principle — updates only change Aipify software. */
export const UPDATE_CORE_PRINCIPLE =
  "Aipify updates must only update Aipify software. Updates must never silently alter customer data.";

export const UPDATE_TYPES: readonly UpdateType[] = [
  "patch",
  "minor",
  "major",
  "security",
  "database_migration",
] as const;

export const UPDATE_CHANNELS: readonly UpdateChannel[] = [
  "internal",
  "pilot",
  "stable",
  "enterprise",
] as const;

export const MAINTENANCE_WINDOW_STATUSES: readonly MaintenanceWindowStatus[] = [
  "draft",
  "scheduled",
  "in_progress",
  "completed",
  "failed",
  "rolled_back",
] as const;

export const UPDATE_AUDIT_EVENTS: readonly UpdateAuditEventType[] = [
  "update_created",
  "update_scheduled",
  "notification_sent",
  "update_started",
  "installation_updated",
  "installation_failed",
  "rollback_started",
  "rollback_completed",
  "migration_approved",
  "migration_rejected",
] as const;

export const NOTIFICATION_CHANNELS: readonly NotificationChannel[] = [
  "presence_center",
  "notification_bell",
  "email",
  "customer_control_center",
  "platform_admin",
] as const;

/** Rollout order (Phase 18 § VERSION MANAGEMENT). */
export const UPDATE_ROLLOUT_ORDER: readonly UpdateChannel[] = [
  "internal",
  "pilot",
  "stable",
  "enterprise",
] as const;

export const DEFAULT_ANNOUNCEMENT_TEMPLATE =
  "Scheduled maintenance: Aipify will be updated on {date} at {time}. Expected downtime: {duration}. No customer data will be changed.";

export const CUSTOMER_REASSURANCE_MESSAGE =
  "Nothing is required from you. Aipify will continue monitoring after the update.";

export function isUpdateType(value: string): value is UpdateType {
  return (UPDATE_TYPES as readonly string[]).includes(value);
}

export function isMaintenanceStatus(
  value: string
): value is MaintenanceWindowStatus {
  return (MAINTENANCE_WINDOW_STATUSES as readonly string[]).includes(value);
}

export function requiresMigrationApproval(type: UpdateType): boolean {
  return type === "database_migration" || type === "major";
}

export function formatExpectedDowntime(minutes: number): string {
  if (minutes < 60) return `${minutes} minutes`;
  const hours = Math.floor(minutes / 60);
  const remainder = minutes % 60;
  return remainder > 0 ? `${hours}h ${remainder}m` : `${hours} hour${hours > 1 ? "s" : ""}`;
}

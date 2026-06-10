/** Phase 18 — Safe Update & Version Deployment types. */

export type UpdateType =
  | "patch"
  | "minor"
  | "major"
  | "security"
  | "database_migration";

export type UpdateChannel = "internal" | "pilot" | "stable" | "enterprise";

export type MaintenanceWindowStatus =
  | "draft"
  | "scheduled"
  | "in_progress"
  | "completed"
  | "failed"
  | "rolled_back";

export type InstallationUpdateStatus =
  | "idle"
  | "pending"
  | "updating"
  | "updated"
  | "failed"
  | "rolled_back";

export type UpdateTargetStatus =
  | "pending"
  | "notified"
  | "updating"
  | "updated"
  | "failed"
  | "rolled_back";

export type UpdateAuditEventType =
  | "update_created"
  | "update_scheduled"
  | "notification_sent"
  | "update_started"
  | "installation_updated"
  | "installation_failed"
  | "rollback_started"
  | "rollback_completed"
  | "migration_approved"
  | "migration_rejected";

export type NotificationChannel =
  | "presence_center"
  | "notification_bell"
  | "email"
  | "customer_control_center"
  | "platform_admin";

export type DatabaseMigrationApproval = {
  migrationFile: string;
  description: string;
  affectedTables: string[];
  backupStrategy: string;
  rollbackPlan: string;
  approved: boolean;
  approvedAt?: string;
};

export type RollbackPlan = {
  rollbackAvailable: boolean;
  previousVersion: string;
  rollbackSteps: string[];
  rollbackDeadline?: string;
};

export type MaintenanceWindow = {
  id: string;
  version: string;
  title: string;
  description: string;
  scheduledAt: string;
  expectedDurationMinutes: number;
  status: MaintenanceWindowStatus;
  updateType: UpdateType;
  updateChannel: UpdateChannel;
  affectedInstallationCount?: number;
  createdAt: string;
  rollback?: RollbackPlan;
  migration?: DatabaseMigrationApproval;
};

export type InstallationVersionState = {
  installationId: string;
  currentVersion: string;
  targetVersion: string | null;
  lastUpdateAt: string | null;
  updateStatus: InstallationUpdateStatus;
  rollbackAvailable: boolean;
  updateChannel: UpdateChannel;
};

export type CustomerUpdateOverview = {
  currentVersion: string;
  nextScheduledUpdate: MaintenanceWindow | null;
  updateHistory: MaintenanceWindow[];
  installations: InstallationVersionState[];
};

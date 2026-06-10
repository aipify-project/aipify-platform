import type { DatabaseMigrationApproval, UpdateType } from "./types";
import { requiresMigrationApproval } from "./engine";

/** Operations forbidden without explicit approval (Phase 18 § DATABASE SAFETY). */
export const FORBIDDEN_MIGRATION_OPERATIONS = [
  "delete_table",
  "delete_column",
  "delete_customer_data",
  "overwrite_customer_settings",
  "reset_installation_configuration",
  "change_billing_data",
  "change_permissions",
] as const;

export type MigrationSafetyCheck = {
  allowed: boolean;
  reasons: string[];
};

export function validateDatabaseMigration(
  updateType: UpdateType,
  migration?: Partial<DatabaseMigrationApproval>
): MigrationSafetyCheck {
  const reasons: string[] = [];

  if (!requiresMigrationApproval(updateType) && updateType !== "database_migration") {
    if (migration?.migrationFile) {
      reasons.push("Database migration file provided for a non-migration update type.");
    }
    return { allowed: reasons.length === 0, reasons };
  }

  if (!migration?.migrationFile) {
    reasons.push("Migration file is required.");
  }
  if (!migration?.description) {
    reasons.push("Migration description is required.");
  }
  if (!migration?.affectedTables?.length) {
    reasons.push("Affected tables must be listed.");
  }
  if (!migration?.backupStrategy) {
    reasons.push("Backup strategy is required.");
  }
  if (!migration?.rollbackPlan) {
    reasons.push("Rollback plan is required.");
  }
  if (migration?.approved !== true) {
    reasons.push("Migration must be explicitly approved before production rollout.");
  }

  return { allowed: reasons.length === 0, reasons };
}

export function assertSoftwareOnlyUpdate(touchesCustomerData: boolean): void {
  if (touchesCustomerData) {
    throw new Error(
      "Software updates must not touch customer databases or configuration without approved migration."
    );
  }
}

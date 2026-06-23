import type { AppOrganizationRole } from "@/lib/app-portal/nav-config";
import type { UserRole } from "@/lib/tenant/types";
import type { WorkerExecutionProfile } from "@/lib/app/companion/chat-queue/load-worker-profile";

/** Validated queue job scope — never cross-tenant. */
export type CompanionWorkerRuntimeScope = {
  tenantId: string;
  userId: string;
  customerId: string;
  companyId: string;
  organizationId: string;
  userRole: UserRole;
  organizationRole: AppOrganizationRole | null;
};

export type CompanionWorkerRuntimeBootstrap = {
  ok: boolean;
  error?: string;
  scope: CompanionWorkerRuntimeScope;
  organization_context: Record<string, unknown>;
  identity_permissions: Record<string, unknown>;
  customer_license_center: Record<string, unknown>;
  integrations_hub: Record<string, unknown>;
  identity_center: unknown;
  assistant_identity: unknown;
  personality_card: unknown;
  companion_identity_relationship: unknown;
  install_discovery_context: unknown;
  install_discovery_center: unknown;
  support_operations_center: unknown;
  executive_command_center: unknown;
  marketplace_summary: unknown;
  license_subscription_center: unknown;
  memory_center_preferences: unknown;
  learning_center: unknown;
};

function str(value: unknown): string | null {
  return typeof value === "string" && value.trim() ? value.trim() : null;
}

export function parseCompanionWorkerRuntimeBootstrap(raw: unknown): CompanionWorkerRuntimeBootstrap | null {
  if (!raw || typeof raw !== "object") return null;
  const record = raw as Record<string, unknown>;
  if (record.ok !== true) return null;

  const scopeRaw = record.scope;
  if (!scopeRaw || typeof scopeRaw !== "object") return null;
  const scopeRecord = scopeRaw as Record<string, unknown>;

  const tenantId = str(scopeRecord.tenant_id);
  const userId = str(scopeRecord.user_id);
  const companyId = str(scopeRecord.company_id);
  const organizationId = str(scopeRecord.organization_id);
  if (!tenantId || !userId || !companyId || !organizationId) return null;

  const customerId = str(scopeRecord.customer_id) ?? tenantId;

  const userRole = (str(scopeRecord.user_role) ?? "staff") as UserRole;
  const organizationRole = str(scopeRecord.organization_role) as AppOrganizationRole | null;

  return {
    ok: true,
    scope: {
      tenantId,
      userId,
      customerId,
      companyId,
      organizationId,
      userRole,
      organizationRole,
    },
    organization_context: (record.organization_context as Record<string, unknown>) ?? {},
    identity_permissions: (record.identity_permissions as Record<string, unknown>) ?? {},
    customer_license_center: (record.customer_license_center as Record<string, unknown>) ?? {},
    integrations_hub: (record.integrations_hub as Record<string, unknown>) ?? {},
    identity_center: record.identity_center ?? null,
    assistant_identity: record.assistant_identity ?? null,
    personality_card: record.personality_card ?? null,
    companion_identity_relationship: record.companion_identity_relationship ?? null,
    install_discovery_context: record.install_discovery_context ?? null,
    install_discovery_center: record.install_discovery_center ?? null,
    support_operations_center: record.support_operations_center ?? null,
    executive_command_center: record.executive_command_center ?? null,
    marketplace_summary: record.marketplace_summary ?? null,
    license_subscription_center: record.license_subscription_center ?? null,
    memory_center_preferences: record.memory_center_preferences ?? null,
    learning_center: record.learning_center ?? null,
  };
}

export function workerScopeFromProfile(profile: WorkerExecutionProfile): Omit<
  CompanionWorkerRuntimeScope,
  "organizationId" | "organizationRole"
> {
  return {
    tenantId: profile.customerId,
    userId: profile.user.id,
    customerId: profile.customerId,
    companyId: profile.company.id,
    userRole: (profile.user.role ?? "staff") as UserRole,
  };
}

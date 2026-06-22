export type HrProviderImplementationStatus =
  | "connected"
  | "implemented_disconnected"
  | "partial"
  | "specification_only"
  | "placeholder";

export type HrCapabilityOperation = "read" | "write";

export type HrCapabilityKey =
  | "employee.read"
  | "team.read"
  | "department.read"
  | "role.read"
  | "absence.read"
  | "schedule.read"
  | "onboarding.read"
  | "training.read"
  | "certification.read"
  | "performance.read"
  | "employee.update"
  | "onboarding.create"
  | "task.assign";

/** Blocked in Companion runtime Phase 21 — never expose as enabled capabilities. */
export const HR_BLOCKED_CAPABILITY_KEYS = [
  "employee.delete",
  "employee.terminate",
  "salary.update",
  "compensation.change",
  "health_record.read",
  "legal_decision.execute",
  "account.access.revoke",
  "permission.revoke",
  "payment.execute",
  "payment.refund",
] as const;

export type HrBlockedCapabilityKey = (typeof HR_BLOCKED_CAPABILITY_KEYS)[number];

export type HrCapabilityManifest = {
  capability_key: HrCapabilityKey;
  operation: HrCapabilityOperation;
  adapter_available: boolean;
  approval_required: boolean;
  reversible: boolean;
  risk_level: 1 | 2 | 3;
  entity: string;
  required_permission: string | null;
  privacy_sensitive: boolean;
};

export type HrProviderSourceEngine =
  | "employee_management"
  | "employee_lifecycle"
  | "people_operations"
  | "team_center"
  | "workforce_scheduling"
  | "absence_coverage"
  | "employee_knowledge"
  | "hr_pack_adapter";

export type HrProviderManifest = {
  provider_key: string;
  display_name_key: string;
  source_engine: HrProviderSourceEngine;
  implementation_status: HrProviderImplementationStatus;
  capabilities: readonly HrCapabilityManifest[];
  search_terms_key: string;
  business_pack_key: string | null;
};

export const HR_BUSINESS_PACK_KEYS = [
  "hr_pack",
  "hr",
  "people",
  "employees",
] as const;

export function isHrBusinessPackActive(activeBusinessPacks: readonly string[]): boolean {
  return activeBusinessPacks.some((pack) =>
    (HR_BUSINESS_PACK_KEYS as readonly string[]).includes(pack),
  );
}

export function buildHrCapabilityId(
  providerKey: string,
  capabilityKey: HrCapabilityKey,
  operation: HrCapabilityOperation,
): string {
  return `${providerKey}.${capabilityKey}.${operation}`;
}

export function isHrCapabilityBlocked(capabilityKey: string): boolean {
  return (HR_BLOCKED_CAPABILITY_KEYS as readonly string[]).includes(capabilityKey);
}

/** Phase 19 — Trust Architecture & Data Ownership types. */

export type DataAccessLevel =
  | "metadata"
  | "read_only_operational"
  | "approved_operational_actions"
  | "customer_hosted_intelligence";

export type EnterpriseSecurityModel =
  | "cloud_intelligence"
  | "hybrid_intelligence"
  | "customer_hosted_intelligence";

export type ConnectorPermission = "read" | "write" | "admin" | "none";

export type TrustAuditOutcome = "success" | "failure" | "blocked" | "pending";

export type OffboardingStep =
  | "disable_installations"
  | "invalidate_tokens"
  | "terminate_connectors"
  | "retain_legal_records_only";

export type PrivacyByDesignAnswer = {
  dataRequired: string;
  dataOwner: string;
  storageLocation: string;
  retentionPeriod: string;
  revocable: boolean;
};

export type TrustAuditEntry = {
  id?: string;
  timestamp: string;
  tenantId: string;
  userId?: string;
  skillId?: string;
  action: string;
  reason?: string;
  approvalSource?: string;
  outcome: TrustAuditOutcome;
  installationId?: string;
};

export type CustomerSecurityOverview = {
  connectedSystems: Array<{
    key: string;
    status: string;
    permission: ConnectorPermission;
  }>;
  registeredDomains: string[];
  permissionScopes: DataAccessLevel;
  recentActions: TrustAuditEntry[];
  tokenHealth: "healthy" | "warning" | "critical";
  principles: string[];
};

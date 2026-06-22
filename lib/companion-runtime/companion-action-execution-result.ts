export type CompanionActionExecutionStatus =
  | "planned"
  | "awaiting_approval"
  | "approved"
  | "executing"
  | "completed"
  | "partially_completed"
  | "failed"
  | "rollback_available"
  | "blocked";

export type CompanionActionExecutionResult = {
  execution_id: string;
  action_id: string;
  capability_id: string;
  provider_key: string;
  status: CompanionActionExecutionStatus;
  started_at: string;
  completed_at: string | null;
  result: Record<string, unknown>;
  source_reference: string | null;
  audit_reference: string | null;
  reversible: boolean;
  rollback_available: boolean;
  warnings: string[];
  error_code: string | null;
};

export function createEmptyCompanionActionExecutionResult(
  overrides?: Partial<CompanionActionExecutionResult>,
): CompanionActionExecutionResult {
  const now = new Date().toISOString();
  return {
    execution_id: "",
    action_id: "",
    capability_id: "",
    provider_key: "",
    status: "planned",
    started_at: now,
    completed_at: null,
    result: {},
    source_reference: null,
    audit_reference: null,
    reversible: false,
    rollback_available: false,
    warnings: [],
    error_code: null,
    ...overrides,
  };
}

export function mapApprovalStatusToExecutionStatus(
  approvalStatus: string,
): CompanionActionExecutionStatus {
  if (approvalStatus === "pending") return "awaiting_approval";
  if (approvalStatus === "approved") return "approved";
  if (approvalStatus === "blocked" || approvalStatus === "prohibited") return "blocked";
  return "planned";
}

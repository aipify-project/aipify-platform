import type { SupabaseClient } from "@supabase/supabase-js";
import type { ActionRequest } from "@/lib/trust-action/types";
import type { CompanionActionRequest } from "@/lib/companion-action-approval/types";

export type CompanionApprovedActionRecord = {
  request_id: string;
  action_id: string;
  risk_level: number;
  status: string;
  reversible: boolean;
  expires_at: string | null;
  source: "trust_action" | "companion_action";
};

function parseRiskLevel(value: unknown): number {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : 2;
}

export function parseApprovedTrustActionRequest(request: ActionRequest): CompanionApprovedActionRecord | null {
  if (request.status !== "approved") return null;
  return {
    request_id: request.id,
    action_id: request.action_name,
    risk_level: request.risk_level,
    status: request.status,
    reversible: Boolean(request.undo_available),
    expires_at: null,
    source: "trust_action",
  };
}

export function parseApprovedCompanionActionRequest(
  request: CompanionActionRequest,
): CompanionApprovedActionRecord | null {
  if (!["approved", "completed"].includes(request.approval_status)) return null;
  if (request.lifecycle_status === "rejected" || request.lifecycle_status === "expired") return null;
  return {
    request_id: request.id,
    action_id: request.title.toLowerCase().includes(":")
      ? request.title.split(":").pop()?.trim() ?? request.id
      : request.id,
    risk_level: parseRiskLevel(request.risk_level),
    status: request.approval_status,
    reversible: parseRiskLevel(request.risk_level) <= 2,
    expires_at: request.expires_at || null,
    source: "companion_action",
  };
}

export function findApprovedActionRecord(
  actionId: string,
  records: CompanionApprovedActionRecord[],
): CompanionApprovedActionRecord | null {
  const normalized = actionId.trim().toLowerCase();
  return (
    records.find((record) => record.action_id.toLowerCase() === normalized) ??
    records.find((record) => record.request_id === actionId) ??
    null
  );
}

export function isApprovalExpired(record: CompanionApprovedActionRecord): boolean {
  if (!record.expires_at) return false;
  const parsed = Date.parse(record.expires_at);
  if (!Number.isFinite(parsed)) return false;
  return parsed < Date.now();
}

export async function fetchActionRequestStatus(
  supabase: SupabaseClient,
  requestId: string,
): Promise<string | null> {
  const { data, error } = await supabase.rpc("get_customer_trust_actions_center");
  if (error || !data) return null;

  const bundle = data as Record<string, unknown>;
  const pending = Array.isArray(bundle.pending_approvals) ? bundle.pending_approvals : [];
  for (const entry of pending) {
    const row = entry as Record<string, unknown>;
    if (String(row.id) === requestId) {
      return String(row.status ?? "pending");
    }
  }
  return null;
}

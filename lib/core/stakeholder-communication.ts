/**
 * Stakeholder Communication Engine helpers (Phase A.53).
 * Authoritative enforcement lives in Supabase RPCs.
 */

type RpcClient = {
  rpc: (fn: string, params?: Record<string, unknown>) => Promise<{ data: unknown; error: { message: string } | null }>;
};

export const STAKEHOLDER_TYPES = [
  "employee",
  "manager",
  "executive",
  "customer",
  "partner",
  "supplier",
] as const;

export type StakeholderType = (typeof STAKEHOLDER_TYPES)[number];

export const STAKEHOLDER_COMMUNICATION_TYPES = [
  "announcement",
  "operational_update",
  "incident_notification",
  "onboarding_message",
  "executive_communication",
  "policy_update",
] as const;

export type StakeholderCommunicationType = (typeof STAKEHOLDER_COMMUNICATION_TYPES)[number];

export const CAMPAIGN_STATUSES = [
  "draft",
  "scheduled",
  "active",
  "completed",
  "cancelled",
] as const;

export type CampaignStatus = (typeof CAMPAIGN_STATUSES)[number];

export const STAKEHOLDER_DELIVERY_CHANNELS = [
  "email",
  "desktop_notification",
  "in_platform",
  "knowledge_center",
] as const;

export type StakeholderDeliveryChannel = (typeof STAKEHOLDER_DELIVERY_CHANNELS)[number];

export const DELIVERY_STATUSES = ["pending", "delivered", "failed", "skipped"] as const;
export type DeliveryStatus = (typeof DELIVERY_STATUSES)[number];

export async function getStakeholderCommunicationEngineDashboard(
  supabase: RpcClient
): Promise<Record<string, unknown>> {
  const { data, error } = await supabase.rpc("get_stakeholder_communication_engine_dashboard");
  if (error) throw new Error(error.message);
  return (data as Record<string, unknown>) ?? {};
}

export async function getStakeholderCommunicationEngineCard(
  supabase: RpcClient
): Promise<Record<string, unknown>> {
  const { data, error } = await supabase.rpc("get_stakeholder_communication_engine_card");
  if (error) throw new Error(error.message);
  return (data as Record<string, unknown>) ?? {};
}

export async function getExecutiveCommunicationSummary(
  supabase: RpcClient
): Promise<Record<string, unknown>> {
  const { data, error } = await supabase.rpc("get_executive_communication_summary");
  if (error) throw new Error(error.message);
  return (data as Record<string, unknown>) ?? {};
}

export function createStakeholderCommunicationAuditEntry(
  actionType: string,
  metadata: Record<string, unknown> = {}
) {
  return { action_type: actionType, metadata, recorded_server_side: true as const };
}

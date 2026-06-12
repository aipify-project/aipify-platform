/**
 * Meeting & Collaboration Intelligence Engine helpers (Phase A.61).
 * Authoritative enforcement lives in Supabase RPCs.
 */

type RpcClient = {
  rpc: (fn: string, params?: Record<string, unknown>) => Promise<{ data: unknown; error: { message: string } | null }>;
};

export const MEETING_TYPES = [
  "executive",
  "department",
  "incident_review",
  "customer_success",
  "strategy",
  "project",
] as const;

export type MeetingType = (typeof MEETING_TYPES)[number];

export const MEETING_STATUSES = [
  "scheduled",
  "in_progress",
  "completed",
  "cancelled",
] as const;

export type MeetingStatus = (typeof MEETING_STATUSES)[number];

export const MEETING_ACTION_STATUSES = [
  "open",
  "in_progress",
  "completed",
  "overdue",
] as const;

export type MeetingActionStatus = (typeof MEETING_ACTION_STATUSES)[number];

export async function getMeetingCollaborationIntelligenceEngineDashboard(
  supabase: RpcClient
): Promise<Record<string, unknown>> {
  const { data, error } = await supabase.rpc("get_meeting_collaboration_intelligence_engine_dashboard");
  if (error) throw new Error(error.message);
  return (data as Record<string, unknown>) ?? {};
}

export async function getMeetingCollaborationIntelligenceEngineCard(
  supabase: RpcClient
): Promise<Record<string, unknown>> {
  const { data, error } = await supabase.rpc("get_meeting_collaboration_intelligence_engine_card");
  if (error) throw new Error(error.message);
  return (data as Record<string, unknown>) ?? {};
}

export async function getExecutiveMeetingSummary(supabase: RpcClient): Promise<Record<string, unknown>> {
  const { data, error } = await supabase.rpc("get_executive_meeting_summary");
  if (error) throw new Error(error.message);
  return (data as Record<string, unknown>) ?? {};
}

export function createMeetingCollaborationAuditEntry(
  actionType: string,
  metadata: Record<string, unknown> = {}
) {
  return { action_type: actionType, metadata, recorded_server_side: true as const };
}

/**
 * Personal Productivity Engine helpers (Phase A.70).
 * Per-user productivity metadata — NOT organization_tasks or PAME personal_memories.
 * Authoritative enforcement lives in Supabase RPCs.
 */

import type { RpcClient } from "./rpc-client";

export const PRODUCTIVITY_REMINDER_CHANNELS = ["in_app", "desktop", "email", "presence"] as const;
export type ProductivityReminderChannel = (typeof PRODUCTIVITY_REMINDER_CHANNELS)[number];

export const PRODUCTIVITY_REMINDER_STATUSES = [
  "scheduled",
  "delivered",
  "dismissed",
  "snoozed",
  "cancelled",
] as const;
export type ProductivityReminderStatus = (typeof PRODUCTIVITY_REMINDER_STATUSES)[number];

export async function getPersonalProductivityEngineDashboard(
  supabase: RpcClient
): Promise<Record<string, unknown>> {
  const { data, error } = await supabase.rpc("get_personal_productivity_engine_dashboard");
  if (error) throw new Error(error.message);
  return (data as Record<string, unknown>) ?? {};
}

export async function getPersonalProductivityEngineCard(
  supabase: RpcClient
): Promise<Record<string, unknown>> {
  const { data, error } = await supabase.rpc("get_personal_productivity_engine_card");
  if (error) throw new Error(error.message);
  return (data as Record<string, unknown>) ?? {};
}

export async function getDailyProductivityBriefing(
  supabase: RpcClient,
  briefingDate?: string
): Promise<Record<string, unknown>> {
  const { data, error } = await supabase.rpc("get_daily_productivity_briefing", {
    p_briefing_date: briefingDate ?? null,
  });
  if (error) throw new Error(error.message);
  return (data as Record<string, unknown>) ?? {};
}

export async function getCompanionOrbProductivitySummary(
  supabase: RpcClient
): Promise<Record<string, unknown>> {
  const { data, error } = await supabase.rpc("companion_orb_productivity_summary");
  if (error) throw new Error(error.message);
  return (data as Record<string, unknown>) ?? {};
}

export function createPersonalProductivityAuditEntry(
  actionType: string,
  metadata: Record<string, unknown> = {}
) {
  return { action_type: actionType, metadata, recorded_server_side: true as const };
}

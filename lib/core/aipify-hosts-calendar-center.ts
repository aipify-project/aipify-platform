/**
 * Aipify Hosts — Calendar Center (Phase Airbnb 26).
 */

import type { RpcClient } from "./rpc-client";

export async function getAipifyHostsCalendarCenterDashboard(
  supabase: RpcClient,
  params: {
    section?: string;
    view?: string;
    propertyId?: string | null;
    teamMember?: string | null;
    eventType?: string | null;
    dateFrom?: string | null;
    dateTo?: string | null;
  } = {},
): Promise<Record<string, unknown>> {
  const { data, error } = await supabase.rpc("get_aipify_hosts_calendar_center_dashboard", {
    p_section: params.section ?? "master_calendar",
    p_view: params.view ?? "month",
    p_property_id: params.propertyId ?? null,
    p_team_member: params.teamMember ?? null,
    p_event_type: params.eventType ?? null,
    p_date_from: params.dateFrom ?? null,
    p_date_to: params.dateTo ?? null,
  });
  if (error) throw new Error(error.message);
  return (data as Record<string, unknown>) ?? {};
}

export async function getAipifyHostsCalendarCenterCard(
  supabase: RpcClient,
): Promise<Record<string, unknown>> {
  const { data, error } = await supabase.rpc("get_aipify_hosts_calendar_center_card");
  if (error) throw new Error(error.message);
  return (data as Record<string, unknown>) ?? {};
}

export async function createAipifyHostsCalendarEvent(
  supabase: RpcClient,
  params: {
    title: string;
    eventType: string;
    startDate: string;
    endDate: string;
    propertyId?: string | null;
    assignedUsers?: string | null;
    internalNotes?: string | null;
  },
): Promise<Record<string, unknown>> {
  const { data, error } = await supabase.rpc("create_aipify_hosts_calendar_event", {
    p_title: params.title,
    p_event_type: params.eventType,
    p_start_date: params.startDate,
    p_end_date: params.endDate,
    p_property_id: params.propertyId ?? null,
    p_assigned_users: params.assignedUsers ?? null,
    p_internal_notes: params.internalNotes ?? null,
  });
  if (error) throw new Error(error.message);
  return (data as Record<string, unknown>) ?? {};
}

export async function performAipifyHostsCalendarAction(
  supabase: RpcClient,
  params: {
    actionType: string;
    propertyId?: string | null;
    startDate?: string | null;
    endDate?: string | null;
    blockId?: string | null;
    eventId?: string | null;
    notes?: string | null;
    reason?: string | null;
    defaultView?: string | null;
  },
): Promise<Record<string, unknown>> {
  const { data, error } = await supabase.rpc("perform_aipify_hosts_calendar_action", {
    p_action_type: params.actionType,
    p_property_id: params.propertyId ?? null,
    p_start_date: params.startDate ?? null,
    p_end_date: params.endDate ?? null,
    p_block_id: params.blockId ?? null,
    p_event_id: params.eventId ?? null,
    p_notes: params.notes ?? null,
    p_reason: params.reason ?? null,
    p_default_view: params.defaultView ?? null,
  });
  if (error) throw new Error(error.message);
  return (data as Record<string, unknown>) ?? {};
}

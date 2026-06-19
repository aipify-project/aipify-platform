import type { RpcClient } from "@/lib/core/rpc-client";

export async function getCalendarManagementCenter(
  supabase: RpcClient,
  rangeStart?: string,
  rangeEnd?: string,
) {
  const { data, error } = await supabase.rpc("get_calendar_management_center", {
    p_range_start: rangeStart ?? undefined,
    p_range_end: rangeEnd ?? undefined,
  });
  if (error) throw new Error(error.message);
  return (data as Record<string, unknown>) ?? {};
}

export async function performCalendarManagementAction(
  supabase: RpcClient,
  actionType: string,
  payload: Record<string, unknown> = {},
) {
  const { data, error } = await supabase.rpc("perform_calendar_management_action", {
    p_action_type: actionType,
    p_payload: payload,
  });
  if (error) throw new Error(error.message);
  return (data as Record<string, unknown>) ?? {};
}

export async function createBusinessPackCalendarEvent(
  supabase: RpcClient,
  params: {
    packKey: string;
    title: string;
    startsAt: string;
    endsAt: string;
    description?: string;
    eventType?: string;
    domainId?: string;
    departmentId?: string;
    resourceId?: string;
    metadata?: Record<string, unknown>;
  },
) {
  const { data, error } = await supabase.rpc("create_business_pack_calendar_event", {
    p_pack_key: params.packKey,
    p_title: params.title,
    p_starts_at: params.startsAt,
    p_ends_at: params.endsAt,
    p_description: params.description ?? null,
    p_event_type: params.eventType ?? "booking",
    p_domain_id: params.domainId ?? null,
    p_department_id: params.departmentId ?? null,
    p_resource_id: params.resourceId ?? null,
    p_metadata: params.metadata ?? {},
  });
  if (error) throw new Error(error.message);
  return (data as Record<string, unknown>) ?? {};
}

export async function getCompanionCalendarContext(supabase: RpcClient) {
  const { data, error } = await supabase.rpc("get_companion_calendar_context");
  if (error) throw new Error(error.message);
  return (data as Record<string, unknown>) ?? {};
}

export * from "./types";
export * from "./parse";
export { buildCalendarManagementLabels, statusLabel, formatEventTime } from "./labels";
export type { CalendarManagementLabels } from "./labels";

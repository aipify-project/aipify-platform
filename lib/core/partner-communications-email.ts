/**
 * Partner Communication & Recognition Email Engine — Phase 338.
 */

import type { RpcClient } from "./rpc-client";

export async function getPartnerCommunications(supabase: RpcClient): Promise<Record<string, unknown>> {
  const { data, error } = await supabase.rpc("get_partner_communications");
  if (error) throw new Error(error.message);
  return (data as Record<string, unknown>) ?? {};
}

export async function updatePartnerCommunicationPreferences(
  supabase: RpcClient,
  patch: Record<string, boolean>,
): Promise<Record<string, unknown>> {
  const { data, error } = await supabase.rpc("update_partner_communication_preferences", {
    p_patch: patch,
  });
  if (error) throw new Error(error.message);
  return (data as Record<string, unknown>) ?? {};
}

export async function getPartnerCommunicationLog(
  supabase: RpcClient,
  logId: string,
): Promise<Record<string, unknown>> {
  const { data, error } = await supabase.rpc("get_partner_communication_log", {
    p_log_id: logId,
  });
  if (error) throw new Error(error.message);
  return (data as Record<string, unknown>) ?? {};
}

export async function getSuperPartnerCommunications(supabase: RpcClient): Promise<Record<string, unknown>> {
  const { data, error } = await supabase.rpc("get_super_partner_communications");
  if (error) throw new Error(error.message);
  return (data as Record<string, unknown>) ?? {};
}

export async function getSuperPartnerCommunicationTemplates(
  supabase: RpcClient,
  category?: string,
): Promise<Record<string, unknown>> {
  const { data, error } = await supabase.rpc("get_super_partner_communication_templates", {
    p_category: category ?? null,
  });
  if (error) throw new Error(error.message);
  return (data as Record<string, unknown>) ?? {};
}

export async function updateSuperPartnerCommunicationTemplate(
  supabase: RpcClient,
  templateId: string,
  patch: Record<string, unknown>,
): Promise<Record<string, unknown>> {
  const { data, error } = await supabase.rpc("update_super_partner_communication_template", {
    p_template_id: templateId,
    p_patch: patch,
  });
  if (error) throw new Error(error.message);
  return (data as Record<string, unknown>) ?? {};
}

export async function getSuperPartnerCommunicationLogs(
  supabase: RpcClient,
  limit?: number,
): Promise<Record<string, unknown>> {
  const { data, error } = await supabase.rpc("get_super_partner_communication_logs", {
    p_limit: limit ?? 100,
  });
  if (error) throw new Error(error.message);
  return (data as Record<string, unknown>) ?? {};
}

export async function queueSuperPartnerCommunicationTest(
  supabase: RpcClient,
  templateKey: string,
  recipientEmail: string,
  orgId?: string,
  language?: string,
): Promise<Record<string, unknown>> {
  const { data, error } = await supabase.rpc("queue_super_partner_communication_test", {
    p_template_key: templateKey,
    p_recipient_email: recipientEmail,
    p_org_id: orgId ?? null,
    p_language: language ?? "en",
  });
  if (error) throw new Error(error.message);
  return (data as Record<string, unknown>) ?? {};
}

export async function resendSuperPartnerCommunicationEmail(
  supabase: RpcClient,
  logId: string,
): Promise<Record<string, unknown>> {
  const { data, error } = await supabase.rpc("resend_super_partner_communication_email", {
    p_log_id: logId,
  });
  if (error) throw new Error(error.message);
  return (data as Record<string, unknown>) ?? {};
}

export async function fetchPartnerCommunicationOutbox(
  supabase: RpcClient,
  limit?: number,
): Promise<Record<string, unknown>> {
  const { data, error } = await supabase.rpc("fetch_partner_communication_outbox", {
    p_limit: limit ?? 25,
  });
  if (error) throw new Error(error.message);
  return (data as Record<string, unknown>) ?? {};
}

export async function markPartnerCommunicationDelivery(
  supabase: RpcClient,
  logId: string,
  status: string,
  error?: string,
): Promise<Record<string, unknown>> {
  const { data, error: rpcError } = await supabase.rpc("mark_partner_communication_delivery", {
    p_log_id: logId,
    p_status: status,
    p_error: error ?? null,
  });
  if (rpcError) throw new Error(rpcError.message);
  return (data as Record<string, unknown>) ?? {};
}

export async function triggerPartnerCommunicationEvent(
  supabase: RpcClient,
  orgId: string,
  eventType: string,
  context?: Record<string, unknown>,
): Promise<Record<string, unknown>> {
  const { data, error } = await supabase.rpc("trigger_partner_communication_event", {
    p_org_id: orgId,
    p_event_type: eventType,
    p_context: context ?? {},
  });
  if (error) throw new Error(error.message);
  return { email_log_id: data };
}

export async function processPartnerCommunicationOutbox(
  supabase: RpcClient,
  limit?: number,
): Promise<{ sent: number; failed: number }> {
  const outbox = await fetchPartnerCommunicationOutbox(supabase, limit);
  const { parsePartnerEmailOutbox, processPartnerEmailOutbox: dispatch } = await import(
    "@/lib/partner-communications-email"
  );
  const items = parsePartnerEmailOutbox(outbox);
  return dispatch(items, async (id, status, err) => {
    await markPartnerCommunicationDelivery(supabase, id, status, err);
  });
}

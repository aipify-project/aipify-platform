import { createClient } from "@/lib/supabase/client";

export type RecordWorkflowEventInput = {
  workflowKey: string;
  sourceType: string;
  sourceId?: string | null;
  eventType?: string;
  payload?: Record<string, unknown>;
  actorUserId?: string | null;
  relatedCustomerId?: string | null;
  relatedCaseId?: string | null;
};

/** Client-side helper for modules feeding OIL workflow signals. */
export async function recordWorkflowEvent(
  input: RecordWorkflowEventInput
): Promise<{ id: string; workflow_id: string | null } | null> {
  const supabase = createClient();
  const { data, error } = await supabase.rpc("record_workflow_event", {
    p_workflow_key: input.workflowKey,
    p_source_type: input.sourceType,
    p_source_id: input.sourceId ?? null,
    p_event_type: input.eventType ?? "created",
    p_payload: input.payload ?? {},
    p_actor_user_id: input.actorUserId ?? null,
    p_related_customer_id: input.relatedCustomerId ?? null,
    p_related_case_id: input.relatedCaseId ?? null,
  });

  if (error || !data || typeof data !== "object") return null;
  const row = data as Record<string, unknown>;
  return {
    id: String(row.id),
    workflow_id: row.workflow_id == null ? null : String(row.workflow_id),
  };
}

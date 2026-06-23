import type { SupabaseClient } from "@supabase/supabase-js";
import { classifyExternalProviderHandoff } from "./external-handoff";
import { resolveActiveArtifactReference, toActiveArtifact } from "./resolution";
import type {
  CompanionArtifactContextPayload,
  CompanionConversationAttachment,
  CompanionExternalProviderHandoff,
} from "./types";

function parseAttachmentRow(raw: unknown): CompanionConversationAttachment | null {
  if (!raw || typeof raw !== "object") return null;
  const row = raw as Record<string, unknown>;
  const attachmentId = typeof row.attachment_id === "string" ? row.attachment_id : null;
  if (!attachmentId) return null;
  return {
    attachment_id: attachmentId,
    conversation_id: String(row.conversation_id ?? ""),
    original_filename: String(row.original_filename ?? "attachment"),
    mime_type: String(row.mime_type ?? "application/octet-stream"),
    category: (row.category as CompanionConversationAttachment["category"]) ?? "other",
    byte_size: Number(row.byte_size ?? 0),
    security_status:
      (row.security_status as CompanionConversationAttachment["security_status"]) ?? "pending",
    provenance_source:
      (row.provenance_source as CompanionConversationAttachment["provenance_source"]) ??
      "user_upload",
    created_at: String(row.created_at ?? new Date().toISOString()),
    preview_available: row.preview_available === true,
  };
}

export async function loadCompanionArtifactContext(
  supabase: SupabaseClient,
  input: {
    conversation_id: string;
    query: string;
    active_artifact_id?: string | null;
    attachment_ids?: readonly string[];
    external_provider?: string | null;
    external_consent?: boolean;
  },
): Promise<
  CompanionArtifactContextPayload & {
    attachments: CompanionConversationAttachment[];
    externalHandoff?: CompanionExternalProviderHandoff;
  }
> {
  const { data: listRaw } = await supabase.rpc("list_companion_conversation_attachments", {
    p_conversation_id: input.conversation_id,
  });

  const listResult = (listRaw ?? {}) as { ok?: boolean; attachments?: unknown[] };
  const attachments = (Array.isArray(listResult.attachments) ? listResult.attachments : [])
    .map(parseAttachmentRow)
    .filter((row): row is CompanionConversationAttachment => row !== null);

  const filtered =
    input.attachment_ids && input.attachment_ids.length > 0
      ? attachments.filter((row) => input.attachment_ids!.includes(row.attachment_id))
      : attachments;

  let activeArtifact = null as ReturnType<typeof toActiveArtifact> | null;

  if (input.active_artifact_id) {
    const match = filtered.find((row) => row.attachment_id === input.active_artifact_id);
    if (match) activeArtifact = toActiveArtifact(match);
  }

  if (!activeArtifact) {
    const { data: activeRaw } = await supabase.rpc("get_companion_active_artifact", {
      p_conversation_id: input.conversation_id,
    });
    const activeResult = (activeRaw ?? {}) as { active_artifact?: Record<string, unknown> | null };
    if (activeResult.active_artifact && typeof activeResult.active_artifact === "object") {
      const row = activeResult.active_artifact;
      activeArtifact = {
        attachment_id: String(row.attachment_id ?? ""),
        conversation_id: String(row.conversation_id ?? input.conversation_id),
        label: String(row.label ?? "attachment"),
        category: (row.category as CompanionConversationAttachment["category"]) ?? "other",
        mime_type: String(row.mime_type ?? ""),
        byte_size: Number(row.byte_size ?? 0),
        selected_at: String(row.selected_at ?? new Date().toISOString()),
      };
    }
  }

  const reference = resolveActiveArtifactReference({
    query: input.query,
    activeArtifact,
    attachments: filtered,
    explicitAttachmentId: input.active_artifact_id,
  });

  const payload: CompanionArtifactContextPayload = {
    conversation_id: input.conversation_id,
    active_artifact: activeArtifact,
    attachment_ids: filtered.map((row) => row.attachment_id),
    references: [reference],
  };

  if (input.external_provider) {
    return {
      ...payload,
      attachments: filtered,
      externalHandoff: classifyExternalProviderHandoff({
        provider_key: input.external_provider,
        consent_granted: input.external_consent === true,
        permission_granted: reference.attachment_id !== null,
      }),
    };
  }

  return { ...payload, attachments: filtered };
}

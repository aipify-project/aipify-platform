import type { SupabaseClient } from "@supabase/supabase-js";
import { COMPANION_ATTACHMENT_STORAGE_BUCKET } from "@/lib/companion-runtime/artifact-context/constants";
import { decryptIntegrationCredential } from "@/lib/unonight/connection/crypto";
import { parseCanvaOAuthTokenPayload } from "@/lib/integration-intelligence/providers/canva/oauth";

export type CompanionHandoffAttachmentAccess = {
  ok: boolean;
  attachment_id?: string;
  conversation_id?: string;
  storage_path?: string;
  original_filename?: string;
  mime_type?: string;
  category?: string;
  byte_size?: number;
  security_status?: string;
  tenant_id?: string;
  user_id?: string;
  error?: string;
};

export async function loadCompanionHandoffAttachmentAccess(
  supabase: SupabaseClient,
  attachmentId: string,
): Promise<CompanionHandoffAttachmentAccess> {
  const { data, error } = await supabase.rpc("get_companion_conversation_attachment_access", {
    p_attachment_id: attachmentId,
  });
  if (error) {
    return { ok: false, error: "access_failed" };
  }
  const row = (data ?? {}) as Record<string, unknown>;
  if (row.ok !== true) {
    return { ok: false, error: String(row.error ?? "forbidden") };
  }
  return {
    ok: true,
    attachment_id: String(row.attachment_id ?? attachmentId),
    conversation_id: String(row.conversation_id ?? ""),
    storage_path: String(row.storage_path ?? ""),
    original_filename: String(row.original_filename ?? "attachment"),
    mime_type: String(row.mime_type ?? "application/octet-stream"),
    category: String(row.category ?? "other"),
    byte_size: Number(row.byte_size ?? 0),
    security_status: String(row.security_status ?? "pending"),
  };
}

export async function downloadCompanionHandoffAttachmentBytes(
  supabase: SupabaseClient,
  storagePath: string,
): Promise<Buffer | null> {
  const { data, error } = await supabase.storage
    .from(COMPANION_ATTACHMENT_STORAGE_BUCKET)
    .download(storagePath);
  if (error || !data) return null;
  return Buffer.from(await data.arrayBuffer());
}

export type CanvaHandoffConnectionMaterial = {
  connected: boolean;
  connection_id: string | null;
  approved_scopes: string[];
  access_token: string | null;
};

export async function loadCanvaHandoffConnectionMaterial(
  supabase: SupabaseClient,
): Promise<CanvaHandoffConnectionMaterial> {
  const { data, error } = await supabase.rpc("get_companion_canva_handoff_connection");
  if (error) {
    return { connected: false, connection_id: null, approved_scopes: [], access_token: null };
  }

  const row = (data ?? {}) as Record<string, unknown>;
  if (row.ok !== true) {
    return { connected: false, connection_id: null, approved_scopes: [], access_token: null };
  }

  const encrypted = row.encrypted_token ? String(row.encrypted_token) : null;
  let accessToken: string | null = null;
  if (encrypted) {
    const decrypted = decryptIntegrationCredential(encrypted);
    const parsed = parseCanvaOAuthTokenPayload(decrypted);
    accessToken = parsed?.access_token ?? null;
  }

  return {
    connected: row.connected === true && Boolean(accessToken),
    connection_id: row.connection_id ? String(row.connection_id) : null,
    approved_scopes: Array.isArray(row.approved_scopes)
      ? row.approved_scopes.filter((scope): scope is string => typeof scope === "string")
      : [],
    access_token: accessToken,
  };
}

export async function recordCompanionArtifactHandoffAudit(
  supabase: SupabaseClient,
  input: {
    conversation_id: string;
    attachment_id: string;
    provider_key: string;
    consent_granted: boolean;
    status: string;
    external_reference?: string | null;
    open_url?: string | null;
    failure_code?: string | null;
    metadata?: Record<string, unknown>;
  },
): Promise<boolean> {
  const { data, error } = await supabase.rpc("record_companion_artifact_handoff_audit", {
    p_conversation_id: input.conversation_id,
    p_attachment_id: input.attachment_id,
    p_provider_key: input.provider_key,
    p_consent_granted: input.consent_granted,
    p_status: input.status,
    p_external_reference: input.external_reference ?? null,
    p_open_url: input.open_url ?? null,
    p_failure_code: input.failure_code ?? null,
    p_metadata: input.metadata ?? {},
  });

  if (error) return false;
  const result = (data ?? {}) as { recorded?: boolean };
  return result.recorded === true;
}

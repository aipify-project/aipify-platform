import type { SupabaseClient } from "@supabase/supabase-js";
import { decryptIntegrationCredential } from "@/lib/unonight/connection/crypto";
import { loadCanvaHandoffConnectionMaterial } from "@/lib/integration-intelligence/external-artifact-handoff/server";
import { assertCanvaHandoffPermissionForRole } from "@/lib/integration-intelligence/providers/canva/permissions";
import {
  assertMicrosoft365HandoffPermissionForRole,
  isMicrosoft365ApplicationKey,
  parseMicrosoft365OAuthTokenPayload,
} from "@/lib/integration-intelligence/providers/microsoft365";

export type HandoffConnectionMaterial = {
  connected: boolean;
  connection_id: string | null;
  approved_scopes: string[];
  access_token: string | null;
  account_label?: string | null;
};

export async function loadMicrosoft365HandoffConnectionMaterial(
  supabase: SupabaseClient,
): Promise<HandoffConnectionMaterial> {
  const { data, error } = await supabase.rpc("get_companion_microsoft365_handoff_connection");
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
    const parsed = parseMicrosoft365OAuthTokenPayload(decrypted);
    accessToken = parsed?.access_token ?? null;
  }

  const accountLabel =
    typeof row.account_label === "string" && row.account_label.trim()
      ? row.account_label.trim()
      : null;

  return {
    connected: row.connected === true && Boolean(accessToken),
    connection_id: row.connection_id ? String(row.connection_id) : null,
    approved_scopes: Array.isArray(row.approved_scopes)
      ? row.approved_scopes.filter((scope): scope is string => typeof scope === "string")
      : [],
    access_token: accessToken,
    account_label: accountLabel,
  };
}

export async function loadHandoffConnectionMaterial(
  supabase: SupabaseClient,
  providerKey: string,
): Promise<HandoffConnectionMaterial> {
  const key = providerKey.trim().toLowerCase();
  if (key === "canva") {
    return loadCanvaHandoffConnectionMaterial(supabase);
  }
  if (isMicrosoft365ApplicationKey(key) || key === "microsoft365") {
    return loadMicrosoft365HandoffConnectionMaterial(supabase);
  }
  return { connected: false, connection_id: null, approved_scopes: [], access_token: null };
}

export function assertHandoffPermissionForRole(providerKey: string, role: Parameters<typeof assertCanvaHandoffPermissionForRole>[0]): boolean {
  const key = providerKey.trim().toLowerCase();
  if (key === "canva") {
    return assertCanvaHandoffPermissionForRole(role);
  }
  if (isMicrosoft365ApplicationKey(key) || key === "microsoft365") {
    return assertMicrosoft365HandoffPermissionForRole(role);
  }
  return false;
}

export function resolveConnectedApplicationKeys(input: {
  canvaConnected: boolean;
  microsoft365Connected: boolean;
}): string[] {
  const keys: string[] = [];
  if (input.canvaConnected) keys.push("canva");
  if (input.microsoft365Connected) {
    keys.push("microsoft_word", "microsoft_excel", "microsoft_powerpoint");
  }
  return keys;
}

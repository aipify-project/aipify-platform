import "server-only";

import type { SupabaseClient } from "@supabase/supabase-js";

export type CompanionTenantContext = {
  primaryVerifiedProvider: string | null;
  connectedProviders: string[];
};

type HubConnection = {
  provider_key?: string;
  canonical_status?: string;
  status?: string;
  last_test_success_at?: string | null;
};

function isVerifiedConnection(connection: HubConnection): boolean {
  const canonical = String(connection.canonical_status ?? "").toLowerCase();
  if (canonical === "verified" || canonical === "active") return true;
  if (connection.last_test_success_at) return true;
  const status = String(connection.status ?? "").toLowerCase();
  return status === "connected" || status === "verified";
}

export async function loadCompanionTenantContext(
  supabase: SupabaseClient,
): Promise<CompanionTenantContext> {
  const { data, error } = await supabase.rpc("get_app_portal_integrations_hub");
  if (error || !data || typeof data !== "object") {
    return { primaryVerifiedProvider: null, connectedProviders: [] };
  }

  const connections = (data as { connections?: HubConnection[] }).connections ?? [];
  const verified = connections.filter(
    (entry) => entry.provider_key && isVerifiedConnection(entry),
  );
  const connectedProviders = verified
    .map((entry) => String(entry.provider_key))
    .filter(Boolean);

  return {
    primaryVerifiedProvider: connectedProviders[0] ?? null,
    connectedProviders,
  };
}

export function resolveCompanionIntegrationContext(
  requested: string | null | undefined,
  tenantContext: CompanionTenantContext,
): string | null {
  if (requested && tenantContext.connectedProviders.includes(requested)) {
    return requested;
  }
  return tenantContext.primaryVerifiedProvider;
}

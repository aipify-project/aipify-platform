import type { RpcClient } from "@/lib/core/rpc-client";

export type BusinessPackActivationStatus =
  | "pending_activation"
  | "validating"
  | "active"
  | "activation_failed"
  | "suspended"
  | "removed";

export type BusinessPackActivationGateItem = {
  pack_key: string;
  activation_status: BusinessPackActivationStatus;
  current_step?: string | null;
  failed_step?: string | null;
  retry_count?: number;
};

export type OrganizationBusinessPackActivationGates = {
  found: boolean;
  items?: BusinessPackActivationGateItem[];
};

export type PlatformBusinessPackActivationOverview = {
  found: boolean;
  items?: Array<
    BusinessPackActivationGateItem & {
      organization_id: string;
      organization_name?: string;
      diagnostic_summary?: string | null;
      provisioning_version?: string | null;
      last_smoke_status?: string | null;
      last_smoke_at?: string | null;
      updated_at?: string | null;
    }
  >;
  privacy_note?: string;
};

export function parseOrganizationBusinessPackActivationGates(
  data: unknown
): OrganizationBusinessPackActivationGates | null {
  if (!data || typeof data !== "object") return null;
  const row = data as Record<string, unknown>;
  if (row.found === false) return { found: false };
  const items = Array.isArray(row.items)
    ? (row.items as Record<string, unknown>[]).map((item) => ({
        pack_key: String(item.pack_key ?? ""),
        activation_status: String(item.activation_status ?? "pending_activation") as BusinessPackActivationStatus,
        current_step: typeof item.current_step === "string" ? item.current_step : null,
        failed_step: typeof item.failed_step === "string" ? item.failed_step : null,
        retry_count: typeof item.retry_count === "number" ? item.retry_count : undefined,
      }))
    : [];
  return { found: true, items };
}

export function parsePlatformBusinessPackActivationOverview(
  data: unknown
): PlatformBusinessPackActivationOverview | null {
  if (!data || typeof data !== "object") return null;
  const row = data as Record<string, unknown>;
  if (row.found === false) return { found: false };
  const items = Array.isArray(row.items)
    ? (row.items as Record<string, unknown>[]).map((item) => ({
        organization_id: String(item.organization_id ?? ""),
        organization_name: typeof item.organization_name === "string" ? item.organization_name : undefined,
        pack_key: String(item.pack_key ?? ""),
        activation_status: String(item.activation_status ?? "pending_activation") as BusinessPackActivationStatus,
        current_step: typeof item.current_step === "string" ? item.current_step : null,
        failed_step: typeof item.failed_step === "string" ? item.failed_step : null,
        retry_count: typeof item.retry_count === "number" ? item.retry_count : undefined,
        diagnostic_summary:
          typeof item.diagnostic_summary === "string" ? item.diagnostic_summary : null,
        provisioning_version:
          typeof item.provisioning_version === "string" ? item.provisioning_version : null,
        last_smoke_status: typeof item.last_smoke_status === "string" ? item.last_smoke_status : null,
        last_smoke_at: typeof item.last_smoke_at === "string" ? item.last_smoke_at : null,
        updated_at: typeof item.updated_at === "string" ? item.updated_at : null,
      }))
    : [];
  return {
    found: true,
    items,
    privacy_note: typeof row.privacy_note === "string" ? row.privacy_note : undefined,
  };
}

export async function getOrganizationBusinessPackActivationGates(supabase: RpcClient) {
  const { data, error } = await supabase.rpc("get_organization_business_pack_activation_gates");
  if (error) throw new Error(error.message);
  return parseOrganizationBusinessPackActivationGates(data) ?? { found: false };
}

export async function getPlatformBusinessPackActivationOverview(supabase: RpcClient) {
  const { data, error } = await supabase.rpc("get_platform_business_pack_activation_overview");
  if (error) throw new Error(error.message);
  return parsePlatformBusinessPackActivationOverview(data) ?? { found: false };
}

export async function performBusinessPackActivationGateAction(
  supabase: RpcClient,
  actionType: string,
  payload: Record<string, unknown>
) {
  const { data, error } = await supabase.rpc("perform_business_pack_activation_gate_action", {
    p_action_type: actionType,
    p_payload: payload,
  });
  if (error) throw new Error(error.message);
  return (data as Record<string, unknown>) ?? {};
}

export function buildBusinessPackActivationGateLabels(t: (key: string) => string) {
  const p = "customerApp.dynamicNavigation.activationGate";
  return {
    title: t(`${p}.title`),
    message: t(`${p}.message`),
    support: t(`${p}.support`),
  };
}

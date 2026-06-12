/**
 * Sales Expert Operating System helpers (Phase A.95 / Blueprint Phase 33 Extension).
 * Authoritative enforcement lives in Supabase RPCs (_seos_*).
 */

type RpcClient = {
  rpc: (fn: string, params?: Record<string, unknown>) => Promise<{ data: unknown; error: { message: string } | null }>;
};

export const SALES_EXPERT_PIPELINE_STAGES = [
  "discovery",
  "qualification",
  "demo",
  "proposal",
  "negotiation",
  "won",
  "lost",
] as const;

export const SALES_EXPERT_COMMISSION_STATUSES = [
  "pending",
  "approved",
  "paid",
  "forecasted",
  "cancelled",
] as const;

export const OFFICIAL_PARTNER_TIER_KEYS = [
  "sales_representative",
  "sales_expert",
  "certified",
  "expert",
] as const;

export const OFFICIAL_PARTNER_TIER_LABELS: Record<(typeof OFFICIAL_PARTNER_TIER_KEYS)[number], string> = {
  sales_representative: "Aipify Sales Representative",
  sales_expert: "Aipify Sales Expert",
  certified: "Aipify Certified Partner",
  expert: "Aipify Expert Partner",
};

export const SALES_EXPERT_PORTAL_TERMS = [
  "Customers",
  "Opportunities",
  "Pipeline",
  "Commission Overview",
  "Certifications",
  "Performance Insights",
  "Partner Resources",
] as const;

export async function getSalesExpertOperatingSystemDashboard(
  supabase: RpcClient
): Promise<Record<string, unknown>> {
  const { data, error } = await supabase.rpc("get_sales_expert_operating_system_dashboard");
  if (error) throw new Error(error.message);
  return (data as Record<string, unknown>) ?? {};
}

export async function getSalesExpertOperatingSystemCard(
  supabase: RpcClient
): Promise<Record<string, unknown>> {
  const { data, error } = await supabase.rpc("get_sales_expert_operating_system_card");
  if (error) throw new Error(error.message);
  return (data as Record<string, unknown>) ?? {};
}

export function createSalesExpertAuditEntry(
  actionType: string,
  metadata: Record<string, unknown> = {}
) {
  return { action_type: actionType, metadata, recorded_server_side: true as const };
}

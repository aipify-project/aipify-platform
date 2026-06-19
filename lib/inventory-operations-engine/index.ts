import type { RpcClient } from "@/lib/core/rpc-client";

export async function getOrganizationInventoryCenter(supabase: RpcClient, section?: string) {
  const { data, error } = await supabase.rpc("get_organization_inventory_center", {
    p_section: section ?? "overview",
  });
  if (error) throw new Error(error.message);
  return (data as Record<string, unknown>) ?? {};
}

export async function getCompanionInventoryAdvisorBundle(supabase: RpcClient) {
  const { data, error } = await supabase.rpc("get_aipify_companion_inventory_advisor_bundle");
  if (error) throw new Error(error.message);
  return (data as Record<string, unknown>) ?? {};
}

export async function getOrganizationInventoryMobileSummary(supabase: RpcClient) {
  const { data, error } = await supabase.rpc("get_organization_inventory_mobile_summary");
  if (error) throw new Error(error.message);
  return (data as Record<string, unknown>) ?? {};
}

export * from "./config";
export * from "./parse";
export * from "./labels";
export * from "./advisor";
export { InventoryOperationsSectionPage } from "./section-page";

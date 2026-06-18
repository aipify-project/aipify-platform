/**
 * Phase 502 — App Store & Business Pack Installation Engine
 */

import type { RpcClient } from "@/lib/core/rpc-client";

export async function getAppStoreHome(supabase: RpcClient, locale = "en") {
  const { data, error } = await supabase.rpc("get_app_store_home", { p_locale: locale });
  if (error) throw new Error(error.message);
  return (data as Record<string, unknown>) ?? {};
}

export async function getAppStorePackDetail(supabase: RpcClient, packKey: string) {
  const { data, error } = await supabase.rpc("get_app_store_pack_detail", { p_pack_key: packKey });
  if (error) throw new Error(error.message);
  return (data as Record<string, unknown>) ?? {};
}

export async function getCustomerLicenseDashboard(supabase: RpcClient) {
  const { data, error } = await supabase.rpc("get_customer_license_dashboard");
  if (error) throw new Error(error.message);
  return (data as Record<string, unknown>) ?? {};
}

export async function performAppStoreAction(
  supabase: RpcClient,
  params: { actionType: string; packKey?: string | null; payload?: Record<string, unknown> },
) {
  const { data, error } = await supabase.rpc("perform_app_store_action", {
    p_action_type: params.actionType,
    p_pack_key: params.packKey ?? null,
    p_payload: params.payload ?? {},
  });
  if (error) throw new Error(error.message);
  return (data as Record<string, unknown>) ?? {};
}

export async function getPlatformAppStoreRevenueDashboard(supabase: RpcClient) {
  const { data, error } = await supabase.rpc("get_platform_app_store_revenue_dashboard");
  if (error) throw new Error(error.message);
  return (data as Record<string, unknown>) ?? {};
}

export * from "./types";
export * from "./parse";
export { buildAppStoreLabels, buildLicenseDashboardLabels, buildPlatformAppStoreRevenueLabels } from "./labels";
export type { AppStoreLabels, LicenseDashboardLabels } from "./labels";

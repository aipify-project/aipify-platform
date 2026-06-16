/**
 * Aipify Hosts — Vendor Center (Phase Airbnb 24).
 */

import type { RpcClient } from "./rpc-client";

export async function getAipifyHostsVendorCenterDashboard(
  supabase: RpcClient,
  section = "vendors",
): Promise<Record<string, unknown>> {
  const { data, error } = await supabase.rpc("get_aipify_hosts_vendor_center_dashboard", { p_section: section });
  if (error) throw new Error(error.message);
  return (data as Record<string, unknown>) ?? {};
}

export async function getAipifyHostsVendorCenterCard(
  supabase: RpcClient,
): Promise<Record<string, unknown>> {
  const { data, error } = await supabase.rpc("get_aipify_hosts_vendor_center_card");
  if (error) throw new Error(error.message);
  return (data as Record<string, unknown>) ?? {};
}

export async function createAipifyHostsVendor(
  supabase: RpcClient,
  params: {
    companyName: string;
    serviceCategory: string;
    contactPerson?: string | null;
    email?: string | null;
    phoneNumber?: string | null;
    coverageArea?: string | null;
  },
): Promise<Record<string, unknown>> {
  const { data, error } = await supabase.rpc("create_aipify_hosts_vendor", {
    p_company_name: params.companyName,
    p_service_category: params.serviceCategory,
    p_contact_person: params.contactPerson ?? null,
    p_email: params.email ?? null,
    p_phone_number: params.phoneNumber ?? null,
    p_coverage_area: params.coverageArea ?? null,
  });
  if (error) throw new Error(error.message);
  return (data as Record<string, unknown>) ?? {};
}

export async function performAipifyHostsVendorAction(
  supabase: RpcClient,
  params: {
    vendorId: string;
    actionType: string;
    propertyId?: string | null;
    contractId?: string | null;
    notes?: string | null;
  },
): Promise<Record<string, unknown>> {
  const { data, error } = await supabase.rpc("perform_aipify_hosts_vendor_action", {
    p_vendor_id: params.vendorId,
    p_action_type: params.actionType,
    p_property_id: params.propertyId ?? null,
    p_contract_id: params.contractId ?? null,
    p_notes: params.notes ?? null,
  });
  if (error) throw new Error(error.message);
  return (data as Record<string, unknown>) ?? {};
}

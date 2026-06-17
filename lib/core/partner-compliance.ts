/**
 * Partner Self-Billing & Compliance Center — Phase 335.
 */

import type { RpcClient } from "./rpc-client";
import type { PartnerComplianceFilters } from "@/lib/partner-compliance/types";

export async function getPartnerCompliance(
  supabase: RpcClient,
  filters: PartnerComplianceFilters = {},
): Promise<Record<string, unknown>> {
  const { data, error } = await supabase.rpc("get_partner_compliance", {
    p_compliance_status: filters.compliance_status ?? null,
    p_country: filters.country ?? null,
    p_verification_status: filters.verification_status ?? null,
    p_agreement_status: filters.agreement_status ?? null,
    p_tax_status: filters.tax_status ?? null,
    p_date_from: filters.date_from ?? null,
    p_search: filters.search ?? null,
  });
  if (error) throw new Error(error.message);
  return (data as Record<string, unknown>) ?? {};
}

export async function getPartnerComplianceDocuments(
  supabase: RpcClient,
  filters: Pick<PartnerComplianceFilters, "document_status" | "search"> = {},
): Promise<Record<string, unknown>> {
  const { data, error } = await supabase.rpc("get_partner_compliance_documents", {
    p_document_status: filters.document_status ?? null,
    p_search: filters.search ?? null,
  });
  if (error) throw new Error(error.message);
  return (data as Record<string, unknown>) ?? {};
}

export async function getPartnerComplianceTaxProfile(
  supabase: RpcClient,
): Promise<Record<string, unknown>> {
  const { data, error } = await supabase.rpc("get_partner_compliance_tax_profile");
  if (error) throw new Error(error.message);
  return (data as Record<string, unknown>) ?? {};
}

export async function getPartnerComplianceAgreements(
  supabase: RpcClient,
): Promise<Record<string, unknown>> {
  const { data, error } = await supabase.rpc("get_partner_compliance_agreements");
  if (error) throw new Error(error.message);
  return (data as Record<string, unknown>) ?? {};
}

export async function submitPartnerComplianceVerification(
  supabase: RpcClient,
  verificationType: string,
): Promise<Record<string, unknown>> {
  const { data, error } = await supabase.rpc("submit_partner_compliance_verification", {
    p_verification_type: verificationType,
  });
  if (error) throw new Error(error.message);
  return (data as Record<string, unknown>) ?? {};
}

export async function updatePartnerComplianceProfile(
  supabase: RpcClient,
  payload: Record<string, unknown>,
): Promise<Record<string, unknown>> {
  const { data, error } = await supabase.rpc("update_partner_compliance_profile", {
    p_payload: payload,
  });
  if (error) throw new Error(error.message);
  return (data as Record<string, unknown>) ?? {};
}

import type { SupabaseClient } from "@supabase/supabase-js";

export async function calculateCheckoutVat(supabase: SupabaseClient, payload: Record<string, unknown>) {
  const { data, error } = await supabase.rpc("calculate_checkout_vat_tax", { p_payload: payload });
  if (error) throw new Error(error.message);
  return data as Record<string, unknown>;
}

export async function upsertCheckoutVatSession(supabase: SupabaseClient, payload: Record<string, unknown>) {
  const { data, error } = await supabase.rpc("upsert_checkout_vat_session", { p_payload: payload });
  if (error) throw new Error(error.message);
  return data;
}

export async function getCheckoutVatSession(supabase: SupabaseClient, sessionKey: string) {
  const { data, error } = await supabase.rpc("get_checkout_vat_session", { p_session_key: sessionKey });
  if (error) throw new Error(error.message);
  return data as Record<string, unknown>;
}

export async function finalizeCheckoutVatSession(
  supabase: SupabaseClient,
  sessionKey: string,
  paymentReference?: string
) {
  const { data, error } = await supabase.rpc("finalize_checkout_vat_session", {
    p_session_key: sessionKey,
    p_payment_reference: paymentReference ?? "",
  });
  if (error) throw new Error(error.message);
  return data;
}

export async function recordCheckoutVatValidation(supabase: SupabaseClient, payload: Record<string, unknown>) {
  const { data, error } = await supabase.rpc("record_checkout_vat_validation", { p_payload: payload });
  if (error) throw new Error(error.message);
  return data;
}

export async function getPlatformTaxVerificationCenter(supabase: SupabaseClient) {
  const { data, error } = await supabase.rpc("get_platform_checkout_tax_verification_center");
  if (error) throw new Error(error.message);
  return data as Record<string, unknown>;
}

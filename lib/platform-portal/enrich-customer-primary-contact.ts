import "server-only";

import type { SupabaseClient } from "@supabase/supabase-js";
import type { PlatformPortalCustomerDetail } from "./types";

/**
 * Enrich Customer 360 person-contact fields from existing `customers` columns.
 * Organization name stays on customer.name / legalName — never overwritten here.
 */
export async function enrichPlatformCustomerDetailPrimaryContact(input: {
  admin: SupabaseClient;
  detail: PlatformPortalCustomerDetail;
}): Promise<PlatformPortalCustomerDetail> {
  const customerId = input.detail.customer.id;
  const { data, error } = await input.admin
    .from("customers")
    .select("full_name, email, phone")
    .eq("id", customerId)
    .maybeSingle();

  if (error || !data) {
    return input.detail;
  }

  const fullName =
    typeof data.full_name === "string" ? data.full_name.trim() || null : null;
  const email = typeof data.email === "string" ? data.email.trim() || null : null;
  const phone = typeof data.phone === "string" ? data.phone.trim() || null : null;

  return {
    ...input.detail,
    customer: {
      ...input.detail.customer,
      primaryContactName: fullName ?? input.detail.customer.primaryContactName,
      primaryContactEmail: email ?? input.detail.customer.primaryContactEmail,
      primaryContactPhone: phone ?? input.detail.customer.primaryContactPhone,
    },
  };
}

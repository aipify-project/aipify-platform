import type { SupabaseClient } from "@supabase/supabase-js";

export type CommerceTenantContext = {
  userId: string;
  email: string | null;
  organizationId: string;
  customerId: string | null;
  hasActivePaidSubscription: boolean;
};

function asRecord(value: unknown): Record<string, unknown> | null {
  if (!value || typeof value !== "object" || Array.isArray(value)) return null;
  return value as Record<string, unknown>;
}

/**
 * Resolve tenant + customer from authenticated session only.
 * Never accept organization/customer IDs from the client body.
 */
export async function resolveCommerceTenantContext(
  supabase: SupabaseClient
): Promise<CommerceTenantContext | null> {
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  let organizationId: string | null = null;
  try {
    const { data } = await supabase.rpc("get_app_portal_organization_context");
    const root = asRecord(data);
    const org =
      (typeof root?.organization_id === "string" && root.organization_id) ||
      (typeof root?.organizationId === "string" && root.organizationId) ||
      null;
    if (org) organizationId = org;
  } catch {
    organizationId = null;
  }

  if (!organizationId) {
    const { data: membership } = await supabase
      .from("organization_members")
      .select("organization_id")
      .eq("user_id", user.id)
      .limit(1)
      .maybeSingle();
    if (membership && typeof membership.organization_id === "string") {
      organizationId = membership.organization_id;
    }
  }

  if (!organizationId) return null;

  let customerId: string | null = null;
  let hasActivePaidSubscription = false;

  const { data: customer } = await supabase
    .from("customers")
    .select("id")
    .eq("organization_id", organizationId)
    .limit(1)
    .maybeSingle();
  if (customer && typeof customer.id === "string") {
    customerId = customer.id;
    const { data: subscription } = await supabase
      .from("subscriptions")
      .select("status")
      .eq("customer_id", customerId)
      .limit(1)
      .maybeSingle();
    const status = subscription && typeof subscription.status === "string" ? subscription.status : "";
    hasActivePaidSubscription = status === "active" || status === "trialing";
  }

  // Fallback: some tenants use company_id on customers.
  if (!customerId) {
    const { data: customerByCompany } = await supabase
      .from("customers")
      .select("id")
      .eq("company_id", organizationId)
      .limit(1)
      .maybeSingle();
    if (customerByCompany && typeof customerByCompany.id === "string") {
      customerId = customerByCompany.id;
    }
  }

  return {
    userId: user.id,
    email: user.email ?? null,
    organizationId,
    customerId,
    hasActivePaidSubscription,
  };
}

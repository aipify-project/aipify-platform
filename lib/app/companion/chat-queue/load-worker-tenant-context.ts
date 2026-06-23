import type { SupabaseClient } from "@supabase/supabase-js";
import { createEmptyCompanionTenantContext, type CompanionTenantContext } from "@/lib/companion-runtime/companion-tenant-context";
import { coerceToCustomerActiveLocale } from "@/lib/i18n/customer-active-locale-registry";
import type { WorkerExecutionProfile } from "./load-worker-profile";

export async function loadCompanionTenantContextForWorker(
  supabase: SupabaseClient,
  profile: WorkerExecutionProfile,
  locale?: string | null,
): Promise<CompanionTenantContext> {
  const activeLocale = coerceToCustomerActiveLocale(locale ?? undefined);

  const { data: subscription } = await supabase
    .from("subscriptions")
    .select("plan_key, status")
    .eq("customer_id", profile.customerId)
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  return createEmptyCompanionTenantContext({
    locale: activeLocale,
    organizationId: profile.company.id,
    companyId: profile.company.id,
    organizationName: profile.company.name,
    planKey: typeof subscription?.plan_key === "string" ? subscription.plan_key : null,
    subscriptionStatus: typeof subscription?.status === "string" ? subscription.status : null,
  });
}

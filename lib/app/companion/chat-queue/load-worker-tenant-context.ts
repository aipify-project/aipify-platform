import "server-only";

import type { SupabaseClient } from "@supabase/supabase-js";
import { loadCompanionTenantContext, type CompanionTenantContext } from "@/lib/companion-runtime/tenant-context";
import {
  createWorkerScopedCompanionSupabase,
  fetchCompanionWorkerRuntimeBootstrap,
} from "@/lib/companion-runtime/companion-worker-scoped-supabase";
import type { CompanionWorkerRuntimeScope } from "@/lib/companion-runtime/companion-worker-runtime-scope";
import { coerceToCustomerActiveLocale } from "@/lib/i18n/customer-active-locale-registry";
import type { WorkerExecutionProfile } from "./load-worker-profile";

export type CompanionWorkerTenantRuntime = {
  tenantContext: CompanionTenantContext;
  scopedSupabase: SupabaseClient;
  scope: CompanionWorkerRuntimeScope;
};

export async function bootstrapCompanionWorkerTenantRuntime(
  supabase: SupabaseClient,
  profile: WorkerExecutionProfile,
  locale?: string | null,
): Promise<CompanionWorkerTenantRuntime | null> {
  const activeLocale = coerceToCustomerActiveLocale(locale ?? undefined);

  const bootstrap = await fetchCompanionWorkerRuntimeBootstrap(
    supabase,
    profile.customerId,
    profile.user.id,
    activeLocale,
  );
  if (!bootstrap) return null;

  if (
    bootstrap.scope.tenantId !== profile.customerId ||
    bootstrap.scope.userId !== profile.user.id ||
    bootstrap.scope.companyId !== profile.company.id
  ) {
    return null;
  }

  const scopedSupabase = createWorkerScopedCompanionSupabase(
    supabase,
    bootstrap.scope,
    bootstrap,
  );

  const tenantContext = await loadCompanionTenantContext(scopedSupabase, {
    locale: activeLocale,
  });

  return {
    tenantContext,
    scopedSupabase,
    scope: bootstrap.scope,
  };
}

/** @deprecated Use bootstrapCompanionWorkerTenantRuntime — kept for call-site compatibility. */
export async function loadCompanionTenantContextForWorker(
  supabase: SupabaseClient,
  profile: WorkerExecutionProfile,
  locale?: string | null,
): Promise<CompanionTenantContext> {
  const runtime = await bootstrapCompanionWorkerTenantRuntime(supabase, profile, locale);
  if (!runtime) {
    throw new Error("worker_bootstrap_failed");
  }
  return runtime.tenantContext;
}

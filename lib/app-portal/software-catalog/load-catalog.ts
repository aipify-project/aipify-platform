import type { SupabaseClient } from "@supabase/supabase-js";
import { getOrganizationBusinessPackActivationGates } from "@/lib/business-pack-activation-gate";
import {
  getBusinessPackIdentityEngineDashboard,
  getBusinessPackIdentityLanding,
} from "@/lib/core/business-pack-identity-engine";
import {
  buildSoftwareCatalogViewModel,
  CANONICAL_HOSTS_PACK_KEY,
  computeSoftwareCatalogPartial,
} from "./adapter";
import type { SoftwareCatalogViewModel } from "./types";

function isReadOnlySeedFailure(message: string): boolean {
  const lower = message.toLowerCase();
  return (
    lower.includes("read-only") ||
    lower.includes("cannot execute insert") ||
    lower.includes("read only transaction")
  );
}

export type SoftwareCatalogLocalizers = {
  localizePackage?: (packageKey: string) => { name?: string | null; description?: string | null } | null;
  localizeModuleName?: (moduleKey: string) => string | null;
  localizeFeature?: (feature: string) => string | null;
};

/**
 * Server-side catalog load over authoritative RPCs.
 * Soft-fails Business Pack identity when GET RPCs write (read-only) — packages/modules still render.
 * Hard partial only when billing/modules centers fail.
 */
export async function loadSoftwareCatalog(
  supabase: SupabaseClient,
  localizers: SoftwareCatalogLocalizers = {}
): Promise<SoftwareCatalogViewModel> {
  const diagnostics: string[] = [];

  const [billingResult, modulesResult, gates] = await Promise.all([
    supabase.rpc("get_customer_billing_center"),
    supabase.rpc("get_customer_modules_center"),
    getOrganizationBusinessPackActivationGates(supabase).catch(() => {
      diagnostics.push("activation_gates_unavailable");
      return { found: false as const, items: [] };
    }),
  ]);

  let identityDashboardRaw: unknown = { has_access: false, packs: [] };
  try {
    identityDashboardRaw = await getBusinessPackIdentityEngineDashboard(supabase);
  } catch (error) {
    const message = error instanceof Error ? error.message : "identity_dashboard_failed";
    diagnostics.push(
      isReadOnlySeedFailure(message) ? "identity_dashboard_readonly" : "identity_dashboard_failed"
    );
  }

  let hostsLandingRaw: unknown = null;
  try {
    hostsLandingRaw = await getBusinessPackIdentityLanding(supabase, CANONICAL_HOSTS_PACK_KEY);
  } catch (error) {
    const message = error instanceof Error ? error.message : "hosts_landing_failed";
    diagnostics.push(
      isReadOnlySeedFailure(message) ? "hosts_landing_readonly" : "hosts_landing_failed"
    );
  }

  if (billingResult.error) diagnostics.push("billing_center_error");
  if (modulesResult.error) diagnostics.push("modules_center_error");

  const view = buildSoftwareCatalogViewModel({
    billingRaw: billingResult.error ? { has_customer: false } : billingResult.data,
    modulesRaw: modulesResult.error ? { has_customer: false } : modulesResult.data,
    identityDashboardRaw,
    hostsLandingRaw: hostsLandingRaw ?? undefined,
    activationGates: gates.found ? gates.items ?? [] : [],
    localizePackage: localizers.localizePackage,
    localizeModuleName: localizers.localizeModuleName,
    localizeFeature: localizers.localizeFeature,
  });

  const mergedDiagnostics = [...view.diagnostics, ...diagnostics];
  return {
    ...view,
    diagnostics: mergedDiagnostics,
    partial: computeSoftwareCatalogPartial(mergedDiagnostics),
  };
}

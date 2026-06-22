import "server-only";

import type { SupabaseClient } from "@supabase/supabase-js";
import {
  getOrganizationBusinessPackActivationGates,
  type BusinessPackActivationGateItem,
} from "@/lib/business-pack-activation-gate";
import {
  classifyBusinessPackLoadError,
  normalizeCompanionBusinessPackCollection,
  parseModulesCenterData,
  parseRuntimeCenter,
  type CompanionBusinessPackCollection,
} from "./companion-business-pack-context";

export type LoadCompanionBusinessPackInput = {
  activeBusinessPacks: string[];
  subscriptionStatus: string | null;
  effectivePermissions: string[];
};

export async function loadCompanionBusinessPackContext(
  supabase: SupabaseClient,
  input: LoadCompanionBusinessPackInput,
): Promise<CompanionBusinessPackCollection> {
  if (input.activeBusinessPacks.length === 0) {
    return normalizeCompanionBusinessPackCollection({
      activeBusinessPacks: [],
      subscriptionStatus: input.subscriptionStatus,
      effectivePermissions: input.effectivePermissions,
      gateItems: [],
      runtimeInstalled: null,
      runtimePermissions: null,
      modulesCenter: null,
    });
  }

  try {
    const [gatesResult, installedResult, permissionsResult, modulesResult] = await Promise.all([
      getOrganizationBusinessPackActivationGates(supabase).catch(() => ({ found: false as const })),
      supabase.rpc("get_organization_business_pack_runtime", { p_section: "installed" }),
      supabase.rpc("get_organization_business_pack_runtime", { p_section: "permissions" }),
      supabase.rpc("get_customer_modules_center"),
    ]);

    const gateItems: BusinessPackActivationGateItem[] =
      gatesResult.found && gatesResult.items ? gatesResult.items : [];

    if (installedResult.error && permissionsResult.error && modulesResult.error) {
      return classifyBusinessPackLoadError(
        installedResult.error.message ||
          permissionsResult.error.message ||
          modulesResult.error.message,
      );
    }

    return normalizeCompanionBusinessPackCollection({
      activeBusinessPacks: input.activeBusinessPacks,
      subscriptionStatus: input.subscriptionStatus,
      effectivePermissions: input.effectivePermissions,
      gateItems,
      runtimeInstalled: installedResult.error ? null : parseRuntimeCenter(installedResult.data),
      runtimePermissions: permissionsResult.error
        ? null
        : parseRuntimeCenter(permissionsResult.data),
      modulesCenter: modulesResult.error ? null : parseModulesCenterData(modulesResult.data),
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    return classifyBusinessPackLoadError(message);
  }
}

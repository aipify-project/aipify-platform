import "server-only";

import type { SupabaseClient } from "@supabase/supabase-js";
import {
  getCompanionInstallDiscoveryContext,
  getInstallDiscoveryCenter,
  parseInstallDiscoveryCenter,
} from "@/lib/install-discovery";
import {
  assertDiscoveryOrganizationScope,
  classifyDiscoveryLoadError,
  normalizeCompanionDiscoveryContext,
  type CompanionDiscoveryContext,
} from "./companion-discovery-context";

export async function loadCompanionDiscoveryContext(
  supabase: SupabaseClient,
  organizationId: string | null,
): Promise<CompanionDiscoveryContext> {
  try {
    const companionRaw = await getCompanionInstallDiscoveryContext(supabase);
    let center = null;
    try {
      const centerRaw = await getInstallDiscoveryCenter(supabase);
      center = parseInstallDiscoveryCenter(centerRaw);
    } catch {
      center = null;
    }

    const normalized = normalizeCompanionDiscoveryContext(companionRaw, center, organizationId);
    return assertDiscoveryOrganizationScope(normalized, organizationId);
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    return classifyDiscoveryLoadError(message);
  }
}

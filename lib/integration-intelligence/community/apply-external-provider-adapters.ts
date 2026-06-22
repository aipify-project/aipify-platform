import type { SupabaseClient } from "@supabase/supabase-js";
import type { CompanionCommunityContext } from "@/lib/companion-runtime/companion-community-context";
import { applyUnonightProviderAdapterToCommunityContext } from "@/lib/unonight/provider-adapter/merge-community-context";
import {
  fetchUnonightMemberStatistics,
  type UnonightMemberStatisticsSnapshot,
} from "@/lib/unonight/provider-adapter/member-statistics";
import { UNONIGHT_COMMUNITY_ADAPTER_INTEGRATION_KEY } from "@/lib/unonight/provider-adapter/constants";

export type ApplyExternalCommunityProviderAdaptersInput = {
  organizationId: string | null;
  subscriptionStatus: string | null;
  connectedProviders: readonly string[];
  activeBusinessPacks: readonly string[];
  effectivePermissions: readonly string[];
  memberStatistics?: UnonightMemberStatisticsSnapshot | null;
};

/** Applies registered external community provider adapters without embedding provider logic in Core runtime loaders. */
export function applyExternalCommunityProviderAdapters(
  context: CompanionCommunityContext,
  input: ApplyExternalCommunityProviderAdaptersInput,
): CompanionCommunityContext {
  return applyUnonightProviderAdapterToCommunityContext(context, input);
}

/** Fetches Unonight member statistics when provider is connected, then applies adapter overlay. */
export async function applyExternalCommunityProviderAdaptersAsync(
  supabase: SupabaseClient,
  context: CompanionCommunityContext,
  input: ApplyExternalCommunityProviderAdaptersInput,
): Promise<CompanionCommunityContext> {
  let memberStatistics = input.memberStatistics ?? null;

  if (
    memberStatistics === null &&
    input.connectedProviders.includes(UNONIGHT_COMMUNITY_ADAPTER_INTEGRATION_KEY) &&
    input.effectivePermissions.includes("customer_community.view") &&
    !context.permission_denied &&
    !context.app_entitlement_blocked
  ) {
    memberStatistics = await fetchUnonightMemberStatistics(supabase);
  }

  return applyExternalCommunityProviderAdapters(context, {
    ...input,
    memberStatistics,
  });
}

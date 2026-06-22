import type { CompanionCommunityContext } from "@/lib/companion-runtime/companion-community-context";
import { applyUnonightProviderAdapterToCommunityContext } from "@/lib/unonight/provider-adapter/merge-community-context";

export type ApplyExternalCommunityProviderAdaptersInput = {
  organizationId: string | null;
  subscriptionStatus: string | null;
  connectedProviders: readonly string[];
  activeBusinessPacks: readonly string[];
  effectivePermissions: readonly string[];
};

/** Applies registered external community provider adapters without embedding provider logic in Core runtime loaders. */
export function applyExternalCommunityProviderAdapters(
  context: CompanionCommunityContext,
  input: ApplyExternalCommunityProviderAdaptersInput,
): CompanionCommunityContext {
  return applyUnonightProviderAdapterToCommunityContext(context, input);
}

import type { CustomerAppSplitName } from "@/lib/i18n/customer-app-split-config";
import type { CompanionTurnRoute } from "@/lib/companion-runtime/companion-turn-route";

/** Dictionary splits required for OAA / authorization-target customer copy. */
export const COMPANION_OAA_DICTIONARY_SPLITS = ["settings"] as const satisfies readonly CustomerAppSplitName[];

export function companionDictionarySplitsForTurnRoute(
  turnRoute: CompanionTurnRoute | "datetime",
): CustomerAppSplitName[] {
  const base: CustomerAppSplitName[] = [
    "navigation",
    "portalStructure",
    "companionPlatformKnowledge",
    "companion",
  ];

  if (turnRoute === "exact_source" || turnRoute === "foundation" || turnRoute === "datetime") {
    return [...base, "settings"];
  }

  return base;
}

export function companionDirectTurnDictionarySplits(): CustomerAppSplitName[] {
  return ["companion", "companionPlatformKnowledge", "settings"];
}

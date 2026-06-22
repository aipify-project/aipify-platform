/**
 * Phase 32 routing audit — classifies existing Companion query mechanisms.
 * Documents where non-semantic matching may still appear as fallback-only support.
 */

export type CompanionRoutingMechanismKind =
  | "semantic"
  | "exact_phrase"
  | "keyword"
  | "regex"
  | "manifest"
  | "model"
  | "fallback_only";

export type CompanionRoutingSurface = {
  module: string;
  function: string;
  kind: CompanionRoutingMechanismKind;
  role: "primary" | "support" | "fallback_only" | "gate";
  overrides_semantic: boolean;
  notes: string;
};

/** Read-only audit map — updated when routing surfaces change. */
export const COMPANION_ROUTING_SURFACE_MAP: readonly CompanionRoutingSurface[] = [
  {
    module: "lib/companion-runtime/companion-semantic-resolver.ts",
    function: "resolveCompanionSemanticQuery",
    kind: "semantic",
    role: "primary",
    overrides_semantic: false,
    notes: "Central semantic chain — intent, metric, provider, outcome.",
  },
  {
    module: "lib/companion-runtime/companion-semantic-query-match.ts",
    function: "resolveCompanionSemanticIntent",
    kind: "manifest",
    role: "primary",
    overrides_semantic: false,
    notes: "Manifest descriptor scoring with operation/metric/time hints.",
  },
  {
    module: "lib/companion-runtime/community-answer.ts",
    function: "matchCommunityProviderQuery",
    kind: "semantic",
    role: "primary",
    overrides_semantic: false,
    notes: "Semantic resolver first; legacy keyword paths are fallback-only.",
  },
  {
    module: "lib/companion-runtime/community-answer.ts",
    function: "matchCommunityProviderQuery",
    kind: "keyword",
    role: "fallback_only",
    overrides_semantic: true,
    notes: "Provider keyword map — only when semantic resolution is unresolved.",
  },
  {
    module: "lib/companion-runtime/community-answer.ts",
    function: "matchCommunityProviderQuery",
    kind: "exact_phrase",
    role: "fallback_only",
    overrides_semantic: true,
    notes: "Capability key phrase substring match — support signal only.",
  },
  {
    module: "lib/companion-runtime/community-answer.ts",
    function: "hasCommunityProviderIntent",
    kind: "regex",
    role: "gate",
    overrides_semantic: false,
    notes: "Generic community domain gate plus manifest semantic gate.",
  },
  {
    module: "lib/companion-runtime/community-companion-query.ts",
    function: "resolveCommunityCompanionQuery",
    kind: "semantic",
    role: "primary",
    overrides_semantic: false,
    notes: "Outcome-aware community branch on orchestrator path.",
  },
  {
    module: "lib/companion-runtime/community-provider-adapter-answer.ts",
    function: "buildCommunityProviderAdapterGroundedAnswer",
    kind: "manifest",
    role: "primary",
    overrides_semantic: false,
    notes: "Phase 31B metric contract — exact/compatible only for direct answers.",
  },
  {
    module: "lib/companion-runtime/orchestrator.ts",
    function: "orchestrateCompanionSearch",
    kind: "fallback_only",
    role: "fallback_only",
    overrides_semantic: true,
    notes: "Navigation corpus and generic fallback — last resort after domain branches.",
  },
];

export function listRoutingSurfacesThatCanOverrideSemantic(): CompanionRoutingSurface[] {
  return COMPANION_ROUTING_SURFACE_MAP.filter((entry) => entry.overrides_semantic);
}

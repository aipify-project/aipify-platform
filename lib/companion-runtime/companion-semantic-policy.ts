/**
 * Frozen Companion semantic understanding invariants — platform-wide Core policy.
 * Semantic resolution belongs to Companion Core; customer vocabulary belongs in adapters/manifests.
 *
 * @see companion-semantic-resolver · companion-semantic-query-match · integration-intelligence/semantic/types
 */

export const COMPANION_SEMANTIC_PRIMARY_MECHANISM = "manifest_schema_driven" as const;

/** Literal phrase matching may only support fallback — never the primary routing mechanism. */
export const COMPANION_SEMANTIC_LITERAL_TEXT_MATCH_ROLE = "fallback_only" as const;

export const COMPANION_SEMANTIC_FALLBACK_ORDER = [
  "manifest_entity_alias",
  "schema_entity_field",
  "generic_operation_metric",
  "capability_key_phrase",
  "provider_search_terms",
] as const;

export type CompanionSemanticPrimaryMechanism = typeof COMPANION_SEMANTIC_PRIMARY_MECHANISM;

export type CompanionSemanticLiteralTextMatchRole = typeof COMPANION_SEMANTIC_LITERAL_TEXT_MATCH_ROLE;

export type CompanionSemanticFallbackStage = (typeof COMPANION_SEMANTIC_FALLBACK_ORDER)[number];

/** Core semantic query matcher — manifest/schema driven resolution lives here. */
export const COMPANION_SEMANTIC_QUERY_MATCH_MODULE =
  "lib/companion-runtime/companion-semantic-query-match.ts" as const;

/** Central semantic resolver — single Companion Core routing chain. */
export const COMPANION_SEMANTIC_RESOLVER_MODULE =
  "lib/companion-runtime/companion-semantic-resolver.ts" as const;

/** Frozen Companion query routing — semantic intent resolves before literal phrase fallback. */
export const COMPANION_QUERY_ROUTING = "semantic_intent_first" as const;

export const COMPANION_EXACT_PHRASE_MATCH = "support_only" as const;

export const COMPANION_CAPABILITY_RESOLUTION = "manifest_schema_driven" as const;

export const COMPANION_METRIC_RESOLUTION = "semantic_and_schema_validated" as const;

export const COMPANION_GENERIC_FALLBACK = "last_resort" as const;

export const COMPANION_CUSTOMER_PHRASES_IN_CORE = "forbidden" as const;

export const COMPANION_PROXY_METRIC_AS_EXACT_ANSWER = "forbidden" as const;

/** Frozen fallback pipeline — generic fallback is always last. */
export const COMPANION_RESOLUTION_PIPELINE = [
  "semantic_intent",
  "conversation_context",
  "capability_manifest_schema",
  "provider_availability",
  "entitlement_permission",
  "grounded_execution",
  "capability_specific_gap",
  "clarification",
  "generic_fallback",
] as const;

export type CompanionResolutionPipelineStage = (typeof COMPANION_RESOLUTION_PIPELINE)[number];

export function companionSemanticPolicyMetadata() {
  return {
    query_routing: COMPANION_QUERY_ROUTING,
    exact_phrase_match: COMPANION_EXACT_PHRASE_MATCH,
    capability_resolution: COMPANION_CAPABILITY_RESOLUTION,
    metric_resolution: COMPANION_METRIC_RESOLUTION,
    generic_fallback: COMPANION_GENERIC_FALLBACK,
    customer_phrases_in_core: COMPANION_CUSTOMER_PHRASES_IN_CORE,
    proxy_metric_as_exact_answer: COMPANION_PROXY_METRIC_AS_EXACT_ANSWER,
    primary_mechanism: COMPANION_SEMANTIC_PRIMARY_MECHANISM,
    literal_text_match_role: COMPANION_SEMANTIC_LITERAL_TEXT_MATCH_ROLE,
    fallback_order: COMPANION_SEMANTIC_FALLBACK_ORDER,
    resolution_pipeline: COMPANION_RESOLUTION_PIPELINE,
  };
}

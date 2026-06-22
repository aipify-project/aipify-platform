/**
 * Frozen Companion semantic understanding invariants — platform-wide Core policy.
 * Semantic resolution belongs to Companion Core; customer vocabulary belongs in adapters/manifests.
 *
 * @see companion-semantic-query-match · integration-intelligence/semantic/types
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

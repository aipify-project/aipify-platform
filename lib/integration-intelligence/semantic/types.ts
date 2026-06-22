import type { CustomerActiveLocale } from "@/lib/i18n/customer-active-locale-registry";

export type CompanionSemanticOperation =
  | "count"
  | "compare"
  | "trend"
  | "read"
  | "list"
  | "status";

export type CompanionSemanticMetric =
  | "total"
  | "count"
  | "new"
  | "growth"
  | "pending"
  | "latest"
  | "status"
  | "active"
  | "list";

export type CompanionSemanticTimeScope = "current" | "since_last" | "period" | "historical";

export type CompanionSemanticEntityAliases = Partial<
  Record<CustomerActiveLocale | "en", readonly string[]>
>;

export type CompanionSemanticMetricMapping = {
  requested_metric: string;
  when: {
    metric?: CompanionSemanticMetric | null;
    operation?: CompanionSemanticOperation | null;
    time_scope?: CompanionSemanticTimeScope | null;
  };
  period?: string | null;
};

/** Adapter/manifest semantic contract — customer aliases live here, not in Core matchers. */
export type CompanionSemanticCapabilityDescriptor = {
  capability_key: string;
  entity: string;
  domain?: string;
  metrics?: readonly string[];
  operations?: readonly CompanionSemanticOperation[];
  time_scopes?: readonly CompanionSemanticTimeScope[];
  entity_aliases?: CompanionSemanticEntityAliases;
  metric_mappings?: readonly CompanionSemanticMetricMapping[];
};

export type CompanionSemanticIntent = {
  entity: string | null;
  operation: CompanionSemanticOperation | null;
  metric: CompanionSemanticMetric | null;
  time_scope: CompanionSemanticTimeScope | null;
  capability_candidates: string[];
  confidence: "high" | "moderate" | "low";
  ambiguous: boolean;
  ambiguity_reason: string | null;
};

export type CompanionResolutionSource =
  | "semantic_model"
  | "manifest_schema"
  | "conversation_context"
  | "exact_phrase_support"
  | "unresolved";

export type CompanionSemanticOutcomeType =
  | "intent_resolved_and_grounded"
  | "intent_resolved_metric_missing"
  | "intent_resolved_provider_missing"
  | "intent_resolved_permission_denied"
  | "intent_resolved_activation_pending"
  | "intent_ambiguous"
  | "intent_unresolved";

export type CompanionConversationSemanticContext = {
  previous_entity?: string | null;
  previous_domain?: string | null;
  previous_requested_metric?: string | null;
  previous_capability_key?: string | null;
  previous_provider_key?: string | null;
};

export type CompanionResolvedIntent = {
  intent_id: string;
  source_language: CustomerActiveLocale;
  domain: string | null;
  entity: string | null;
  operation: CompanionSemanticOperation | null;
  requested_metric: string | null;
  time_scope: CompanionSemanticTimeScope | null;
  filters: Record<string, string | null>;
  comparison_scope: string | null;
  requested_detail_level: "summary" | "list" | "detail";
  capability_candidates: readonly string[];
  provider_key: string | null;
  capability_key: string | null;
  confidence: "high" | "moderate" | "low";
  ambiguous: boolean;
  ambiguity_reason: string | null;
  conversation_reference: boolean;
  resolution_source: CompanionResolutionSource;
  fallback_stage:
    | "manifest_entity_alias"
    | "schema_entity_field"
    | "generic_operation_metric"
    | "capability_key_phrase"
    | "provider_search_terms"
    | null;
  outcome: CompanionSemanticOutcomeType;
  clarification_key: string | null;
};

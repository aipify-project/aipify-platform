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
  | "status";

export type CompanionSemanticTimeScope = "current" | "since_last" | "period" | "historical";

export type CompanionSemanticEntityAliases = Partial<
  Record<CustomerActiveLocale | "en", readonly string[]>
>;

/** Adapter/manifest semantic contract — customer aliases live here, not in Core matchers. */
export type CompanionSemanticCapabilityDescriptor = {
  capability_key: string;
  entity: string;
  metrics?: readonly string[];
  operations?: readonly CompanionSemanticOperation[];
  time_scopes?: readonly CompanionSemanticTimeScope[];
  entity_aliases?: CompanionSemanticEntityAliases;
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

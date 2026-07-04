import type { PlatformKnowledgeAction } from "@/lib/companion-platform-knowledge/types";

export type CompanionResponseEnrichmentIntent =
  | "pricing"
  | "business_packs"
  | "onboarding"
  | "support"
  | "general";

export type CompanionOrganizationState = "new" | "active" | "trial" | "unknown";

export type CompanionEnrichmentActionType = "primary" | "secondary";

export type CompanionEnrichmentAction = {
  label: string;
  type: CompanionEnrichmentActionType;
  route: string;
  routeKey?: string;
  labelKey?: string;
};

export type CompanionResponseEnrichmentInput = {
  text: string;
  intent: CompanionResponseEnrichmentIntent;
  context: {
    organizationState: CompanionOrganizationState;
  };
  existingActions?: PlatformKnowledgeAction[];
};

export type CompanionResponseEnrichmentOutput = {
  text: string;
  actions: CompanionEnrichmentAction[];
};

export type CompanionEnrichmentSkipReason =
  | "empty_answer"
  | "general_existing_actions"
  | "unchanged_actions"
  | "no_new_actions";

export type CompanionEnrichmentDecisionLog = {
  event: "companion_enrichment_decision";
  intent: CompanionResponseEnrichmentIntent;
  organizationState: CompanionOrganizationState;
  existingActionCount: number;
  injectedActionIds: string[];
  finalActionCount: number;
  skippedReason?: CompanionEnrichmentSkipReason;
  conversationId?: string;
  queueId?: string;
  correlationId?: string;
};

export type CompanionEnrichmentLogContext = {
  conversationId?: string;
  queueId?: string;
  correlationId?: string;
};

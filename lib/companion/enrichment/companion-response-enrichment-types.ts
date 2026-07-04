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

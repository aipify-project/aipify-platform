import { buildActionForRoute } from "@/lib/companion-platform-knowledge/answer-builder";
import type { PlatformKnowledgeAction } from "@/lib/companion-platform-knowledge/types";
import type { Translator } from "@/lib/i18n/translate";
import type { CompanionEnrichmentActionType } from "./companion-response-enrichment-types";

export type EnrichmentRouteDefinition = {
  id: string;
  labelKey: string;
  href: string;
  routeKey?: string;
  variant: CompanionEnrichmentActionType;
};

/** Canonical enrichment targets — labels resolved via i18n at runtime, never in UI. */
export const COMPANION_ENRICHMENT_ROUTE_CATALOG: Record<string, EnrichmentRouteDefinition> = {
  startFreeTrial: {
    id: "startFreeTrial",
    labelKey: "customerApp.companionPlatformKnowledge.actions.upgradeOptions",
    href: "/pricing",
    routeKey: "upgradeOptions",
    variant: "primary",
  },
  viewPricing: {
    id: "viewPricing",
    labelKey: "customerApp.companionPlatformKnowledge.articles.subscriptionPricing.title",
    href: "/pricing",
    variant: "secondary",
  },
  exploreBusinessPacks: {
    id: "exploreBusinessPacks",
    labelKey: "customerApp.companionPlatformKnowledge.actions.availableBusinessPacks",
    href: "/app/business-packs/available",
    routeKey: "availableBusinessPacks",
    variant: "primary",
  },
  registerOrganization: {
    id: "registerOrganization",
    labelKey: "customerApp.companionPlatformKnowledge.actions.teamMembers",
    href: "/app/organization/team",
    routeKey: "teamMembers",
    variant: "primary",
  },
  bookDemo: {
    id: "bookDemo",
    labelKey: "marketing.navbar.bookDemo",
    href: "/book-demo",
    variant: "secondary",
  },
  contactSupport: {
    id: "contactSupport",
    labelKey: "customerApp.companionPlatformKnowledge.actions.contactSupport",
    href: "/app/support/contact",
    routeKey: "contactSupport",
    variant: "primary",
  },
  explore: {
    id: "explore",
    labelKey: "customerApp.companionPlatformKnowledge.actions.aipifyCompanion",
    href: "/app/companion",
    routeKey: "aipifyCompanion",
    variant: "secondary",
  },
};

export function resolveEnrichmentPlatformAction(
  definition: EnrichmentRouteDefinition,
  t: Translator,
): PlatformKnowledgeAction {
  if (definition.routeKey) {
    const fromRegistry = buildActionForRoute(definition.routeKey, t);
    if (fromRegistry) {
      return {
        ...fromRegistry,
        variant: definition.variant,
      };
    }
  }

  const label = t(definition.labelKey);
  const resolvedLabel = label !== definition.labelKey ? label : definition.id;

  return {
    labelKey: definition.labelKey,
    label: resolvedLabel,
    href: definition.href,
    routeKey: definition.routeKey ?? definition.id,
    variant: definition.variant,
  };
}

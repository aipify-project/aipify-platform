import { normalizeIntegrationQuery } from "@/lib/integration-intelligence/normalize-text";
import type { PlatformKnowledgeAnswer } from "@/lib/companion-platform-knowledge/types";
import type { Translator } from "@/lib/i18n/translate";
import {
  COMPANION_ENRICHMENT_ROUTE_CATALOG,
  resolveEnrichmentPlatformAction,
} from "./companion-enrichment-routes";
import type {
  CompanionEnrichmentAction,
  CompanionOrganizationState,
  CompanionResponseEnrichmentInput,
  CompanionResponseEnrichmentIntent,
  CompanionResponseEnrichmentOutput,
} from "./companion-response-enrichment-types";

const MAX_ENRICHMENT_ACTIONS = 2;
const MAX_TOTAL_ACTIONS = 4;

function actionIdentity(action: { href: string; routeKey?: string }): string {
  return action.routeKey?.trim() || action.href.trim();
}

function toEnrichmentAction(action: {
  label: string;
  href: string;
  routeKey?: string;
  labelKey?: string;
  variant?: "primary" | "secondary";
}): CompanionEnrichmentAction {
  return {
    label: action.label,
    type: action.variant ?? "secondary",
    route: action.href,
    routeKey: action.routeKey,
    labelKey: action.labelKey,
  };
}

function mergeActions(
  existing: CompanionEnrichmentAction[],
  additions: CompanionEnrichmentAction[],
): CompanionEnrichmentAction[] {
  const seen = new Set(existing.map(actionIdentity));
  const merged = [...existing];

  for (const action of additions) {
    if (merged.length >= MAX_TOTAL_ACTIONS) break;
    const key = actionIdentity(action);
    if (seen.has(key)) continue;
    seen.add(key);
    merged.push(action);
  }

  return merged;
}

export function resolveCompanionEnrichmentIntent(
  query: string,
  answer?: Pick<PlatformKnowledgeAnswer, "sourceId" | "source">,
): CompanionResponseEnrichmentIntent {
  const normalized = normalizeIntegrationQuery(query);
  const lower = normalized.toLowerCase();

  if (
    answer?.sourceId === "subscription-pricing" ||
    answer?.sourceId === "upgrade-subscription" ||
    answer?.sourceId === "my-subscription" ||
    /\b(pris\w*|pricing|price|cost|kost\w*|abonnement|subscription|trial|free trial|invoice|faktura)\b/i.test(
      lower,
    )
  ) {
    return "pricing";
  }

  if (
    answer?.sourceId === "business-packs" ||
    /\b(business pack\w*|business packs|modul\w*|marketplace pack\w*)\b/i.test(lower)
  ) {
    return "business_packs";
  }

  if (
    answer?.sourceId === "add-team-members" ||
    answer?.sourceId === "install-web-app" ||
    /\b(onboard\w*|register|registrer\w*|kom i gang|getting started|set up|setup|establish workspace|ny organisasjon)\b/i.test(
      lower,
    )
  ) {
    return "onboarding";
  }

  if (
    answer?.sourceId === "contact-support" ||
    /\b(support|hjelp|help desk|henvendelse|ticket|kontakt support)\b/i.test(lower)
  ) {
    return "support";
  }

  return "general";
}

export function resolveCompanionOrganizationState(
  subscriptionRaw: unknown,
): CompanionOrganizationState {
  if (!subscriptionRaw || typeof subscriptionRaw !== "object") return "unknown";

  const subscription = (subscriptionRaw as { subscription?: { status?: string; plan_key?: string } })
    .subscription;
  const status = subscription?.status?.toLowerCase().trim();

  if (status === "trialing" || status === "trial") return "trial";
  if (status === "active") return "active";
  if (status === "paused" || status === "cancelled" || status === "canceled") return "new";
  return "unknown";
}

function buildIntentActionIds(
  intent: CompanionResponseEnrichmentIntent,
  organizationState: CompanionOrganizationState,
): string[] {
  switch (intent) {
    case "pricing":
      if (organizationState === "active") {
        return ["viewPricing"];
      }
      return ["startFreeTrial", "viewPricing"];
    case "business_packs":
      return ["exploreBusinessPacks"];
    case "onboarding":
      if (organizationState === "active" || organizationState === "trial") {
        return ["bookDemo"];
      }
      return ["registerOrganization", "bookDemo"];
    case "support":
      return ["contactSupport"];
    case "general":
    default:
      return [];
  }
}

function buildEnrichmentActionsForIntent(
  intent: CompanionResponseEnrichmentIntent,
  organizationState: CompanionOrganizationState,
  t: Translator,
): CompanionEnrichmentAction[] {
  const ids = buildIntentActionIds(intent, organizationState);
  const actions: CompanionEnrichmentAction[] = [];

  for (const id of ids) {
    if (actions.length >= MAX_ENRICHMENT_ACTIONS) break;
    const definition = COMPANION_ENRICHMENT_ROUTE_CATALOG[id];
    if (!definition) continue;
    actions.push(toEnrichmentAction(resolveEnrichmentPlatformAction(definition, t)));
  }

  if (intent === "general" && actions.length === 0) {
    const explore = COMPANION_ENRICHMENT_ROUTE_CATALOG.explore;
    actions.push(toEnrichmentAction(resolveEnrichmentPlatformAction(explore, t)));
  }

  return actions;
}

export function enrichCompanionResponseWithTranslator(
  input: Omit<CompanionResponseEnrichmentInput, "existingActions"> & {
    existingActions?: PlatformKnowledgeAnswer["actions"];
    t: Translator;
  },
): CompanionResponseEnrichmentOutput {
  const existing =
    input.existingActions?.map((action) => toEnrichmentAction(action)) ?? [];

  if (input.intent === "general" && existing.length > 0) {
    return { text: input.text, actions: existing };
  }

  const additions = buildEnrichmentActionsForIntent(
    input.intent,
    input.context.organizationState,
    input.t,
  );

  return {
    text: input.text,
    actions: mergeActions(existing, additions),
  };
}
export function enrichCompanionResponse(
  input: CompanionResponseEnrichmentInput & { t: Translator },
): CompanionResponseEnrichmentOutput {
  return enrichCompanionResponseWithTranslator(input);
}

export function enrichCompanionPlatformAnswer(
  answer: PlatformKnowledgeAnswer,
  options: {
    query: string;
    t: Translator;
    organizationState?: CompanionOrganizationState;
  },
): PlatformKnowledgeAnswer {
  const intent = resolveCompanionEnrichmentIntent(options.query, answer);
  const enriched = enrichCompanionResponseWithTranslator({
    text: answer.directAnswer,
    intent,
    context: {
      organizationState: options.organizationState ?? "unknown",
    },
    existingActions: answer.actions,
    t: options.t,
  });

  if (
    enriched.actions.length === answer.actions.length &&
    enriched.actions.every(
      (action, index) =>
        actionIdentity(action) === actionIdentity(toEnrichmentAction(answer.actions[index]!)),
    )
  ) {
    return answer;
  }

  return {
    ...answer,
    actions: enriched.actions.map((action) => ({
      labelKey: action.labelKey ?? action.routeKey ?? action.route,
      label: action.label,
      href: action.route,
      routeKey: action.routeKey ?? action.route,
      variant: action.type,
    })),
  };
}

export async function enrichCompanionSearchJson(
  searchJson: Record<string, unknown>,
  options: {
    query: string;
    locale: string;
    organizationState?: CompanionOrganizationState;
  },
): Promise<Record<string, unknown>> {
  const answer = (searchJson as { answer?: PlatformKnowledgeAnswer }).answer;
  if (!answer?.directAnswer?.trim()) return searchJson;

  const { getDictionary } = await import("@/lib/i18n/get-dictionary");
  const { createTranslator } = await import("@/lib/i18n/translate");
  const { isCoreLocale } = await import("@/lib/i18n/config");

  const locale = isCoreLocale(options.locale) ? options.locale : "en";
  const dict = await getDictionary(locale);
  const t = createTranslator(dict);

  const enrichedAnswer = enrichCompanionPlatformAnswer(answer, {
    query: options.query,
    t,
    organizationState: options.organizationState,
  });

  return {
    ...searchJson,
    answer: enrichedAnswer,
  };
}

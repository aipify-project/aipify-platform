import { normalizeIntegrationQuery } from "@/lib/integration-intelligence/normalize-text";
import type { PlatformKnowledgeAnswer } from "@/lib/companion-platform-knowledge/types";
import type { Translator } from "@/lib/i18n/translate";
import {
  COMPANION_ENRICHMENT_ROUTE_CATALOG,
  resolveEnrichmentPlatformAction,
} from "./companion-enrichment-routes";
import type {
  CompanionEnrichmentAction,
  CompanionEnrichmentDecisionLog,
  CompanionEnrichmentLogContext,
  CompanionEnrichmentSkipReason,
  CompanionOrganizationState,
  CompanionResponseEnrichmentInput,
  CompanionResponseEnrichmentIntent,
  CompanionResponseEnrichmentOutput,
} from "./companion-response-enrichment-types";

export type {
  CompanionEnrichmentDecisionLog,
  CompanionEnrichmentLogContext,
  CompanionEnrichmentSkipReason,
} from "./companion-response-enrichment-types";

const MAX_ENRICHMENT_ACTIONS = 2;
const MAX_TOTAL_ACTIONS = 4;

type EnrichmentLogSink = (decision: CompanionEnrichmentDecisionLog) => void;

let enrichmentLogSink: EnrichmentLogSink | null = null;

/** Test-only hook — captures enrichment decisions without console output. */
export function __setCompanionEnrichmentLogSinkForTests(sink: EnrichmentLogSink | null): void {
  enrichmentLogSink = sink;
}

export function logCompanionEnrichmentDecision(decision: CompanionEnrichmentDecisionLog): void {
  const payload: Record<string, string | number | string[]> = {
    event: decision.event,
    intent: decision.intent,
    organizationState: decision.organizationState,
    existingActionCount: decision.existingActionCount,
    injectedActionIds: decision.injectedActionIds,
    finalActionCount: decision.finalActionCount,
  };

  if (decision.skippedReason) payload.skippedReason = decision.skippedReason;
  if (decision.conversationId) payload.conversationId = decision.conversationId;
  if (decision.queueId) payload.queueId = decision.queueId;
  if (decision.correlationId) payload.correlationId = decision.correlationId;

  console.info("[companion-enrichment]", JSON.stringify(payload));
}

function emitCompanionEnrichmentDecision(decision: CompanionEnrichmentDecisionLog): void {
  if (enrichmentLogSink) {
    enrichmentLogSink(decision);
    return;
  }
  logCompanionEnrichmentDecision(decision);
}

function resolveCatalogActionId(action: CompanionEnrichmentAction): string {
  if (action.routeKey) {
    for (const [id, definition] of Object.entries(COMPANION_ENRICHMENT_ROUTE_CATALOG)) {
      if (definition.routeKey === action.routeKey) return id;
      if (definition.id === action.routeKey) return id;
    }
  }

  for (const [id, definition] of Object.entries(COMPANION_ENRICHMENT_ROUTE_CATALOG)) {
    if (definition.href === action.route && !definition.routeKey) return id;
  }

  for (const [id, definition] of Object.entries(COMPANION_ENRICHMENT_ROUTE_CATALOG)) {
    if (definition.href === action.route) return id;
  }

  return action.routeKey?.trim() || action.route.trim();
}

function resolveInjectedActionIds(
  existing: CompanionEnrichmentAction[],
  finalActions: CompanionEnrichmentAction[],
): string[] {
  const existingKeys = new Set(existing.map(actionIdentity));
  return finalActions
    .filter((action) => !existingKeys.has(actionIdentity(action)))
    .map(resolveCatalogActionId);
}

export function buildCompanionEnrichmentDecisionLog(input: {
  intent: CompanionResponseEnrichmentIntent;
  organizationState: CompanionOrganizationState;
  existingActionCount: number;
  existingActions: CompanionEnrichmentAction[];
  finalActions: CompanionEnrichmentAction[];
  skippedReason?: CompanionEnrichmentSkipReason;
  logContext?: CompanionEnrichmentLogContext;
}): CompanionEnrichmentDecisionLog {
  const injectedActionIds = input.skippedReason
    ? []
    : resolveInjectedActionIds(input.existingActions, input.finalActions);

  let skippedReason = input.skippedReason;
  if (!skippedReason && injectedActionIds.length === 0) {
    skippedReason = "no_new_actions";
  }

  return {
    event: "companion_enrichment_decision",
    intent: input.intent,
    organizationState: input.organizationState,
    existingActionCount: input.existingActionCount,
    injectedActionIds,
    finalActionCount: input.finalActions.length,
    ...(skippedReason ? { skippedReason } : {}),
    ...(input.logContext?.conversationId ? { conversationId: input.logContext.conversationId } : {}),
    ...(input.logContext?.queueId ? { queueId: input.logContext.queueId } : {}),
    ...(input.logContext?.correlationId ? { correlationId: input.logContext.correlationId } : {}),
  };
}

function actionIdentity(action: { href?: string; route?: string; routeKey?: string }): string {
  return action.routeKey?.trim() || action.route?.trim() || action.href?.trim() || "";
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

/** Self-service signup/onboarding — not organization member directory intelligence. */
export function isCompanionOnboardingRegistrationQuery(query: string): boolean {
  const normalized = normalizeIntegrationQuery(query);
  const lower = normalized.toLowerCase();

  if (/\b(medlem|member|medlemmer|members)\b/i.test(lower)) {
    return false;
  }

  return (
    /\b(hvor\s+registrer\w*|where\s+(?:do\s+)?i\s+register|how\s+(?:do\s+)?i\s+register)\b/i.test(
      lower,
    ) ||
    (/\b(hvor|where|how)\b/i.test(lower) &&
      /\b(registrer\w*|register|sign\s*up|signup)\b/i.test(lower) &&
      /\b(meg|myself|me|konto|account|organisasjon|organization|workspace)\b/i.test(lower))
  );
}

/** Pricing/onboarding/support queries need platform knowledge — not lightweight smalltalk. */
export function shouldDeferLightweightConversationalAnswer(
  query: string,
  answer?: Pick<PlatformKnowledgeAnswer, "sourceId" | "source">,
): boolean {
  if (isCompanionOnboardingRegistrationQuery(query)) return true;
  return resolveCompanionEnrichmentIntent(query, answer) !== "general";
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
    /\b(onboard\w*|register|registrer\w*|registrerer jeg|hvor registrer\w*|kom i gang|getting started|set up|setup|establish workspace|ny organisasjon|sign\s*up|signup)\b/i.test(
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
    logContext?: CompanionEnrichmentLogContext;
  },
): PlatformKnowledgeAnswer {
  const organizationState = options.organizationState ?? "unknown";
  const intent = resolveCompanionEnrichmentIntent(options.query, answer);
  const existingActions =
    answer.actions.map((action) => toEnrichmentAction(action));

  if (intent === "general" && existingActions.length > 0) {
    emitCompanionEnrichmentDecision(
      buildCompanionEnrichmentDecisionLog({
        intent,
        organizationState,
        existingActionCount: existingActions.length,
        existingActions,
        finalActions: existingActions,
        skippedReason: "general_existing_actions",
        logContext: options.logContext,
      }),
    );
    return answer;
  }

  const enriched = enrichCompanionResponseWithTranslator({
    text: answer.directAnswer,
    intent,
    context: {
      organizationState,
    },
    existingActions: answer.actions,
    t: options.t,
  });

  const unchanged =
    enriched.actions.length === answer.actions.length &&
    enriched.actions.every(
      (action, index) =>
        actionIdentity(action) === actionIdentity(toEnrichmentAction(answer.actions[index]!)),
    );

  if (unchanged) {
    emitCompanionEnrichmentDecision(
      buildCompanionEnrichmentDecisionLog({
        intent,
        organizationState,
        existingActionCount: existingActions.length,
        existingActions,
        finalActions: existingActions,
        skippedReason: "unchanged_actions",
        logContext: options.logContext,
      }),
    );
    return answer;
  }

  emitCompanionEnrichmentDecision(
    buildCompanionEnrichmentDecisionLog({
      intent,
      organizationState,
      existingActionCount: existingActions.length,
      existingActions,
      finalActions: enriched.actions,
      logContext: options.logContext,
    }),
  );

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
    logContext?: CompanionEnrichmentLogContext;
    t?: Translator;
  },
): Promise<Record<string, unknown>> {
  const answer = (searchJson as { answer?: PlatformKnowledgeAnswer }).answer;
  if (!answer?.directAnswer?.trim()) {
    emitCompanionEnrichmentDecision(
      buildCompanionEnrichmentDecisionLog({
        intent: "general",
        organizationState: options.organizationState ?? "unknown",
        existingActionCount: answer?.actions?.length ?? 0,
        existingActions: [],
        finalActions: [],
        skippedReason: "empty_answer",
        logContext: options.logContext,
      }),
    );
    return searchJson;
  }

  const { createTranslator } = await import("@/lib/i18n/translate");
  const { isCoreLocale } = await import("@/lib/i18n/config");

  const locale = isCoreLocale(options.locale) ? options.locale : "en";
  let t = options.t;
  if (!t) {
    const { getCustomerAppDictionaryForSplits } = await import("@/lib/i18n/get-dictionary");
    const { companionDirectTurnDictionarySplits } = await import(
      "@/lib/companion-runtime/companion-oaa-dictionary-splits"
    );
    const dict = await getCustomerAppDictionaryForSplits(
      locale,
      companionDirectTurnDictionarySplits(),
    );
    t = createTranslator(dict);
  }

  const enrichedAnswer = enrichCompanionPlatformAnswer(answer, {
    query: options.query,
    t,
    organizationState: options.organizationState,
    logContext: options.logContext,
  });

  return {
    ...searchJson,
    answer: enrichedAnswer,
  };
}

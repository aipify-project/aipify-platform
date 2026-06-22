import { normalizeIntegrationQuery } from "@/lib/integration-intelligence/normalize-text";
import type { CompanionActionDefinition } from "./companion-action-definition";
import type { CompanionActionContext } from "./companion-action-context";
import type { CompanionTenantContext } from "./companion-tenant-context";

export type CompanionActionQueryMatch = {
  definition: CompanionActionDefinition;
  score: number;
  intent: "action_request";
};

const ACTION_VERB_PATTERN =
  /\b(send|create|update|delete|export|publish|schedule|approve|trigger|modify|post|submit|execute|run|draft|invite|sync)\b/i;

export function hasCompanionActionIntent(query: string): boolean {
  return ACTION_VERB_PATTERN.test(query);
}

function scoreActionDefinition(query: string, definition: CompanionActionDefinition): number {
  const normalized = normalizeIntegrationQuery(query);
  let score = 0;

  const actionId = normalizeIntegrationQuery(definition.action_id.replace(/\./g, " "));
  const entity = normalizeIntegrationQuery(definition.entity.replace(/_/g, " "));
  const capability = normalizeIntegrationQuery(definition.capability_id.replace(/\./g, " "));

  if (normalized.includes(actionId)) score += 50;
  if (normalized.includes(entity)) score += 30;
  if (capability.split(" ").some((token) => token.length > 3 && normalized.includes(token))) {
    score += 15;
  }

  for (const word of normalized.split(/\s+/)) {
    if (word.length < 4) continue;
    if (actionId.includes(word)) score += 8;
    if (entity.includes(word)) score += 6;
  }

  if (hasCompanionActionIntent(query)) score += 10;

  return score;
}

export function matchCompanionActionQuery(
  query: string,
  tenantContext: CompanionTenantContext,
): CompanionActionQueryMatch | null {
  if (!tenantContext.writeActionsAvailable) return null;
  if (!hasCompanionActionIntent(query)) return null;

  const { actionContext } = tenantContext;
  let best: CompanionActionQueryMatch | null = null;

  for (const definition of actionContext.registry.actions) {
    const score = scoreActionDefinition(query, definition);
    if (score < 25) continue;
    if (!best || score > best.score) {
      best = { definition, score, intent: "action_request" };
    }
  }

  return best;
}

export function isReadOnlyQuery(query: string): boolean {
  const normalized = normalizeIntegrationQuery(query);
  return /\b(show|list|what|how many|status|read|view|check|describe|explain|tell me)\b/i.test(
    normalized,
  );
}

export function shouldPreferReadPath(query: string, actionMatch: CompanionActionQueryMatch | null): boolean {
  if (!actionMatch) return true;
  if (!hasCompanionActionIntent(query)) return true;
  if (isReadOnlyQuery(query) && actionMatch.score < 45) return true;
  return false;
}

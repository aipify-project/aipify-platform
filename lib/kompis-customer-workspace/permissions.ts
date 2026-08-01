import type { KompisConfirmationLevel } from "./enums";
import type {
  KompisCustomerWorkspaceContract,
  KompisWorkspaceContext,
  KompisWorkspacePermissions,
} from "./types";
import { getKompisWorkspaceToolDefinition } from "./tool-registry";

export type ResolveKompisWorkspacePermissionsInput = {
  contract: KompisCustomerWorkspaceContract;
  context: Pick<
    KompisWorkspaceContext,
    "surface" | "route" | "module" | "user_role" | "access_tier" | "entity_type"
  >;
  user_groups?: string[];
};

function matchesList(allowed: string[], value: string): boolean {
  if (!allowed.length) return true;
  return allowed.includes("*") || allowed.includes(value);
}

function routeAllowed(contract: KompisCustomerWorkspaceContract, route: string): boolean {
  if (contract.denied_routes.some((r) => route === r || route.startsWith(`${r}/`))) return false;
  if (!contract.allowed_routes.length) return false;
  return contract.allowed_routes.some((r) => r === "*" || route === r || route.startsWith(`${r}/`));
}

/**
 * Server-authoritative permission evaluator.
 * Deny by default. No client override. Deterministic.
 */
export function resolveKompisWorkspacePermissions(
  input: ResolveKompisWorkspacePermissionsInput
): KompisWorkspacePermissions {
  const { contract, context } = input;
  const denied_reasons: string[] = [];
  const empty: KompisWorkspacePermissions = {
    enabled: false,
    allowed_knowledge_sources: [],
    allowed_context_fields: [],
    allowed_tools: [],
    confirmation_levels: {},
    denied_reasons,
    escalation_options: [],
    effective_locale_policy: contract.locale_policy,
    commercial_guidance_enabled: false,
    support_handoff_enabled: false,
  };

  if (!contract.enabled) {
    denied_reasons.push("contract_disabled");
    return empty;
  }

  const surfaceAuth =
    context.surface === "public_website"
      ? contract.public_enabled
      : contract.authenticated_enabled;
  if (!surfaceAuth) {
    denied_reasons.push("surface_disabled");
    return empty;
  }

  if (!contract.allowed_surfaces.includes(context.surface)) {
    denied_reasons.push("surface_not_allowed");
    return empty;
  }

  if (contract.denied_roles.includes(context.user_role)) {
    denied_reasons.push("role_denied");
    return empty;
  }
  if (contract.allowed_roles.length && !matchesList(contract.allowed_roles, context.user_role)) {
    denied_reasons.push("role_not_allowed");
    return empty;
  }

  if (
    contract.allowed_access_tiers.length &&
    !matchesList(contract.allowed_access_tiers, context.access_tier)
  ) {
    denied_reasons.push("access_tier_not_allowed");
    return empty;
  }

  if (contract.allowed_user_groups.length) {
    const groups = input.user_groups ?? [];
    if (!groups.some((g) => contract.allowed_user_groups.includes(g))) {
      denied_reasons.push("user_group_not_allowed");
      return empty;
    }
  }

  if (!routeAllowed(contract, context.route)) {
    denied_reasons.push("route_not_allowed");
    return empty;
  }

  const allowed_knowledge_sources = contract.knowledge_sources
    .filter((s) => s.enabled)
    .filter((s) => !s.roles.length || matchesList(s.roles, context.user_role))
    .filter((s) => !s.access_tiers.length || matchesList(s.access_tiers, context.access_tier))
    .filter((s) => !s.modules.length || matchesList(s.modules, context.module))
    .filter((s) => !s.routes.length || matchesList(s.routes, context.route))
    .sort((a, b) => b.authority_level - a.authority_level)
    .map((s) => s.source_key);

  const confirmation_levels: Record<string, KompisConfirmationLevel> = {};
  const allowed_tools: string[] = [];

  for (const perm of contract.tool_permissions) {
    if (!perm.enabled) continue;
    if (perm.confirmation_level === "prohibited") continue;
    if (perm.roles.length && !matchesList(perm.roles, context.user_role)) continue;
    if (perm.access_tiers.length && !matchesList(perm.access_tiers, context.access_tier)) continue;
    if (perm.modules.length && !matchesList(perm.modules, context.module)) continue;
    if (perm.routes.length && !matchesList(perm.routes, context.route)) continue;
    const def = getKompisWorkspaceToolDefinition(perm.tool_key);
    if (!def || !def.enabled || def.deprecated) continue;
    allowed_tools.push(perm.tool_key);
    confirmation_levels[perm.tool_key] =
      contract.action_confirmation_policies[perm.tool_key] ??
      perm.confirmation_level ??
      def.default_confirmation;
  }

  const escalation_options: string[] = [];
  if (contract.escalation_policies.support_handoff_enabled) escalation_options.push("support_handoff");
  if (contract.escalation_policies.abuse_escalation_enabled) escalation_options.push("abuse_escalation");
  if (contract.escalation_policies.privacy_escalation_enabled) {
    escalation_options.push("privacy_escalation");
  }

  return {
    enabled: true,
    allowed_knowledge_sources,
    allowed_context_fields: [...contract.context_fields],
    allowed_tools,
    confirmation_levels,
    denied_reasons,
    escalation_options,
    effective_locale_policy: contract.locale_policy,
    commercial_guidance_enabled: contract.risk_policies.commercial_guidance_enabled,
    support_handoff_enabled: contract.support_handoff.enabled,
  };
}

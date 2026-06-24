import type { CustomerActiveLocale } from "@/lib/i18n/customer-active-locale-registry";
import {
  classifyCompanionTurnRoute,
  type CompanionTurnRoute,
} from "./companion-turn-route";
import { resolveDirectDateTimeKind } from "./direct-datetime-answer";
import {
  isLocalDevicePermissionQuery,
  isUserOwnedAccountControlQuery,
} from "@/lib/core/authorization-target";
import {
  resolveOrganizationCapabilityRoute,
  isOrganizationCapabilityQuery,
  type OrganizationExecutionKind,
} from "./organization-capability-resolution";
import { detectOperationalQueryKind } from "./companion-operational-query-match";
import { resolveCompanionExplicitIntent } from "./companion-explicit-intent";

export type CompanionSubmitPath = "direct" | "queued" | "direct_exact_source_or_queue";

const DIRECT_EXACT_SOURCE_KINDS = new Set<OrganizationExecutionKind>(["member_count"]);

function isDirectExactSourceCandidate(
  query: string,
  locale: CustomerActiveLocale,
): boolean {
  if (detectOperationalQueryKind(query)) return true;
  return isSimpleDirectExactSourceQuery(query, locale);
}

export function classifyCompanionSubmitPath(
  query: string,
  locale: CustomerActiveLocale = "en",
  options: { hasAttachments?: boolean; hasActiveArtifact?: boolean } = {},
): CompanionSubmitPath {
  if (options.hasAttachments || options.hasActiveArtifact) {
    return "queued";
  }

  if (resolveDirectDateTimeKind(query)) {
    return "direct";
  }

  if (resolveCompanionExplicitIntent(query)) {
    return "direct";
  }

  const turnRoute = classifyCompanionTurnRoute(query, locale, options);

  if (turnRoute === "lightweight" || turnRoute === "foundation") {
    return "direct";
  }

  if (
    turnRoute === "exact_source" &&
    (isUserOwnedAccountControlQuery(query) || isLocalDevicePermissionQuery(query))
  ) {
    return "direct";
  }

  if (turnRoute === "exact_source" && isOrganizationCapabilityQuery(query, locale)) {
    return "direct";
  }

  if (turnRoute === "exact_source" && isDirectExactSourceCandidate(query, locale)) {
    return "direct_exact_source_or_queue";
  }

  return "queued";
}

export function isSimpleDirectExactSourceQuery(
  query: string,
  locale: CustomerActiveLocale = "en",
): boolean {
  const route = resolveOrganizationCapabilityRoute(query, locale);
  if (!route) return false;
  if (route.confidence === "low") return false;
  return DIRECT_EXACT_SOURCE_KINDS.has(route.execution_kind);
}

export function resolveDirectTurnRoute(
  query: string,
  locale: CustomerActiveLocale = "en",
  options: { hasAttachments?: boolean; hasActiveArtifact?: boolean } = {},
): CompanionTurnRoute | "datetime" {
  if (resolveDirectDateTimeKind(query)) {
    return "datetime";
  }

  const explicitIntent = resolveCompanionExplicitIntent(query);
  if (explicitIntent) return "exact_source";

  return classifyCompanionTurnRoute(query, locale, options);
}

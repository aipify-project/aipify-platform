import type { CustomerActiveLocale } from "@/lib/i18n/customer-active-locale-registry";
import {
  isOrganizationCapabilityQuery,
  resolveOrganizationCapabilityRoute,
  type OrganizationCapabilityRoute,
  type OrganizationExecutionKind,
} from "./organization-capability-resolution";

export type OrganizationIntelligenceIntent = OrganizationCapabilityRoute & {
  kind: OrganizationExecutionKind;
  score: number;
};

/** @deprecated Use resolveOrganizationCapabilityRoute — kept for routing compatibility. */
export function resolveOrganizationIntelligenceIntent(
  query: string,
  locale: CustomerActiveLocale = "en",
): OrganizationIntelligenceIntent | null {
  const route = resolveOrganizationCapabilityRoute(query, locale);
  if (!route) return null;

  return {
    ...route,
    kind: route.execution_kind,
    score: route.confidence === "high" ? 100 : route.confidence === "moderate" ? 60 : 30,
  };
}

export function isOrganizationIntelligenceQuery(query: string, locale: CustomerActiveLocale = "en"): boolean {
  return isOrganizationCapabilityQuery(query, locale);
}

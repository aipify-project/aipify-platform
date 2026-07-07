import type { CustomerActiveLocale } from "@/lib/i18n/customer-active-locale-registry";
import { normalizeIntegrationQuery } from "@/lib/integration-intelligence/normalize-text";
import { hasOrganizationMemberDomainSignal } from "@/lib/core/authorization-target";

/** Organization-specific source domains not yet registered in the capability registry. */
const UNKNOWN_ORGANIZATION_SOURCE_SIGNAL =
  /\b(gjesteliste(?:n|r)?|festplanlegging|festplanlegger|arrangement(?:et|er)?|invitasjonsliste(?:n|r)?|deltakerliste(?:n|r)?|guest\s*lists?|event\s*planning|party\s*planning|invitation\s*lists?|attendee\s*lists?|participant\s*lists?)\b/i;

const FEST_GUEST_CONTEXT_SIGNAL =
  /\b(fest(?:en|er)?|party|parties|bursdag|birthday)\b/i;

const ORGANIZATION_DATA_FETCH_SIGNAL =
  /\b(hent|vis|show|list|liste|hvilke|finn|get|fetch|bring|opp)\b/i;

function hasUnknownOrganizationSourceTerm(normalized: string): boolean {
  if (UNKNOWN_ORGANIZATION_SOURCE_SIGNAL.test(normalized)) return true;
  if (FEST_GUEST_CONTEXT_SIGNAL.test(normalized) && /\b(gjest|guest)\b/i.test(normalized)) {
    return true;
  }
  return false;
}

/** Explicit community-member search/list — must keep routing to member.search. */
export function hasExplicitOrganizationMemberSearchIntent(query: string): boolean {
  const normalized = normalizeIntegrationQuery(query);
  const hasMemberSignal =
    hasOrganizationMemberDomainSignal(normalized) || /\bmedlemmet\b/i.test(normalized);

  if (!hasMemberSignal) return false;

  return (
    /\b(finn|søk|search|find)\b/i.test(normalized) ||
    /\bmedlemmet\b/i.test(normalized) ||
    /\b(medlemmer|members)\s+(som|who|named|med|with)\b/i.test(normalized) ||
    /\b(søk etter medlem|search for member|find member|finn medlem)\b/i.test(normalized) ||
    /\b(med e-post|with email|e-postadresse|email address)\b/i.test(normalized) ||
    /\b(vis|show)\s+(aktive\s+)?(medlemmer|members)\b/i.test(normalized) ||
    /\b(medlemmer|members)\s+med\b/i.test(normalized)
  );
}

export function isUnknownOrganizationSourceIntent(
  query: string,
  _locale: CustomerActiveLocale = "en",
): boolean {
  const normalized = normalizeIntegrationQuery(query);
  if (!normalized.trim()) return false;
  if (!hasUnknownOrganizationSourceTerm(normalized)) return false;
  if (hasExplicitOrganizationMemberSearchIntent(query)) return false;
  return true;
}

export function shouldRouteUnknownOrganizationSourceAsExact(
  query: string,
  locale: CustomerActiveLocale = "en",
): boolean {
  return isUnknownOrganizationSourceIntent(query, locale);
}

export function hasUnknownOrganizationSourceFetchIntent(query: string): boolean {
  const normalized = normalizeIntegrationQuery(query);
  if (!hasUnknownOrganizationSourceTerm(normalized)) return false;
  return ORGANIZATION_DATA_FETCH_SIGNAL.test(normalized) || normalized.split(/\s+/).length <= 6;
}

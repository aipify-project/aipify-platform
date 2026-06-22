import { normalizeIntegrationQuery } from "@/lib/integration-intelligence/normalize-text";

const COMMUNITY_DOMAIN_PATTERN =
  /\b(community|fellesskap|membership|medlemskap|member|medlem|moderation|moderering|moderate|leaderboard|referral|birthday|gift|listing|marketplace|engagement|report|verification queue|verifiseringskø)\b/;

const ORGANIZATION_CONNECTION_PATTERN =
  /(organisasjon|organization|arbeidsområde|arbeidsomrade|workspace).*(koblet|connected|tilkoblet|tilkobling|connection|integrert|integrated)/;

const CONNECTION_ORGANIZATION_PATTERN =
  /(koblet|connected|tilkoblet|tilkobling|connection|integrert|integrated).*(organisasjon|organization|arbeidsområde|arbeidsomrade|workspace|aipify)/;

const WORKSPACE_CONNECTION_PATTERN =
  /\b(er vi koblet|are we connected|har vi koblet|have we connected|is (the )?organization connected|er organisasjonen koblet)\b/;

const CONNECTION_STATUS_PATTERN =
  /\b(tilkoblingsstatus|connection status|integrasjonsstatus|integration status|tilkoblingsstatusen)\b/;

/** Questions about whether the active organization is connected to Aipify — not community/moderation. */
export function isOrganizationConnectionStatusQuery(query: string): boolean {
  const q = normalizeIntegrationQuery(query);
  if (!q) return false;

  const mentionsCommunityDomain = COMMUNITY_DOMAIN_PATTERN.test(q);
  const asksOrganizationConnection =
    ORGANIZATION_CONNECTION_PATTERN.test(q) ||
    CONNECTION_ORGANIZATION_PATTERN.test(q) ||
    WORKSPACE_CONNECTION_PATTERN.test(q) ||
    (CONNECTION_STATUS_PATTERN.test(q) &&
      /(organisasjon|organization|arbeidsområde|arbeidsomrade|workspace|aipify)/.test(q));

  if (!asksOrganizationConnection) return false;
  if (mentionsCommunityDomain && !/(organisasjon|organization|aipify|workspace|arbeidsomr)/.test(q)) {
    return false;
  }

  return true;
}

const ORGANIZATION_CONNECTION_ROLES = new Set(["organization_owner", "organization_admin"]);

export function canViewOrganizationConnectionStatus(input: {
  organizationId: string | null;
  organizationRole: string | null;
}): boolean {
  if (!input.organizationId) return false;
  const role = input.organizationRole;
  return role != null && ORGANIZATION_CONNECTION_ROLES.has(role);
}

export function shouldBypassCommunityForOrganizationConnection(query: string): boolean {
  return isOrganizationConnectionStatusQuery(query);
}

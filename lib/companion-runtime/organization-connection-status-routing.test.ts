import assert from "node:assert/strict";
import { hasCommunityProviderIntent } from "./community-answer";
import { createEmptyCompanionTenantContext } from "./companion-tenant-context";
import {
  canViewOrganizationConnectionStatus,
  isOrganizationConnectionStatusQuery,
  shouldBypassCommunityForOrganizationConnection,
} from "@/lib/companion-platform-knowledge/organization-connection-status-intent";
import { detectLiveIntegrationStatusIntent } from "@/lib/companion-platform-knowledge/integration-status-intent";
import { resolveCompanionLiveToolRouting } from "@/lib/companion-platform-knowledge/live-routing";
import { detectGenericIntegrationIntent } from "@/lib/integration-intelligence/intent-detection";

const ACCEPTANCE_QUERY = "Er organisasjonen koblet til Aipify?";

assert.equal(isOrganizationConnectionStatusQuery(ACCEPTANCE_QUERY), true);
assert.equal(shouldBypassCommunityForOrganizationConnection(ACCEPTANCE_QUERY), true);
assert.equal(hasCommunityProviderIntent(ACCEPTANCE_QUERY), false);

assert.equal(
  detectLiveIntegrationStatusIntent(ACCEPTANCE_QUERY)?.queryKind,
  "status",
);
assert.equal(
  resolveCompanionLiveToolRouting(ACCEPTANCE_QUERY, {
    integrationContext: "unonight",
    locale: "no",
  }).tool,
  "get_connection_status",
);
assert.equal(
  detectGenericIntegrationIntent(ACCEPTANCE_QUERY, "unonight", "no", {
    activeProviderKey: "unonight",
  })?.capability,
  "connection_status",
);

const ownerTenant = createEmptyCompanionTenantContext({
  organizationId: "org-1",
  organizationRole: "organization_owner",
  connectedProviders: ["unonight"],
  primaryVerifiedProvider: "unonight",
});
assert.equal(canViewOrganizationConnectionStatus(ownerTenant), true);

const adminTenant = createEmptyCompanionTenantContext({
  organizationId: "org-1",
  organizationRole: "organization_admin",
  connectedProviders: ["unonight"],
  primaryVerifiedProvider: "unonight",
});
assert.equal(canViewOrganizationConnectionStatus(adminTenant), true);

const memberTenant = createEmptyCompanionTenantContext({
  organizationId: "org-1",
  organizationRole: "organization_member",
  connectedProviders: ["unonight"],
  primaryVerifiedProvider: "unonight",
});
assert.equal(canViewOrganizationConnectionStatus(memberTenant), false);

assert.equal(
  isOrganizationConnectionStatusQuery("How many community members need moderation?"),
  false,
);
assert.equal(hasCommunityProviderIntent("How many community members need moderation?"), true);

console.log("organization connection status routing tests passed");

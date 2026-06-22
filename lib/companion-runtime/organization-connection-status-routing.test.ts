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
import { PILOT_INTEGRATION_PROVIDER_KEY } from "@/lib/integration-intelligence/pilot-integration-fixture";

const ACCEPTANCE_QUERY = "Er organisasjonen koblet til Aipify?";
const pilotProvider = PILOT_INTEGRATION_PROVIDER_KEY;

assert.equal(isOrganizationConnectionStatusQuery(ACCEPTANCE_QUERY), true);
assert.equal(shouldBypassCommunityForOrganizationConnection(ACCEPTANCE_QUERY), true);
assert.equal(hasCommunityProviderIntent(ACCEPTANCE_QUERY), false);

assert.equal(
  detectLiveIntegrationStatusIntent(ACCEPTANCE_QUERY)?.queryKind,
  "status",
);
assert.equal(
  resolveCompanionLiveToolRouting(ACCEPTANCE_QUERY, {
    integrationContext: pilotProvider,
    locale: "no",
  }).tool,
  "get_connection_status",
);
assert.equal(
  detectGenericIntegrationIntent(ACCEPTANCE_QUERY, pilotProvider, "no", {
    activeProviderKey: pilotProvider,
  })?.capability,
  "connection_status",
);

const ownerTenant = createEmptyCompanionTenantContext({
  organizationId: "org-1",
  organizationRole: "organization_owner",
  connectedProviders: [pilotProvider],
  primaryVerifiedProvider: pilotProvider,
});
assert.equal(canViewOrganizationConnectionStatus(ownerTenant), true);

const adminTenant = createEmptyCompanionTenantContext({
  organizationId: "org-1",
  organizationRole: "organization_admin",
  connectedProviders: [pilotProvider],
  primaryVerifiedProvider: pilotProvider,
});
assert.equal(canViewOrganizationConnectionStatus(adminTenant), true);

const memberTenant = createEmptyCompanionTenantContext({
  organizationId: "org-1",
  organizationRole: "organization_member",
  connectedProviders: [pilotProvider],
  primaryVerifiedProvider: pilotProvider,
});
assert.equal(canViewOrganizationConnectionStatus(memberTenant), false);

assert.equal(
  isOrganizationConnectionStatusQuery("How many community members need moderation?"),
  false,
);
assert.equal(hasCommunityProviderIntent("How many community members need moderation?"), true);

console.log("organization connection status routing tests passed");

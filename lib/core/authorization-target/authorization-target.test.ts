import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { createTranslator } from "@/lib/i18n/translate";
import {
  resolveAuthorizationTargetFromQuery,
  type ProviderAuthorizationDescriptor,
} from "@/lib/core/authorization-target";
import { resolveOrganizationCapabilityRoute } from "@/lib/companion-runtime/organization-capability-resolution";
import {
  buildOrganizationAccessApproverDirectAnswer,
  buildUserOwnedAccountConnectionAnswer,
  resolveAuthorizationTargetCompanionAnswer,
} from "@/lib/companion-runtime/authorization-target-routing";
import { mapOrganizationAccessRpcError } from "@/lib/core/authorization-target/map-organization-access-error";
import { ORGANIZATION_ACCESS_RPC_ERROR_CODES } from "@/lib/core/authorization-target/types";
import { resolveOrganizationAccessGate } from "@/lib/companion-runtime/organization-access-gate";
import { resolveAccessOfferFromCapability } from "@/lib/companion-runtime/organization-access-approval-bridge";

const FIXTURE_USER_OWNED_MEDIA: ProviderAuthorizationDescriptor = {
  provider_key: "fixture_user_owned_media",
  resource_ownership: "user_owned_account",
  consent_type: "personal_oauth",
  capability_keys: ["playback.start"],
  search_terms: ["spotify", "streaming"],
  connection_readiness: "oauth_required",
  provider_label_key: "customerApp.authorizationTarget.providers.personalStreamingAccount.label",
};

const FIXTURE_ORG_DATA: ProviderAuthorizationDescriptor = {
  provider_key: "fixture_org_data",
  resource_ownership: "organization_owned_resource",
  consent_type: "organization_access_approval",
  capability_keys: ["organization.metrics.read"],
  search_terms: ["member totals", "medlemstall"],
  connection_readiness: "adapter_missing",
};

const FIXTURE_LOCAL_DEVICE: ProviderAuthorizationDescriptor = {
  provider_key: "fixture_local_device",
  resource_ownership: "local_device_permission",
  consent_type: "local_device_permission",
  capability_keys: ["device.read"],
  search_terms: ["speaker", "hoyttaler"],
  connection_readiness: "permission_required",
};

const repoRoot = path.join(import.meta.dirname, "..", "..", "..");

const MEDIA_QUERIES = [
  "Kan du styre musikken for meg?",
  "Koble til musikkontoen min",
  "Kan du styre Spotify for meg?",
  "Styr Spotify",
];

for (const query of MEDIA_QUERIES) {
  const target = resolveAuthorizationTargetFromQuery(query, "no", [FIXTURE_USER_OWNED_MEDIA]);
  assert.equal(target?.ownership, "user_owned_account", query);
  assert.equal(resolveOrganizationCapabilityRoute(query, "no"), null, `org route blocked: ${query}`);
}

const orgMemberQuery = "Hent organisasjonens medlemstall";
assert.equal(
  resolveAuthorizationTargetFromQuery(orgMemberQuery, "no", [FIXTURE_ORG_DATA])?.ownership,
  "organization_owned_resource",
);
const orgRoute = resolveOrganizationCapabilityRoute(orgMemberQuery, "no");
assert.equal(orgRoute?.execution_kind, "member_count", orgMemberQuery);

const deviceQuery = "Gi mikrofontilgang på denne enheten";
assert.equal(
  resolveAuthorizationTargetFromQuery(deviceQuery, "no", [FIXTURE_LOCAL_DEVICE])?.ownership,
  "local_device_permission",
);
assert.equal(resolveOrganizationCapabilityRoute(deviceQuery, "no"), null);

const memberCountQuery = "Hvor mange medlemmer har vi?";
assert.equal(resolveOrganizationCapabilityRoute(memberCountQuery, "no")?.execution_kind, "member_count");

async function loadNoTranslator() {
  const settings = JSON.parse(
    fs.readFileSync(path.join(repoRoot, "locales/no/customer-app/settings.json"), "utf8"),
  ) as Record<string, unknown>;
  return createTranslator({ customerApp: settings });
}

async function runAuthorizationTargetTests() {
const t = await loadNoTranslator();

for (const query of MEDIA_QUERIES) {
  const answer = resolveAuthorizationTargetCompanionAnswer(query, {
    t,
    locale: "no",
    extraDescriptors: [FIXTURE_USER_OWNED_MEDIA],
  });
  assert.ok(answer?.answer.directAnswer, query);
  assert.ok(!answer?.answer.directAnswer.includes("No Authority Message"), query);
  assert.ok(!answer?.answer.directAnswer.includes("organization_member_count"), query);
  assert.equal(answer?.answer.actions?.[0]?.label, t("customerApp.authorizationTarget.userOwned.actions.connect"));
}

const approverAnswer = buildOrganizationAccessApproverDirectAnswer({
  t,
  provider_key: "organization_member_count",
  binding: {
    intent: "approve",
    provider_key: "organization_member_count",
    capability_key: "member.search",
    ownership_type: "organization_owned_resource",
    organization_id: "org-1",
    user_message_id: "msg-1",
    request_id: null,
  },
});
assert.ok(approverAnswer.directAnswer.includes("APP-panel"));
assert.equal(approverAnswer.actions?.[0]?.label, "Godkjenn tilgang");
assert.ok(!approverAnswer.actions?.some((action) => action.label.includes("Send forespørsel")));

const userOwnedAnswer = buildUserOwnedAccountConnectionAnswer({
  t,
  target: {
    ownership: "user_owned_account",
    consent_type: "personal_oauth",
    provider_key: "fixture_user_owned_media",
    capability_key: "playback.start",
    connection_readiness: "oauth_required",
    confidence: "high",
    resolution_source: "provider_manifest",
  },
});
assert.ok(userOwnedAnswer.actions?.some((action) => action.label === "Koble til konto"));
assert.ok(!userOwnedAnswer.explanation?.includes("Why Needed"));

assert.equal(
  mapOrganizationAccessRpcError(ORGANIZATION_ACCESS_RPC_ERROR_CODES.approverShouldGrantDirectly),
  "customerApp.authorizationTarget.errors.approverShouldGrantDirectly",
);

const gate = await resolveOrganizationAccessGate({
  supabase: {
    rpc: async () => ({ data: false, error: null }),
  } as never,
  t,
  offer: resolveAccessOfferFromCapability({
    provider_key: "community_member_directory",
    capability_key: "member.search",
    execution_kind: "member_count",
  }),
  providerReady: true,
  effectivePermissions: ["customer_community.view"],
  capabilityKey: "member.search",
  sourceReference: "get_customer_member_directory_center",
  organizationRole: "owner",
  organizationId: "org-1",
  userMessageId: "msg-1",
});

assert.equal(gate.gate?.answer.sourceId, "organization-access-approver-direct");
assert.ok(!gate.gate?.answer.actions?.some((action) => action.label === "Send forespørsel"));

const resolverSource = fs.readFileSync(
  path.join(repoRoot, "lib/core/authorization-target/resolve-authorization-target.ts"),
  "utf8",
);
const registrySource = fs.readFileSync(
  path.join(repoRoot, "lib/core/authorization-target/provider-authorization-registry.ts"),
  "utf8",
);
assert.equal(/\bspotify\b/i.test(resolverSource), false);
assert.equal(/\bunonight\b/i.test(resolverSource), false);
assert.equal(registrySource.includes("integration-intelligence/media"), false);

const spotifyQuery = "kan du styre Spotify for meg";
assert.equal(resolveOrganizationCapabilityRoute(spotifyQuery, "no"), null);
assert.equal(
  resolveAuthorizationTargetFromQuery(spotifyQuery, "no")?.ownership,
  "user_owned_account",
);

console.log("authorization-target.test.ts: all assertions passed");
}

void runAuthorizationTargetTests();

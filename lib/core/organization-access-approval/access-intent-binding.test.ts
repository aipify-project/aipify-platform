import assert from "node:assert/strict";
import {
  buildOrganizationAccessContextPayload,
  buildOrganizationAccessIdempotencyKey,
  buildOrganizationAccessIntentHref,
  isOrganizationAccessCreateBinding,
  organizationAccessIntentBindingsMatch,
  parseOrganizationAccessIntentBinding,
} from "@/lib/core/organization-access-approval/access-intent-binding";
import { resolveOrganizationCapabilityRoute } from "@/lib/companion-runtime/organization-capability-resolution";
import { resolveAuthorizationTargetFromQuery } from "@/lib/core/authorization-target";

function params(input: Record<string, string>) {
  return new URLSearchParams(input);
}

const spotifyQuery = "kan du styre Spotify for meg";
assert.equal(resolveOrganizationCapabilityRoute(spotifyQuery, "no"), null);
assert.equal(resolveAuthorizationTargetFromQuery(spotifyQuery, "no")?.ownership, "user_owned_account");

const memberQuery = "Hvor mange medlemmer har vi?";
assert.equal(resolveOrganizationCapabilityRoute(memberQuery, "no")?.execution_kind, "member_count");

const spotifyBinding = parseOrganizationAccessIntentBinding(
  params({
    intent: "connect",
    provider: "personal_streaming_account",
    capability: "playback.start",
    ownership_type: "user_owned_account",
    user_message_id: "msg-spotify",
  }),
);
assert.ok(spotifyBinding);
assert.equal(spotifyBinding?.ownership_type, "user_owned_account");

const memberBinding = parseOrganizationAccessIntentBinding(
  params({
    intent: "create",
    provider: "organization_member_count",
    capability: "member.search",
    ownership_type: "organization_owned_resource",
    organization_id: "org-1",
    user_message_id: "msg-member",
  }),
);
assert.ok(memberBinding && isOrganizationAccessCreateBinding(memberBinding));

assert.equal(
  organizationAccessIntentBindingsMatch(spotifyBinding!, memberBinding!),
  false,
  "consecutive intents must not reuse prior binding",
);

const href = buildOrganizationAccessIntentHref("/app/settings/organization-access", memberBinding!);
assert.ok(href.includes("intent=create"));
assert.ok(href.includes("provider=organization_member_count"));
assert.ok(href.includes("capability=member.search"));
assert.ok(href.includes("ownership_type=organization_owned_resource"));
assert.ok(href.includes("organization_id=org-1"));
assert.ok(href.includes("user_message_id=msg-member"));

const payload = buildOrganizationAccessContextPayload(memberBinding!);
assert.equal(payload.ownership_type, "organization_owned_resource");
assert.equal(payload.user_message_id, "msg-member");
assert.equal(payload.capability_key, "member.search");

const idempotency = buildOrganizationAccessIdempotencyKey(memberBinding!);
assert.ok(idempotency.includes("organization_member_count"));
assert.ok(idempotency.includes("msg-member"));

console.log("access-intent-binding.test.ts: all assertions passed");

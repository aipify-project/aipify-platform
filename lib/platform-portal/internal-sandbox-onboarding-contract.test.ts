import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { join } from "node:path";

import {
  ADMIN_PROVISION_INVITE_DELIVERY_CONNECTED,
} from "./admin-provisioning";
import {
  CUSTOMER_CREATE_EXECUTE_ENABLED,
  CUSTOMER_CREATE_EXECUTE_OWNER_ALLOWLIST,
} from "./create-customer-prepare";
import {
  KOMPIS_BEDRIFT_ACTIVATE_OWNER_ALLOWLIST,
} from "./kompis-bedrift-activation";
import {
  PLATFORM_CUSTOMER_LEGAL_ACCEPTANCE_SOURCE_CONNECTED,
} from "./legal-acceptance-evidence-contract";
import {
  INTERNAL_SANDBOX_CLASSIFICATION,
  INTERNAL_SANDBOX_INTENDED_ADMIN_EMAIL,
  INTERNAL_SANDBOX_INTENDED_LEGAL_NAME,
  INTERNAL_SANDBOX_LEGAL_EXCEPTION_PROPOSAL,
  INTERNAL_SANDBOX_ONBOARDING_CONTRACT_ID,
  INTERNAL_SANDBOX_ONBOARDING_EXECUTE_ENABLED,
  assertInternalSandboxPrepareHasNoSideEffects,
  buildInternalSandboxOnboardingPreparePacket,
  isInternalSandboxSlugAllowed,
} from "./internal-sandbox-onboarding-contract";

assert.equal(INTERNAL_SANDBOX_ONBOARDING_EXECUTE_ENABLED, false);
assert.equal(INTERNAL_SANDBOX_INTENDED_LEGAL_NAME, "Aipify Group AS");
assert.equal(INTERNAL_SANDBOX_INTENDED_ADMIN_EMAIL, "admin@aipify.tech");
assert.equal(INTERNAL_SANDBOX_CLASSIFICATION, "INTERNAL_SANDBOX");
assert.equal(
  INTERNAL_SANDBOX_LEGAL_EXCEPTION_PROPOSAL.status,
  "PROPOSED_NOT_APPROVED",
);

const packet = buildInternalSandboxOnboardingPreparePacket({
  authIdentityPresent: false,
});

assert.equal(packet.contractId, INTERNAL_SANDBOX_ONBOARDING_CONTRACT_ID);
assert.equal(packet.mode, "prepare");
assert.equal(packet.dryRun, true);
assert.equal(packet.executeEnabled, false);
assert.ok(assertInternalSandboxPrepareHasNoSideEffects(packet));

assert.equal(packet.createPayloadPreview.organizationNumber, null);
assert.equal(
  packet.createPayloadPreview.organizationNumberStatus,
  "UNKNOWN_PENDING_OWNER",
);
assert.equal(packet.createPayloadPreview.slug, null);
assert.equal(
  packet.createPayloadPreview.environmentControlStatus,
  "not_enforced",
);
assert.equal(
  packet.createPayloadPreview.billableControlStatus,
  "not_enforced",
);
assert.equal(
  packet.createPayloadPreview.environmentTypeIfCreatedToday,
  "production",
);

assert.equal(packet.adminHandshake.domainOwnedPerPolicy, false);
assert.equal(packet.adminHandshake.authIdentityPresent, false);
assert.equal(packet.adminHandshake.inviteOrganizationUserIsStub, true);
assert.equal(packet.adminHandshake.inviteDeliveryConnected, false);

assert.equal(packet.legal.sourceConnected, false);
assert.equal(packet.legal.agreementStatus, "AGREEMENT_UNVERIFIED");
assert.equal(PLATFORM_CUSTOMER_LEGAL_ACCEPTANCE_SOURCE_CONNECTED, false);

assert.equal(CUSTOMER_CREATE_EXECUTE_ENABLED, false);
assert.equal(CUSTOMER_CREATE_EXECUTE_OWNER_ALLOWLIST.size, 0);
assert.equal(ADMIN_PROVISION_INVITE_DELIVERY_CONNECTED, false);
assert.equal(KOMPIS_BEDRIFT_ACTIVATE_OWNER_ALLOWLIST.size, 0);
assert.equal(packet.gates.customerCreateAllowlistSize, 0);
assert.equal(packet.gates.bedriftActivateAllowlistSize, 0);
assert.equal(packet.gates.existingPlatformAipifyGroupIsNotSandboxTenant, true);

const pendingCodes = new Set(packet.pending.map((p) => p.code));
for (const code of [
  "organization_number_owner_verification",
  "admin_email_domain_ownership",
  "admin_auth_identity_absent",
  "legal_policy_internal_sandbox",
  "sandbox_classification_controls",
  "customer_create_execute_authorization",
  "invite_delivery_and_accept_contract",
  "bedrift_activate_authorization",
  "slug_owner_choice",
] as const) {
  assert.ok(pendingCodes.has(code), `missing pending ${code}`);
}

assert.equal(isInternalSandboxSlugAllowed("aipify-group"), false);
assert.equal(isInternalSandboxSlugAllowed("aipify"), false);
assert.equal(isInternalSandboxSlugAllowed("platform"), false);
assert.equal(isInternalSandboxSlugAllowed("aipify-bedrift-sandbox"), true);

const reservedProposal = buildInternalSandboxOnboardingPreparePacket({
  proposedSlug: "aipify-group",
  authIdentityPresent: false,
});
assert.ok(
  reservedProposal.pending.some(
    (p) =>
      p.code === "slug_owner_choice" &&
      p.detail.includes("aipify-group"),
  ),
);

// Source guards — no execute enablement sneaks in.
const src = readFileSync(
  join(
    process.cwd(),
    "lib/platform-portal/internal-sandbox-onboarding-contract.ts",
  ),
  "utf8",
);
assert.match(src, /INTERNAL_SANDBOX_ONBOARDING_EXECUTE_ENABLED = false/);
assert.match(src, /PROPOSED_NOT_APPROVED/);
assert.match(src, /UNKNOWN_PENDING_OWNER/);
assert.doesNotMatch(src, /organizationNumber:\s*["']\d{9}["']/);

const createSql = readFileSync(
  join(
    process.cwd(),
    "supabase/migrations/20261934400000_platform_portal_customer_creation_global_identity.sql",
  ),
  "utf8",
);
assert.match(createSql, /'production'/);
assert.doesNotMatch(
  createSql,
  /environment_type,\s*\n\s*'internal'/,
);

console.log("internal-sandbox-onboarding-contract: all tests passed");

import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import {
  canApproveOrganizationAccess,
  canApproveRequestedScopes,
  canSubmitOrganizationAccessRequest,
  isOrganizationAccessApprover,
} from "@/lib/core/organization-access-approval/approval-policy";
import {
  canRetryOrganizationCapabilityAfterApproval,
  resolveOrganizationAccessAuthorization,
  resolvesBusinessPackEntitlementWithoutOrganizationGrant,
  userHasPermissionsForScopes,
} from "@/lib/core/organization-access-approval/access-authorization-resolver";
import {
  normalizeOrganizationAccessProviderKey,
  resolveProviderAccessManifest,
  resolveScopesForCapability,
} from "@/lib/core/organization-access-approval/provider-scope-registry";
import { ORGANIZATION_PROVIDER_ACCESS_MANIFESTS } from "@/lib/core/organization-access-approval/provider-scope-registry";
import {
  resolveAccessOfferFromCapability,
  resolveAccessProviderKeyForRoute,
} from "@/lib/companion-runtime/organization-access-approval-bridge";

const repoRoot = path.join(import.meta.dirname, "..", "..", "..");
const CORE_LOCALES = ["en", "no", "sv", "da", "pl", "uk"] as const;

function loadSettingsLocale(locale: string): Record<string, unknown> {
  return JSON.parse(
    fs.readFileSync(path.join(repoRoot, `locales/${locale}/customer-app/settings.json`), "utf8"),
  ) as Record<string, unknown>;
}

function getNested(obj: Record<string, unknown>, keyPath: string): unknown {
  return keyPath.split(".").reduce<unknown>((current, part) => {
    if (!current || typeof current !== "object") return undefined;
    return (current as Record<string, unknown>)[part];
  }, obj);
}

assert.equal(canSubmitOrganizationAccessRequest({ role: "staff", effective_permissions: [] }), true);
assert.equal(canSubmitOrganizationAccessRequest({ role: null, effective_permissions: [] }), false);

assert.equal(
  canApproveOrganizationAccess({ role: "staff", effective_permissions: [] }),
  false,
  "employee cannot approve org access",
);
assert.equal(
  canApproveOrganizationAccess({ role: "owner", effective_permissions: [] }),
  true,
  "owner can approve",
);
assert.equal(
  canApproveOrganizationAccess({ role: "administrator", effective_permissions: [] }),
  true,
  "administrator can approve",
);
assert.equal(
  canApproveOrganizationAccess({
    role: "staff",
    effective_permissions: ["governance.approve"],
  }),
  true,
  "delegated governance approver can review",
);

const supportScopes = ORGANIZATION_PROVIDER_ACCESS_MANIFESTS.find(
  (entry) => entry.provider_key === "autonomous_support_operations",
)!.required_scopes;

assert.equal(
  canApproveRequestedScopes(
    { role: "staff", effective_permissions: ["governance.approve", "support.view_metrics"] },
    supportScopes,
  ),
  true,
  "delegated admin with scope permission can approve support SLA scopes",
);

assert.equal(
  canApproveRequestedScopes(
    { role: "staff", effective_permissions: ["governance.approve"] },
    supportScopes,
  ),
  false,
  "delegated admin without support scope permission is limited",
);

assert.equal(isOrganizationAccessApprover({ role: "owner", effective_permissions: [] }), true);

const memberScopes = ["community.members.read"];

assert.equal(
  resolveOrganizationAccessAuthorization({
    provider_key: "community_member_directory",
    scope_keys: memberScopes,
    provider_ready: false,
    effective_permissions: ["customer_community.view"],
    organization_has_active_scope: false,
  }).state,
  "provider_not_connected",
  "state A: missing provider adapter",
);

assert.equal(
  resolveOrganizationAccessAuthorization({
    provider_key: "community_member_directory",
    scope_keys: memberScopes,
    provider_ready: true,
    effective_permissions: [],
    organization_has_active_scope: true,
  }).state,
  "user_role_denied",
  "state C: missing user role never shows org request path",
);

assert.equal(
  resolveOrganizationAccessAuthorization({
    provider_key: "community_member_directory",
    scope_keys: memberScopes,
    provider_ready: true,
    effective_permissions: ["customer_community.view"],
    organization_has_active_scope: false,
  }).state,
  "organization_scope_required",
  "state B: provider ready + user role ok + org scope missing",
);

const authorized = resolveOrganizationAccessAuthorization({
  provider_key: "community_member_directory",
  scope_keys: memberScopes,
  provider_ready: true,
  effective_permissions: ["customer_community.view"],
  organization_has_active_scope: true,
});

assert.equal(authorized.state, "authorized");
assert.equal(canRetryOrganizationCapabilityAfterApproval(authorized), true);

assert.equal(
  canRetryOrganizationCapabilityAfterApproval({
    ...authorized,
    state: "authorized",
    user_has_required_role: false,
  }),
  false,
  "approved org scope without user role still blocks data retry",
);

assert.deepEqual(
  userHasPermissionsForScopes(["customer_community.view"], memberScopes).missing,
  [],
);

assert.deepEqual(
  userHasPermissionsForScopes([], memberScopes).missing,
  ["customer_community.view"],
);

assert.equal(
  normalizeOrganizationAccessProviderKey("member_verification_center"),
  "member_verification",
);
assert.equal(
  resolveAccessProviderKeyForRoute({
    provider_key: "community_member_directory",
    execution_kind: "member_count",
  }),
  "organization_member_count",
);

const offer = resolveAccessOfferFromCapability({
  provider_key: "member_verification_center",
  capability_key: "verification_queue.read",
  execution_kind: "member_pending_verification",
});
assert.deepEqual(offer.scope_keys, ["verification.queue.read"]);
assert.ok(resolveProviderAccessManifest("community_member_verification"));

const supportQueueScopes = ["support.queue.read"];

assert.equal(
  resolveOrganizationAccessAuthorization({
    provider_key: "support_ai_engine",
    scope_keys: supportQueueScopes,
    provider_ready: true,
    effective_permissions: ["support.view"],
    organization_has_active_scope: false,
  }).state,
  "organization_scope_required",
  "internal pack without entitlement bypass input still requires grant when scope flag is false",
);

assert.equal(
  resolvesBusinessPackEntitlementWithoutOrganizationGrant({
    provider_key: "support_ai_engine",
    scope_keys: supportQueueScopes,
    provider_ready: true,
    effective_permissions: ["support.view"],
  }),
  true,
  "internal Support AI pack read scope authorizes without organization grant when ready and permitted",
);

assert.equal(
  resolveOrganizationAccessAuthorization({
    provider_key: "support_ai_engine",
    scope_keys: supportQueueScopes,
    provider_ready: true,
    effective_permissions: ["support.view"],
    organization_has_active_scope: resolvesBusinessPackEntitlementWithoutOrganizationGrant({
      provider_key: "support_ai_engine",
      scope_keys: supportQueueScopes,
      provider_ready: true,
      effective_permissions: ["support.view"],
    }),
  }).state,
  "authorized",
  "internal Support AI provider + ready + permission + read scope + no grant → authorized",
);

assert.equal(
  resolveOrganizationAccessAuthorization({
    provider_key: "support_ai_engine",
    scope_keys: supportQueueScopes,
    provider_ready: false,
    effective_permissions: ["support.view"],
    organization_has_active_scope: resolvesBusinessPackEntitlementWithoutOrganizationGrant({
      provider_key: "support_ai_engine",
      scope_keys: supportQueueScopes,
      provider_ready: false,
      effective_permissions: ["support.view"],
    }),
  }).state,
  "provider_not_connected",
  "internal Support AI provider blocks when provider readiness is false",
);

assert.equal(
  resolveOrganizationAccessAuthorization({
    provider_key: "support_ai_engine",
    scope_keys: supportQueueScopes,
    provider_ready: true,
    effective_permissions: [],
    organization_has_active_scope: resolvesBusinessPackEntitlementWithoutOrganizationGrant({
      provider_key: "support_ai_engine",
      scope_keys: supportQueueScopes,
      provider_ready: true,
      effective_permissions: [],
    }),
  }).state,
  "user_role_denied",
  "internal Support AI provider blocks when user permission is missing",
);

assert.equal(
  resolvesBusinessPackEntitlementWithoutOrganizationGrant({
    provider_key: "support_ai_engine",
    scope_keys: ["support.queue.write"],
    provider_ready: true,
    effective_permissions: ["support.view"],
  }),
  false,
  "unknown Support AI scope is not authorized via business pack entitlement",
);

assert.equal(
  resolvesBusinessPackEntitlementWithoutOrganizationGrant({
    provider_key: "autonomous_support_operations",
    scope_keys: ["support.sla.read"],
    provider_ready: true,
    effective_permissions: ["support.view_metrics"],
  }),
  true,
  "ASO SLA scope still authorizes via business pack entitlement",
);

assert.equal(
  resolveOrganizationAccessAuthorization({
    provider_key: "autonomous_support_operations",
    scope_keys: supportQueueScopes,
    provider_ready: true,
    effective_permissions: ["support.view_metrics"],
    organization_has_active_scope: false,
  }).state,
  "user_role_denied",
  "ASO provider no longer owns support queue scope",
);

assert.equal(
  resolvesBusinessPackEntitlementWithoutOrganizationGrant({
    provider_key: "member_verification",
    scope_keys: ["verification.queue.read"],
    provider_ready: true,
    effective_permissions: ["moderation.review"],
  }),
  false,
  "higher-risk external scope still requires organization grant",
);

assert.equal(
  resolveOrganizationAccessAuthorization({
    provider_key: "member_verification",
    scope_keys: ["verification.queue.read"],
    provider_ready: true,
    effective_permissions: ["moderation.review"],
    organization_has_active_scope: false,
  }).state,
  "organization_scope_required",
  "external provider without grant remains blocked",
);

assert.equal(
  resolveOrganizationAccessAuthorization({
    provider_key: "member_verification",
    scope_keys: ["verification.queue.read"],
    provider_ready: true,
    effective_permissions: ["moderation.review"],
    organization_has_active_scope: true,
  }).state,
  "authorized",
  "external provider with grant remains authorized",
);

for (const manifest of ORGANIZATION_PROVIDER_ACCESS_MANIFESTS) {
  const scopes = resolveScopesForCapability({ provider_key: manifest.provider_key });
  assert.ok(scopes.length > 0, `${manifest.provider_key} resolves scopes`);
}

for (const locale of CORE_LOCALES) {
  const settings = loadSettingsLocale(locale);
  const block = getNested(settings, "organizationAccessApproval") as Record<string, unknown>;
  assert.ok(block, `${locale} missing organizationAccessApproval`);
  assert.ok(getNested(block, "employee.noAuthorityMessage"), `${locale} employee message`);
  assert.ok(getNested(block, "employee.userRoleDeniedMessage"), `${locale} user role denied message`);
  assert.ok(getNested(block, "employee.actions.submit"), `${locale} submit action`);
  assert.ok(getNested(block, "review.actions.approve"), `${locale} approve action`);
  assert.ok(getNested(block, "providers.communityMemberDirectory.label"), `${locale} provider label`);
}

console.log("organization-access-approval tests passed");

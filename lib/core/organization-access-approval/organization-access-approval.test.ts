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
  "delegated admin with scope permission can approve support scopes",
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

for (const manifest of ORGANIZATION_PROVIDER_ACCESS_MANIFESTS) {
  const scopes = resolveScopesForCapability({ provider_key: manifest.provider_key });
  assert.ok(scopes.length > 0, `${manifest.provider_key} resolves scopes`);
}

for (const locale of CORE_LOCALES) {
  const settings = loadSettingsLocale(locale);
  const block = getNested(settings, "organizationAccessApproval") as Record<string, unknown>;
  assert.ok(block, `${locale} missing organizationAccessApproval`);
  assert.ok(getNested(block, "employee.noAuthorityMessage"), `${locale} employee message`);
  assert.ok(getNested(block, "employee.actions.submit"), `${locale} submit action`);
  assert.ok(getNested(block, "review.actions.approve"), `${locale} approve action`);
  assert.ok(getNested(block, "providers.communityMemberDirectory.label"), `${locale} provider label`);
}

console.log("organization-access-approval tests passed");
